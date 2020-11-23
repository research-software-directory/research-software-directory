import time

from src import util


def test_rate_limit():
    @util.rate_limit('test', 10, 1)
    def test_dummy():
        pass

    start_time = time.time()
    for i in range(0, 25):
        test_dummy()

    assert 2 < (time.time() - start_time) < 2.5

def test_field2unset():
    schema = {
        'properties': {
            '_id': None,
            'opt': None
        },
        'required': ['_id']
    }
    resource = {
        '_id': 'foo'
    }
    fields = util.field2unset(schema, resource)

    assert fields == {'opt': ''}

def test_resource2update_one2unset():
    schema = {
        'properties': {
            '_id': None,
            'opt': None
        },
        'required': ['_id']
    }
    resource = {
        '_id': 'foo'
    }
    fields = util.resource2update(schema, resource)

    expected = {
        '$set': {'_id': 'foo'},
        '$unset': {'opt': ''}
    }
    assert fields == expected

def test_resource2update_nothing2unset():
    schema = {
        'properties': {
            '_id': None,
        },
        'required': ['_id']
    }
    resource = {
        '_id': 'foo'
    }
    fields = util.resource2update(schema, resource)

    expected = {
        '$set': {'_id': 'foo'}
    }
    assert fields == expected

def test_resource2update_keepopt():
    schema = {
        'properties': {
            '_id': None,
            'opt1': None,
            'opt2': None
        },
        'required': ['_id']
    }
    resource = {
        '_id': 'foo',
        'opt2': 'bar'
    }
    fields = util.resource2update(schema, resource)

    expected = {
        '$set': {'_id': 'foo', 'opt2': 'bar'},
        '$unset': {'opt1': ''}
    }
    assert fields == expected