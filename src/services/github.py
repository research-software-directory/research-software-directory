import requests


def releases(token, repo):
    url = 'https://api.github.com/repos/%s/releases?access_token=%s' % (repo, token)
    headers = {'Accept': 'application/vnd.github.v3+json '}
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
                release['draft'] is False and
                release['prerelease'] is False
            )
        ]
