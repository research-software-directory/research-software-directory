import logging
import json
import time
import difflib
from collections import OrderedDict

logger = logging.getLogger(__name__)

with open('data/index2.json') as data_file:
    database = json.load(data_file, object_pairs_hook=OrderedDict)


def sync_db():
    with open('data/index2.json', 'w') as file:
        file.write(json.dumps(database, indent=4))

with open('data/schema2.json') as data_file:
    current_schema = data_file.read()
    schema = json.loads(current_schema, object_pairs_hook=OrderedDict)


def sync_schema():
    global current_schema
    new_schema = json.dumps(schema, indent=4)
    with open('data/schema2.json', 'w') as file:
        file.write(new_schema)
    with open('data/schema2.json.diff', 'a') as file:
        file.write(time.strftime("%c")+'\n')
        diff = difflib.unified_diff(current_schema.split('\n'), new_schema.split('\n'), lineterm="")
        for line in diff:
            file.write(line+'\n')
    current_schema = new_schema
