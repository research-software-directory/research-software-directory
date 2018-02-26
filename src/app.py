import logging
import os
from flask import Flask
from pymongal.database_mongo import MongoDatabase
from src.routes import get_routes

import src.commands as commands
import src.error_handlers as error_handlers

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
    "ENVIRONMENT",
    "JWT_SECRET"
]

for var in required_environmental_variables:
    if not os.environ.get(var):
        raise EnvironmentError("%s not set (add to environment)" % var)


def create_app(database=None):
    app = Flask(__name__)
    if database:
        db = database
    else:
        db = MongoDatabase(os.environ.get('DATABASE_HOST'),
                           os.environ.get('DATABASE_PORT'),
                           os.environ.get('DATABASE_NAME')
                           )
    register_error_handlers(app)
    register_blueprints(app, db)
    register_commands(app, db)
    return app


def register_error_handlers(app):
    error_handlers.init(app)


def register_blueprints(app, db):
    routes = get_routes(db)
    app.register_blueprint(routes)


def register_commands(app, db):
    commands.init(app, db)


if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5001)
