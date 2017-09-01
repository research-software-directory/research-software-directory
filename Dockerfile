FROM alpine:3.6

ENV STATIC_FILES_URL http://rsd.esciencecenter.nl.s3-website.eu-central-1.amazonaws.com

#Github prod
ENV GITHUB_CLIENT_ID 99b6ac9f86e5b16eabf5
ENV GITHUB_CLIENT_SECRET 5929aadf17a34225b53643e95284437bd3c4ca2b

RUN (apk update)

RUN (apk add zlib zlib-dev jpeg jpeg-dev gcc libc-dev python3 python3-dev py3-pip uwsgi uwsgi-http uwsgi-python3 nginx)

WORKDIR /src
COPY requirements.txt /src/

RUN (pip3 install -r requirements.txt)

COPY . /src

CMD [ "sh", "run.sh" ]

EXPOSE 8000