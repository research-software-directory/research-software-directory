from datetime import datetime
import re

import requests

from util import db_connect

db = db_connect()


def to_concept_doi(doi):
    doi = doi.replace('https://doi.org/', '')
    if not doi.startswith('10.5281/zenodo.'):
        raise ValueError('Not a Zenodo doi')
    zenodo_id = doi.replace('10.5281/zenodo.', '')
    url = 'https://zenodo.org/api/records/' + zenodo_id
    r = requests.get(url)
    r.raise_for_status()
    try:
        return r.json()['conceptdoi']
    except KeyError:
        raise KeyError('DOI is not a versioned Zenodo doi or concept Zenodo doi')


def versions_of_doi(doi):
    """First is latest version"""
    url = "https://zenodo.org/api/records?q=conceptdoi:\"{0}\"&all_versions=true".format(doi)
    r = requests.get(url)
    r.raise_for_status()
    unordered = r.json()['hits']['hits']
    return sorted(unordered, key=lambda h: h['metadata']['relations']['version'][0]['index'], reverse=True)


def tagurl_of_zenodo(record):
    for related_identifier in record['metadata']['related_identifiers']:
        if related_identifier['relation'] == 'isSupplementTo':
            return related_identifier['identifier']
    raise KeyError('Zenodo record does not contain a related identifier with isSupplementTo relation ')


def tagurl2version(tagurl):
    return re.sub('^.*(/tree/v?)', '', tagurl)


def time_now():
    return datetime.utcnow().replace(microsecond=0).isoformat()+'Z'


def fetch_release(doi):
    concept_doi = to_concept_doi(doi)
    versioned_doi_records = versions_of_doi(concept_doi)

    releases = []
    for record in versioned_doi_records:
        tag_url = tagurl_of_zenodo(record)
        try:
            version = record['metadata']['version']
        except KeyError:
            version = tagurl2version(tag_url)
        try:
            release = {
                'doi': record['doi'],
                'tagUrl': tag_url,
                'version': version,
                'publicationDate': record['metadata']['publication_date'],
                'isLast': record['metadata']['relations']['version'][0]['is_last']
            }
            releases.append(release)
        except KeyError as e:
            print(record)
            raise e
    record = {
        '_id': doi,
        'conceptDOI': concept_doi,
        'releases': releases,
        'createdAt': time_now()
    }
    return record


def sync_releases():
    db.release.create_index([('conceptDOI', 1)])
    software_items = db.software.find({'conceptDOI': {'$exists': True}}, {'conceptDOI': 1})
    for software_item in software_items:
        doi = software_item['conceptDOI']
        if not doi:
            continue
        try:
            record = fetch_release(doi)
            db.release.insert(record)
        except (KeyError, ValueError,) as e:
            print('Skipping: ' + doi)
            print(e)
