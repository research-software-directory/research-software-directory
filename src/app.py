import logging
from flask import Flask
from src.routes import api as api_routes
from src.extensions import resize
import src.commands as commands
import src.error_handlers as error_handlers

logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s'))
logger.info('Starting')


def create_app():
    app = Flask(__name__)
    register_extensions(app)
    register_error_handlers(app)
    register_blueprints(app)
    register_commands(app)
    return app


def register_error_handlers(app):
    error_handlers.init(app)


def register_blueprints(app):
    app.register_blueprint(api_routes)


def register_extensions(app):
    app.config['RESIZE_URL'] = 'data'
    app.config['RESIZE_ROOT'] = 'data'
    resize.init_app(app)


def register_commands(app):
    commands.init(app)


if __name__ == "__main__":
    app = create_app()
    app.run()
