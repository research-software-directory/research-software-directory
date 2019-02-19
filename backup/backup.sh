echo $PATH && \
echo 'dumping the contents of the database...' &&
mongodump --host ${DATABASE_HOST} \
 --port ${DATABASE_PORT} \
 --db ${DATABASE_NAME} \
 --out /dump \
 --excludeCollection=commit \
 --excludeCollection=software_cache \
 --excludeCollection=release && \
echo 'compressing the mongodump result...' && \
tar --create --gzip --file /app/rsd-backup.tar.gz --directory /dump/rsd . && \
echo 'transferring the tar.gz file using xenon...' && \
$(echo ${BACKUP_CMD}) && \
echo 'done.'

# rsd-backup-$(date -Iseconds).tar.gz
