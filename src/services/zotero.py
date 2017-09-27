import logging

import requests
from src.settings import settings
from src.database import db
from pyzotero import zotero
logger = logging.getLogger(__name__)

nlesc_library = '1689348'
zotero_api_key = 'U4ZsZH026AYwC36eufgoGCXz'
library_type = 'group'


def zotero_sync():
    req = requests.get('https://api.zotero.org/groups/1689348/items?key=%s' % settings['ZOTERO_ACCESS_TOKEN'])
    result = req.json()

    for entry in [entry['data'] for entry in result]:
        publication = entry
        publication['_id'] = '/publication/' + entry['key']
        publication['id'] = '/publication/' + entry['key']
        db.publication.update({'_id': publication['_id']}, publication, upsert=True)

import json

def zotero_test():
    zot = zotero.Zotero(nlesc_library, library_type, zotero_api_key)
    collections = zot.collections()
    projects_collection = next(filter(lambda x: x['data']['name'] == 'Projects', collections))
    projects = list(filter(lambda x: x['data']['parentCollection'] == projects_collection['key'], collections))

    print(projects[0])

    import pprint
    pprint.pprint(zot.collection_items(projects[0]['key'])[0])
    exit(0)
