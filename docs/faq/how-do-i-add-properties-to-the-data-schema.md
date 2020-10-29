# How do I add properties to the data schema?

## Relevant files

- `backend/schemas/*.json`
- `admin/public/settings.json`

The data schema is the document that describes what the data in the database
looks like. You can find those documents here: `backend/schemas/`. As you can
see, there are multiple documents, one for each collection in the MongoDB
database.

We can make different kinds of changes to the schema, for example, we may change
a property, remove a property or add a property. Some of these are more complex
than others. Because the simplest change is making an addition to the schema,
that's where we'll start.

Let's say we want to add a key `grants` to the `software` schema, such that
we can record the grant numbers of the project in which certain software was
developed.

Insert `grants` as a property of the existing top-level property `properties`:

```json
"grants": {
    "type": "array",
    "items": {
        "type": "string"
    }
},
```

This extends the software schema with an array of strings. Additionally, we need
to find the corresponding part in `admin/public/settings.json`, such that the
admin interface reflects our adding of `grants`. To do so, first find the
`software` property under `resources`, then look for its property `properties`.

Add `grants`, as follows:

```json
"grants": {
},
```

This minimal addition will make the `grants` property show up in the admin
interface. However, it's probably a good idea to provide a small description to
whoever is going to fill in the grants value in the admin interface. For this,
you can add a `label`, like so:

```json
"grants": {
    "label": "Specify which research grants were used to develop this software."
},
```

Finally, you can also control the order in which properties appear using
`sortIndex`; if you don't define a `sortIndex`, it will be added at the
bottom of the form. Given that the `sortIndex` of most other properties are
around 100 or even higher, a value of 50 will place it near the top of the form:

```json
"grants": {
    "label": "Specify which research grants were used to develop this software.",
    "sortIndex": 50
},
```

Refer to the [general workflow when making
changes](/README.md#general-workflow-when-making-changes) to update the Docker
container with the new content.

## Migrating pre-existing data to the new schema

If you go to [http://localhost/admin](http://localhost/admin), then select Software from the menu on the left and click
the blue plus sign, there should be a section in the form labeled `grants`, with the description that you provided.
However, pre-existing software documents do not have any grant numbers yet, so if you try to load e.g.
[http://localhost/admin/software/xenon](http://localhost/admin/software/xenon) the admin interface will complain about
missing data.

To avoid those errors, we need to update the pre-existing data from the old
schema to the new schema. We will use the MongoDB console for this.

Make sure the Research Software Directory is still up and running with

```bash
docker ps -a
```

Start a new terminal and go to the project's root directory.

Start a shell in the `database` container, as follows:

```
docker-compose exec database /bin/sh
```

Once in the shell, run `mongo rsd` to gain access to the `rsd` database via
the MongoDB shell.

In the MongoDB shell, run (see explanation below):

```
db.software.update({}, {$set: {"grants": []}}, {"multi": true})
```

`db.software.update` takes three arguments here. The first `{}` selects all
documents from the collection; the second `{$set: {"grants": []}}` specifies
that the `grants` property should be set to an empty array; the third argument
`{"multi": true}` specifies that if there are multiple documents in the
selection, that they should all be updated.

For more details on how to use the MongoDB shell, please refer to the documentation:
[https://docs.mongodb.com/manual/reference/method/db.collection.update/](https://docs.mongodb.com/manual/reference/method/db.collection.update/).

Go to any software package in the admin interface and verify that the errors
which were there previously have now gone.

