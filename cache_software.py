import os
import logging
from functools import reduce
from bson.code import Code
import pymongo
import json

db = pymongo.MongoClient(host=os.environ.get('DATABASE_HOST'),
                         port=int(os.environ.get('DATABASE_PORT')),
                         connectTimeoutMS=100,
                         serverSelectionTimeoutMS=100
                         )[os.environ.get('DATABASE_NAME')]

logger = logging.getLogger(__name__)


def replace_foreign_keys(resource):
    if isinstance(resource, dict):
        for key in resource.keys():
            if key == 'foreignKey':
                resource['foreignKey'] = db[resource['foreignKey']['collection']].find_one(
                    {'primaryKey.id': resource['foreignKey']['id']}
                )
            else:
                replace_foreign_keys(resource[key])
    if isinstance(resource, list):
        for item in resource:
            replace_foreign_keys(item)


def get_binned_commits(github_urls):
    mapper = Code("function () { emit(this.date.substr(0, 7), 1); }")
    reducer = Code("function (key, values) { return Array.sum(values); }")
    results = db.commit.map_reduce(mapper, reducer, {'inline': 1}, query={'githubURL': {'$in': github_urls}})['results']

    return dict((row['_id'], int(row['value'])) for row in results)


def total_commits(github_url):
    return db.commit.find({'githubURL': github_url}).count()


def last_commit_date(github_url):
    try:
        return db.commit.find({'githubURL': github_url}).sort('date', pymongo.DESCENDING)[0]['date']
    except IndexError:
        return None


def git_citation_cff(sw):
    citation_cff_urls = list(map(
        lambda github_url: github_url['url'],
        filter(lambda x: x['isCitationcffSource'], sw['githubURLs'])
    ))

    if len(citation_cff_urls) > 0:
        try:
            from cff_converter_python.citation import Citation
            c = Citation(citation_cff_urls[0])
            return json.loads(c.as_json())
        except Exception:
            logger.log(logging.WARNING, 'citation cff not found while set for url %s' % citation_cff_urls[0])
    return None


def cache_software():
    for sw in db.software.find():
        logger.log(logging.INFO, 'processing %s' % sw['brandName'])
        replace_foreign_keys(sw)
        github_urls = list(map(
            lambda github_url: github_url['url'],
            filter(lambda x: x['isCommitDataSource'], sw['githubURLs'])
        ))
        sw['totalCommits'] = sum(map(lambda url: total_commits(url), github_urls))
        sw['lastCommit'] = reduce(
            lambda acc, date: date if date and (not acc or date > acc) else acc,
            map(lambda url: last_commit_date(url), github_urls),
            None
        )
        sw['commits'] = get_binned_commits(github_urls)
        sw['citationCFF'] = git_citation_cff(sw)

        db.software_cache.replace_one({'_id': sw['_id']}, sw, upsert=True)
