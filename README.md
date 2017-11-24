# research-software-directory-backend
[![TravisCIBadge](https://travis-ci.org/NLeSC/research-software-directory-backend.svg?branch=master)](https://travis-ci.org/NLeSC/research-software-directory-backend)
[![Coverage Status](https://coveralls.io/repos/github/NLeSC/research-software-directory-backend/badge.svg)](https://coveralls.io/github/NLeSC/research-software-directory-backend)

Backend for the eScience Research Software Directory.
### Requirements:
- Python 3
- Pip
- mkvirtualenv (`pip install virtualenvwrapper`)
- Mongodb server

### Configuration:
- Copy `settings.json.dist` to `settings.json` or add as environmental variables
  (environment is prioritized over `settings.json`)

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
### Docker
```
docker build -t rsd-backend
docker run -v data:/data -p 0.0.0.0:80:8000 rsd-backend
```

### export MongoDB data
```
flask export file.tar.gz
```

### import MongoDB data exported with `flask export`
```
flask import file.tar.gz
```

### api keys:
API keys are encrypted in `.travis.yml` - this is for testing purposes (tests are ran directly against
services). They should NOT be included in the build but deployed seperately in the production environment
(through settings.json or environmental variables.