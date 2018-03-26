from app.application import api_url, application
import requests_mock
import pytest
import pprint
import re
from py_w3c.validators.html.validator import HTMLValidator

@pytest.fixture(autouse=True)
def get():
    def _get(url):
        client = application.test_client()
        response = client.get(url)
        return response.data.decode('utf-8')
    return _get


def get_mock(name):
    with open("mocks/%s" % name) as f:
        return f.read()

def is_really_error(error):
    w3c_regex_whitelist = [
        r'An “img” element must have an “alt” attribute, except under certain conditions.*',
        r'Attribute “.*?” not allowed.*',
        r'Element “li” not allowed as child of element “.*?” in this context.*',
    ]

    for regex in w3c_regex_whitelist:
        if re.match(regex, error['message']):
            return False
    return True


def test_index(get):
    with requests_mock.mock() as m:
        m.get(api_url + '/software_cache?isPublished=true', text=get_mock('software.json'))
        m.get(api_url + '/latest_mentions', text=get_mock('latest_mentions.json'))
        m.get(api_url + '/organization', text=get_mock('organizations.json'))
        m.get(api_url + '/corporate_blogs', text=get_mock('blogs.json'))
        result = get('/')

        html_validator = HTMLValidator()
        html_validator.validate_fragment(result)
        errors = list(filter(is_really_error, html_validator.errors))
        if len(errors) != 0:
            pprint.pprint(errors)

        assert len(errors) == 0

def test_xenon(get):
    with requests_mock.mock() as m:
        m.get(api_url + '/software_cache/xenon', text=get_mock('software/xenon.json'))
        result = get('/software/xenon')
        html_validator = HTMLValidator()
        html_validator.validate_fragment(result)
        errors = list(filter(is_really_error, html_validator.errors))
        if len(errors) != 0:
            pprint.pprint(errors)

        assert len(errors) == 0
