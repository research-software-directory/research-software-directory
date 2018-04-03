import json
import os
import re
from glob import glob


def resolve(schema_name, schema_dict):
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


def get_schemas():
    schema = {}
    for path in glob(os.path.join(os.environ.get('SCHEMAS_PATH'), '*.json')):
        file_name = path.split('/')[-1]
        schema_name = file_name.split('.')[0]
        with open(path) as file:
            schema[schema_name] = json.load(file)

    if os.environ.get('SCHEMA_RESOLVE_REFS', "1") == "1":
        for schema_name in schema:
            schema[schema_name] = resolve(schema_name, schema)

    return schema
