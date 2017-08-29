FROM python:3.6.2-alpine3.6

COPY . /src

WORKDIR /src

RUN (apk update)

RUN (apk add zlib zlib-dev jpeg jpeg-dev gcc libc-dev)

RUN (pip install -r requirements.txt)

CMD [ "python", "." ]
