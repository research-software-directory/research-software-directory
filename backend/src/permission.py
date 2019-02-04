import jwt
import os

from enum import Enum
from flask import request
from src.exceptions import UnauthorizedException


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


"""
JWT claims shape when authed with research-software-directory/auth-github:
{
  "sub": [github_username],
  "subType": "CLI-ISSUES" or "GITHUB", 
  "permissions": ["read", "write"],
  "iat": [current timestamp (in seconds)],
  "user": {
    "name": [github_username],
    "image": [github_users_avatar_image_url],
  }
}
"""
def get_sub():
    """
    Get sub (eg. github username) from JWT token in Authorization header
    :return: The `sub` claim in JWT.
    """
    jwt_token = request.headers['Authorization'].split(' ')[1]
    payload = jwt.decode(jwt_token, os.environ.get('JWT_SECRET'), algorithm='HS256')
    return payload.get('sub')


def require_permission(permissions):
    """
    Decorator for flask Route. Checks for Authorization header of current Flask request.
    Assures all `permissions` are present in the JWT claim 'permissions'.
    :param permissions: required permissions eg. ['read', 'write']
    :return: decorated function
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            if 'Authorization' not in request.headers:
                raise UnauthorizedException('No "Authorization" header in request')
            jwt_token = request.headers['Authorization'].split(' ')[1]
            try:
                payload = jwt.decode(jwt_token, os.environ.get('JWT_SECRET'), algorithm='HS256')
                for p in permissions:
                    assert p in payload.get('permissions')
            except jwt.exceptions.DecodeError as e:
                raise UnauthorizedException('Error in JWT token: ' + str(e))

            return func(*args, **kwargs)

        wrapper.__name__ = func.__name__
        return wrapper

    return decorator
