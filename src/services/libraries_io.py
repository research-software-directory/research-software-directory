import logging

import urllib.parse

import requests
from src.services.util import rate_limit
from src.settings import settings

logger = logging.getLogger(__name__)


@rate_limit('libraries_io', 60, 60)
def get_projects(githubid):
    url = 'https://libraries.io/api/github/%s/projects?api_key=%s' % (githubid, settings['LIBRARIES_IO_API_KEY'])
    req = requests.get(url)
    if req.status_code == 429:
        logger.error('Libraries IO over API rate limit')
    elif req.status_code == 200:
        info = req.json()
        projects = [{
            'platform': project['platform'],
            'name':     project['name'],
            'rank':     project['rank'],
            'stars':    project['stars'],
            'forks':    project['forks']
        } for project in info]
        return projects
    else:
        logger.error('Libraries IO return unexpected status code %i', req.status_code)
    return []


@rate_limit('libraries_io', 60, 60)
def get_dependencies(project):
    url = 'https://libraries.io/api/%s/%s/dependents?api_key=%s' % (project['platform'], urllib.parse.quote(project['name']), settings['LIBRARIES_IO_API_KEY'])
    req = requests.get(url)
    if (req.status_code == 200):
        info = req.json()
        projects = [{
            'platform': project['platform'],
            'name':     project['name'],
            'rank':     project['rank'],
            'stars':    project['stars'],
            'forks':    project['forks']
        } for project in info]
        return projects
    else:
        logger.error('Libraries IO return unexpected status code %i', req.status_code)
    return []
