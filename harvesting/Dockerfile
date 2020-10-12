FROM python:3.6-alpine


RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app

RUN apk add --update build-base && \
    pip install --use-feature=2020-resolver -r /app/requirements.txt && \
    apk del build-base

COPY . /app

COPY ./crontab /var/spool/cron/crontabs/root


# publish the schedule, see also reverse-proxy's nginx.conf:

RUN mkdir -p /var/www && \
    cat index.html | sed '/<!--crontab-->/r crontab' > /var/www/index.html

CMD crond -d7 -f
