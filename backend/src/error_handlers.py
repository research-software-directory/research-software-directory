import logging
import traceback

from jsonschema import ValidationError
from pymongo.errors import ServerSelectionTimeoutError
from src.exceptions import RouteException
from src.json_response import jsonify

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
        logger.warning('general exception: ' + str_format_exception(exception))
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

    @app.errorhandler(ServerSelectionTimeoutError)
    @jsonify
    def _mongo_connect_error(exception):
        data = {
            "error": "Couldn't connect to Mongo database: " + str(exception),
            "class": "ServerSelectionTimeoutError",
        }
        logger.error('Could not connect to Mongo')
        return data, 500