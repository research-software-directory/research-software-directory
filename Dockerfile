FROM python:3

WORKDIR /src

COPY requirements.txt /src/
RUN pip3 install -r requirements.txt

COPY . /src
RUN bash build-assets.sh

RUN mkdir /var/log/flask-uwsgi
RUN touch /var/log/flask-uwsgi/flask-uwsgi.log
RUN chmod 666 /var/log/flask-uwsgi/flask-uwsgi.log

CMD [ "uwsgi", "--http-socket", "0.0.0.0:8000", "--processes", "5", "--master", "--wsgi-file", "entry.py" ]
EXPOSE 8000

