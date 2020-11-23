# Updating data from 1.x to 2.x

In version 2.0.0, the ``project`` collection is partly filled by harvesting from
an external data source, and partly filled by means of users making edits in the
admin interface. This means that version 2.0.0 of the Research Software
Directory requires changes to the database. Below are the steps to migrate data
from 1.2.0 to 2.0.0. Furthermore, the frontend now shows information for page
maintainers, for which a new MongoDB collection ``logging`` is needed.

When migrating data there is always the possibility of **LOSS OF DATA**. Review the
notes on how to make a backup of the Mongo data [here](/docs/maintaining.md#updating-a-production-instance).

```shell
source rsd-secrets.env
docker-compose exec database mongo rsd
```

Create collection "logging":

```shell
db.createCollection("logging")
```

**Remove** all ``release`` documents, ``project`` documents, and ``project_cache`` documents entirely:

```shell
db.release.deleteMany({})
db.project.deleteMany({})
db.project_cache.deleteMany({})
```
Then, update the project identifiers as used in the ``software`` collection by
copy-pasting the contents of the [data migration script](/data-migration/1.x-to-2.x/migrate.js) into the Mongo shell.

Exit the Mongo shell with Ctrl-d or ``exit``, then run the harvester:

```shell
docker-compose exec harvesting python app.py harvest all
```

See if it all worked by running:

```shell
docker-compose exec harvesting python app.py resolve all
```

The ``resolve`` command should list only INFO messages, not ERROR messages.
