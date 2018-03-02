class RouteException(Exception):
    """Raise when there is a general problem in a route"""
    def __init__(self, message, status_code=500, data=None, *args):
        self.message = message
        self.status_code = status_code
        self.data = data

        super().__init__(message, status_code, data, *args)


class BadRequestException(RouteException):
    def __init__(self, message, status_code=400, data=None, *args):
        super().__init__(message, status_code, data, *args)

class DuplicatePrimaryKeyException(RouteException):
    def __init__(self, id, status_code=409, data=None, *args):
        super().__init__('primaryKey already exists: \'%s\'' % id, status_code, data, *args)

class UnauthorizedException(RouteException):
    def __init__(self, message, status_code=401, data=None, *args):
        super().__init__(message, status_code, data, *args)

class NotFoundException(RouteException):
    def __init__(self, message, status_code=404, data=None, *args):
        super().__init__(message, status_code, data, *args)
