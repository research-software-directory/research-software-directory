# harvesting

Periodic harvesting of external data

## Install

```bash
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

### Harvesting project descriptions from the corporate site

The projects are scraped from https://www.esciencecenter.nl/projects

It requires the same ``BACKEND_URL`` and ``JWT_SECRET`` environment variable as
harvesting the mentions from zotero.

### Harvesting citations data from Zenodo

The harvester retrieves all the data to be able to cite a software item.

The harvester directly injects into the database so the ``DATABASE_HOST``, the
``DATABASE_PORT`` and ``DATABASE_NAME`` environment variables should be set.

## Usage

Refer to the help like this:

```bash
python app.py --help
```

The mentions can be fetched from Zotero using

```bash
python app.py harvest mentions
python app.py harvest mentions --help
python app.py harvest mentions --since-version VERSION
python app.py harvest mentions --keys STRING
```

The Github commits can be fetched using

```bash
python app.py harvest commits
```

The projects can be fetched from the corporate site using

```bash
python app.py harvest projects
```

The releases of each software can be fetched using

```bash
python app.py harvest citations
```

The metadata of each software can be fetched using

```bash
python app.py harvest metadata
```

If you want to fetch data from all sources, use:

```bash
python app.py harvest all
```

Once the data have been fetched, data from different collections need to be
combined into one document such that it can be fed to the ``frontend``'s template.
Combining is done with the ``resolve`` task, as follows:

```bash
python app.py resolve
```

# Docker

Build with
```bash
cd harvesting/
docker build --tag rsd_harvesting .
```
