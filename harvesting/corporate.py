import logging

import os
import requests

from Scraper import ProjectScraper
from util import generate_jwt_token

logger = logging.getLogger(__name__)


def get_projects():
    def transform_project(from_scraper): #  to Project according to Schema

        principal_investigators = [person for person in from_scraper['team'] if person['role'] == 'Principal Investigator']

        pi = {
            'name': '',
            'affiliation': ''
        }
        if len(principal_investigators) > 0:
            pi = {
                'name': principal_investigators[0]['name'],
                'affiliation': principal_investigators[0]['affiliation']
            }

        return {
            'primaryKey': {
                'collection': 'project',
                'id': from_scraper['url'].replace('https://www.esciencecenter.nl/project/', '')
            },
            'url': from_scraper['url'],
            'image': from_scraper['image'],
            'title': from_scraper['title'],
            'subtitle': from_scraper['subtitle'] or '',
            'principalInvestigator': pi
        }

    scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
                             include_deep_info=True)

    to_save = list(map(transform_project, scraper.projects))

    token = generate_jwt_token()
    resp = requests.put(
        os.environ.get('BACKEND_URL') + '/project',
        json=to_save,
        headers={'Authorization': 'Bearer %s' % token}
    )
    if resp.status_code != 200:
        raise Exception('error saving projects', str(resp.json()))

