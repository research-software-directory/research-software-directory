FROM python:3.6

#ENV PYTHONUNBUFFERED 1

RUN groupadd -r flask \
    && useradd -r -g flask flask

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

RUN mkdir -p /var/log/flask-uwsgi
RUN chown flask /var/log/flask-uwsgi

COPY . /app
RUN chown -R flask /app
USER flask

WORKDIR /app

STOPSIGNAL SIGINT

CMD uwsgi --http-socket 0.0.0.0:8000 --wsgi-file entry.py --processes 5 --master
