import requests
import re
import datetime
import time
import settings
from .github import get_repository
from tinydb import Query
import logging
import json
logger = logging.getLogger(__name__)

def update_data(software, table):
    repo = get_repository(software)
    if repo is None:
        logger.warning("No github repository")
        return
    time.sleep(1)
    r = requests.get('https://libraries.io/api/github/'+repo+'?api_key='+settings.LIBRARIES_IO_API_KEY)
    q = Query()
    table.update({"librariesIO" : json.loads(r.text)}, q.id == software['id'])
