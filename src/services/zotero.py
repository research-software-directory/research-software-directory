import logging

import requests
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