import logging

import urllib.parse

import requests
from src.services.util import rate_limit
from src.settings import settings
from src.database import db


logger = logging.getLogger(__name__)


def zotero_sync():
    req = requests.get('https://api.zotero.org/groups/1689348/items?key=%s' % settings['ZOTERO_ACCESS_TOKEN'])
    result = req.json()

    for entry in [entry['data'] for entry in result]:
        publication = entry
        publication['_id'] = '/publication/' + entry['key']
        publication['id'] = '/publication/' + entry['key']
        db.publication.update({'_id': publication['_id']}, publication, upsert=True)


def author_map_suggestion(publication_id):
    publication = db.publication.find_one({'_id': publication_id})
    if not publication:
        raise Exception('publication not found: '+publication_id)

    import json
    from fuzzywuzzy import fuzz
    people = list(db.person.find())
    mapping = []
    for creator in publication['creators']:
        full_name = creator['firstName'] + ' ' + creator['lastName']
        for person in people:
            print(person['name'], full_name, str(fuzz.ratio(person['name'], full_name)))
            if fuzz.ratio(person['name'], full_name) > 80:
                mapping.append(
                    {
                        'creator': creator,
                        'person': person['_id']
                    }
                )
                break

    return mapping
