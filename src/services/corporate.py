import logging
from src.scraper.Scraper import BlogPostScraper, ProjectScraper

logger = logging.getLogger(__name__)

def get_blogs():
    scraper = BlogPostScraper(baseurl="https://blog.esciencecenter.nl/")
    return scraper.posts

def get_projects():
    scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
        include_deep_info=True)
    return scraper.projects


class CorporateService:
    def __init__(self, db):
        self.db = db

    def sync_blogs(self):
        blogs = get_blogs()
        self.db['corporate_blog'].drop()

        for blog in blogs:
            record = self.db['corporate_blog'].new()
            record.data.update(blog)
            record.save()

    def sync_projects(self):
        projects = get_projects()
        self.db['corporate_project'].drop()

        for project in projects:
            record = self.db['corporate_project'].new()
            record.data.update(project)
            record.save()