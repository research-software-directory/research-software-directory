import json
import re

from src.services.database import db

prefixes = ['/project/', '/software/', '/person/', '/organization/']

with open('data/original_index.json') as data_file:
    print('reading original data (index.json)')
    old_data = json.load(data_file)
    original_data = {
        "project": old_data['project'],
        "software": old_data['software'],
        "person": old_data['person'],
        "organization": old_data['organization']
    }


def remove_id_prefix(data):
    text = json.dumps(data)
    for prefix in prefixes:
        text = text.replace(prefix+'//', prefix)
        text = text.replace('"'+prefix, '"')
    return json.loads(text)


def find_project_code(project_id):
    with open('data/zotero_project_map.json') as file:
        map_data = json.load(file)
    try:
        code = next(filter(lambda x: x['project_id'] == project_id, map_data))['project_code']
        return code if code != '' else None
    except StopIteration:
        return None


def import_projects():
    for project in original_data['project']:
        project['project_code'] = find_project_code(project['id'])
        project = remove_id_prefix(project)
        project['@id'] = project['id']
        db.project.insert_one(project)


def fix_software_githubid(software):
    if 'githubid' not in software and 'codeRepository' in software:
        matches = re.match(r'https://github.com/(.*?/.*?)/?$', str(software['codeRepository']))
        if matches:
            software['githubid'] = matches.group(1)

            
def import_software():
    for software in original_data['software']:
        software = remove_id_prefix(software)
        software['@id'] = software['id']
        fix_software_githubid(software)
        db.software.insert_one(software)


def fix_person_github_id(person):
    if 'githubid' not in person and 'githubUrl' in person:
        matches = re.match(r'.*github.com/(.*$)', person['githubUrl'])
        person['github_id'] = matches.group(1)

def import_persons():
    for person in original_data['person']:
        person = remove_id_prefix(person)
        person['@id'] = person['id']
        fix_person_github_id(person)
        db.person.insert_one(person)


def import_organizations():
    for organization in original_data['organization']:
        organization = remove_id_prefix(organization)
        organization['@id'] = organization['id']
        db.organization.insert_one(organization)


def import_original():
    import_projects()
    import_software()
    import_persons()
    import_organizations()


def cleanup():
    """Cleanup unused keys (not in schema)"""
    for resource_type in ['software', 'person', 'project', 'organization']:
        for resource in db[resource_type].find():
            for key in resource:
                if key not in ['id', '@id', '_id', 'schema'] and \
                        key not in db.schema.find_one({'_id': resource_type})['properties']:
                    print(resource['_id'] + ' ' + key)
                    db[resource_type].update({'_id' : resource['_id']}, {'$unset': { key: ''}})