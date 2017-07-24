import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.info('Starting')
from app import app
from database import database
from schema import schema

import commands
import routes

commands.init(app, database)
routes.init(app, database, schema)
