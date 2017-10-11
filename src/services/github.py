import requests


class GithubService:
    def __init__(self, db, token):
        self.access_token = token
        self.db = db

    def releases(self, repo):
        url = 'https://api.github.com/repos/%s/releases' % repo
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token %s' % self.access_token
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

    @staticmethod
    def description(token, repo):
        url = 'https://api.github.com/repos/%s/' % repo
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token %s' % token
        }
        req = requests.get(url, headers=headers)
        resp = req.json()
        if req.status_code != 200:
            raise Exception('Github request failed (code: %s) %s' % (req.status_code, resp['message']))
        else:
            return "test"

    def get_commits(self, repo, since='2012-01-01T00:00:00Z'):
        def get_page(page):
            url = 'https://api.github.com/repos/%s/commits?per_page=100&page=%i&since=%s' % (repo, page, since)
            headers = {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + self.access_token
            }
            req = requests.get(url, headers=headers)
            if req.status_code == 404:
                raise Exception('GitHub repo not found: %s' % repo)
            if req.status_code != 200:
                raise Exception('Error getting commits for GitHub repo %s' % repo)
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
    
    def update_commits(self, software_id):
        software = self.db.software.find_by_id(software_id)
        if not software:
            raise Exception('software not found (%s)' % software_id)
        if not software['githubid']:
            raise Exception('software has no github id')
    
        last_commit_cursor = self.db.commit.find({'software_id': software_id}).sort([('date', -1)]).limit(1)
        last_date = '2012-01-01T00:00:00Z' if last_commit_cursor.count() == 0 else last_commit_cursor.next()['date']
        new_commits = self.get_commits(software['githubid'], last_date)
    
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
            for commit_data in new_commits:
                try:
                    commit = self.db.commit.new(transform(commit_data))
                    commit.save()
                except Exception as e:
                    print(e)

    def get_github_repo(self, github_id):
        url = 'https://api.github.com/repos/%s' % github_id
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + self.access_token
        }
        req = requests.get(url, headers=headers)
        return req.json()
