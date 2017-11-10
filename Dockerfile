FROM python:3

ENV STATIC_FILES_URL http://rsd.esciencecenter.nl.s3-website.eu-central-1.amazonaws.com

RUN (apt-get update)

RUN (apt-get -y install nginx)

RUN (pip3 install uwsgi)

#RUN (apt install add zlib zlib-dev jpeg jpeg-dev gcc libc-dev uwsgi uwsgi-http uwsgi-python3 nginx)

WORKDIR /src
COPY requirements.txt /src/

RUN (pip3 install -r requirements.txt)

COPY . /src

CMD [ "sh", "run.sh" ]

EXPOSE 8000