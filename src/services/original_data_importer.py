import requests
import json
import re

prefixes = ['/project/', '/software/', '/person/', '/organization/']


class OriginalDataImporterService:
    def __init__(self, db):
        self.db = db

        with open('data/original_index.json') as data_file:
            print('reading original data (index.json)')
            old_data = json.load(data_file)
            self.original_data = {
                "project": old_data['project'],
                "software": old_data['software'],
                "person": old_data['person'],
                "organization": old_data['organization']
            }

    @staticmethod
    def remove_id_prefix(data):
        text = json.dumps(data)
        for prefix in prefixes:
            text = text.replace(prefix+'//', prefix)
            text = text.replace('"'+prefix, '"')
        return json.loads(text)

    @staticmethod
    def find_project_code(project_id):
        with open('data/zotero_project_map.json') as file:
            map_data = json.load(file)
        try:
            code = next(filter(lambda x: x['project_id'] == project_id, map_data))['project_code']
            return code if code != '' else None
        except StopIteration:
            return None

    def import_projects(self):
        for project_data in self.original_data['project']:
            project_data['projectCode'] = self.find_project_code(project_data['id'])
            project_data = self.remove_id_prefix(project_data)
            project = self.db.project.new(project_data)
            project.save()

    @staticmethod
    def fix_software_githubid(software):
        if 'githubid' not in software:
            if 'codeRepository' in software:
                matches = re.match(r'https://github.com/(.*?/.*?)/?$', str(software['codeRepository']))
                if matches:
                    software['githubid'] = matches.group(1)
            else:
                software['githubid'] = None

    def import_software(self):
        for software_data in self.original_data['software']:
            software_data = self.remove_id_prefix(software_data)
            self.fix_software_githubid(software_data)
            software = self.db.software.new(software_data)
            software.save()

    @staticmethod
    def fix_person_github_id(person):
        if 'githubid' not in person and 'githubUrl' in person:
            matches = re.match(r'.*github.com/(.*$)', person['githubUrl'])
            person['githubid'] = matches.group(1)

    def import_people(self):
        for person_data in self.original_data['person']:
            person_data = self.remove_id_prefix(person_data)
            self.fix_person_github_id(person_data)
            person = self.db.person.new(person_data)
            person.save()

    def import_organizations(self):
        for organization_data in self.original_data['organization']:
            organization_data = self.remove_id_prefix(organization_data)
            organization = self.db.organization.new(organization_data)
            organization.save()

    def import_original(self):
        self.import_projects()
        self.import_software()
        self.import_people()
        self.import_organizations()

    def set_descriptions(self):
        # update description for each resource from old site repository
        for resource_type in ['software', 'project', 'person', 'organization']:
            for resource in list(iter(self.db[resource_type].all())):
                url = 'https://raw.githubusercontent.com/NLeSC/software.esciencecenter.nl/gh-pages/_%s/%s.md' %\
                      (resource_type, resource['id'])
                req = requests.get(url)
                if req.status_code == 200:
                    regex = re.compile('\n---\n')
                    print('%s/%s' % (resource_type, resource['id']))
                    resource['description'] = regex.split(req.text)[1]
                    resource.save()
