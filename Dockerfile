FROM alpine:3.6

COPY . /src

WORKDIR /src

RUN (apk update)

RUN (apk add zlib zlib-dev jpeg jpeg-dev gcc libc-dev python3 python3-dev py3-pip uwsgi uwsgi-http uwsgi-python3 nginx)

RUN (pip3 install -r requirements.txt)

CMD [                     \
  "uwsgi",                \
  "--plugins",            \
  "http,python3",         \
  "--http",               \
  "0.0.0.0:8080",         \
  "--wsgi-file entry.py", \
  "--callable app",       \
  "--master"              \
]

