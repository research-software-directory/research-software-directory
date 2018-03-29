import logging

import os
import requests

from Scraper import BlogPostScraper, ProjectScraper, PersonScraper

logger = logging.getLogger(__name__)


def get_projects():
    scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
                             include_deep_info=True)
    return scraper.projects


def get_people():
    scraper = PersonScraper(baseurl="https://www.esciencecenter.nl/people")
    return scraper.people


def sync_projects():
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
                'id': from_scraper['url']
            },
            'url': from_scraper['url'],
            'image': from_scraper['image'],
            'title': from_scraper['title'],
            'subtitle': from_scraper['subtitle'] or '',
            'principalInvestigator': pi
        }

    projects = get_projects()

    to_save = list(map(transform_project, projects))

    resp = requests.patch(
        os.environ.get('BACKEND_URL') + '/project',
        json=to_save,
        headers={'Authorization': 'Bearer %s' % os.environ.get('BACKEND_JWT')}
    )
    if resp.status_code != 200:
        raise Exception('error saving projects', str(resp.json()))


def sync_people():
    people = get_people()
    print(people)
