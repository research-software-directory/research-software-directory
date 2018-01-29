import requests
from src.exceptions import UnauthorizedException
from flask import request


class UserService:
    def __init__(self, github_client_id, github_client_secret):
        self.github_client_id = github_client_id
        self.github_client_secret = github_client_secret

    @staticmethod
    def headers(token):
        return {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token %s' % token
        }

    @staticmethod
    def get_user(token):
        url = 'https://api.github.com/user'
        req = requests.get(url, headers=UserService.headers(token))
        resp = req.json()
        if req.status_code != 200:
            raise Exception('Request to github failed (code%s: %s)' % (req.status_code, resp['status_code']))
        return resp

    @staticmethod
    def get_user_organizations(user, token):
        url = user['organizations_url']
        req = requests.get(url, headers=UserService.headers(UserService.headers(token)))
        resp = req.json()
        if req.status_code != 200:
            resp['error'] = resp['message']
            resp['status_code'] = req.status_code

        return resp

    def login(self, token):
        url = 'https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s&accept=json' %\
            (self.github_client_id, self.github_client_secret, token)
        req = requests.get(url)
        import urllib.parse
        query = urllib.parse.parse_qsl(req.text)
        query_dict = {}
        for pair in query:
            query_dict[pair[0]] = pair[1]
        return query_dict

    @staticmethod
    def user_in_organization(token, organization):
        user = UserService.get_user(token)
        url = 'https://api.github.com/orgs/%s/members/%s' % (organization, user['login'])
        req = requests.get(url, headers=UserService.headers(token))
        if req.status_code == 403:
            raise Exception('Github rate limit exceeded?')
        return 200 <= req.status_code < 300

    @staticmethod
    def require_organization(organization):
        def decorator(func):
            def wrapper(*args, **kwargs):
                if 'Token' not in request.headers:
                    raise UnauthorizedException('No "Token" header in request')
                if not UserService.user_in_organization(request.headers['Token'], organization):
                    raise UnauthorizedException('Not a public member of organization ' + organization)

                return func(*args, **kwargs)
            wrapper.__name__ = func.__name__
            return wrapper
        return decorator
