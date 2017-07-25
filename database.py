import logging
import json
from collections import OrderedDict
logger = logging.getLogger(__name__)

with open('index2.json') as data_file:
    database = json.load(data_file, object_pairs_hook=OrderedDict)


def sync_db():
    with open('index2.json', 'w') as file:
        file.write(json.dumps(database, indent=4))

with open('schema2.json') as data_file:
    schema = json.load(data_file, object_pairs_hook=OrderedDict)


def sync_schema():
    with open('schema2.json', 'w') as file:
        file.write(json.dumps(schema, indent=4))
