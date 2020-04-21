# 2.0.0

<!-- - Bugfix | Change | Feature | Documentation | Security -->
## Summary of changes

- no need for starting ``docker-compose`` with ``--project-name`` anymore
- updated documentation
- updated ``admin`` style for better legibility
- projects can now be harvested from the corporate site, and users can add mentions as 'impact' or 'output' via the admin interface
- security updates
- fixed bug where server logging would fill the entire disk space
- now providing feedback to page maintainers via frontend
- ``/graphs`` is now available via a button on the frontend
- added codemeta and CITATION.cff files as downloadable files
- added the content type of downloadable citation manager files
- downloadable citation manager files now have filenames consistent with their respective standard
- full commit diff [1.2.0...2.0.0](https://github.com/research-software-directory/research-software-directory/compare/e1e10fc781089d19aedc32824ffe4641f746baa2...bee8cd4642d7158591dc04fd0b2b603da51db036)


## Data migration notes

In version 2.0.0, the ``project`` collection is partly filled by harvesting from
an external data source, and partly filled by means of users making edits in the
admin interface. This means that version 2.0.0 of the Research Software
Directory requires changes to the database. Below are the steps to migrate data
from 1.2.0 to 2.0.0. Furthermore, the frontend now shows information for page
maintainers, for which a new MongoDB collection ``logging`` is needed.

When migrating data there is always the possibility of **LOSS OF DATA**. Review the
notes on how to make a backup of the Mongo data [here](README.md#updating-a-production-instance).

```
$ source rsd-secrets.env
$ docker-compose exec database mongo rsd
```

Create collection "logging":

```
db.createCollection("logging")
```

**Remove** all ``release`` documents, ``project`` documents, and ``project_cache`` documents entirely:

```
db.release.deleteMany({})
db.project.deleteMany({})
db.project_cache.deleteMany({})
```
Then, update the project identifiers as used in the ``software`` collection by
copy-pasting the contents of the data migration script 
[data-migration-1.x-to-2.js](/data-migration-1.x-to-2.js) into the Mongo shell.

Exit the Mongo shell with Ctrl-d or ``exit``, then run the harvester:

```
$ docker-compose exec harvesting python app.py harvest all
```

See if it all worked by running:

```
$ docker-compose exec harvesting python app.py resolve all
```

The ``resolve`` command should list only INFO messages, not ERROR messages.

# 1.2.0

- added github issue templates
- replaced latest codemeta fields in releases with latest schema.org; the schema.org data is also used in the frontend to help discovery by Google et al.
- replaced the prominent header in the frontend with a more subtle one that helps make explicit that there are multiple instances of the Research Software Directory
- added new /graphs page showing metrics as well as their distribution over the software packages
- removed deprecated code from harvesting scrapers
- fixed error with blog scraping after Medium site changed its layout
- added more detailed control of the harvesting of dois and of zotero items
- added more informative logging messages for harvesters
- added throttling of queries to Zenodo
- cleaned up docker-compose file, simplified building (removed required ``-p`` option)
- added documentation for maintainers, e.g. how to make a release, how to update a production instance; added notes on security aspects

# 1.1.0

- added a simple OAI-PMH interface to allow harvesting of metadata about the 
items in the Research Software Directory in datacite4 format. The interface
implementation is not complete; at the moment, the OAI-PMH verbs ``ListRecord``
and ``GetRecords`` are implemented (but without any time based slicing such as
using ``from`` or ``until``, and without subsetting based on ``set``)
- added a service that visualizes the state of the Research Software Directory 
instance as simple graphs, e.g. histograms of how many contributors there are 
per software package.
- no longer using git submodules, this should make installing a lot easier. 
Having a monolithic repo also means that it is easier to see diffs between an 
'upstream' instance of the Research Software Direcotry, and one of its
descendants. Finally, archiving of the software via Zenodo works better for a
monorepo than for a repo with multiple submodules.
- bugfixes
- added a lot of documentation

# 1.0.0

First stable release.

Names below refer to repositories within the https://github.com/research-software-directory/ GitHub organization.

submodules SHAs:
```
 6856e70204eac7e0bb5b63cd0c391b13917966d9 admin (v1-140-g6856e70)
 fa3e0e62033dba864437af8c3b929e639428a4ac auth-github (heads/master)
 97c26c5f2825396f03fd029c32c3e21404c3b3a5 backend (v1-122-g97c26c5)
 f553e6d076471eab390b44d39c915e48f3b27ba4 db-dump (heads/master)
 1d82f242c3b2d15973b50f9a4096a16e72bcb0be frontend (v1-79-g1d82f24)
 362da73a4d594972318d5d11e3d6fb81402a46da readthedocs (heads/master)
 b4a99564651a547488c3a00efbb0b0ccbd75a7fe tasks-nlesc (heads/master)
```

# 0.0.0

First release, mostly testing the (Zenodo| GitHub) infrastructure at this point.

