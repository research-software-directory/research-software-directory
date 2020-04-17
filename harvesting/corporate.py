import logging

import os
import requests

from Scraper import ProjectScraper
from util import generate_jwt_token

logger = logging.getLogger(__name__)


def get_projects():
    scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects")

    token = generate_jwt_token()
    resp = requests.put(
        os.environ.get('BACKEND_URL') + '/project',
        json=scraper.projects,
        headers={'Authorization': 'Bearer %s' % token}
    )
    if resp.status_code != 200:
        raise Exception('error saving projects', str(resp.json()))

