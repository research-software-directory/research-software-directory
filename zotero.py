"""
https://pyzotero.readthedocs.io/en/latest/#retrieving-version-information

"""

import logging

import requests
from pyzotero import zotero
import os

logger = logging.getLogger(__name__)


def get_project_keys(client):
    collections = client.collections_top()
    projects_collection = [c for c in collections if c['data']['name'] == 'Projects'][0]
    projects = client.collections_sub(projects_collection['key'])
    return list(map(lambda x: x['key'], projects))


def get_last_version():
    last_version_item = requests.get(
        os.environ.get('BACKEND_URL') + '/mention?sort=version&direction=desc&limit=1'
    ).json()

    return 0 if len(last_version_item) == 0 else last_version_item[0]['version']


def zotero_sync():
    client = zotero.Zotero(os.environ.get('ZOTERO_LIBRARY'), 'group', os.environ.get('ZOTERO_API_KEY'))

    items = (client.everything(client.items(since=get_last_version())))

    logger.log(logging.INFO, str(len(items)) + ' new/updated zotero items')

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
        if resp.status_code != 200:
            raise Exception('error saving zotero items')

