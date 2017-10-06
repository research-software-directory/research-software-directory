import json
import os

from jsonschema import validate, ValidationError

from src.database.database import db

schema = {}
for (_, _, files) in os.walk('schema'):
    for (filename, file) in [(file, open('schema/' + file)) for file in files]:
        schema[filename.split('.')[0]] = json.load(file)

def verify_data(fix=True):
    for software in db.software.find():
        sw = db.software.find_one({'_id': software['_id']})
        sw.pop('_id', None)  # remove mongodb identifier
        try:
            validate(sw, schema['software'])
        except ValidationError as e:
            if fix and str(e.message) == "None is not of type 'array'":
                print('fixing None to []')
                db.sw.update({'_id': software['_id']}, {'$set': {e.path[0]: []}})


            print('in %s: %s' % (sw['id'], ' -> '.join(str(path_elm) for path_elm in e.path)))
            print(e.message)
            print('\n')
