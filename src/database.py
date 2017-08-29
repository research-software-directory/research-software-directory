import logging
import src.settings as settings
from pymongo import MongoClient
logger = logging.getLogger(__name__)

client = MongoClient(settings.DATABASE_URL)
db = client[settings.DATABASE_NAME]

# create indexes
db.impact_report.create_index([('software_id', 1)])
db.commit.create_index([('software_id', 1)])
