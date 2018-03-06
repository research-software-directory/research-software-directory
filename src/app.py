import logging
import os
from flask import Flask
from pymongo import MongoClient
from src import commands
from src import error_handlers
from src.schema import Schema
from src.routes import get_routes


logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s'))
logger.info('Starting')

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
