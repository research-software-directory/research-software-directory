import logging
import urllib.parse
import requests

from src.helpers.util import rate_limit

logger = logging.getLogger(__name__)


class LibrariesIOService:
    def __init__(self, api_key):
        self.api_key = api_key

    @rate_limit('libraries_io', 60, 60)
    def get_projects(self, githubid):
        url = 'https://libraries.io/api/github/%s/projects?api_key=%s' % (githubid, self.api_key)
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
    def get_dependencies(self, project):
        url = 'https://libraries.io/api/%s/%s/dependents?api_key=%s' % (project['platform'],
                                                                        urllib.parse.quote(project['name']),
                                                                        self.api_key)
        req = requests.get(url)
        if req.status_code == 200:
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
