FROM python:3.6-alpine

RUN apk update && apk add --no-cache mongodb-tools

RUN mkdir /app
COPY ./backup.sh /app/backup.sh
COPY ./crontab /var/spool/cron/crontabs/root

CMD crond -d7 -f