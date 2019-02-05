#!/usr/bin/env bash

mongod "$@" &
MONGOD_PID=$!

sleep 5

if mongo --quiet rsd --eval "db.getCollectionNames().length" | egrep '^0\s?$' ; then
    echo "Mongo DB seems empty, populating from db-dump"
    mongorestore -d rsd /db-dump-initial
fi

wait $MONGOD_PID