import xml.etree.ElementTree as Tree
import os
import logging
from datetime import datetime
import requests
from requests.exceptions import HTTPError
import time
import pymongo

db = pymongo.MongoClient(host=os.environ.get('DATABASE_HOST'),
                         port=int(os.environ.get('DATABASE_PORT')),
                         connectTimeoutMS=100,
                         serverSelectionTimeoutMS=100
                         )[os.environ.get('DATABASE_NAME')]

logger = logging.getLogger(__name__)


def list_records(dois):

    oaipmh_cache_dir = os.path.join(os.getcwd(), 'oaipmh-cache', 'datacite4')
    _safe_create_dir(oaipmh_cache_dir)

    oaipmh_elem = _build_oaipmh_elem()

    logger.info("Still need to enrich and correct the metadata. Currectly serving Zenodo's metadata as-is.")

    # get the conceptdois from /api/software
    response = requests.get(os.environ.get('BACKEND_URL') + '/software?isPublished=true&sort=conceptDOI')

    if dois is None:
        softwares = response.json()
    else:
        softwares = [software for software in response.json() if software["conceptDOI"] in dois]

    headers = {
        'Authorization': 'Bearer ' + os.environ.get('ZENODO_ACCESS_TOKEN')
    }

    n_softwares = len(softwares)

    for i_software, software in enumerate(softwares):

        if software["conceptDOI"] is None:
            logger.warning(" %d/%d: conceptDOI is None" % (i_software + 1, n_softwares))
            continue

        try:
            redirect_url = _get_redirect(software)
            identifier = _get_zenodo_identifier(redirect_url, headers)
            url = 'https://zenodo.org/oai2d?verb=GetRecord&identifier=oai:zenodo.org:' + identifier +\
                  '&metadataPrefix=datacite4'
            record_elem = _get_datacite(url, headers, oaipmh_cache_dir, identifier)
            oaipmh_elem.find('{http://www.openarchives.org/OAI/2.0/}ListRecords')\
                .append(record_elem)

            logger.info(" %d/%d: retrieved datacite4 metadata for %s" % (i_software + 1, n_softwares, software["conceptDOI"]))

            d = dict(id=software["primaryKey"]["id"],
                     collection="software",
                     metadata="OK")

            db.logging.find_one_and_update({"id": d["id"], "collection": d["collection"]},
                                           {"$set": d},
                                           upsert=True)

        except requests.exceptions.RequestException as e:
            logger.warning(" %d/%d: There was an error while retrieving OAI-PMH metadata for https://doi.org/%s. %s" %
                          (i_software + 1, n_softwares, software["conceptDOI"], str(e)))

            d = dict(id=software["primaryKey"]["id"],
                     collection="software",
                     metadata=str(e))

            db.logging.find_one_and_update({"id": d["id"], "collection": d["collection"]},
                                           {"$set": d},
                                           upsert=True)
            continue

    document = Tree.ElementTree(oaipmh_elem)

    document.write(os.path.join(oaipmh_cache_dir, 'listrecords.xml'),
                   encoding='UTF-8',
                   xml_declaration=True,
                   method='xml')


def _build_oaipmh_elem():
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


def _get_redirect(software):
    response = requests.head('https://doi.org/{conceptdoi}'.format(conceptdoi=software["conceptDOI"]), headers=headers)
    if response.status_code == 302:
        return response.next.url
    elif response.status_code == 429:
        response.raise_for_status()
    else:
        raise HTTPError("Expected a redirect from doi.org to zenodo.org, got {0} instead."
                        .format(response.status_code))


def _get_zenodo_identifier(redirect_url, headers):
    response = requests.head(redirect_url, headers=headers)
    if response.status_code == 302:
        return response.next.url.split('/')[-1:][0]
    elif response.status_code == 429:
        response.raise_for_status()
    else:
        raise HTTPError("Expected a redirect from a conceptdoi to a versioned doi, got {0} instead."
                        .format(response.status_code))


def _get_datacite(url, headers, oaipmh_cache_dir, identifier):
    response = requests.get(url, headers=headers)
    if int(response.headers.get('x-ratelimit-remaining')) < 10:
        # throttle requests
        logger.info("Sleeping for 60 seconds to avoid HttpError 429")
        time.sleep(60)
    if response.status_code != requests.codes.ok:
        response.raise_for_status()

    fname = os.path.join(oaipmh_cache_dir, 'record-' + identifier + '.xml')
    with open(fname, 'w') as fid:
        fid.write(response.text)
    # future work: correct/expand the datacite4 representation with other data from the RSDjson
    return Tree.fromstring(response.text) \
        .find("{http://www.openarchives.org/OAI/2.0/}GetRecord") \
        .find("{http://www.openarchives.org/OAI/2.0/}record")


def _safe_create_dir(oaipmh_cache_dir):
    if os.path.isdir(oaipmh_cache_dir):
        pass
    else:
        os.makedirs(oaipmh_cache_dir)
