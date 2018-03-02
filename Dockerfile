FROM python:3.6

#ENV PYTHONUNBUFFERED 1

RUN groupadd -r flask \
    && useradd -r -g flask flask

RUN if [ ! -d /log ]; then mkdir /log; fi
RUN chown flask:flask /log

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY . /app
RUN chown -R flask /app
USER flask

WORKDIR /app

STOPSIGNAL SIGINT

CMD gunicorn --workers 3 --max-requests 10 --bind 0.0.0.0:8000 --access-logfile /log/reqlog --error-logfile /log/errlog entry:application
