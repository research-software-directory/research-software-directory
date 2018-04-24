from datetime import datetime
import re

import requests
from cff_converter_python import Citation


class ReleaseScraper:

    """
    steps after user provides the doi via admin interface:
    1. get the list of software items
        for each software item, 
        2. check that the doi is a zenodo doi
        3. check that the doi is a concept doi
        4. retrieve versioned dois
        foreach versioned doi
            5. visit the github release
            6. on github, check if there is a cff
            foreach cff
            7. validate the cff
            8. generate bibtex, ris, endnote, and codemeta strings

    "releases": [{
        "doi": "10.5281/zenodo.597993",
        "files": {
            "bibtex": "file contents",
            "cff": "file contents",
            "codemeta": "file contents",
            "endnote": "file contents",
            "ris": "file contents"
        },
        "tag": "2.6.1"
    }]

    """

    def __init__(self, doi):
        self.doi = doi
        self.zenodo_data = dict(conceptdoi=None, versioned_dois=None)
        self.releases = None
        if not self.is_zenodo_doi():
            raise ValueError("is not a Zenodo doi.")
        self.fetch_zenodo_data_conceptdoi()
        if not self.is_concept_doi():
            raise ValueError("is not a concept doi.")
        self.fetch_zenodo_data_versioned_dois()
        self.filter_zenodo_data_versioned_dois()
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
        files = None
        for hit in hits:
            doi = hit["metadata"]["doi"]
            date_published = hit["metadata"]["publication_date"]
            url = select_github_url()
            tag = re.sub('^.*(/tree/v?)', '', url)
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
        for release in self.releases:
            # 'https://github.com/sonjageorgievska/Crowds/tree/1.0'
            # 'https://github.com/ArenA-Crowds/Crowds/tree/1.0'
            # "https://raw.githubusercontent.com/ArenA-Crowds/Crowds/1.0/README.md"
            # FIXME here
            r = requests.get(release["url"])
            r.raise_for_status()
            dinges = r.json()

        citation = Citation("something here FIXME")
        self.files = dict({
            "bibtex": citation.as_bibtex(),
            "cff": citation.file_contents,
            "codemeta": citation.as_codemeta(),
            "endnote": citation.as_enw(),
            "ris": citation.as_ris()
        })
        return self

    def is_concept_doi(self):
        return self.doi == self.zenodo_data["conceptdoi"]["conceptdoi"]

    def is_zenodo_doi(self):
        return self.doi.startswith('10.5281/zenodo.')


def sync_releases(db):
    db.release.create_index([('conceptDOI', 1)])
    software_items = db.software.find({"conceptDOI": {"$nin": [None]}},{"conceptDOI": 1})
    item_index = 0
    for software_item in software_items:
        item_index += 1
        conceptdoi = software_item['conceptDOI']
        try:
            scraper = ReleaseScraper(conceptdoi)
            record = {
                '_id': conceptdoi,
                'conceptDOI': conceptdoi,
                'releases': scraper.releases,
                'createdAt': datetime.utcnow().replace(microsecond=0).isoformat()+'Z'
            }
            # db.release.insert(record)
        except (KeyError, ValueError) as e:
            print("{0}/{1} {2} {3}".format(item_index, software_items.retrieved, conceptdoi, str(e)))
