import json
import traceback
from flask import Response

def json_response(json_string, status=200):
    """
    create Flask Response for JSON response.

    :param json_string `str` | JSON serializable object
    :param status: `int` : HTTP status code
    :returns: Flask `Response` object with application/json mimetype.
    :raises TypeError when `json_string` not str or JSON serializable
    """
    data = json_string if isinstance(json_string, str) else json.dumps(json_string)
    return Response(response=data,
                    status=status,
                    mimetype="application/json")

def init(app):
    @app.errorhandler(404)
    def _page_not_found():
        return json_response({"error" : "Resource not found"}, 404)

    @app.errorhandler(Exception)
    def _handle_exception(error):
        data = {
            "error" : str(error),
            "class" : error.__class__.__name__,
            "traceback" : traceback.format_tb(error.__traceback__)
        }
        return json_response(data, 500)
