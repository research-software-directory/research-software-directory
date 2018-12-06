FROM python:3.6-alpine


RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app

RUN apk add --update build-base && \
    pip install -r /app/requirements.txt && \
    apk del build-base

COPY . /app

COPY ./crontab /var/spool/cron/crontabs/root

CMD crond -d7 -f