import datetime
import time
import logging
import json
import requests
from http import HTTPStatus
from http.client import HTTPException
from tinydb import Query

logger = logging.getLogger(__name__)

ISO_DATETIME_FORMAT_TIMEZONE = '%Y-%m-%dT%H:%M:%SZ'


def extract_crossref_data(data):
    return {
        "type"                  : data['type'],
        "publisher"             : data['publisher'],
        "referenceCount"        : data['reference-count'],
        "shortContainerTitle"   : None if not data['short-container-title']
                                    else data['short-container-title'][0],
        "containerTitle"        : None if not data['container-title']
                                    else data['container-title'][0],
        "createdAt"             : datetime.datetime.strptime(
            data['created']['date-time'], ISO_DATETIME_FORMAT_TIMEZONE).isoformat(),
        "page"                  : data.get('page'),
        "referencedByCount"     : data['is-referenced-by-count'],
        "title"                 : None if not data['title'] else data['title'][0],
        "volume"                : data.get('volume'),
        "authors"               : data['author'],
        "score"                 : data['score'],
        "subtitle"              : None if not data['subtitle'] else data['subtitle'][0],
        "shortTitle"            : None if not data['short-title'] else data['short-title'][0]
    }

def update_data(publication, table):
    try:
        if not 'doi' in publication:
            doi = 'http://dx.doi.org/' +publication['id'].replace(
                '/publication/', '').replace('_', '/')
            table.update({"doi" : doi}, Query().id == publication['id'])
            publication['doi'] = doi

        logger.info(publication['doi'])
        time.sleep(1)
        req = requests.get('https://api.crossref.org/works/'+publication['doi'])

        if req.status_code != HTTPStatus.OK:
            raise HTTPException("Crossref: DOI not found")

        data = json.loads(req.text)['message']

        crossref_data = extract_crossref_data(data)

        q = Query()
        table.update({"crossref" : crossref_data}, q.id == publication['id'])

    except HTTPException as e:
        logger.error("Error trying to update Crossref data")
        logger.exception(e)
