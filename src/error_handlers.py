import traceback

from jsonschema import ValidationError

from src.json_response import jsonify
from src.exceptions import RouteException
import logging

logger = logging.getLogger(__name__)

def str_format_exception(exception):
    result = '(' + exception.__class__.__name__ + ') '
    result += str(exception)
    return result


def init(app):
    @app.errorhandler(RouteException)
    @jsonify
    def handle_route_exception(exception):
        data = {
            "error": exception.message,
            "class": exception.__class__.__name__,
            "traceback": traceback.format_tb(exception.__traceback__),
            "data": exception.data
        }
        return data, exception.status_code

    @app.errorhandler(Exception)
    @jsonify
    def handle_exception(exception):
        data = {
            "error": str(exception),
            "class": exception.__class__.__name__,
            "traceback": traceback.format_tb(exception.__traceback__),
        }
        logger.warning(str_format_exception(exception))
        return data, 500

    @app.errorhandler(404)
    @jsonify
    def _page_not_found(exception):
        data = {
            "error": "Resource not found",
            "class": "PageNotFoundException",
            "traceback": traceback.format_tb(exception.__traceback__),
        }
        return data, 404

    @app.errorhandler(ValidationError)
    @jsonify
    def _validation_error(exception):
        data = {
            "error": exception.message,
            "class": "ValidationError",
            "path": list(exception.absolute_path)
        }
        return data, 400
