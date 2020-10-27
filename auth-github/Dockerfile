FROM python:3.8-alpine

COPY requirements.txt /requirements.txt

RUN python3 -m pip install --upgrade pip && \
    pip install -r /requirements.txt

COPY . /app

WORKDIR /app

STOPSIGNAL SIGINT

CMD gunicorn --preload --workers 3 --max-requests 10 --timeout 15 --bind 0.0.0.0:5002 --access-logfile - --error-logfile - app:application
EXPOSE 5002
