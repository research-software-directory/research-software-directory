import logging
from datetime import datetime
import re
import os
import time

import requests
from cffconvert import Citation
from util import rate_limit_reached

logger = logging.getLogger(__name__)


class ReleaseScraper:

    """
    1. check that the doi is a zenodo doi
    2. check that the doi is a concept doi
    3. retrieve versioned dois
    foreach versioned doi
        4. visit the github release
        5. on github, check if there is a cff
        foreach cff
        6. validate the cff
        7. generate bibtex, ris, endnote, and schema.org strings

    After initialization, the ReleaseScraper instance has a field .releases which is
    an array of objects with one of the following layouts:
    {
        "citability": "full"
        "datePublished": "2018-03-16"
        "doi": "10.5281/zenodo.1200251",
        "files": {
            "bibtex": "file contents",
            "cff": "file contents",
            "schema_dot_org": "file contents",
            "endnote": "file contents",
            "ris": "file contents"
        },
        "tag": "2.6.1"
    }
    or in case there is no valid CITATION.cff for a given release:
    {
        "citability": "doi-only"
        "datePublished": "2018-02-23"
        "doi": "10.5281/zenodo.1183426",
        "files": {},
        "tag": "2.4.0"
    }
    """

    def __init__(self, doi):
        self.latest_schema_dot_org = None
        self.releases = list()
        self.is_citable = False
        self.zenodo_data = dict(conceptdoi=None, versioned_dois=None)
        self.title = None
        self.message = None
        self.doi = None

        if doi is None:
            self.message = "record has no doi value of any kind."
            return

        if not isinstance(doi, str):
            self.message = "doi should be a string."
            return

        if doi == "":
            self.message = "doi should not be an empty string."
            return

        url = "https://doi.org/{0}".format(doi)
        response = requests.get(url)
        if response.status_code == requests.codes.ok:
            self.is_citable = True
            self.doi = doi
        else:
            self.message = "error {0} resolving doi.".format(response.status_code)
            return

        if not self.is_zenodo_doi():
            self.message = "doi is not a Zenodo doi."
            return

        self.fetch_zenodo_data_conceptdoi()
        if not self.is_concept_doi():
            self.message = "doi is not a concept doi."
            return

        self.fetch_zenodo_data_versioned_dois()
        if "hits" not in self.zenodo_data["versioned_dois"]:
            self.message = "record doesn't seem to be resulting from GitHub-Zenodo integration."
            return

        self.filter_zenodo_data_versioned_dois()
        self.reverse_sort_zenodo_data_versioned_dois()
        self.generate_files()
        if True not in [release["citability"] == "full" for release in self.releases]:
            self.message = "no valid CITATION.cff found in any release."
            return
        self.determine_latest_schema_dot_org()
        self.message = "OK"

    def determine_latest_schema_dot_org(self):
        for release in self.releases:
            if "schema_dot_org" in release["files"].keys():
                self.latest_schema_dot_org = release["files"]["schema_dot_org"]
                return self

    def filter_zenodo_data_versioned_dois(self):
        def select_github_url():
            github_link = None
            for identifier in hit["metadata"]["related_identifiers"]:
                if identifier["scheme"] == "url" and \
                        identifier["relation"] == "isSupplementTo" and \
                        identifier["identifier"].startswith("https://github.com/"):
                    github_link = identifier["identifier"]
                else:
                    # Associated Zenodo record does not contain a related identifier with "isSupplementTo" relation
                    # that points to GitHub. Continue with the next related identifier:
                    continue
            return github_link

        hits = self.zenodo_data["versioned_dois"]["hits"]["hits"]
        # already include the "files" key here, even though we're only filling it later:
        files = dict()
        for hit in hits:
            try:
                doi = hit["metadata"]["doi"]
                date_published = hit["metadata"]["publication_date"]
                url = select_github_url()
                if url is not None:
                    tag = re.sub("^.*(/tree/)", "", url)
                    self.releases.append({
                        "citability": "doi-only",
                        "datePublished": date_published,
                        "doi": doi,
                        "files": files,
                        "tag": tag,
                        "url": url})
            except Exception as e:
                print("Something unexpected happened when trying to retrieve versioned doi info" +
                      " but I'll try to continue. {0}".format(e))
        return self

    def fetch_zenodo_data_conceptdoi(self):
        zenodo_id = self.doi.replace("10.5281/zenodo.", "")
        url = "https://zenodo.org/api/records/" + zenodo_id
        headers = {
            'Authorization': 'Bearer ' + os.environ.get('ZENODO_ACCESS_TOKEN')
        }
        r = requests.get(url, headers=headers)
        while rate_limit_reached(r):
            # throttle requests
            logger.info("Rate limit reached: sleeping for 60 seconds")
            time.sleep(60)
            r = requests.get(url, headers=headers)
        r.raise_for_status()
        self.zenodo_data["conceptdoi"] = r.json()
        return self

    def fetch_zenodo_data_versioned_dois(self):
        url = "https://zenodo.org/api/records?q=conceptdoi:\"{0}\"&all_versions=true&size=100".format(self.doi)
        headers = {
            'Authorization': 'Bearer ' + os.environ.get('ZENODO_ACCESS_TOKEN')
        }
        r = requests.get(url, headers=headers)
        while rate_limit_reached(r):
            # throttle requests
            logger.info("Rate limit reached: sleeping for 60 seconds")
            time.sleep(60)
            r = requests.get(url, headers=headers)
        r.raise_for_status()
        self.zenodo_data["versioned_dois"] = r.json()
        hits = self.zenodo_data["versioned_dois"]["hits"]["hits"]
        hits_sorted = sorted(hits, key=lambda hit: hit["metadata"]["publication_date"])
        self.title = hits_sorted[-1]["metadata"]["title"]
        return self

    def generate_files(self):
        for release in self.releases:
            try:
                override = {
                    "doi": release["doi"],
                    "date-released": datetime.strptime(release["datePublished"], "%Y-%m-%d").date(),
                    "version": release["tag"]
                }
                remove = ["commit"]
                citation = Citation(url=release["url"], override=override, remove=remove)
                try:
                    release["files"] = dict({
                        "bibtex": citation.as_bibtex(),
                        "codemeta": citation.as_codemeta(),
                        "cff": citation.cffstr,
                        "schema_dot_org": citation.as_schema_dot_org(),
                        "endnote": citation.as_enw(),
                        "ris": citation.as_ris()
                    })
                    release["citability"] = "full"
                except Exception:
                    continue
            except Exception as e:
                if str(e).startswith("Error requesting file: "):
                    continue
                elif str(e).startswith("Provided CITATION.cff does not seem valid YAML."):
                    continue
                elif type(e).__name__ == "ScannerError":
                    continue
                else:
                    raise e
        return self

    def is_concept_doi(self):
        return "conceptdoi" in self.zenodo_data["conceptdoi"] and \
               self.doi == self.zenodo_data["conceptdoi"]["conceptdoi"]

    def is_zenodo_doi(self):
        return self.doi.startswith("10.5281/zenodo.")

    def reverse_sort_zenodo_data_versioned_dois(self):
        self.releases.sort(key=lambda release: release["tag"], reverse=True)
        return self


