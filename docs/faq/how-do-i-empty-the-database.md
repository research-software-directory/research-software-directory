# How do I empty the database?

Obviously, this part of the documentation can lead to the **LOSS OF DATA**. Make
sure you have copies of all data that you care about.

Assuming that `docker images` shows the `rsd/` images, and `docker ps -a`
shows the `rsd-` docker containers, add the environment variables to the
terminal:

```shell
docker-compose up -d && docker-compose logs --follow
```

In a new terminal,

```shell
docker-compose exec database /bin/sh
```

Run the `mongo` command inside the `database` container to start the Mongo
shell there.

```shell
mongo
```

In Mongo shell, tell Mongo you want to use the `rsd` database:

```shell
use rsd
```

Ask for the list of collections that Mongo knows about:

```shell
show collections
```

For every collection that you want to delete, e.g. `commit` and `project`:

```shell
db.commit.deleteMany({})
db.project.deleteMany({})
```

For reference, here is the Link to the Mongo shell documentation:
[https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)

Type Ctrl-D to exit the Mongo shell.

After you are done making changes to the collections, you will want to update
the data in `/database/db-init`. The data in this directory is part of the
GitHub repo and serves as sample data for when people do a `git clone`. Now
that you have emptied some collections, that initial data needs to be updated,
as follows:

Dump the contents of the `rsd` database to a directory by running (still from
within the `database` container):

```shell
mongodump --db rsd
```

The dump files should be located at `/dump/rsd/` (inside the `database`
container). Verify that the files are there and then leave the `database`
container with:

```shell
exit
```

You should now be back in the original terminal. From there, copy the database dump files from inside the
container to outside the container:

```shell
docker cp rsd-database:/dump/rsd/ database/db-init/
```

Move the data to the appropriate place (`./database/db-init`) and delete the `rsd` directory:

```shell
cd database/db-init
mv rsd/* .
rm -r rsd
cd ../..
```

Update your git repository with:

```shell
git branch updated-data
git checkout updated-data
git add database/db-init/*
git commit
git push origin updated-data
```

After that, people who do a new `git clone` of your fork of the Research Software
Directory, should get the updated sample data.
