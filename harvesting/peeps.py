import os
import logging
import requests
from cffconvert import Citation

logger = logging.getLogger(__name__)


def get_orcids_from_releases():

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

    return set([author["orcid"].strip() for author in authors if "orcid" in author.keys()])


if __name__ == '__main__':
    orcids = get_orcids_from_releases()
    for orcid in sorted(orcids):
        print(orcid)
