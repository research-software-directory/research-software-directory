import logging

import re
from pyzotero import zotero
from pyzenodo import zenodo

logger = logging.getLogger(__name__)

nlesc_library = '1689348'
library_type = 'group'


class ZoteroService:
    def __init__(self, db, api_key):
        self.db = db
        self.api_key = api_key
        self.client = zotero.Zotero(nlesc_library, library_type, self.api_key)

    def list_projects(self):
        print(self.get_projects())

    def get_projects(self):
        # All folders are collections, so both 'Projects' and all Projects themselves
        collections = self.client.everything(self.client.collections())  # get all collections
        # get the 'Projects' collection
        projects_collection = next(filter(lambda x: x['data']['name'] == 'Projects', collections))
        # Projects are all collections with 'Projects' as parent collection
        return list(filter(lambda x: x['data']['parentCollection'] == projects_collection['key'], collections))

    def new_projects(self):
        projects = self.get_projects()
        current_keys = [project.data.get('projectCode') for project in self.db.project.all()]

        def project_is_new(project):
            # projects in Zotero as "[code] [name]"
            return project['data']['name'].split(' ')[0] not in current_keys

        projects = list(filter(project_is_new, projects))
        return [
            {
                'projectCode': project['data']['name'].split(' ')[0],
                'name': project['data']['name'],
                'zoteroKey': project['key']
            } for project in projects
        ]

    @staticmethod
    def _publication_is_software(publication):
        return (publication['data']['itemType'] == 'computerProgram'
                or '//zenodo.org/record/' in publication['data']['url']
                or '//github.com/' in publication['data']['url'])

    @staticmethod
    def _publication_has_collection(publication):
        return len(publication['data']['collections']) > 0

    @staticmethod
    def update_software_fields(software):
        # adds github id from URL or from Zenodo DOI
        def extract_github_id(string):
            github_regexp = r'(^.*github\.com/)?(.*?/.*?)(/|$)'
            re_matches = re.match(github_regexp, string)
            if re_matches and len(re_matches.groups()) == 3 and 'http' not in re_matches.group(2):
                return re_matches.group(2)
            return None

        # get github id from URL
        if 'url' in software['data']:
            software['data']['githubid'] = extract_github_id(software['data']['url'])
            if software['data']['githubid']:
                return software

        # try to get github id by looking up the DOI in zenodo...
        matches = None
        if 'doi' in software['data']:
            matches = re.match('.*?(\d.*?\.\d.*?/zenodo\.\d*)', software['data']['doi'])
        if not matches:
            matches = re.match('.*?(\d.*?\.\d.*?/zenodo\.\d*)', software['data']['extra'])
        if matches:
            try:
                zen = zenodo.Zenodo()
                software['data']['doi'] = matches.group(1)
                record = zen.find_record_by_doi(matches.group(1))
                if record:
                    for rel in record.data['metadata']['related_identifiers']:
                        if rel['relation'] == 'isSupplementTo':
                            software['data']['githubid'] = extract_github_id(rel['identifier'])
                            if software['data']['githubid']:
                                print(rel['identifier'])
                                print(software['data']['githubid'])
                                return software

            except Exception as e:
                pass

        return software

    def new_publications(self):  # todo: make only for software, use last_modified etc.
        current_library_version = self.client.last_modified_version()
        current_software_keys = [
            software.data.get('zoteroKey') for software in self.db.software.all()
        ]
        current_publication_keys = [
            publication.data.get('zoteroKey') for publication in self.db.publication.all()
        ]

        try:
            cache = next(iter(self.db.zotero_cache.all()))
        except StopIteration:
            cache = self.db.zotero_cache.new()
            cache.data['version'] = 0
            cache.data['software'] = []
            cache.data['publications'] = []

        if cache.data['version'] != current_library_version:
            logger.log(logging.INFO, 'Zotero cache is dirty')
            results = self.client.everything(self.client.top())  # fetch everything from zotero
            results = list(filter(lambda x: self._publication_has_collection(x), results))  # filter items w/ collection
            cache.data['software'] = list(filter(lambda x: self._publication_is_software(x), results))  # filter software
            cache.data['publications'] = [result for result in results if result not in cache.data['software']]  # rest is publication

        # filter away all items already imported
        cache.data['publications'] = list(filter(lambda x: x['key'] not in current_publication_keys, cache.data['publications']))
        cache.data['software'] = list(filter(lambda x: x['key'] not in current_software_keys, cache.data['software']))

        if cache.data['version'] != current_library_version:
            # add github ID from URL or by looking up DOI in zenodo
            cache.data['software'] = [self.update_software_fields(sw) for sw in cache.data['software']]

        cache.data['version'] = current_library_version
        cache.save(False)

        return cache.data['publications'], cache.data['software']


    def sync_publications(self):
        publications = self.client.item_versions()
        to_update = []
        for key, version in publications.items():
            pub = self.db['zotero_publication'].find({'key': key})
            if not pub or pub.count() == 0 or next(iter(pub))['version'] < version:
                to_update.append(key)

        for n in range(0, len(to_update), 50):
            print('%s / %s synced' % (n, len(to_update)))
            results = self.client.items(itemKey=','.join(to_update[n:n+50]))
            for result in results:
                pub = self.db['zotero_publication'].find({'key': result['key']})
                pub = self.db['zotero_publication'].new() if pub.count() == 0 else next(iter(pub))
                pub.data.update(result)
                pub.save()

