# 3.0.0

- Added project page accessible through new route `/projects/<id>` and `/projects/<slug>`
- Added project index page accessible through new route `/projects`
- Added 404 error page
- Clean up and improve scss files
- Cleaned up the file structure for templates
- Improve documentation
- `docker-compose` now uses `.env` for environment variables instead of `export` command
- This version works on Windows and updated the developer documentation
- Added error messages if environment variables are undefined
- Migrated from Travis CI to GitHub Actions
    - Added GitHub Superlinter
    - Added OSSAR tests
    - Added Markdown link checker
    - Added `backend` tests
    - Added `frontend` tests
    - Added `harvesting` tests
    - Added integration tests
- Certificate microservice is now called `https` in docker-compose.yml instead of `nginx_ssl`
- Use static docker volumes instead of 
    - `docker-volumes/letsencrypt` 
    - `docker-volumes/cert`
- Python docker containers now based on Python 3.8
- Node docker containers now use Node 14.x
- Updated security and other dependencies
- Use `Caddy` in favor of `letsencrypt`
- API changes
    - removed `corporateUrl` and `principalInvestigator` from `project` collection
    - `image` now uses blobs like `{data: string, mimeType: string}`
    - added required properties to `project` collection
        - `callUrl`
        - `codeUrl`
        - `dateEnd`
        - `dateStart`
        - `description`
        - `grantId`
        - `isPublished`
        - `related.organizations`
        - `related.projects`
        - `related.software`
        - `slug`
        - `topics`
        - `team`
    - added optional properties to `project` collection
        - `dataManagementPlanUrl`    
        - `homeUrl`
        - `imageCaption`
    - renamed required properties to `project` collection
        - `tags` to `technologies`
- the sample data from `database/db-init` was updated to schema version 3.0.0. For notes on
  how to migrate your own data, please refer to the
  [data migration notes](/data-migration/2.0-to-3.0/README.md).
- the sample data also include data harvested from esciencecenter.nl/projects such as logos,
  related people, related organizations, descriptive text, and a hero image; furthermore the
  project start dates and end dates were added based on data from Exact. 
- FIXME: add commit comparison [2.0.2...3.0.0](https://github.com/research-software-directory/research-software-directory/compare/2.0.2...3.0.0)

# 2.0.2

- Had to rewrite history due to a copyright violation on the included Akkurat font files.

# 2.0.1

- fixed a bug with retrieving images from the corporate site when they have http addresses instead of https

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
- full commit diff [1.2.0...2.0.0](https://github.com/research-software-directory/research-software-directory/compare/e1e10fc781089d19aedc32824ffe4641f746baa2...2be41cb88be237700f60feb03fd4702e7bee9cff)

For the data migration instructions, go [here](/data-migration/1.x-to-2.x/README.md).

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

