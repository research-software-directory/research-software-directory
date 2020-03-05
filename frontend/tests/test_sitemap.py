from app.application import application
import requests_mock
import pytest

from tests.helpers import get_mock, is_live


@pytest.fixture(autouse=True)
def get():
    def _get(url):
        client = application.test_client()
        response = client.get(url)
        return response.data.decode('utf-8')
    return _get


def test_sitemap(get):
    with requests_mock.mock() as m:
        m.get('https://www.research-software.nl/api/software?isPublished=true', text=get_mock('software_cache.json'))
        result = get('/sitemap.xml')

    assert len(result.split('lastmod')) > 10


@pytest.mark.skipif(not is_live, reason="--live not specified")
def test_sitemap_live(get):
    result = get('/sitemap.xml')
    assert len(result.split('lastmod')) > 10