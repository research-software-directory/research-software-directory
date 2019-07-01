import logging
import os
import requests
import jwt
import time
import urllib.parse
from functools import wraps
from flask import Flask, redirect, request, Response

logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s'))

for var in ['JWT_SECRET', 'AUTH_CALLBACK_URL', 'AUTH_USERNAME', 'AUTH_PASSWORD']:
    if not os.environ.get(var):
        raise Exception('%s not in environment' % var)

app = application = Flask(__name__)
url_prefix = os.environ.get('AUTH_ROOT', '')


# http://flask.pocoo.org/snippets/8/
def check_auth(username, password):
    """This function is called to check if a username /
    password combination is valid.
    """
    return username == os.environ.get('AUTH_USERNAME') and password == os.environ.get('AUTH_USERNAME')


def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated


@app.route(url_prefix + '/', methods=["GET"])
@requires_auth
def _root():
    payload = {
        'sub': 'user',
        'subType': 'GITHUB',
        'permissions': ['read', 'write'],
        'iat': round(time.time()),
        'user': {
            'name': 'Admin user',
            'image': 'https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png'
        }
    }

    issued_jwt = jwt.encode(payload, os.environ.get('JWT_SECRET'), algorithm='HS256').decode('ascii')
    return redirect(os.environ.get('AUTH_CALLBACK_URL') + '?jwt=' + issued_jwt), 302



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
