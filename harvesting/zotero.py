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
    # logger.info(zotero_item['data']['url'] + ' = eScience Blog')
    try:
        data = requests.get(zotero_item['data']['url']).text
        soup = BeautifulSoup(data, 'html.parser')
        author = soup.select('a.ds-link')[0].contents[0]
        image = soup.find("meta", property ="og:image").attrs["content"]
        return author, image
    except:
        return None, None


def get_mentions(since_version=None, keys=None):
    by_version = since_version is not None
    by_key = keys is not None

    if by_version and by_key:
        raise Exception("Use either 'since_version' or 'keys', not both")

    client = zotero.Zotero(os.environ.get('ZOTERO_LIBRARY'), 'group', os.environ.get('ZOTERO_API_KEY'))

    if by_key:
        items = client.everything(client.items(itemKey=keys))
        logger.log(logging.INFO, 'Found %d items in Zotero library %s based on supplied key(s).' % (len(items),
                   os.environ.get('ZOTERO_LIBRARY')))
    else:
        their_last_version = client.last_modified_version()
        our_last_version = get_last_version()
        logger.log(logging.INFO, ('Database collection \'mention\' is currently at version %d; Zotero library %s is cur' +
                   'rently at version %d.') % (our_last_version, os.environ.get('ZOTERO_LIBRARY'), their_last_version))
        if since_version is None:
            since_version = our_last_version
        items = (client.everything(client.items(since=since_version)))

        logger.log(logging.INFO, 'Found %d new or updated items in Zotero library %s since version %d.' % (len(items),
                   os.environ.get('ZOTERO_LIBRARY'),
                   since_version))

    items_to_save = []

    project_keys = get_project_keys(client)
    supported_types = ['attachment', 'blogPost', 'book', 'bookSection', 'computerProgram', 'conferencePaper',
                       'document', 'interview', 'journalArticle', 'magazineArticle', 'manuscript', 'newspaperArticle',
                       'note', 'presentation', 'radioBroadcast', 'report', 'thesis', 'videoRecording', 'webpage']

    n_items = len(items)
    for item_index, item in enumerate(items):

        if 'title' not in item['data'] or not item['data']['title']:
            logger.warning("{0}/{1}: {2} does not have a title."
                           .format(item_index+1, n_items, item['key']))
            continue
        item_collection_keys = item['data'].get('collections', [])
        if len(set.intersection(set(item_collection_keys), set(project_keys))) == 0:
            logger.warning("{0}/{1}: {2} is not part of a project ({3})."
                           .format(item_index + 1, n_items, item['key'], item["data"]["title"]))
            continue

        try:
            item_date = parse(item['data']['date']).isoformat()[:19] + 'Z'
        except:
            logger.warning("{0}/{1}: {2} has a date problem ({3})."
                           .format(item_index + 1, n_items, item['key'], item["data"]["title"]))
            continue

        if item["data"]["itemType"] not in supported_types:
            logger.warning("{0}/{1}: {2} not a supported type ({3})."
                           .format(item_index + 1, n_items, item['key'], item["data"]["title"]))
            continue

        # item is good as far as we know
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
            'date': item_date
        }
        url = get_url_for_zotero_item(item)
        if url:
            to_save['url'] = url

        if item['data']['url'] and '://blog.esciencecenter.nl/' in item['data']['url']:
            (author, image) = get_blog_fields(item)
            if author is None:
                logger.info("{0}/{1}: {2} cannot scrape the author from blog.esciencecenter.nl ({3})."
                            .format(item_index + 1, n_items, item['key'], item['data']['url']))
                continue
            if image is None:
                logger.info("{0}/{1}: {2} cannot scrape the image from blog.esciencecenter.nl ({3})."
                            .format(item_index + 1, n_items, item['key'], item['data']['url']))
                continue

            to_save['isCorporateBlog'] = True
            to_save['author'] = author
            to_save['image'] = image

        logger.info("{0}/{1}: {2} is going to be added to the mentions collection."
                    .format(item_index + 1, n_items, item['key']))
        items_to_save.append(to_save)

    if len(items_to_save) > 0:
        token = generate_jwt_token()
        logger.info("Items to save: %s" % len(items_to_save))
        resp = requests.put(
            os.environ.get('BACKEND_URL') + '/mention',
            json=items_to_save,
            headers={'Authorization': 'Bearer %s' % token}
        )
        if resp.status_code != requests.codes.ok:

            raise Exception('error saving zotero items', str(resp.json()))
