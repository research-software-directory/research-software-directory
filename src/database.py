import logging
import json
import time
import difflib
from collections import OrderedDict

logger = logging.getLogger(__name__)

with open('data/index2.json') as data_file:
    database = json.load(data_file, object_pairs_hook=OrderedDict)


def sync_db():
    # print(database['software'])
    with open('data/index2.json', 'w') as file:
        file.write(json.dumps(database, indent=4))

with open('data/schema2.json') as data_file:
    current_schema = data_file.read()
    schema = json.loads(current_schema, object_pairs_hook=OrderedDict)


# def db_get_index_by_id(resourceType, id):


# def updateDB(value):
#     for resource_type in value:
#         for resource in value[resource_type]:
#             for (index, item) in enumerate(database[resource_type]):
#                 if item['id'] == resource['id']:
#                     print('match')
#                     database[resource_type][index] = resource








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

def append_to_schema_enum(resource_type, field_name, value):
    field = schema[resource_type]['properties'][field_name]
    if field['type'] == 'array':
        enum = field['items']['enum']
    elif field['type'] == 'string':
        enum = field['enum']
        enum.append(value)
        enum.sort()
        sync_schema()
    return enum


def get_resource_by_id(resource_type, id):
    for resource in database[resource_type]:
        if resource['id'] == id:
            return resource
    return None
