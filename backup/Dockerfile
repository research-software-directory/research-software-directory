FROM openjdk:8-alpine

RUN apk add --no-cache mongodb-tools==4.0.5-r0

RUN mkdir /app
COPY ./backup.sh /app/backup.sh
COPY ./crontab /var/spool/cron/crontabs/root

WORKDIR /app
RUN wget https://github.com/NLeSC/xenon-cli/releases/download/v2.4.1/xenon-cli-shadow-2.4.1.tar 2>&1 && sync && tar -xf xenon-cli-shadow-2.4.1.tar

ENV PATH "$PATH:/app/xenon-cli-shadow-2.4.1/bin/"

CMD ["crond","-d7","-f"]
