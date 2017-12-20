#FROM python:3.6
#
#COPY requirements.txt /
#RUN pip3 install -r /requirements.txt
#
#WORKDIR /app
#
#CMD [ "flask", "run", "-h", "0.0.0.0", "-p", "5000"]
#
#EXPOSE 5000



FROM python:3.6

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY ./compose/production/flask/celery/worker/start.sh /start-celeryworker.sh
RUN chmod +x /start-celeryworker.sh
COPY ./compose/local/flask/start.sh /start-flask.sh
RUN chmod +x /start-flask.sh
COPY ./compose/production/flask/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]
