from app import app
from database import database, schema
import commands
import routes
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.info('Starting')

commands.init(app, database)
routes.init(app, database, schema)
app.run()
