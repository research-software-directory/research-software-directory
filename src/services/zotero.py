import logging
from pyzotero import zotero

logger = logging.getLogger(__name__)

nlesc_library = '1689348'
library_type = 'group'


class ZoteroService:
    def __init__(self, db, api_key):
        self.db = db
        self.api_key = api_key
        self.client = zotero.Zotero(nlesc_library, library_type, self.api_key)

    def get_projects(self):
        collections = self.client.collections()
        projects_collection = next(filter(lambda x: x['data']['name'] == 'Projects', collections))
        return list(filter(lambda x: x['data']['parentCollection'] == projects_collection['key'], collections))

    def new_projects(self):
        projects = self.get_projects()
        current_keys = [project.data['project_code'] if 'project_code' in project.data else None for project in self.db.project.all()]

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

    @staticmethod
    def publication_is_software(publication):
        if publication['data']['itemType'] == 'computerProgram':
            return True
        if '//zenodo.org/record/' in publication['data']['url']:
            return True
        if '//github.com/' in publication['data']['url']:
            return True
        return False

    def new_publications(self):
        results = self.client.everything(self.client.top())

        software = list(filter(lambda x: self.publication_is_software(x), results))
        publications = [result for result in results if result not in software]

        current_software_keys = [
            software.data['zotero_key'] if 'zotero_key' in software.data else None for software in self.db.software.all()
        ]
        current_publication_keys = [
            publication.data['zotero_key'] if 'zotero_key' in publication.data
            else None for publication in self.db.publication.all()
        ]

        publications = list(filter(lambda x: x['key'] not in current_publication_keys, publications))
        software = list(filter(lambda x: x['key'] not in current_software_keys, software))

        return publications, software
