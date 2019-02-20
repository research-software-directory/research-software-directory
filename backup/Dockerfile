FROM python:3.6-alpine

RUN apk update && apk add --no-cache mongodb-tools git gradle

RUN mkdir /app
COPY ./backup.sh /app/backup.sh
COPY ./crontab /var/spool/cron/crontabs/root

WORKDIR /app
RUN git clone https://github.com/NLeSC/xenon-cli.git && cd xenon-cli && git checkout v2.4.0 && ./gradlew installShadowDist

ENV PATH "$PATH:/app/xenon-cli/build/install/xenon-cli-shadow/bin/"

CMD crond -d7 -f