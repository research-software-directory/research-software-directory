# research-software-directory-frontend
[![TravisCIBadge](https://travis-ci.org/research-software-directory/frontend.svg?branch=master)](https://travis-ci.org/research-software-directory/frontend)
[![Docker badge](https://dockerbuildbadges.quelltext.eu/status.svg?organization=rsdnlesc&repository=frontend)](https://hub.docker.com/r/rsdnlesc/frontend/)

### How to run
* Setup a virtual Python 3 environment
- `pip install -r requirements.txt`
- Setup `.env` file, see `.env.example`
- Setup environmental variables: `export $(cat .env | xargs)`
- Run with `python entry.py`

#### Alternatively, run with `docker`
- Setup `.env` file, see `.env.example`
- `docker build . -t rsd-frontend && docker run --env-file .env --rm -it --name test -p5004:5004 rsd-frontend`