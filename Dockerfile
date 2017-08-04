FROM python:3.6.2-alpine3.6

WORKDIR /src

ADD ./requirements.txt ./requirements.txt
ADD ./data ./data
ADD ./src ./src
ADD ./__main__.py ./__main__.py

RUN (pip install -r requirements.txt)

CMD [ "python", "." ]

ENTRYPOINT ["/bin/sh"]
