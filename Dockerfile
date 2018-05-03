FROM python:3.6-alpine

RUN apk update && apk add g++ make

RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app

RUN pip install -r /app/requirements.txt

COPY . /app

COPY ./crontab /var/spool/cron/crontabs/root

CMD crond -d7 -f