import logging

import requests
from src.settings import settings
from src.database import db
from pyzotero import zotero

logger = logging.getLogger(__name__)

nlesc_library = '1689348'
library_type = 'group'

def zotero_sync():
    pass
    # req = requests.get('https://api.zotero.org/groups/1689348/items?key=%s' % settings['ZOTERO_ACCESS_TOKEN'])
    # result = req.json()
    #
    # for entry in [entry['data'] for entry in result]:
    #     publication = entry
    #     publication['_id'] = '/publication/' + entry['key']
    #     publication['id'] = '/publication/' + entry['key']
    #     db.publication.update({'_id': publication['_id']}, publication, upsert=True)

import json

def zotero_test():
    zot = zotero.Zotero(nlesc_library, library_type, settings['ZOTERO_API_KEY'])
    collections = zot.collections()
    projects_collection = next(filter(lambda x: x['data']['name'] == 'Projects', collections))
    projects = list(filter(lambda x: x['data']['parentCollection'] == projects_collection['key'], collections))

    print(projects[0])

    import pprint
    pprint.pprint(zot.collection_items(projects[0]['key'])[0])
    exit(0)

def get_projects(zotero):
    collections = zotero.collections()
    projects_collection = next(filter(lambda x: x['data']['name'] == 'Projects', collections))
    return list(filter(lambda x: x['data']['parentCollection'] == projects_collection['key'], collections))


def new_projects():
    zot = zotero.Zotero(nlesc_library, library_type, settings['ZOTERO_API_KEY'])
    projects = get_projects(zot)
    current_keys = [project['zotero_key'] if 'zotero_key' in project else None for project in db.project.find()]
    return [{
        'zotero_key': project['key'],
        'name': project['data']['name']
    } for project in projects if project['key'] not in current_keys]


def publication_is_software(publication):
    if publication['data']['itemType'] == 'computerProgram':
        return True
    if '//zenodo.org/record/' in publication['data']['url']:
        return True
    if '//github.com/' in publication['data']['url']:
        return True
    return False


def new_publications():
    zot = zotero.Zotero(nlesc_library, library_type, settings['ZOTERO_API_KEY'])
    results = zot.everything(zot.top())

    software = list(filter(lambda x: publication_is_software(x), results))
    publications = [result for result in results if result not in software]

    current_software_keys = [
        software['zotero_key'] if 'zotero_key' in software else None for software in db.software.find()
    ]
    current_publication_keys = [
        publication['zotero_key'] if 'zotero_key' in publication else None for publication in db.publication.find()
    ]

    publications = list(filter(lambda x: x['key'] not in current_publication_keys, publications))
    software = list(filter(lambda x: x['key'] not in current_software_keys, software))

    return publications, software
