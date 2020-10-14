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


def test_index(get, is_live):
    if not is_live:
        with requests_mock.mock() as m:
            m.get(api_url + '/software_cache?isPublished=true', text=get_mock('software_cache.json'))
            m.get(api_url + '/organization', text=get_mock('organization.json'))
            result = get('/')
    else:
        result = get('/')

    assert isValidHTML(result)
