import click
import logging
import sys

from util import db_connect
from cache_software import cache_software
from corporate import get_projects
from github import sync_all as get_commits
from releases import get_citations
from zotero import get_mentions
from oaipmh import list_records


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

@click.group()
def cli():
    pass

harvest_choices = click.Choice(['commits', 'mentions', 'projects', 'citations', 'metadata', 'all'])
@cli.command('harvest', help='Specify the type of data to be harvested.')
@click.argument('type_of_data', type=harvest_choices, required=True)
def harvest(type_of_data):
    db = db_connect()
    if type_of_data == 'commits':
        get_commits()
    elif type_of_data == 'mentions':
        get_mentions()
    elif type_of_data == 'projects':
        get_projects()
    elif type_of_data == 'citations':
        get_citations(db)
    elif type_of_data == 'metadata':
        list_records()
    elif type_of_data == 'all':
        get_commits()
        get_citations(db)
        get_mentions()
        get_projects()
        list_records()
    else:
        raise Exception("I don't know how to harvest '" + harvest + "'.")


@cli.command('resolve', help='Resolve foreign keys')
def resolve():
    db = db_connect()
    cache_software()

cli = click.CommandCollection(sources=[cli])

if __name__ == '__main__':
    cli()


