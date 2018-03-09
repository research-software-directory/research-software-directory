import logging
import os
import sys

from flask import Flask
from pymongo import MongoClient
from src import commands
from src import error_handlers
from src.schema import Schema
from src.routes import get_routes


class MaxLevel(object):
    def __init__(self, level):
        self.__level = level

    def filter(self, log_record):
        return log_record.levelno <= self.__level

log_formatter = logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s')
stdout_handler = logging.StreamHandler(stream=sys.stdout)
stdout_handler.addFilter(MaxLevel(logging.WARNING))
stdout_handler.setFormatter(log_formatter)

stderr_handler = logging.StreamHandler()
stderr_handler.setLevel(logging.ERROR)
stderr_handler.setFormatter(log_formatter)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(stdout_handler)
logger.addHandler(stderr_handler)

required_environmental_variables = [
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_NAME",
    "JWT_SECRET",
    "SCHEMA_URL"
]

for var in required_environmental_variables:
    if not os.environ.get(var):
        raise EnvironmentError("%s not set (add to environment)" % var)


def create_app(db=None, schema=None):
    app = Flask(__name__)
    if not db:
        db = MongoClient(host=os.environ.get('DATABASE_HOST'),
                         port=int(os.environ.get('DATABASE_PORT')),
                         connectTimeoutMS=100,
                         serverSelectionTimeoutMS=100
                         )[os.environ.get('DATABASE_NAME')]

    if not schema:
        schema = Schema(os.environ.get('SCHEMA_URL'))

    register_error_handlers(app)
    register_blueprints(app, db, schema)
    register_commands(app, db, schema)

    return app


def register_error_handlers(app):
    error_handlers.init(app)


def register_blueprints(app, db, schema):
    routes = get_routes(db, schema)
    app.register_blueprint(routes)


def register_commands(app, db, schema):
    commands.init(app, db, schema)
