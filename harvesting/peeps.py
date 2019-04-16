import os
import logging
import requests
from cffconvert import Citation

logger = logging.getLogger(__name__)


def get_authors_from_releases():

    logger.info("Making a list of orcids as mentioned in any CITATION.cff file for any release of all software")
    authors = []
    # get the urls from /api/release
    brands = requests.get(os.environ.get('BACKEND_URL') + '/release').json()
    for brand in brands:
        for release in brand["releases"]:
            if release["citability"] == "full":
                cffstr = release["files"]["cff"]
                citation = Citation(cffstr=cffstr)
                authors += citation.yaml["authors"]
    return authors


def get_unique_authors_by_fullname():
    authors = get_authors_from_releases()
    for author in authors:
        fullname = []
        for namepart in ['given-names', 'name-particle', 'family-names', 'name-suffix']:
            fullname += [author[namepart].strip()] if namepart in author.keys() else []
        author['fullname'] = ' '.join(fullname)

    return set([author["fullname"] for author in authors])


def get_unique_authors_by_orcid():
    authors = get_authors_from_releases()
    return set([author["orcid"].strip() for author in authors if "orcid" in author.keys()])


if __name__ == '__main__':

    def main():
        orcids = get_unique_authors_by_orcid()
        for orcid in sorted(orcids):
            print(orcid)

        fullnames = get_unique_authors_by_fullname()
        for fullname in sorted(fullnames):
            print(fullname)

    main()
