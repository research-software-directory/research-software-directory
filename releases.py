from datetime import datetime
import re

import requests
from cff_converter_python import Citation


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
        7. generate bibtex, ris, endnote, and codemeta strings

    After initialization, the ReleaseScraper instance has a field .releases which is 
    an array of objects with the following layout:
    {
        "citability": "doi-only"
        "datePublished": "2018-03-14"
        "doi": "10.5281/zenodo.597993",
        "files": {
            "bibtex": "file contents",
            "cff": "file contents",
            "codemeta": "file contents",
            "endnote": "file contents",
            "ris": "file contents"
        },
        "tag": "2.6.1"
    }
    """

    def __init__(self, doi):
        if doi is None:
            raise ValueError("Record has no doi value of any kind")
        self.doi = doi
        self.zenodo_data = dict(conceptdoi=None, versioned_dois=None)
        self.releases = None
        self.isCitable = None
        if not self.is_zenodo_doi():
            raise ValueError("is not a Zenodo doi.")
        self.fetch_zenodo_data_conceptdoi()
        if not self.is_concept_doi():
            raise ValueError("is not a concept doi.")
        self.fetch_zenodo_data_versioned_dois()
        self.filter_zenodo_data_versioned_dois()
        #self.sort_zenodo_data_versioned_dois()
        self.generate_files()

    def filter_zenodo_data_versioned_dois(self):
        def select_github_url():
            for item in hit["metadata"]["related_identifiers"]:
                if item["scheme"] == "url" and item["relation"] == "isSupplementTo" and\
                        item["identifier"].startswith("https://github.com/"):
                    return item["identifier"]
                else:
                    raise ValueError("associated Zenodo record does not contain a related identifier" +
                                     " with \"isSupplementTo\" relation that points to GitHub.")

        self.releases = list()
        hits = self.zenodo_data["versioned_dois"]["hits"]["hits"]
        # already include the 'files' key here, even though we're only filling it later:
        files = dict()
        for hit in hits:
            doi = hit["metadata"]["doi"]
            date_published = hit["metadata"]["publication_date"]
            url = select_github_url()
            tag = re.sub('^.*(/tree/)', '', url)
            self.releases.append({
                "datePublished": date_published,
                "doi": doi,
                "files": files,
                "tag": tag,
                "url": url})
        return self

    def fetch_zenodo_data_conceptdoi(self):
        zenodo_id = self.doi.replace('10.5281/zenodo.', '')
        url = 'https://zenodo.org/api/records/' + zenodo_id
        r = requests.get(url)
        r.raise_for_status()
        self.zenodo_data["conceptdoi"] = r.json()
        return self

    def fetch_zenodo_data_versioned_dois(self):
        url = "https://zenodo.org/api/records?q=conceptdoi:\"{0}\"&all_versions=true".format(self.doi)
        r = requests.get(url)
        r.raise_for_status()
        self.zenodo_data["versioned_dois"] = r.json()
        return self

    def generate_files(self):
        n = len(self.releases)
        cff_file = dict(found=[False] * n, appears_valid_cff=[False] * n)
        for release_index, release in enumerate(self.releases):
            try:
                override = {
                    "doi": release["doi"],
                    "date-released": datetime.strptime(release["datePublished"], "%Y-%m-%d").date(),
                    "version": release["tag"]
                }
                remove = ["commit"]
                citation = Citation(release["url"], override=override, remove=remove)
                cff_file["found"][release_index] = True
                try:
                    release["files"] = dict({
                        "bibtex": citation.as_bibtex(),
                        "cff": citation.file_contents,
                        "codemeta": citation.as_codemeta(),
                        "endnote": citation.as_enw(),
                        "ris": citation.as_ris()
                    })
                    cff_file["appears_valid_cff"][release_index] = True
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

        if True not in cff_file["found"]:
            raise ValueError("no valid YAML citation data found in any release.")
        if True not in cff_file["appears_valid_cff"]:
            raise ValueError("citation data found but appears to violate the CFF schema.")
        return self

    def is_concept_doi(self):
        if "conceptdoi" not in self.zenodo_data["conceptdoi"]:
            raise ValueError("Zenodo record has no associated conceptdoi: won't be able to retrieve any versions.")
        return self.doi == self.zenodo_data["conceptdoi"]["conceptdoi"]

    def is_zenodo_doi(self):
        return self.doi.startswith('10.5281/zenodo.')

    def sort_zenodo_data_versioned_dois(self):
        raise Warning("Still have to implement that")


def sync_releases(db):
    db.release.create_index([('conceptDOI', 1)])
    count = db.software.count()
    software_items = db.software.find({}, {"conceptDOI": 1, "brandName": 1})
    for item_index, software_item in enumerate(software_items):
        conceptdoi = software_item['conceptDOI']
        try:
            scraper = ReleaseScraper(conceptdoi)
            document = {
                '_id': conceptdoi,
                'conceptDOI': conceptdoi,
                'releases': scraper.releases,
                'createdAt': datetime.utcnow().replace(microsecond=0).isoformat()+'Z'
            }
            print("{0}/{1} \"{2}\": {3} OK".format(item_index+1, count,
                                                   software_item["brandName"], conceptdoi))
            db.release.find_one_and_update({"_id": document["conceptDOI"]}, {"$set": document}, upsert=True)
        except (KeyError, ValueError) as e:
            print("{0}/{1} \"{2}\": {3} {4}".format(item_index+1, count,
                                                    software_item["brandName"], conceptdoi, str(e)))
