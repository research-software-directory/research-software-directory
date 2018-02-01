FROM python:3

WORKDIR /src

COPY requirements.txt /src/
RUN pip3 install -r requirements.txt

COPY . /src
RUN bash build-assets.sh

STOPSIGNAL SIGINT

CMD gunicorn --workers 3 --max-requests 10 --bind 0.0.0.0:8000 --access-logfile /log/reqlog --error-logfile /log/errlog entry:application

EXPOSE 8000
