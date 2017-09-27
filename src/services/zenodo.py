import logging

from pyzenodo import zenodo
from dateutil import parser

logger = logging.getLogger(__name__)


def version_info(repo):
    zen = zenodo.Zenodo()
    record = zen.find_record_by_github_repo(repo)
    if not record:
        return None
    versions = record.get_versions()
    for version in versions:
        version.update({'date': parser.parse(version['date']).date()})
    return versions
