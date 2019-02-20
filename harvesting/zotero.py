"""
https://pyzotero.readthedocs.io/en/latest/#retrieving-version-information

"""

import logging
from dateutil.parser import parse
import requests
from bs4 import BeautifulSoup
from pyzotero import zotero
import os

from util import generate_jwt_token

logger = logging.getLogger(__name__)


def get_project_keys(client):
    collections = client.everything(client.collections_top())
    projects_collection = [c for c in collections if c['data']['name'] == 'Projects'][0]
    projects = client.everything(client.collections_sub(projects_collection['key']))
    return list(map(lambda x: x['key'], projects))


def get_last_version():
    last_version_item = requests.get(
        os.environ.get('BACKEND_URL') + '/mention?sort=version&direction=desc&limit=1'
    ).json()
    return 0 if len(last_version_item) == 0 else last_version_item[0]['version']


def get_date_for_zotero_item(item):
    try:
        return parse(item['data']['date']).isoformat()[:19]+'Z'
    except:
        logger.warning("Date problem in zotero item %s (was %s)" % (item['key'], item['data']['date']))
        return parse(item['data']['dateAdded']).isoformat()[:19] + 'Z'


# DOIs can be either an URL or just the identifier, so make sure its a URL
def doi_to_url(doi):
    if doi[:4] == 'http':
        return doi
    else:
        return 'https://doi.org/' + doi


# URL is constructed from doi (either as doi field or in 'extra'), or else from the 'url' field
def get_url_for_zotero_item(item):
    if 'DOI' in item['data'] and item['data']['DOI']:
        return doi_to_url(item['data']['DOI'])
    else:
        for extra in item['data']['extra'].split('\n'):
            if extra[:3] == 'doi' or extra[:3] == 'DOI':
                return doi_to_url(extra[5:])
        if 'url' in item['data'] and item['data']['url']:
            return item['data']['url']
    return None


def get_blog_fields(zotero_item):
    logger.info(zotero_item['data']['url'] + ' = eScience Blog')
    try:
        data = requests.get(zotero_item['data']['url']).text
        soup = BeautifulSoup(data, 'html.parser')
        author = soup.select('a.ds-link')[0].contents[0]
        image = soup.find("meta", property ="og:image").attrs["content"]
        return author, image
    except:
        return None, None


def get_mentions():
    client = zotero.Zotero(os.environ.get('ZOTERO_LIBRARY'), 'group', os.environ.get('ZOTERO_API_KEY'))

    items = (client.everything(client.items(since=get_last_version())))

    logger.log(logging.INFO, str(len(items)) + ' new/updated zotero items')

    items_to_save = []

    project_keys = get_project_keys(client)

    for item in items:
        if 'title' not in item['data'] or not item['data']['title']:
            logger.warning("%s does not have a title" % item['key'])
            continue
        item_collection_keys = item['data'].get('collections', [])
        if len(set.intersection(set(item_collection_keys), set(project_keys))) == 0:
            logger.warning("'%s' is not part of a project (key = %s)" % (item['data']['title'], item['key']))
            continue
        # item is part of a project
        to_save = {
            'primaryKey': {
                'collection': 'mention',
                'id': item['key']
            },
            'version': item['version'],
            'title': item['data'].get('title', ''),
            'type': item['data']['itemType'],
            'zoteroKey': item['key'],
            'isCorporateBlog': False,
            'date': get_date_for_zotero_item(item)
        }
        url = get_url_for_zotero_item(item)
        if url:
            to_save['url'] = url

        if item['data']['url'] and '://blog.esciencecenter.nl/' in item['data']['url']:
            (author, image) = get_blog_fields(item)
            to_save['isCorporateBlog'] = True
            to_save['author'] = author
            to_save['image'] = image

        items_to_save.append(to_save)

    if len(items_to_save) > 0:
        token = generate_jwt_token()
        logger.info("Items to save: %s" % len(items_to_save))
        resp = requests.put(
            os.environ.get('BACKEND_URL') + '/mention',
            json=items_to_save,
            headers={'Authorization': 'Bearer %s' % token}
        )
        if resp.status_code != 200:

            raise Exception('error saving zotero items', str(resp.json()))
