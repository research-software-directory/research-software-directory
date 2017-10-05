import os
import json

from jsonschema import validate, ValidationError

from src.services.database import db


schema = {}
for (_, _, files) in os.walk('schema'):
    for (filename, file) in [(file, open('schema/' + file)) for file in files]:
        schema[filename.split('.')[0]] = json.load(file)

def verify_data():
    for software in db.software.find():
        software.pop('_id', None) # remove mongodb identifier
        try:
            validate(software, schema['software'])
        except ValidationError as e:
            print('in %s: %s' % (software['id'], ' -> '.join(str(path_elm) for path_elm in e.path)))
            print(e.message)
            print('\n')

