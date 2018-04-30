"""Flask JSON response module"""

import flask
import json


def dumps(data):
    if isinstance(data, list):
        for row in data:
            if isinstance(row, dict) and '_id' in row.keys():
                del row['_id']

    elif isinstance(data, dict):
        if '_id' in data.keys():
            del data['_id']

    return json.dumps(data)


def json_response(json_string, status=200):
    """
    create Flask Response with JSON.

    :param json_string: `str` | JSON serializable object
    :param status: `int` : HTTP status code
    :returns: Flask `Response` object with application/json mimetype.
    :raises TypeError: when `json_string` not str or JSON serializable
    """
    data = json_string if isinstance(json_string, str) else dumps(json_string)
    return flask.Response(
        response=data,
        status=status,
        mimetype="application/json"
    )


class jsonify(object):
    """
    Decorator for flask route so it can return `data, status_code`
    """
    def __init__(self, f):
        self.f = f
        self.__name__ = f.__name__

    def __call__(self, *args, **kwargs):
        data, *status_code = self.f(*args, **kwargs)
        return json_response(data, status_code[0]) if status_code else json_response(data)


