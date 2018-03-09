"""
https://developer.github.com/v3/repos/commits/
"""

import requests
import os
import re
from dateutil import parser
import datetime
from util import rate_limit
import logging

logger = logging.getLogger(__name__)

def flatten(l):
    """
    Flatten array of arrays to single array, e.g. [ [1], [2, 3] ] => [1, 2, 3]
    :param l: array to flatten
    :return: flattened array
    """
    return [item for sublist in l for item in sublist]


def get_repo_urls_to_sync():
    """
    Ask the backend for all Github repos that have isCommitDataSource enabled
    :return: list of Github repos (full urls)
    """
    software = requests.get(os.environ.get('BACKEND_URL') + '/software').json()
    nested_urls = map(
        lambda sw: [ghDict['url'] for ghDict in sw['githubURLs'] if ghDict['isCommitDataSource']],
        software
    )
    return set(flatten(nested_urls))


def repo_url_to_repo(repo_url):
    """
    Github repo URL to short identifier.
    :param: repo_url the full Github url of a repo. e.g. 'https://github.com/research-software-directory/scrapers-nlesc'
    :return: repo identifier string e.g. 'research-software-directory/scrapers-nlesc'
    """
    return re.match(r'https?://github.com/(.*?)/?$', repo_url).group(1)


def get_commits(repo_url, since):
    """
    Get all commits for repo `repo_url` that are new since `since`
    :param: repo_url Full repo url eg 'https://github.com/research-software-directory/scrapers-nlesc'
    :param: since: ISO format string, function looks for commits after this date e.g. '2012-01-01T00:00:00Z'
    :return: list of commits as in [https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository]
    """
    @rate_limit('github', 120, 60)
    def get_page(page):
        url = 'https://api.github.com/repos/%s/commits?per_page=100&page=%i&since=%s' % \
              (repo_url_to_repo(repo_url), page, since)
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + os.environ.get('GITHUB_ACCESS_TOKEN')
        }
        req = requests.get(url, headers=headers)
        if req.status_code == 404:
            raise Exception('GitHub repo not found: %s' % repo_url)
        if req.status_code != 200:
            raise Exception('Error getting commits for GitHub repo %s' % repo_url)
        return req.json()

    result = []
    i = 1
    while True:
        print(str(i), end='.. ', flush=True)
        commits = get_page(i)
        if not commits:
            break
        result += commits
        i += 1

    return result


def save_commits(repo_url, commits):
    """
    Save list of commits in the backend
    :param repo_url: full github repo URL
    :param commits: list of commits
    """
    post_data = []
    for commit in commits:
        post_data.append({
            'githubURL': repo_url,
            'date': commit['commit']['committer']['date']
        })
    resp = requests.post(
        os.environ.get('BACKEND_URL') + '/commit',
        json=post_data,
        headers={'Authorization': 'Bearer %s' % os.environ.get('BACKEND_JWT')}
    )
    if resp.status_code != 200:
        raise Exception('Error when trying to save')


def sync_github_repo(url):
    """
    - Get last commit for repo `url` from backend
    - Get commits after last date from Github
    - Save commits to backend
    :param url: url of github repo
    """
    logger.info('syncing ' + url)
    last_commit = requests.get(
        os.environ.get('BACKEND_URL') + '/commit?githubURL=' + url + '&sort=date&direction=desc&limit=1'
    ).json()
    since = last_commit[0]['date'] if len(last_commit) == 1 else '2012-01-01T00:00:00Z'
    since = (parser.parse(since) + datetime.timedelta(0, 1)).isoformat()[0:-6]+'Z'  # add a second...
    commits = get_commits(url, since)
    logger.info('%s new commits' % str(len(commits)))
    if len(commits) > 0:
        save_commits(url, commits)
    return len(commits)


def sync_all():
    """
    Sync all Github repos listed in software from backend
    """
    urls = get_repo_urls_to_sync()
    for url in urls:
        try:
            new_commits = sync_github_repo(url)
        except Exception as e:
            logger.error('Error trying to sync ' + url + ' ' + str(e))

    set_total_commits()


def get_last_commit_date(sw):
    last_commit_date = ''
    for url in [repo['url'] for repo in sw['githubURLs'] if repo['isCommitDataSource']]:
        last_commit = requests.get(
            os.environ.get('BACKEND_URL') + '/commit?limit=1&sort=date&direction=desc&githubURL=' + url
        ).json()
        if len(last_commit) > 0 and last_commit[0].get('date') > last_commit_date:
            last_commit_date = last_commit[0].get('date')
    return last_commit_date


def get_total_commits(sw):
    total_commits = 0
    for url in [repo['url'] for repo in sw['githubURLs'] if repo['isCommitDataSource']]:
        total_commits += requests.get(
            os.environ.get('BACKEND_URL') + '/commit?count&githubURL=' + url
        ).json().get('count')

    return total_commits


def set_total_commits():
    """
    Sets the total commits value for all Software items
    """
    software = requests.get(
        os.environ.get('BACKEND_URL') + '/software'
    ).json()
    for sw in software:
        total_commits = get_total_commits(sw)
        if total_commits > 0 and total_commits != sw.get('total_commits'):
            sw_to_save = {
                'commitsTotal': total_commits,
                'commitsLast': get_last_commit_date(sw)
            }
            res = requests.patch(
                os.environ.get('BACKEND_URL') + '/software/' + sw['primaryKey']['id'],
                json=sw_to_save,
                headers={'Authorization': 'Bearer %s' % os.environ.get('BACKEND_JWT')}
            )
            if res.status_code != 200:
                logger.error('unable to save total commits ' + str(res.json()))
