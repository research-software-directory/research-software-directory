import click
import logging
import sys
from util import db_connect
from releases import get_citations
from github import sync_all as get_commits
from zotero import get_mentions
from oaipmh import list_records
from corporate import get_projects
from cache_software import cache_software


class MaxLevel(object):
    def __init__(self, level):
        self.__level = level

    def filter(self, log_record):
        return log_record.levelno <= self.__level


log_formatter = logging.Formatter('%(asctime)s %(name)s [%(levelname)s] %(message)s')
stdout_handler = logging.StreamHandler(stream=sys.stdout)
stdout_handler.addFilter(MaxLevel(logging.WARNING))
stdout_handler.setFormatter(log_formatter)

stderr_handler = logging.StreamHandler()
stderr_handler.setLevel(logging.ERROR)
stderr_handler.setFormatter(log_formatter)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(stdout_handler)
logger.addHandler(stderr_handler)


@click.group('cli')
def cli():
    """Command line interface to harvest data from various resources and combine the 
    relevant information into one document."""
    pass


@cli.group('harvest')
def harvest_group():
    """Harvest data from a variety of sources"""
    pass


@harvest_group.command('commits')
def harvest_commits():
    """Harvest commit data using GitHub's API"""
    get_commits()


@harvest_group.command('mentions')
@click.option('--since-version', 'since_version', type=int)
@click.option('--keys', 'keys', type=str)
def harvest_mentions(since_version=None, keys=None):
    """Harvest mentions from Zotero"""
    get_mentions(since_version=since_version, keys=keys)


@harvest_group.command('projects')
def harvest_projects():
    """Harvest project descriptions from https://esciencecenter.nl/projects"""
    get_projects()


@harvest_group.command('citations')
def harvest_citations():
    """Harvest citation metadata using Zenodo.org and GitHub.com APIs"""
    get_citations(db)


@harvest_group.command('metadata')
def harvest_metadata():
    """harvest metadata"""
    list_records()


@harvest_group.command('all')
def harvest_all():
    """Harvest commits, citations, mentions, projects"""
    get_commits()
    get_citations(db)
    get_mentions(since_version=None)
    get_projects()
    list_records()


@cli.command('resolve')
def resolve():
    """Combine information from different collections
    into one document by resolving foreign keys"""
    cache_software()


if __name__ == '__main__':
    db = db_connect()
    cli()
