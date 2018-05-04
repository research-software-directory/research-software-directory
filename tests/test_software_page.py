from app.application import api_url, application
import requests_mock
import requests
import pytest
import glob

from tests.helpers import get_mock, isValidHTML


@pytest.fixture(autouse=True)
def get():
    def _get(url):
        client = application.test_client()
        response = client.get(url)
        return response.data.decode('utf-8')
    return _get


software_items = []

for path in glob.glob('mocks/software/*.json'):
    file_name = path.split('/')[-1]
    software_slug = file_name.split('.')[0]
    software_items.append(software_slug)


@pytest.mark.parametrize("slug", software_items)
def test_fixtures_render(get, slug):
    with requests_mock.mock() as m:
        m.get(api_url + '/software_cache/%s' % slug, text=get_mock('software/%s.json' % slug))
        result = get('/software/xenon')
        assert isValidHTML(result)

live_software_items = []
if pytest.config.getoption("live"):
    result = requests.get(api_url + '/software?isPublished=True').json()
    for item in result:
        live_software_items.append(item['slug'])

@pytest.mark.skipif(not pytest.config.getoption("live"), reason="--live not specified")
@pytest.mark.parametrize("slug", live_software_items)
def test_live_software_data_renders(get, slug):
    result = get('/software/xenon')
    assert isValidHTML(result)






# def test_live():
#     print(software_items)
#
#     assert False

# import json
# import pytest
# import glob
# import os
#
# from jsonschema import validate, ValidationError
#
# pwd = os.path.dirname(__file__)
#
# schemas_folder = os.path.join(pwd, '..', '..', 'schemas')
# fixtures_folder = os.path.join(pwd, '..', '..', 'schema-fixtures')
#
# schemas = {}
#
# for (path, file) in [(path, open(path)) for path in glob.glob('%s/*.json' % schemas_folder)]:
#     file_name = path.split('/')[-1]
#     schema_name = file_name.split('.')[0]
#     schemas[schema_name] = json.load(file)
#
# def test_schemas_exist():
#     assert schemas is not None
#
#
# def test_at_least_three_schemas_exist():
#     assert len(schemas) > 3
#
#
# parameters = [
#     (schema_name, fixture_path) for
#     schema_name in schemas.keys() for
#     fixture_path in glob.glob('%s/%s*.json' % (fixtures_folder, schema_name))
# ]
#
#
# @pytest.mark.parametrize("schema_name, fixture_path", parameters)
# def test_fixtures_are_valid(schema_name, fixture_path):
#     error = None
#     try:
#         validate(json.load(open(fixture_path)), schemas[schema_name])
#     except ValidationError as e:
#         error = e.message + ": " + fixture_path + \
#                 ' @ ' + ' -> '.join(str(path_part) for path_part in list(e.relative_path))
#     assert error is None
