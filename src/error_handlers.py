import traceback
from .json_response import jsonify
from .exceptions import RouteException

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