def get_citations(db, dois):

    # get the conceptdois from /api/software
    response = requests.get(os.environ.get('BACKEND_URL') + '/software?isPublished=true&sort=conceptDOI')

    if dois is None:
        softwares = response.json()
    else:
        softwares = [software for software in response.json() if software["conceptDOI"] in dois]

    n_softwares = len(softwares)
    db.release.create_index([("conceptDOI", 1)])

    for i_software, software in enumerate(softwares):
        release = ReleaseScraper(software["conceptDOI"])
        if release.is_citable:
            document = {
                "_id": software["conceptDOI"],
                "isCitable": release.is_citable,
                "conceptDOI": software["conceptDOI"],
                "latestSchema_dot_org": "" if release.latest_schema_dot_org is None else release.latest_schema_dot_org,
                "releases": release.releases,
                "createdAt": datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
            }
            db.release.find_one_and_update({"_id": document["conceptDOI"]}, {"$set": document}, upsert=True)

        if release.message == "OK":
            logger.info("{0}/{1} \"{2}\" ({3}): {4}".format(i_software + 1, n_softwares, software["conceptDOI"],
                                                            release.title, release.message))
        else:
            logger.error('{0}/{1}: {2} {3}'.format(i_software + 1, n_softwares, software["conceptDOI"],
                                                   release.message))

        d = dict(id=software["primaryKey"]["id"],
                 collection="software",
                 releases=release.message)

        db.logging.find_one_and_update({"id": d["id"], "collection": d["collection"]},
                                       {"$set": d},
                                       upsert=True)
