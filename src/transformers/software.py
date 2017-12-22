def unpack_person(entry, db):
    if isinstance(entry, str):
        person = db['person'].find_by_id(entry)
        if person:
            return {
                'id': person.data.get('id'),
                'name': person.data.get('name'),
                'website': person.data.get('website'),
                'email': person.data.get('email')
            }
    return entry

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


def unpack_project(entry, db):
    import re
    if isinstance(entry, str):
        project = db['project'].find_by_id(entry)
        if not project:
            return entry
        else:
            result = {
                'id': project.data.get('id'),
                'name': project.data.get('name'),
                'nlescWebsite': project.data.get('nlescWebsite')
            }

            if project.data.get('nlescWebsite'):
                stripped_url = re.sub('https?://', '', project.data.get('nlescWebsite'), 1)
                corporate_projects = list(iter(db['corporate_project'].all()))
                matches = list(filter(lambda corporate_project: stripped_url in corporate_project['url'], corporate_projects))
                if len(matches) > 0:
                    result['corporate_project'] = matches[0]

            return result
    return entry


def related_software(sw, db):
    result = []
    if 'computerProgram' in sw['mentions']:
        for related_program in sw['mentions']['computerProgram']:
            related_sw = next(iter(db['software'].find({'zoteroKey': related_program['key']})))
            if related_sw:
                result.append(list_entry(related_sw))

    return result

def transform(resource, db):
    for idx, contributor in enumerate(resource['contributor']):
        resource.data['contributor'][idx] = unpack_person(contributor, db)
    resource.data['contactPerson'] = unpack_person(resource.data['contactPerson'], db)
    for idx, organization in enumerate(resource['contributingOrganization']):
        resource.data['contributingOrganization'][idx] = unpack_organization(organization, db)

    resource['usedInProject'] = [unpack_project(project, db) for project in resource['usedInProject']]

    resource.data['mentions'] = {}
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
            if item_type not in resource.data['mentions']:
                resource.data['mentions'][item_type] = []
            resource.data['mentions'][item_type].append(item)

        resource.data['relatedSoftware'] = related_software(resource.data, db)

def list_entry(software):
    return {
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
        'published': software.data.get('published') or False
    }