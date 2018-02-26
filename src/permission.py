from enum import Enum
from flask import request
import jwt
from src.exceptions import UnauthorizedException
from src.settings import settings


class Permission(Enum):
    READ = 'read'
    WRITE = 'write'

    @staticmethod
    def has_value(val):
        try:
            Permission(val)
        except ValueError:
            return False
        return True


def require_permission(organization):
    def decorator(func):
        def wrapper(*args, **kwargs):
            if 'Authorization' not in request.headers:
                raise UnauthorizedException('No "Authorization" header in request')
            jwt_token = request.headers['Authorization'].split(' ')[1]
            try:
                payload = jwt.decode(jwt_token, settings['JWT_SECRET'], algorithm='HS256')
            except jwt.exceptions.DecodeError as e:
                raise UnauthorizedException('Error in JWT token: ' + str(e))

            return func(*args, **kwargs)

        wrapper.__name__ = func.__name__
        return wrapper

    return decorator
