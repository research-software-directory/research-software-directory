FROM python:3.8-alpine

RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app

RUN apk add --update build-base && \
    apk del build-base

RUN python3 -m pip install --upgrade pip && \
    pip install -r /app/requirements.txt

COPY . /app

COPY ./crontab /var/spool/cron/crontabs/root

# publish the schedule, see also reverse-proxy's nginx.conf:

RUN mkdir -p /var/www && \
    cat index.html | sed '/<!--crontab-->/r crontab' > /var/www/index.html

CMD crond -d7 -f
