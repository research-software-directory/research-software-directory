import json
import os
import re
from glob import glob
from jsonschema import validate, ValidationError
from jsonschema._utils import find_additional_properties


schema = {}
for path in glob(os.path.join(os.path.dirname(__file__), '..', 'schemas', '*.json')):
    file_name = path.split('/')[-1]
    schema_name = file_name.split('.')[0]
    with open(path) as file:
        schema[schema_name] = json.load(file)


def resolve(schema_name: str, schema_dict):
    """
    resolves $refs in schema[schema_name], and replaces it with the lookup
    :param schema_name: [str]: the name of the schema to process
    :param schema_dict: [dict]: the full schema dictionary
    :return: [dict]: updated schema of type `schema_name`
    """
    def replacer(regex_matches):
        parts = regex_matches.group(1).split('/')  # eg [definitions.json, key, person]
        foreign_schema_name = parts.pop(0).split('.')[0]
        foreign_schema = schema_dict[foreign_schema_name]
        crawl = foreign_schema
        for key in parts:  # parts contains the path in the schema eg [key, person]
            crawl = crawl[key]
        return json.dumps(crawl)

    raw_schema = json.dumps(schema_dict[schema_name])
    raw_schema = re.sub(r'{\s*"\$ref":\s?"([a-zA-Z0-9_-]*?\.json.*?)"\s*}', replacer, raw_schema)
    return json.loads(raw_schema)


for schema_name in schema:
    schema[schema_name] = resolve(schema_name, schema)

#
#
# def add_properties(base_schema, filename):
#     # add additional properties from properties folder
#     properties = json.load(open('schema/properties/' + filename))
#     for prop_name in properties:
#         base_schema['properties'][prop_name].update(properties[prop_name])
#
#
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
