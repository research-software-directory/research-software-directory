FROM python:3.6

#ENV PYTHONUNBUFFERED 1

RUN groupadd -r flask \
    && useradd -r -g flask flask

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY ./compose/production/flask/celery/worker/start.sh /start-celeryworker.sh
RUN chmod +x /start-celeryworker.sh

COPY ./compose/production/flask/celery/beat/start.sh /start-celerybeat.sh
RUN chmod +x /start-celerybeat.sh

COPY ./compose/production/flask/start.sh /start-flask.sh
RUN chmod +x /start-flask.sh

COPY ./compose/production/flask/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chown flask /entrypoint.sh

RUN mkdir -p /var/log/flask-uwsgi
RUN chown flask /var/log/flask-uwsgi

COPY . /app

RUN chown -R flask /app

USER flask

WORKDIR /app

CMD ["uwsgi", "--socket", "0.0.0.0:8000", "--wsgi-file", "entry.py", "--processes", "5", "--master"]
