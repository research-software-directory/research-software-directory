FROM python:3

WORKDIR /app

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

CMD [ "python3", "entry.py" ]

EXPOSE 5000