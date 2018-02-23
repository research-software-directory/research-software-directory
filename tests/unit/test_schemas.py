import json
import pytest
import glob
import os

from jsonschema import validate, ValidationError

pwd = os.path.dirname(__file__)

schemas_folder = os.path.join(pwd, '..', '..', 'schemas')
fixtures_folder = os.path.join(pwd, '..', '..', 'schema-fixtures')

schemas = {}

for (path, file) in [(path, open(path)) for path in glob.glob('%s/*.json' % schemas_folder)]:
    file_name = path.split('/')[-1]
    schema_name = file_name.split('.')[0]
    schemas[schema_name] = json.load(file)

def test_schemas_exist():
    assert schemas is not None


def test_at_least_three_schemas_exist():
    assert len(schemas) > 3


parameters = [
    (schema_name, fixture_path) for
    schema_name in schemas.keys() for
    fixture_path in glob.glob('%s/%s*.json' % (fixtures_folder, schema_name))
]


@pytest.mark.parametrize("schema_name, fixture_path", parameters)
def test_fixtures_are_valid(schema_name, fixture_path):
    error = None
    try:
        validate(json.load(open(fixture_path)), schemas[schema_name])
    except ValidationError as e:
        error = e.message + ": " + fixture_path + \
                ' @ ' + ' -> '.join(str(path_part) for path_part in list(e.relative_path))
    assert error is None
