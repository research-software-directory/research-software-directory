from app.application import api_url, application
import requests_mock
import requests
import pytest
import glob
from tests.helpers import get_mock, isValidHTML
from urllib.error import HTTPError


@pytest.fixture(autouse=True)
def get():
    def _get(url):
        client = application.test_client()
        response = client.get(url, follow_redirects=True)
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
        data, status_code = get('/software/' + slug)
        assert status_code == 200
        assert isValidHTML(data)

@pytest.mark.live
def test_live_software_data_renders(get):
    live_software_items = []
    result = requests.get(api_url + '/software?isPublished=True').json()
    slug = result[0]
    data, status_code = get('/software/%s' % slug)
    assert status_code == 200
    assert isValidHTML(data)
