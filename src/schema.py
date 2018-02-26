import json
import os

from jsonschema import validate, ValidationError
from jsonschema._utils import find_additional_properties

schema = {}
for (_, _, files) in os.walk('schema'):
    for (filename, file) in [(filename, open('schema/' + filename)) for filename in files]:
        base_schema = json.load(file)
        # add_properties(base_schema, filename)
        schema[filename.split('.')[0]] = base_schema



def add_properties(base_schema, filename):
    # add additional properties from properties folder
    properties = json.load(open('schema/properties/' + filename))
    for prop_name in properties:
        base_schema['properties'][prop_name].update(properties[prop_name])


def verify_data(fix=False):
    valid = True
    for resource_type in ['software', 'project', 'person', 'organization']:
        for resource in self.db[resource_type].all():
            try:
                validate(resource.data, self.schema[resource_type])
            except ValidationError as e:
                valid = False
                if fix and str(e.message) == "None is not of type 'array'":
                    print('fixing None to []')
                    resource[e.path[0]] = []
                    resource.save()
                elif fix and str(e.message) == "None is not of type 'string'":
                    print('fixing None to ""')
                    resource[e.path[0]] = ''
                    resource.save()
                elif fix and str(e.message).find("Additional properties are not allowed") != -1:
                    props = find_additional_properties(resource.data, self.schema[resource_type])
                    print('removing additional props')
                    for prop in list(props):
                        del resource.data[prop]
                    resource.save()

                print('in %s/%s: %s' % (resource_type, resource['id'], ' -> '.join(str(path_elm) for path_elm in e.path)))
                print(e.message)
                print('\n')

    return valid
