import click
import logging
import sys

from corporate import sync_people, sync_projects
from github import sync_all as github_sync_all
from zotero import zotero_sync


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


@click.command()
@click.option('--scraper', required=1, help='Name of scraper.')
def scrape(scraper):
    if scraper == 'github':
        github_sync_all()
    elif scraper == 'zotero':
        zotero_sync()
    elif scraper == 'people':
        sync_people()
    elif scraper == 'projects':
        sync_projects()
    else:
        raise Exception('No such scraper: ' + scraper)

if __name__ == '__main__':
    scrape()
