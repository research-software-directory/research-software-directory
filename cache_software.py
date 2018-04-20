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


def replace_foreign_keys(resource):
    if isinstance(resource, dict):
        for key in resource.keys():
            if key == 'foreignKey' and resource['foreignKey'] and 'collection' in resource['foreignKey'] and 'id' in resource['foreignKey']:
                foreign_resource = db[resource['foreignKey']['collection']].find_one(
                    {'primaryKey.id': resource['foreignKey']['id']}
                )
                if not foreign_resource:
                    logger.error(' not found: ' +
                                 resource['foreignKey']['collection'] + ' ' + resource['foreignKey']['id'])
                    resource['foreignKey'] = None
                    continue
                resource['foreignKey'] = foreign_resource
                del resource['foreignKey']['_id']
            else:
                replace_foreign_keys(resource[key])
    if isinstance(resource, list):
        for item in resource:
            replace_foreign_keys(item)


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


def cache_software():
    for sw in db.software.find():
        if not sw['isPublished']:
            db.software_cache.delete_one({'_id': sw['_id']})
            continue
        logger.log(logging.INFO, 'processing %s' % sw['brandName'])
        replace_foreign_keys(sw)
        repository_urls = sw['repositoryURLs']
        sw['totalCommits'] = sum(map(lambda url: total_commits(url), repository_urls))
        sw['lastCommit'] = reduce(
            lambda acc, date: date if date and (not acc or date > acc) else acc,
            map(lambda url: last_commit_date(url), repository_urls),
            None
        )
        sw['commits'] = get_binned_commits(repository_urls)
        if 'conceptDOI' in sw:
            sw['releases'] = db.release.find_one({'_id': sw['conceptDOI']})

        db.software_cache.replace_one({'_id': sw['_id']}, sw, upsert=True)
