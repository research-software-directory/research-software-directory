from src.error_handlers import init

import flask
import json

def test_error_404():
    app = flask.Flask('__test')
    init(app)

    test_client = app.test_client()
    req = test_client.get('/')
    result = json.loads(req.data.decode('utf-8'))

    assert 'traceback' in result
    assert 'error' in result
    assert result['class'] == 'PageNotFoundException'

def test_error_500():
    app = flask.Flask('__test')
    init(app)

    msg = 'testing exception'

    @app.route('/')
    def _test():
        raise Exception(msg)

    test_client = app.test_client()
    req = test_client.get('/')

    assert req.status_code == 500

    result = json.loads(req.data.decode('utf-8'))
    assert 'error' in result
    assert result['error'] == msg
    assert result['class'] == 'Exception'
