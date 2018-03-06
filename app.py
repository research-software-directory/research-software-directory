import logging
import os
import requests
import jwt
import time
import urllib.parse
from flask import Flask, redirect, request

logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s'))

with open('error.html.template', 'r') as error_template_file:
    error_template = error_template_file.read()

for var in ['AUTH_GITHUB_CLIENT_ID', 'AUTH_GITHUB_CLIENT_SECRET', 'AUTH_GITHUB_ORGANIZATION', 'JWT_SECRET',
            'AUTH_CALLBACK_URL']:
    if not os.environ.get(var):
        raise Exception('%s not in environment' % var)

app = application = Flask(__name__)


@app.route('/', methods=["GET"])
def _root():
    return redirect('https://github.com/login/oauth/authorize/?client_id=%s' % os.environ.get('AUTH_GITHUB_CLIENT_ID'),
                    code=302)


def get_access_token(code):
    url = 'https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s&accept=json' % \
          (os.environ.get('AUTH_GITHUB_CLIENT_ID'), os.environ.get('AUTH_GITHUB_CLIENT_SECRET'), code)
    req = requests.get(url)
    query = urllib.parse.parse_qsl(req.text)
    query_dict = {}
    for pair in query:
        query_dict[pair[0]] = pair[1]
    if 'error' in query_dict:
        raise Exception(query_dict['error'])
    return query_dict['access_token']


def get_user_profile(access_token):
    url = 'https://api.github.com/user'
    req = requests.get(url, headers={
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token %s' % access_token
    })
    resp = req.json()
    if req.status_code != 200:
        raise Exception('Error getting user profile')
    return resp


def is_user_in_organization(user, access_token, organization):
    url = 'https://api.github.com/orgs/%s/members/%s' % (organization, user['login'])
    req = requests.get(url, headers={
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token %s' % access_token
    })
    if req.status_code == 403:
        raise Exception('Github rate limit exceeded?')
    return 200 <= req.status_code < 300


class UserNotInOrganization(Exception):
    def __str__(self):
        return 'It appears you\'re not a (public) member of GitHub organization "%s". If you are a private member, ' \
               'please go to <a target="_blank" href="https://github.com/orgs/%s/people">https://github.com/orgs/%s/people</a> and ' \
               'change your membership from private to public.' \
               '<img src="https://raw.githubusercontent.com/research-software-directory/auth-github/master/cast-github-private-public.gif" />' % (
                   os.environ.get('AUTH_GITHUB_ORGANIZATION'),
                   os.environ.get('AUTH_GITHUB_ORGANIZATION'),
                   os.environ.get('AUTH_GITHUB_ORGANIZATION')
                  )

@app.route('/get_jwt', methods=["GET"])
def _login():
    try:
        code = request.args.get('code')
        access_token = get_access_token(code)
        user_profile = get_user_profile(access_token)
        if not is_user_in_organization(user_profile, access_token, os.environ.get('AUTH_GITHUB_ORGANIZATION')):
            raise UserNotInOrganization

        payload = {
            'sub': user_profile.get('login'),
            'subType': 'GITHUB',
            'permissions': ['read', 'write'],
            'iat': round(time.time()),
            'user': {
                'name': user_profile.get('name'),
                'image': user_profile.get('avatar_url')
            }
        }
        issued_jwt = jwt.encode(payload, os.environ.get('JWT_SECRET'), algorithm='HS256').decode('ascii')

        return redirect(os.environ.get('AUTH_CALLBACK_URL') + '?jwt=' + issued_jwt), 302

    except Exception as e:
        return error_template \
                   .replace('{TITLE}', 'Error getting JWT') \
                   .replace('{SUBTITLE}', str(e.__class__.__name__)) \
                   .replace('{MESSAGE}', str(e)) \
                   .replace('{AUTH_URL}', 'https://github.com/login/oauth/authorize/?client_id=%s' % os.environ.get('AUTH_GITHUB_CLIENT_ID')), 400


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
