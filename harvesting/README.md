# `harvesting` service for the Research Software Directory

Periodic harvesting of external data

## Install

```shell
pip install -r requirements.txt
```

## Configuration

Harvesting requires environment variables.
See `.env.example` for the required variables.

### Harvesting mentions data from Zotero

To fetch mentions of software from Zotero you need the Zotero group identifier
to search and an API key to access it.

The group identifier can be found in the url of a group on the
https://www.zotero.org/groups/ page. For example for the Netherlands eScience
center the group url is
https://www.zotero.org/groups/1689348/netherlands_escience_center and the group
identifier is 1689348. The Zotero group identifier must be set as value for the
``ZOTERO_LIBRARY`` environment variable.

The API key can be created at https://www.zotero.org/settings/keys The API key
must be granted read only permission on the group. The Zotero API key must be
set as value for the ``ZOTERO_API_KEY`` environment variable.

To save the mentions into the database the location of the backend server and a
jwt secret must be configured. A jwt secret can be found in the ``JWT_SECRET``
env var of the backend server. The jwt secret must be set as value for the
``JWT_SECRET`` environment variable. The location of backend server must be set
as value for the ``BACKEND_URL`` environment variable.

### Harvesting commits data from Github

To fetch GitHub commits for lots of repositories an access token is required.
The token can be generated at https://github.com/settings/tokens, no scopes need
to be selected. The token must be set as value for the ``GITHUB_ACCESS_TOKEN``
environment variable.

The harvester directly injects into the database so the ``DATABASE_PORT`` and
``DATABASE_NAME`` environment variables should be set.

### Harvesting citations data from Zenodo

The harvester retrieves all the data to be able to cite a software item.

The harvester directly injects into the database so the ``DATABASE_HOST``, the
``DATABASE_PORT`` and ``DATABASE_NAME`` environment variables should be set.

## Usage

Refer to the help like this:

```shell
python app.py --help
```

The mentions can be fetched from Zotero using

```shell
python app.py harvest mentions
python app.py harvest mentions --help
python app.py harvest mentions --since-version VERSION
python app.py harvest mentions --keys STRING
```

The Github commits can be fetched using

```shell
python app.py harvest commits
```

The releases of each software can be fetched using

```shell
python app.py harvest citations
python app.py harvest citations --help
python app.py harvest citations --dois STRING
```

The metadata of each software can be fetched using

```shell
python app.py harvest metadata
python app.py harvest metadata --help
python app.py harvest metadata --dois STRING
```

If you want to fetch data from all sources, use:

```shell
python app.py harvest all
```

Once the data have been fetched, data from different collections need to be
combined into one document such that it can be fed to the ``frontend``'s template.
Combining is done with the ``resolve`` task, as follows:

```shell
# resolve references in all documents of type project
python app.py resolve projects
```

```shell
# resolve references in all documents of type software
python app.py resolve software
```

```shell
# resolve references in all documents of type project and in all
# documents of type software
python app.py resolve all
```


# Docker

Build with

```shell
cd harvesting/
docker build --tag rsd/harvesting .
```
