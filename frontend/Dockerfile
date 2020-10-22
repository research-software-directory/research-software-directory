FROM python:3.8-alpine

RUN apk update && apk add --no-cache build-base

WORKDIR /src

COPY requirements.txt /src/

RUN python3 -m pip install --upgrade pip && \
    pip3 install -r requirements.txt

COPY . /src

RUN pysassc --style=compressed --sourcemap style/rsd.scss static/style/rsd.scss.css

STOPSIGNAL SIGINT

CMD sh -c "mkdir -p /shared_static && cp -r /src/static/* /shared_static && gunicorn --preload --workers 3 --max-requests 10 --timeout 15 --bind 0.0.0.0:5004 --access-logfile - --error-logfile - entry:application"

EXPOSE 5004
