import logging

from pyzotero import zotero

from src.database.database import db
from src.settings import settings

logger = logging.getLogger(__name__)

nlesc_library = '1689348'
library_type = 'group'


def get_projects(zot):
    collections = zot.collections()
    projects_collection = next(filter(lambda x: x['data']['name'] == 'Projects', collections))
    return list(filter(lambda x: x['data']['parentCollection'] == projects_collection['key'], collections))


def new_projects():
    zot = zotero.Zotero(nlesc_library, library_type, settings['ZOTERO_API_KEY'])
    projects = get_projects(zot)
    current_keys = [project['project_code'] if 'project_code' in project else None for project in db.project.find()]

    def project_is_new(project):
        return project['data']['name'].split(' ')[0] not in current_keys

    projects = list(filter(project_is_new, projects))
    return [
        {
            'project_code': project['data']['name'].split(' ')[0],
            'name': project['data']['name'],
            'zotero_key': project['key']
        } for project in projects
    ]


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
