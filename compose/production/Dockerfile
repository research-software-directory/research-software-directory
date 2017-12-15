FROM python:3

ENV STATIC_FILES_URL http://rsd.esciencecenter.nl.s3-website.eu-central-1.amazonaws.com

RUN (apt-get update)

RUN (apt-get -y install nginx)

RUN (pip3 install uwsgi)

WORKDIR /src
COPY requirements.txt /src/

RUN (pip3 install -r requirements.txt)

COPY . /src

CMD [ "sh", "compose/production/run.sh" ]

EXPOSE 8000