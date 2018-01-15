from flask import logging
import dateparser

logger = logging.getLogger(__name__)

def unpack_person(entry, db):
    if isinstance(entry, str):
        person = db['person'].find_by_id(entry)
        if person:
            unpacked_person = {
                'id': person.data.get('id'),
                'name': person.data.get('name'),
                'website': person.data.get('website'),
                'email': person.data.get('email'),
                'organization': 'Netherlands eScience Center'
            }
            corporate_person = find_matching_corporate_person(person, db)
            if corporate_person:
                unpacked_person['image'] = corporate_person.data.get('image')
                unpacked_person['website'] = corporate_person.data.get('url')
                unpacked_person['function'] = corporate_person.data.get('function')
                unpacked_person['name'] = corporate_person.data.get('name')
            return unpacked_person
    return entry


def find_matching_corporate_person(person, db):
    import re
    if person.data.get('nlescWebsite'):
        stripped_url = re.sub('https?://', '', person.data.get('nlescWebsite'), 1)
        corporate_people = list(iter(db['corporate_person'].all()))
        matches = list(filter(lambda corporate_person: stripped_url in corporate_person['url'], corporate_people))
        if len(matches) > 0:
            return matches[0]
    return None


def unpack_organization(entry, db):
    if isinstance(entry, str):
        organization = db['organization'].find_by_id(entry)
        if organization:
            return {
                'id': organization.data.get('id'),
                'name': organization.data.get('name'),
                'website': organization.data.get('website'),
                'logo': organization.data.get('logo')
            }
    return entry


def find_matching_corporate_project(project, db):
    import re
    if project.data.get('nlescWebsite'):
        stripped_url = re.sub('https?://', '', project.data.get('nlescWebsite'), 1)
        corporate_projects = list(iter(db['corporate_project'].all()))
        matches = list(filter(lambda corporate_project: stripped_url in corporate_project['url'], corporate_projects))
        if len(matches) > 0:
            return matches[0]
    return None


def unpack_project(entry, db):
    if not isinstance(entry, str):
        return None
    project = db['project'].find_by_id(entry)
    if not project:
        return None
    return find_matching_corporate_project(project, db)


def get_blog_posts(posts, db):
    import dateparser
    import time
    # splits blogPost mentions into Corporate eScience Blog and other blog
    all_escience_blog_posts = list(iter(db['corporate_blog'].all()))
    urls = list(map(lambda x: x['data']['url'], posts))
    escience_blog_posts = list(filter(lambda x: any([x['id'] in url for url in urls]), all_escience_blog_posts))
    logger.info([x['id'] for x in all_escience_blog_posts])
    other_blog_posts = list(filter(
        lambda x: not any(
            [post['id'] in x['data']['url'] for post in escience_blog_posts]
        ), posts))

    for post in escience_blog_posts:
        post['datetime'] = time.mktime(dateparser.parse(post['datetime-published']).timetuple())

    return other_blog_posts, escience_blog_posts

def get_related_software(sw, db):
    result = []
    if 'computerProgram' in sw['mentions']:
        for related_program in sw['mentions']['computerProgram']:
            related_sw = next(iter(db['software'].find({'zoteroKey': related_program['key']})))
            if related_sw:
                result.append(list_entry(related_sw))

    return result


def get_mentions(resource, db):
    result = {}
    if 'zoteroKey' in resource.data:
        def has_relation(key, publication):
            if 'dc:relation' in publication['data']['relations']:
                relations = publication['data']['relations']['dc:relation']
                if isinstance(relations, str):
                    relations = [relations]
                for relation in relations:
                    if relation[-8::] == key:
                        return True
            return False

        all_publications = list(db['zotero_publication'].all())
        related = filter(lambda x: has_relation(resource.data['zoteroKey'], x), all_publications)
        for item in related:
            item_type = item['data']['itemType']
            if 'extra' in item['data']:
                extra_field = item['data']['extra'].lower()
                if 'itemtype: dataset' in extra_field or 'itemtype:dataset' in extra_field:
                    item_type = 'dataset'
            if item_type not in result:
                result[item_type] = []
            result[item_type].append(item)
    return result

def transform(resource, db):
    resource.data['contactPerson'] = unpack_person(resource.data['contactPerson'], db)
    resource.data['contributor'] = [unpack_person(contributor, db) for contributor in resource['contributor']]
    resource.data['contributingOrganization'] = [unpack_organization(organization, db) for organization in resource['contributingOrganization']]
    resource.data['corporateProjects'] = [unpack_project(project, db) for project in resource['usedInProject'] if project is not None]
    resource.data['mentions'] = get_mentions(resource, db)
    if 'blogPost' in resource.data['mentions']:
        resource.data['mentions']['blogPost'], resource.data['corporateBlogs'] = get_blog_posts(resource.data['mentions']['blogPost'], db)
        if len(resource.data['mentions']['blogPost']) == 0:
            del resource.data['mentions']['blogPost']
    resource.data['relatedSoftware'] = get_related_software(resource.data, db)

def list_entry(software, db):
    mentions = get_mentions(software, db)
    commits = db['commit'].find({'software_id': software.data.get('id')})
    result = {
        'id': software.data.get('id'),
        'name': software.data.get('name'),
        'tagLine': software.data.get('tagLine'),
        'shortStatement': software.data.get('shortStatement'),
        'code': software.data.get('name')[0].upper() + software.data.get('name')[1].lower(),
        'discipline': software.data.get('discipline'),
        'expertise': software.data.get('expertise'),
        'tags': software.data.get('tags'),
        'lastUpdate': software.data.get('updatedAt'),
        'highlighted': software.data.get('highlighted') or False,
        'published': software.data.get('published') or False,
        'contributingOrganization': software.data.get('contributingOrganization') or [],
        'numMentions': sum([len(mentions[type]) for type in mentions]),
        'numCommits': commits.count()
    }

    if commits and commits.count() > 0:
        last_commit = list(commits.sort('date', -1).limit(1))[0]
        result['lastUpdate'] = int(dateparser.parse(last_commit['date']).timestamp())


    return result
