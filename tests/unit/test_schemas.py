import json
import pytest
import glob
import os
from src.schema import schema
from jsonschema import validate, ValidationError

pwd = os.path.dirname(__file__)

fixtures_folder = os.path.join(pwd, '..', '..', 'schema-fixtures')

def test_schemas_exist():
    assert schema is not None


def test_at_least_three_schemas_exist():
    assert len(schema) >= 3


parameters = [
    (schema_name, fixture_path) for
    schema_name in schema.keys() for
    fixture_path in glob.glob(os.path.join(fixtures_folder, '%s*.json' % schema_name))
]


@pytest.mark.parametrize("schema_name, fixture_path", parameters)
def test_fixtures_are_valid(schema_name, fixture_path):
    error = None
    try:
        validate(json.load(open(fixture_path)), schema[schema_name])
    except ValidationError as e:
        error = e.message + ": " + fixture_path + \
                ' @ ' + ' -> '.join(str(path_part) for path_part in list(e.relative_path))
    assert error is None
