import os
import logging
from functools import reduce
from bson.code import Code
import pymongo

db = pymongo.MongoClient(host=os.environ.get('DATABASE_HOST'),
                         port=int(os.environ.get('DATABASE_PORT')),
                         connectTimeoutMS=100,
                         serverSelectionTimeoutMS=100
                         )[os.environ.get('DATABASE_NAME')]

logger = logging.getLogger(__name__)


# Replace foreign keys in resource (modifies resource).
def replace_foreign_keys(resource):
    if isinstance(resource, dict):
        for key in list(resource):
            if key == 'foreignKey' and resource['foreignKey'] and 'collection' in resource['foreignKey'] and 'id' in resource['foreignKey']:
                foreign_resource = db[resource['foreignKey']['collection']].find_one(
                    {'primaryKey.id': resource['foreignKey']['id']}
                )
                if not foreign_resource:
                    logger.error(' not found: ' +
                                 resource['foreignKey']['collection'] + ' ' + resource['foreignKey']['id'])
                    del resource['foreignKey']
                    continue
                resource['foreignKey'] = foreign_resource
                del resource['foreignKey']['_id']
            else:
                replace_foreign_keys(resource[key])
    if isinstance(resource, list):
        list_has_foreign_keys = len(resource) > 0 and 'foreignKey' in resource[0]
        for item in resource:
            replace_foreign_keys(item)
        if list_has_foreign_keys: # filter out unresolvable items
            resource[:] = [item for item in resource if 'foreignKey' in item]
    return resource


def get_binned_commits(repository_urls):
    mapper = Code("function () { emit(this.date.substr(0, 7), 1); }")
    reducer = Code("function (key, values) { return Array.sum(values); }")
    results = db.commit.map_reduce(mapper, reducer, {'inline': 1}, query={'repositoryURL': {'$in': repository_urls}})['results']

    return dict((row['_id'], int(row['value'])) for row in results)


def total_commits(repository_url):
    return db.commit.find({'repositoryURL': repository_url}).count()


def last_commit_date(repository_url):
    try:
        return db.commit.find({'repositoryURL': repository_url}).sort('date', pymongo.DESCENDING)[0]['date']
    except IndexError:
        return None


def cache_projects():
    projects = db.project.find()
    for project in projects:
        logger.log(logging.INFO, 'processing project %s' % project['corporateUrl'])
        project = replace_foreign_keys(project)
        db.project_cache.replace_one({'_id': project['_id']}, project, upsert=True)


def cache_software():
    db_software = db.software.find()
    for sw in db_software:
        if not sw['isPublished']:
            db.software_cache.delete_one({'_id': sw['_id']})
            continue
        logger.log(logging.INFO, 'processing software %s' % sw['brandName'])
        replace_foreign_keys(sw)
        sw['related']['software'] = [s for s in sw['related']['software'] if s['foreignKey'] and s['foreignKey']['isPublished']]
        repository_urls = sw['repositoryURLs']['github']
        sw['totalCommits'] = sum(map(lambda url: total_commits(url), repository_urls))
        sw['lastCommit'] = reduce(
            lambda acc, date: date if date and (not acc or date > acc) else acc,
            map(lambda url: last_commit_date(url), repository_urls),
            None
        )
        sw['commits'] = get_binned_commits(repository_urls)
        release_document = db.release.find_one({'_id': sw['conceptDOI']})
        if release_document:
            sw['releases'] = release_document['releases']
            sw['isCitable'] = release_document['isCitable']
            sw['latestSchema_dot_org'] = release_document['latestSchema_dot_org']
        else:
            sw['releases'] = []

        sw["logging"] = db.logging.find_one(filter={"id": sw["primaryKey"]["id"],
                                                    "collection": sw["primaryKey"]["collection"]},
                                            projection={"_id": False, "releases": True, "metadata": True})

        db.software_cache.replace_one({'_id': sw['_id']}, sw, upsert=True)

    software_ids = list(map(lambda x: x['primaryKey']['id'], db.software.find()))
    for cache_item in db.software_cache.find():
        if not cache_item['primaryKey']['id'] in software_ids:
            logger.log(logging.INFO, 'Deleting from cache: %s' % cache_item['brandName'])
            db.software_cache.delete_one({'_id': cache_item['_id']})
