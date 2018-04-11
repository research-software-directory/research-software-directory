# tasks-nlesc
Periodic tasks (Scrapers / Data synchronization / Caching) for NLeSC

## Install

```bash
pip install -r requirements.txt
```

## Configuration

The tasks require environment variables.
See `.env.example` for the required variables.

### Zotero

To fetch mentions of software from Zotero you need the Zotero group identifier to search and a API key to access it.

The group identifier can be found in the url of a group on the
https://www.zotero.org/groups/ page. For example for the Netherlands eScience center the group url is https://www.zotero.org/groups/1689348/netherlands_escience_center and the group identifier is 1689348.
The Zotero group identifier must be set as value for the ZOTERO_LIBRARY nviroment variable.

The API key can be created at https://www.zotero.org/settings/keys
The Zotero API key must be set as value for the ZOTERO_API_KEY nviroment variable.

To save the mentions into the database the location of the backend server and a jwt token must be configured.
A jwt token can be found in the local storage of the admin site.
The jwt token for the back end server must be set as value for the BACKEND_JWT environment variable.
The location of backend server must be set as value for the BACKEND_URL environment variable.

### Github

To fetch GitHub commits for lots of repositories a access token is required.
The token can be generated at https://github.com/settings/tokens, no scopes need to be selected.
The token must be set as value for the GITHUB_ACCESS_TOKEN enviroment variable.

### Projects

The projects are scrapped from https://www.esciencecenter.nl/projects

It requires the same BACKEND_URL and BACKEND_JWT environment variable as the zotero task.

### Persons

The projects are scrapped from https://www.esciencecenter.nl/people

It requires the same BACKEND_URL and BACKEND_JWT environment variable as the projects task.

## Usage

The mentions can be fetched from Zotero using

```bash
python app.py --task zotero
```

The Github commits can be fetched using

```bash
python app.py --task github
```

The projects can be fetched from the corporate site using

```bash
python app.py --task projects
```

The persons can be fetched from the corporate site using

```bash
python app.py --task people
```

To keep the frontend dumb the software records must be de-normalized with

```bash
python app.py --task cache_software
```
