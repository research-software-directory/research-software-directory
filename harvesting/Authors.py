import os
import logging
import requests
from datetime import datetime
from cffconvert import Citation


logger = logging.getLogger(__name__)


class Authors:
    def __init__(self):
        self.authors_cff = None
        self.authors = None
        self._get_authors_from_releases()
        self.init()
        self._clean_orcid()
        self._add_fullname()

    def __str__(self):
        fullnames = [author['fullname'] for author in self.authors]
        return '\n'.join(fullnames) + '\n' +\
               'Total: {0}'.format(len(self.authors_cff))

    def _get_authors_from_releases(self):
        logger.info('Calculating the list of all known authors...')
        authors = []
        # get the urls from /api/release
        brands = requests.get(os.environ.get('BACKEND_URL') + '/release').json()
        for brand in brands:
            for release in brand["releases"]:
                if release["citability"] == "full":
                    cffstr = release["files"]["cff"]
                    citation = Citation(cffstr=cffstr)
                    authors += citation.yaml["authors"]
        self.authors_cff = authors
        return self

    def init(self):
        # self.authors is the list that may be modified in-place by later calls to Authors' methods
        self.authors = self.authors_cff
        return self

    def _add_fullname(self):
        logger.info('Calculating the authors\' full name...')
        for author in self.authors:
            fullname = []
            for namepart in ['given-names', 'name-particle', 'family-names', 'name-suffix']:
                fullname += [author[namepart].strip()] if namepart in author.keys() else []
            author.update({'fullname': ' '.join(fullname)})
        return self

    def _clean_orcid(self):
        logger.info('Extracting orcids from the orcid urls...')
        for author in self.authors:
            if 'orcid' in author.keys():
                author['orcid'] = author['orcid'].strip()
                if author['orcid'].startswith('https://orcid.org/'):
                    author['orcid'] = author['orcid'][18:]
        return self

    def get_unique_authors_by_fullname(self):
        logger.info('Calculating the list of unique authors by fullname...')
        d = dict()
        for author in self.authors:
            d[author['fullname']] = author
        self.authors = sorted(d.values(), key=lambda author: author['fullname'])
        return self

    def get_unique_authors_by_orcid(self):
        logger.info('Calculating the list of unique authors by orcid...')
        d = dict()
        for author in self.authors:
            if "orcid" in author.keys():
                d[author['orcid']] = author
        self.authors = sorted(d.values(), key=lambda author: author['orcid'])
        return self

    def upsert(self, db):
        logger.info('Upserting authors into database using orcid as id...')
        db.author.create_index([("orcid", 1)])
        n_authors = len(self.authors)
        for i_author, author in enumerate(self.authors):
            document = author
            document.update({
                "_id": author['orcid'],
                "createdAt": datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
            })
            logger.info('{0}/{1} orcid={2} fullname={3}'.format(i_author+1, n_authors, author['orcid'], author['fullname']))
            db.author.find_one_and_update({"_id": document["orcid"]}, {"$set": document}, upsert=True)


def get_authors(by_fullname=False, by_orcid=False, db=None, upsert=True):
    authors = Authors()
    if not by_fullname and not by_orcid:
        authors.get_unique_authors_by_fullname()
    if by_fullname and not by_orcid:
        authors.get_unique_authors_by_fullname()
    if by_orcid and not by_fullname:
        authors.get_unique_authors_by_orcid()
        if upsert:
            authors.upsert(db)
    if by_fullname and by_orcid:
        raise 'Returning a set of authors by both fullname and orcid is not an option; choose one or the other.'


if __name__ == '__main__':

    get_authors(by_orcid=True, upsert=False)
