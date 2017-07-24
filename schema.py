import logging
logger = logging.getLogger(__name__)
import json
schema = {}

with open('schema.json') as data_file:
    schema = json.load(data_file)

def sync(db):
    with open('schema2.json', 'w') as file:
        file.write(json.dumps(db))
