import logging
from src.settings import settings
from pymongo import MongoClient
logger = logging.getLogger(__name__)

client = MongoClient('mongodb://%s:%s/' % (settings['DATABASE_HOST'], settings['DATABASE_PORT']))
db = client[settings['DATABASE_NAME']]

# create indexes
db.impact_report.create_index([('software_id', 1)])
db.commit.create_index([('software_id', 1)])
