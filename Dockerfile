FROM python:3.6-alpine

RUN apk add --update build-base

RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app

RUN pip install -r /app/requirements.txt

RUN apk del build-base

COPY . /app

COPY ./crontab /var/spool/cron/crontabs/root

CMD crond -d7 -f