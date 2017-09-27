import logging

import requests
from src.settings import settings
from src.database import db
from pyzenodo import zenodo
from dateutil import parser

logger = logging.getLogger(__name__)


def version_info(repo):
    zen = zenodo.Zenodo()
    record = zen.find_by_github_repo(repo)
    versions = record.get_versions()
    for version in versions:
        version.update({'date': parser.parse(version['date']).date()})
    return versions
