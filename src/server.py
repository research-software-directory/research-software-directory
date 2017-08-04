import logging

from . import commands
from . import routes
from .app import app

from src.database import database, schema

logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.info('Starting')

commands.init(app, database)
routes.init(app, database, schema)


def before_req():
    print("before req")


def run():
    app.before_request(before_req)
    app.run()


if __name__ == "__main__":
    run()