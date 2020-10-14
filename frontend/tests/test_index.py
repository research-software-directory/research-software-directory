from app.application import api_url, application
import requests_mock
import pytest

from tests.helpers import get_mock, isValidHTML


@pytest.fixture(autouse=True)
def get():
    def _get(url):
        client = application.test_client()
        response = client.get(url)
        return response.data.decode('utf-8')
    return _get


@pytest.mark.live
def test_index_live(get):
    result = get('/')

    assert isValidHTML(result)

def test_index(get):
    with requests_mock.mock() as m:
        m.get(api_url + '/software_cache?isPublished=true', text=get_mock('software_cache.json'))
        m.get(api_url + '/organization', text=get_mock('organization.json'))
        result = get('/')

    assert isValidHTML(result)
