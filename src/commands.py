import logging
import jwt
import click
import time
from src.settings import settings
from src.schema import verify_data
from src.permission import Permission
logger = logging.getLogger(__name__)


def init(app, db):
    @app.cli.command('verify_data')
    def _verify_data():
        verify_data()

    @app.cli.command('generate_jwt')
    @click.option('--sub', required=True, help='Identity (name of user, software etc).')
    @click.option('--permissions', '-p', required=True, multiple=True)
    def _generate_jwt(permissions, sub):
        for p in permissions:
            if not Permission.has_value(p):
                raise ValueError('\'' + p + '\' is not a valid permission')
        payload = {
            'sub': sub,
            'subType': 'CLI_ISSUED',
            'permissions': list(permissions),
            'iat': round(time.time())
        }
        issued_jwt = jwt.encode(payload, settings['JWT_SECRET'], algorithm='HS256')

        print(payload)
        print(issued_jwt.decode('ascii'))
