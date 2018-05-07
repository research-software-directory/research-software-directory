"""
https://developer.github.com/v3/repos/commits/
"""
import requests
import concurrent.futures
import os
import re
from dateutil import parser
import datetime
from util import db_connect
import logging
import pymongo
db = db_connect()

logger = logging.getLogger(__name__)


class APIRateLimitExceeded(Exception):
    pass


class Repo:
    def __init__(self, url):
        self.url = url
        self.name = re.match(r'https?://github.com/(.*?)/?$', url).group(1)
        self.new_commits = None
        try:
            last_commit_date = db.commit.find({'repositoryURL': url}).sort('date', pymongo.DESCENDING)[0]['date']
            # add one second
            self.synced_until = (parser.parse(last_commit_date) + datetime.timedelta(0, 1)).isoformat()[0:-6] + 'Z'
        except IndexError:
            self.synced_until = '2012-01-01T00:00:00Z'


def get_headers():
    return {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + os.environ.get('GITHUB_ACCESS_TOKEN')
    }


def flatten(l):
    """
    Flatten array of arrays to single array, e.g. [ [1], [2, 3] ] => [1, 2, 3]
    :param l: array to flatten
    :return: flattened array
    """
    return [item for sublist in l for item in sublist]


def is_github_url(url):
    return url.startswith('https://github.com/')


def get_repo_urls_to_sync():
    """
    Ask the backend for all unique Github repos that have isCommitDataSource enabled
    :return: list of Github repos (full urls)
    """
    nested_urls = map(
        lambda sw: [url for url in sw['repositoryURLs']['github'] if is_github_url(url)],
        db.software.find()
    )
    return set(flatten(nested_urls))


def get_commits(repo):
    """
    Get all commits for repo `repo_url` that are new since `since`
    :param: repo_url Full repo url eg 'https://github.com/research-software-directory/scrapers-nlesc'
    :param: since: ISO format string, function looks for commits after this date e.g. '2012-01-01T00:00:00Z'
    :return: list of commits as in [https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository]
    """

    def get_page(page):
        url = 'https://api.github.com/repos/%s/commits?per_page=100&page=%i&since=%s' % \
              (repo.name, page, repo.synced_until)
        req = requests.get(url, headers=get_headers())
        if req.status_code == 404:
            raise Exception('GitHub repo not found: %s' % repo.name)
        if req.status_code != 200:
            raise Exception('Error getting commits for GitHub repo %s' % repo.name)
        if req.status_code == 403:
            raise APIRateLimitExceeded
        return req.json()

    result = []
    i = 1
    while True:
        commits = get_page(i)
        if not commits:
            break
        result += commits
        i += 1

    return result


def save_commits(repo, commits):
    """
    Save list of commits
    :param repo_url: full github repo URL
    :param commits: list of commits
    """
    db.commit.insert_many(map(
        lambda commit: {
            'repositoryURL': repo.url,
            'date': commit['commit']['committer']['date']
        },
        commits
    ))


def sync_github_repo(repo):
    logger.info(repo.name + ' Starting')

    commits = get_commits(repo)

    if len(commits) > 0:
        save_commits(repo, commits)

    logger.info(repo.name + ' Done`')

    return len(commits)


def set_num_new_commits(repo):
    url = "https://api.github.com/repos/%s/commits?since=%s&per_page=1" % (repo.name, repo.synced_until)
    repo.new_commits = 0
    resp = requests.get(url, headers=get_headers())
    if resp.status_code == 403:
        raise APIRateLimitExceeded
    link = resp.headers.get('Link')
    repo.new_commits = int(re.match(r'.*per_page=1&page=(\d*)>; rel="last"', link).group(1))
    return repo


def async_until_rate_limit_exceeds(func, args):
    with concurrent.futures.ThreadPoolExecutor(max_workers=25) as executor:
        futures = [executor.submit(func, arg) for arg in args]
        for future in concurrent.futures.as_completed(futures):
            if isinstance(future.exception(), APIRateLimitExceeded):
                for f in futures:
                    f.cancel()
                return


def sync_all():
    """
    Sync all Github repos listed in software from backend
    """
    repos = [Repo(url) for url in get_repo_urls_to_sync()]
    async_until_rate_limit_exceeds(set_num_new_commits, repos)

    repos = [repo for repo in repos if repo.new_commits > 0]
    for repo in repos:
        logger.info("%s: %s", repo.name, repo.new_commits)
    async_until_rate_limit_exceeds(sync_github_repo, repos)
