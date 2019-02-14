from src.json_response import jsonify
import json


def test_jsonify():
    @jsonify
    def _test():
        return {'test': 456}, 123

    req = _test()
    assert str(type(req)) == "<class 'flask.wrappers.Response'>"
    assert req.status_code == 123

    result = json.loads(req.data.decode('utf-8'))

    assert result['test'] == 456