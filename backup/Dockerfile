FROM openjdk:8-alpine

RUN apk add --no-cache mongodb-tools curl

RUN mkdir /app
COPY ./backup.sh /app/backup.sh
COPY ./crontab /var/spool/cron/crontabs/root

WORKDIR /app
RUN wget https://github.com/NLeSC/xenon-cli/releases/download/v2.4.0/xenon-cli-shadow-2.4.0.tar && tar -xf xenon-cli-shadow-2.4.0.tar

ENV PATH "$PATH:/app/xenon-cli-shadow-2.4.0/bin/"

CMD crond -d7 -f
