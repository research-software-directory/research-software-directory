import os
from functools import reduce

import pymongo

db = pymongo.MongoClient(host=os.environ.get('DATABASE_HOST'),
                 port=int(os.environ.get('DATABASE_PORT')),
                 connectTimeoutMS=100,
                 serverSelectionTimeoutMS=100
                 )[os.environ.get('DATABASE_NAME')]


def resolve(collection, id):
    return db[collection].find_one({'primaryKey.id': id})


def replace_foreign_keys(resource):
    if isinstance(resource, dict):
        for key in resource.keys():
            if key == 'foreignKey':
                resource['foreignKey'] = resolve(resource['foreignKey']['collection'], resource['foreignKey']['id'])
            else:
                replace_foreign_keys(resource[key])
    if isinstance(resource, list):
        for item in resource:
            replace_foreign_keys(item)


def cache_software():
    for sw in db.software.find():
        replace_foreign_keys(sw)
        github_urls = filter(lambda x: x['isCommitDataSource'], sw['githubURLs'])
        sw['total_commits'] = reduce(
            lambda acc, cur: acc + total_commits(cur['url']),
            github_urls,
            0
        )
        sw['last_commit'] = reduce(
            lambda acc, cur: cur if cur and (not acc or cur > acc) else acc,
            map(lambda url: last_commit_date(url), github_urls),
            None
        )
        db.software_cache.replace_one({'_id': sw['_id']}, sw, upsert=True)


def total_commits(github_url):
    return db.commit.find({'githubURL': github_url}).count()


def last_commit_date(github_url):
    return db.commit.fineOne({'githubURL': github_url}).sort('date', pymongo.DESCENDING)
