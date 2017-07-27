import requests
from settings import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET


def get_user(token):
    url = 'https://api.github.com/user?access_token=%s' % token
    headers = {'Accept': 'application/vnd.github.v3+json '}
    req = requests.get(url, headers=headers)
    resp = req.json()
    if req.status_code != 200:
        resp['error'] = resp['message']
        resp['status_code'] = req.status_code
    return resp


def login(token):
    url = 'https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s&accept=json' % \
          (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, token)
    req = requests.get(url)
    import urllib.parse
    query = urllib.parse.parse_qsl(req.text)
    query_dict = {}
    for pair in query:
        query_dict[pair[0]] = pair[1]
    return query_dict

