FROM python:3

RUN (apt-get update)

RUN (apt-get -y install nginx)

RUN (pip3 install uwsgi)

WORKDIR /src
COPY requirements.txt /src/

RUN (pip3 install -r requirements.txt)

COPY . /src

CMD [ "sh", "run.sh" ]

EXPOSE 8000