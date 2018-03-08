import click

from github import sync_all as github_sync_all
from zotero import zotero_sync


@click.command()
@click.option('--scraper', required=1, help='Name of scraper.')
def scrape(scraper):
    if scraper == 'github':
        github_sync_all()
    if scraper == 'zotero':
        zotero_sync()

if __name__ == '__main__':
    scrape()
