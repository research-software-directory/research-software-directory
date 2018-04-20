# Frontend website of Research Software Directory

[![TravisCIBadge](https://travis-ci.org/research-software-directory/frontend.svg?branch=master)](https://travis-ci.org/research-software-directory/frontend)
[![Docker badge](https://dockerbuildbadges.quelltext.eu/status.svg?organization=rsdnlesc&repository=frontend)](https://hub.docker.com/r/rsdnlesc/frontend/)

Visitors of the Research Software Directory website will request pages from this web application.

# Installation

Setup a virtual Python 3 environment with
```bash
pip install -r requirements.txt
```

# Configuration

The frontend requires the [api backend server](https://github.com/research-software-directory/backend) to be running.
The url of the backend server must be set as value for the BACKEND_URL environment variable.

Setup `.env` file, see `.env.example` as an example.

Setup environmental variables: `export $(cat .env | xargs)`

# Run

Before running the installation and configuration must be completed.

Run in development mode with:
```bash
python entry.py
```

Run in production mode with Docker using:
```
docker build . -t rsd-frontend
docker run --env-file .env --rm -it --name test -p5004:5004 rsd-frontend
```

# Develop

Changes to the sass style files should be followed up by css generation with
```bash
sassc --style=compressed --sourcemap style/rsd.scss static/style/rsd.scss.css
```
