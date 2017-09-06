# research-software-directory-backend
![TravisCIBadge](https://travis-ci.org/NLeSC/research-software-directory-backend.svg?branch=master)

Backend for the eScience Research Software Directory.
### Requirements:
- Python 3
- Pip
- mkvirtualenv (`pip install virtualenvwrapper`)
- Mongodb server

### Configuration:
- Copy `src/settings.dist.py` to `src/settings.py`

### Setup
```
mkvirtualenv rsd -p `which python3`
pip install -r requirements.txt
export FLASK_APP=`pwd`/entry.py
export FLASK_DEBUG=1

```
### Run unit tests
```
PYTHONPATH=`pwd` pytest
```

### Run API server
```
flask run
```

### export MongoDB data
```
flask export file.tar.gz
```

### import MongoDB data exported with `flask export`
```
flask import file.tar.gz
```

### get zotero access token:
```
# pip install rauth
from rauth import OAuth1Service

zotero = OAuth1Service(
    name='twitter',
    consumer_key='{ZOTERO_KEY}',
    consumer_secret='{ZOTERO_SECRET}',
    request_token_url='https://www.zotero.org/oauth/request',
    access_token_url='https://www.zotero.org/oauth/access',
    authorize_url='https://www.zotero.org/oauth/authorize',
    base_url='https://api.zotero.org/')
    
request_token, request_token_secret = zotero.get_request_token()
url = zotero.get_authorize_url(request_token)

# visit url -> authorize -> callback url will contain oauth_token & oauth_verifier
oauth_token = '...'
oauth_verifier = '...'
session = zotero.get_auth_session(request_token, request_token_secret, method='GET',
    data={'oauth_verifier': oauth_verifier, 'oauth_token': oauth_token})
access_token = session['access_token']
```