FROM python:3.6-alpine
WORKDIR /src

COPY requirements.txt /src/
RUN pip3 install -r requirements.txt

COPY . /src

STOPSIGNAL SIGINT

CMD gunicorn --preload --workers 3 --max-requests 10 --timeout 15 --bind 0.0.0.0:5004 --access-logfile - --error-logfile - entry:application

EXPOSE 5004
VOLUME /src/static
