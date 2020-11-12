#!/usr/bin/env bash

mongod "$@" &
MONGOD_PID=$!

echo "Sleeping 20 before checking for an existing database"
sleep 20

if mongo --quiet rsd --eval "db.getCollectionNames().length" | grep -E '^0\s?$' ; then
    echo "Mongo DB seems empty, populating from db-init"
    mongorestore -d rsd /db-init
fi

wait $MONGOD_PID