import os
import click
import logging
import sys
from util import db_connect
from releases import get_citations
from github import sync_all as get_commits
from zotero import get_mentions
from oaipmh import list_records
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


@harvest_group.command('mentions', help='Harvest mentions from Zotero library ' +
                                        os.environ.get('ZOTERO_LIBRARY', '<not specified>'))
@click.option('--since-version', 'since_version', type=int, help='Retrieve Zotero items starting from this version ' +
                                                                 'regardless of what the local latest version is. ' +
                                                                 'For example, \'--since-version 4835\'.')
@click.option('--keys', 'keys', type=str, help='Retrieve Zotero items matching the supplied comma-separated string.' +
                                               'For example, \'--keys DQYQKKZ4,GZJ5CEKK\'')
def harvest_mentions(since_version=None, keys=None):
    get_mentions(since_version=since_version, keys=keys)


@harvest_group.command('citations', help='Harvest citation metadata using Zenodo, GitHub, and CITATION.cff files')
@click.option('--dois', 'dois', type=str, help='Harvest only citation metadata associated with the supplied ' +
                                               'comma-separated string of DOIs. For example, \'--dois 10.5281/' +
                                               'zenodo.2609141,10.5281/zenodo.1162057\'')
def harvest_citations(dois=None):
    if dois is None:
        pass
    else:
        dois = dois.split(',')
    db = db_connect()
    get_citations(db, dois)


@harvest_group.command('metadata', help='Harvest datacite4 metadata from Zenodo')
@click.option('--dois', 'dois', type=str, help='Harvest only metadata associated with the supplied comma-separated ' +
                                               'string of DOIs. For example, \'--dois 10.5281/zenodo.2609141,10.5281' +
                                               '/zenodo.1162057\'')
def harvest_metadata(dois=None):
    if dois is None:
        pass
    else:
        dois = dois.split(',')
    list_records(dois)


@harvest_group.command('all')
def harvest_all():
    """Harvest commits, citations, mentions, oaipmh records"""
    db = db_connect()
    dois = None
    get_commits()
    get_citations(db, dois)
    get_mentions(since_version=None)
    list_records(dois)


@cli.command('resolve')
def resolve():
    """Combine information from different collections
    into one document by resolving foreign keys"""
    cache_software()


if __name__ == '__main__':
    cli()
