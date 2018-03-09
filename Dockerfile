FROM python:3.6

RUN groupadd -r flask \
    && useradd -r -g flask flask

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY . /app
RUN chown -R flask /app
USER flask

WORKDIR /app

STOPSIGNAL SIGINT

CMD gunicorn --preload --workers 3 --max-requests 10 --timeout 15 --bind 0.0.0.0:5002 --access-logfile - --error-logfile - app:application
