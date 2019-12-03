from app.application import api_url, application
import requests_mock
import requests
import pytest
import glob
import datetime
import time

from tests.helpers import get_mock, isValidHTML


@pytest.fixture(autouse=True)
def get():
    def _get(url):
        client = application.test_client()
        response = client.get(url)
        return response.data.decode('utf-8'), response.status_code
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
        data, status_code = get('/software/xenon')
        assert status_code == 200
        assert isValidHTML(data)

live_software_items = []
if pytest.config.getoption("live"):
    result = requests.get(api_url + '/software?isPublished=True').json()
    for item in result:
        live_software_items.append(item['slug'])

@pytest.mark.skipif(not pytest.config.getoption("live"), reason="--live not specified")
@pytest.mark.parametrize("slug", live_software_items)
def test_live_software_data_renders(get, slug):
    print(datetime.datetime.now())
    data, status_code = get('/software/%s' % slug)
    time.sleep(1)
    assert status_code == 200
    assert isValidHTML(data)
