import xml.etree.ElementTree as Tree
import os
import logging
from datetime import datetime
import requests
from releases import ReleaseScraper

logger = logging.getLogger(__name__)


def list_records(dois=None):

    def build_oaipmh_elem():

        root_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}OAI-PMH')

        response_date_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}responseDate')
        response_date_elem.text = datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'
        root_elem.append(response_date_elem)

        request_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}request')
        request_elem.set('verb', 'ListRecords')
        request_elem.set('metadataPrefix', 'datacite4')
        request_elem.text = 'https://zenodo.org/oai2d'
        root_elem.append(request_elem)

        listrecords_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}ListRecords')
        root_elem.append(listrecords_elem)

        return root_elem

    logger.info("Still need to enrich and correct the metadata. Currectly serving Zenodo's metadata as-is.")

    if dois is None:
        # get the conceptdois from /api/software
        response = requests.get(os.environ.get('BACKEND_URL') + '/software')
        conceptdois = [software["conceptDOI"] for software in response.json() if software["isPublished"]]
    else:
        conceptdois = []
        for doi in dois:
            release = ReleaseScraper(doi)
            if release.doi is not None and release.is_zenodo_doi() and release.is_concept_doi():
                conceptdois.append(doi)
                logger.info('{0}: {1}'.format(doi, 'doi is a Zenodo conceptdoi'))
            else:
                logger.error('{0}: {1}'.format(doi, release.message))

    # for each conceptdoi, get the datacite4 using Zenodo's OAI-PMH GetRecord
    oaipmh_elem = build_oaipmh_elem()

    n_conceptdois = len(conceptdois)

    oaipmh_cache_dir = os.path.join(os.getcwd(), 'oaipmh-cache', 'datacite4')

    if os.path.isdir(oaipmh_cache_dir):
        pass
    else:
        os.makedirs(oaipmh_cache_dir)

    for i_conceptdoi, conceptdoi in enumerate(conceptdois):

        if conceptdoi is None:
            logger.warning(" %d/%d: conceptDOI is None" % (i_conceptdoi + 1, n_conceptdois))
            continue

        try:
            logger.info(" %d/%d: retrieving datacite4 metadata for %s" % (i_conceptdoi + 1, n_conceptdois, conceptdoi))

            response = requests.get('https://doi.org/{conceptdoi}'.format(conceptdoi=conceptdoi))
            if response.status_code != requests.codes.ok:
                response.raise_for_status()
            identifier = response.url.split('/')[-1:][0]

            url = 'https://zenodo.org/oai2d?verb=GetRecord&identifier=oai:zenodo.org:' + identifier +\
                  '&metadataPrefix=datacite4'
            response = requests.get(url)
            if response.status_code != requests.codes.ok:
                response.raise_for_status()

            fname = os.path.join(oaipmh_cache_dir, 'record-' + identifier + '.xml')
            with open(fname, 'w') as fid:
                fid.write(response.text)

            # future work: correct/expand the datacite4 representation with other data from the RSDjson
            record_elem = Tree.fromstring(response.text)\
                .find("{http://www.openarchives.org/OAI/2.0/}GetRecord")\
                .find("{http://www.openarchives.org/OAI/2.0/}record")

            oaipmh_elem.find('{http://www.openarchives.org/OAI/2.0/}ListRecords')\
                .append(record_elem)

        except requests.exceptions.RequestException:
            logger.warning("There was an error with " + conceptdoi)

    document = Tree.ElementTree(oaipmh_elem)

    document.write(os.path.join(oaipmh_cache_dir, 'listrecords.xml'),
                   encoding='UTF-8',
                   xml_declaration=True,
                   method='xml')
