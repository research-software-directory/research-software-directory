import logging
logger = logging.getLogger(__name__)
import json
database = {}

with open('index2.json') as data_file:
    database = json.load(data_file)

def sync(db):
    with open('index2.json', 'w') as file:
        file.write(json.dumps(db))
