import requests
from src import settings
from src.database import db
import pymongo.errors

def releases(token, repo):
    url = 'https://api.github.com/repos/%s/releases' % repo
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token %s' % token
    }
    req = requests.get(url, headers=headers)
    resp = req.json()
    if req.status_code != 200:
        raise Exception('Github request failed (code: %s) %s' % (req.status_code, resp['message']))
    else:
        return [
            {
                'version': release['tag_name'],
                'date':    release['published_at'],
                'name':    release['name']
            } for release in resp if (
                release['draft'] is False
                # and release['prerelease'] is False
            )
        ]


def get_commits(repo, since='2012-01-01T00:00:00Z'):
    def get_page(page):
        url = 'https://api.github.com/repos/%s/commits?per_page=100&page=%i&since=%s' % (repo, page, since)
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + settings.GITHUB_ACCESS_TOKEN
        }
        req = requests.get(url, headers=headers)
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

def update_commits(software_id):
    software = db.software.find_one({'_id': software_id})
    if not software:
        raise Exception('software not found (%s)' % software_id)
    if not software['githubid']:
        raise Exception('software has no github id')

    last_commit = db.commit.find({'software_id': software_id}).sort([('date', -1)]).limit(1)
    last_date = '2012-01-01T00:00:00Z' if last_commit.count() == 0 else last_commit[0]['date']
    new_commits = get_commits(software['githubid'], last_date)

    def transform(commit):
        return {
            '_id':          commit['sha'],
            'parents':      [parent['sha'] for parent in commit['parents']],
            'author':       commit['committer']['login'] if commit['committer'] else '?',
            'message':      commit['commit']['message'],
            'date':         commit['commit']['committer']['date'],
            'software_id':  software_id
        }

    if len(new_commits) > 0:
        try:
            db.commit.insert_many([transform(commit) for commit in new_commits], ordered=False)
        except pymongo.errors.BulkWriteError:
            pass  # no problem, because it is trying to insert duplicate id (last commit already exists)

def get_github_repo(github_id):
    url = 'https://api.github.com/repos/%s' % github_id
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token ' + settings.GITHUB_ACCESS_TOKEN
    }
    req = requests.get(url, headers=headers)
    return req.json()
