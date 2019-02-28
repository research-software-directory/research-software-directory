# How do I empty the database?

Obviously, this part of the documentation can lead to the **LOSS OF DATA**. Make
sure you have copies of all data that you care about. 

Assuming that ``docker images`` shows the ``rsd_`` images, and ``docker ps -a`` shows the ``rsd-`` docker containers, add the environment variables to the terminal:

```
source rsd-secrets.env
```

Run the ``mongo`` command inside the database service to start the Mongo shell there.

```
docker-compose --project-name rsd run database mongo
```

In Mongo shell, tell Mongo you want to use the ``rsd`` database:

```
use rsd
```

Ask for a list of collections that Mongo knows about:

```
show collections
```

For every collection that you want to delete, e.g. ``commit``:
```
db.commit.deleteMany({})
```

For reference, here is the Link to the Mongo shell documentation:
https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany


Type Ctrl-D to exit the Mongo shell. 

Leave the database service with

```
exit 
```

You should now be back in the original terminal, i.e. where you ran ``source rsd-secrets.env``:

```
docker-compose --project-name rsd run database mongo
```

<!-- TODO: explain how to replace the db-init files -->
