FROM alpine:3.6

ENV STATIC_FILES_URL http://rsd.esciencecenter.nl.s3-website.eu-central-1.amazonaws.com

RUN (apk update)

RUN (apk add zlib zlib-dev jpeg jpeg-dev gcc libc-dev python3 python3-dev py3-pip uwsgi uwsgi-http uwsgi-python3 nginx)

WORKDIR /src
COPY requirements.txt /src/

RUN (pip3 install -r requirements.txt)

COPY . /src

CMD [ "sh", "run.sh" ]

EXPOSE 8000