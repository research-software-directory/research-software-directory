mongodump --host ${DATABASE_HOST} \
 --port ${DATABASE_PORT} \
 --db ${DATABASE_NAME} \
 --out /dump \
 --excludeCollection=commit \
 --excludeCollection=software_cache \
 --excludeCollection=release && \
tar --create --gzip --file /app/rsd-backup.tar.gz --directory /dump/rsd . && \
echo 'still need to transfer'

# rsd-backup-$(date -Iseconds).tar.gz
