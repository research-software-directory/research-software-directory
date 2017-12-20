FROM python:3

WORKDIR /app

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

CMD [ "flask", "run", "-h", "0.0.0.0", "-p", "5000"]

EXPOSE 5000