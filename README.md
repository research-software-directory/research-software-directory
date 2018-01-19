# research-software-directory-backend
[![TravisCIBadge](https://travis-ci.org/research-software-directory/backend.svg?branch=master)](https://travis-ci.org/research-software-directory/backend)
[![Coverage Status](https://coveralls.io/repos/github/research-software-directory/backend/badge.svg)](https://coveralls.io/github/research-software-directory/backend)

Backend for the eScience Research Software Directory.
### Requirements:
- docker, docker-compose
- Mongodb server

### Configuration:
- Configuration is done through environmental variables read by Docker through
  `.env`. Copy and fill `.env.example` to `.env`. Local (dev) config is read from `.dev.local`.

### Run unit tests
```
mkvirtualenv rsd -p `which python3`
pip install -r requirements.txt
PYTHONPATH=`pwd` pytest
```

### Run API server
```
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up
```

### api keys:
API keys are encrypted in `.travis.yml` - this is for testing purposes (tests are ran directly against
services). They should NOT be included in the build but deployed seperately in the production environment
(through environmental variables in `.env`.
