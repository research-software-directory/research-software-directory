import json
import os

from jsonschema import validate, ValidationError


def add_properties(base_schema, filename):
    # add additional properties from properties folder
    properties = json.load(open('schema/properties/' + filename))
    for prop_name in properties:
        base_schema['properties'][prop_name].update(properties[prop_name])

class SchemaService:
    def __init__(self, db):
        self.db = db
        self.schema = {}
        for (_, _, files) in os.walk('schema'):
            for (filename, file) in [(filename, open('schema/' + filename)) for filename in files]:
                base_schema = json.load(file)
                add_properties(base_schema, filename)
                self.schema[filename.split('.')[0]] = base_schema

    def verify_data(self, fix=True):
        valid = True
        for software in self.db.software.all():
            try:
                validate(software.data, self.schema['software'])
            except ValidationError as e:
                valid = False
                if fix and str(e.message) == "None is not of type 'array'":
                    print('fixing None to []')
                    software[e.path[0]] = []
                    software.save()

                print('in %s: %s' % (software['id'], ' -> '.join(str(path_elm) for path_elm in e.path)))
                print(e.message)
                print('\n')
        return valid
