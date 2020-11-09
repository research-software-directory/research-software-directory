# `frontend` service of the Research Software Directory

Visitors of the Research Software Directory website will request pages from this web application.

## Installation

Setup a virtual Python 3 environment with

```shell
pip3 install -r requirements.txt
```

## Configuration

The frontend requires the [api backend server](/backend) to be running.
The url of the backend server must be set as value for the BACKEND_URL environment variable.

Setup `.env` file, see `.env.example` as an example.

Setup environmental variables: `export $(cat .env | xargs)`

## Test

Run unit tests with fixtures:

```shell
PYTHONPATH=. pytest -m "not live"
```

You can also test against live backend server, it will check if all pages render:

```shell
BACKEND_URL=https://www.research-software.nl/api PYTHONPATH=. pytest -m live -v
```

## Run

Before running the installation and configuration must be completed.

Run in development mode with:

```shell
python entry.py
```

Run in production mode with Docker using:

```shell
docker build -t rsd/frontend .
docker run --env-file .env --rm -it --name test -p5004:5004 rsd/frontend
```

## Develop

Changes to the sass style files should be followed up by css generation with

```shell
sassc --style=compressed --sourcemap style/rsd.scss static/style/rsd.scss.css
```
