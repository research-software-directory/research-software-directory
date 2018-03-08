"""
https://pyzotero.readthedocs.io/en/latest/#retrieving-version-information

"""

import logging

import requests
from pyzotero import zotero
import os

logger = logging.getLogger(__name__)

nlesc_library = '1689348'
library_type = 'group'


def get_project_keys(client):
    collections = client.collections_top()
    projects_collection = None
    for collection in collections:
        if collection['data']['name'] == 'Projects':
            projects_collection = collection

    projects = client.collections_sub(projects_collection['key'])
    return list(map(lambda x: x['key'], projects))


def zotero_sync():
    client = zotero.Zotero(os.environ.get('ZOTERO_LIBRARY'), 'group', os.environ.get('ZOTERO_API_KEY'))

    last_version_item = requests.get(
        os.environ.get('BACKEND_URL') + '/mention?sort=version&direction=desc&limit=1'
    ).json()

    last_version = 0 if len(last_version_item) == 0 else last_version_item[0]['version']

    items = (client.everything(client.items(since=last_version)))

    items_to_save = []

    project_keys = get_project_keys(client)

    for item in items:
        item_collection_keys = item['data'].get('collections', [])
        if len(set.intersection(set(item_collection_keys), set(project_keys))) > 0:
            # item is part of a project
            items_to_save.append({
                'primaryKey': {
                    'collection': 'mention',
                    'id': item['key']
                },
                'version': item['version'],
                'title': item['data'].get('title', ''),
                'type': item['data']['itemType'],
                'zoteroKey': item['key']
            })

    if len(items_to_save) > 0:
        resp = requests.patch(
            os.environ.get('BACKEND_URL') + '/mention',
            json=items_to_save,
            headers={'Authorization': 'Bearer %s' % os.environ.get('BACKEND_JWT')}
        )
