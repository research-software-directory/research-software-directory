import json
import os

from jsonschema import validate, ValidationError


class SchemaService:
    def __init__(self, db):
        self.db = db
        self.schema = {}
        for (_, _, files) in os.walk('schema'):
            for (filename, file) in [(file, open('schema/' + file)) for file in files]:
                self.schema[filename.split('.')[0]] = json.load(file)

    def verify_data(self, fix=True):
        for software in self.db.software.all():
            try:
                validate(software.data, self.schema['software'])
            except ValidationError as e:
                if fix and str(e.message) == "None is not of type 'array'":
                    print('fixing None to []')
                    software[e.path[0]] = []
                    software.save()

                print('in %s: %s' % (software['id'], ' -> '.join(str(path_elm) for path_elm in e.path)))
                print(e.message)
                print('\n')
