#!/usr/bin/env bash

MONGO_CONTAINER=$(docker ps --format "{{.Names}}" | grep mongo)
docker exec ${MONGO_CONTAINER} mongodump -d rsd -o /dump --excludeCollection=commit --excludeCollection=software_cache --excludeCollection=release
docker cp ${MONGO_CONTAINER}:/dump/rsd /home/ec2-user/db-dump
cd /home/ec2-user/db-dump/rsd
git add .
git commit -a -m "backup $(date --iso-8601=seconds)"
git push
