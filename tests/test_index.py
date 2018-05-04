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


def test_index(get):
    if not pytest.config.getoption("live"):
        with requests_mock.mock() as m:
            m.get(api_url + '/software_cache?isPublished=true', text=get_mock('software.json'))
            m.get(api_url + '/mention?sort=date&direction=desc&limit=5', text=get_mock('latest_mentions.json'))
            m.get(api_url + '/organization', text=get_mock('organizations.json'))
            result = get('/')
    else:
        result = get('/')

    assert isValidHTML(result)
