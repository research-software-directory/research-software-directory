FROM python:3.6-alpine

RUN apk --no-cache add g++ git

RUN mkdir /app

COPY requirements.txt /app/

WORKDIR /app

RUN pip install -r /app/requirements.txt

COPY . /app/

ENTRYPOINT ["python", "app.py"]

CMD ["--help"]
