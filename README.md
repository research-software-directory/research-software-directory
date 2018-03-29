# tasks-nlesc
Periodic tasks (Scrapers / Data synchronization / Caching) for NLeSC

## Install

```bash
pip install -r requirements.txt
```

## Configuration

The tasks require environment variables.
See `.env.example` for the required variables.

### Backend

The corperate and Zotero tasks use the backend server to insert/update records. The tasks need to know the location of the backend server and a valid jwt token.

### Zotero

To fetch mentions of software from Zotero you need the Zotero group identifier to search and a API key to access it.

The group identifier can be found in the url of a group on the
https://www.zotero.org/groups/ page. For example for the Netherlands eScience center the group url is https://www.zotero.org/groups/1689348/netherlands_escience_center and the group identifier is 1689348.
The Zotero group identifier must be set as value for the ZOTERO_LIBRARY nviroment variable.

The API key can be created at https://www.zotero.org/settings/keys
The Zotero API key must be set as value for the ZOTERO_API_KEY nviroment variable.

### Github

To fetch GitHub commits for lots of repositories a access token is required.
The token can be generated at https://github.com/settings/tokens, no scopes need to be selected.
The token must be set as value for the GITHUB_ACCESS_TOKEN enviroment variable.

## Usage

The Github commits can be fetched using

```bash
python app.py --task github
```
