import pprint
import re

from py_w3c.validators.html.validator import HTMLValidator


def get_mock(name):
    with open("mocks/%s" % name) as f:
        return f.read()


def is_really_error(error):
    w3c_regex_whitelist = [
        r'An “img” element must have an “alt” attribute, except under certain conditions.*',
        r'Attribute “.*?” not allowed.*',
        r'Element “li” not allowed as child of element “.*?” in this context.*',
        r'Element “a” is missing required attribute “href”.'
    ]

    for regex in w3c_regex_whitelist:
        if re.match(regex, error['message']):
            return False
    return True


def isValidHTML(result):
    html_validator = HTMLValidator()
    html_validator.validate_fragment(result)
    errors = list(filter(is_really_error, html_validator.errors))
    if len(errors) != 0:
        pprint.pprint(errors)
    return len(errors) == 0
