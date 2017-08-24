import requests

from src.exceptions import UnauthorizedException

from src.settings import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

from flask import request

def get_user(token):
    url = 'https://api.github.com/user?access_token=%s' % token
    headers = {'Accept': 'application/vnd.github.v3+json '}
    req = requests.get(url, headers=headers)
    resp = req.json()
    if req.status_code != 200:
        raise Exception('Request to github failed (code%s: %s)' % (req.status_code, resp['status_code']))
    return resp


def get_user_organizations(user, token):
    url = '%s?access_token=%s' % (user['organizations_url'], token)
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


def user_in_organization(token, organization):
    user = get_user(token)
    url = 'http://api.github.com/orgs/%s/members/%s?access_token=%s' % (organization, user['login'], token)
    headers = {'Accept': 'application/vnd.github.v3+json '}
    req = requests.get(url, headers=headers)
    if req['status_code'] == 403:
        raise Exception('Github rate limit exceeded?')
    # print(req.status_code)
    return 200 <= req.status_code < 300


def require_organization(organization):
    def decorator(func):
        def wrapper(*args, **kwargs):
            if 'Token' not in request.headers:
                raise UnauthorizedException('No "Token" header in request')
            if not user_in_organization(request.headers['Token'], organization):
                raise UnauthorizedException('Not in organization ' + organization)

            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator
