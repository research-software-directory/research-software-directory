FROM python:3.6-alpine

RUN (apk update && apk add g++ make)

COPY . /app

WORKDIR /app

RUN pip install -r /app/requirements.txt

ENTRYPOINT ["python", "app.py"]

CMD ["--help"]