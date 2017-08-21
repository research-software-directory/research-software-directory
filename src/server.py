import logging

import src.commands as commands
import src.routes as routes
import src.error_handlers as error_handlers

from src.app import app
from src.database import database, schema

logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.info('Starting')

commands.init(app, database)
error_handlers.init(app)
routes.init(app, database, schema)

if __name__ == "__main__":
    app.run()