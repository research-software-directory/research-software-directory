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
    if isinstance(entry, str):
        project = db['project'].find_by_id(entry)
        if project:
            return {
                'id': project.data.get('id'),
                'name': project.data.get('name'),
                'nlescWebsite': project.data.get('nlescWebsite')
            }
    return entry

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