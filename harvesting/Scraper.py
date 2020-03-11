import json
import requests
import logging
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class AbstractScraper:
    def __init__(self, baseurl):
        if baseurl[-1] == "/":
            self.baseurl = baseurl
        else:
            self.baseurl = baseurl + "/"
        self.html = None
        self.soup = None
        self.get_document()
        self.make_soup()

    def get_document(self):
        r = requests.get(self.baseurl)
        if r.status_code != 200:
            raise Exception("Something went wrong while retrieving the page.")
        else:
            self.html = r.text

    def make_soup(self):
        self.soup = BeautifulSoup(self.html, 'html.parser')


class ProjectScraper(AbstractScraper):
    def __init__(self, baseurl, include_deep_info=False):
        super().__init__(baseurl)
        self.projects = []
        self.include_deep_info = include_deep_info
        self.get_projects()

    def __str__(self):
        return json.dumps(self.projects, sort_keys=True, indent=4, separators=(", ", ": "))

    def make_soup(self):
        self.soup = BeautifulSoup(self.html, 'html.parser')

    def get_projects(self):

        def get_project_soup():
            r = requests.get(url)
            if r.status_code != 200:
                raise Exception("Something went wrong while retrieving the page.")
            else:
                return BeautifulSoup(r.text, 'html.parser')

        articles = self.soup.find("section", class_="events").find_all("article")
        n_articles = len(articles)
        for i_article, article in enumerate(articles):
            url = article.find("a", class_="event-inner")["href"]
            logger.info("{0}/{1}: Processing {2}".format(i_article + 1, n_articles, url))

            project = dict()
            project["primaryKey"] = {
                "collection": "project",
                "id": url.replace("https://www.esciencecenter.nl/projects/", "").strip("/").lower()
            }
            project["corporateUrl"] = url
            project["title"] = article.find("h2", class_="title").string.strip()
            project["subtitle"] = article.find("p").string.strip()
            project["principalInvestigator"] = ""
            project["image"] = ""

            if self.include_deep_info:
                soup = get_project_soup()
                project["image"] = soup.find("section", class_="content").find("figure").find("img")["src"]
                team = soup.find("section", id="team")
                if team is not None:
                    persons = team.find_all("div", class_="person")
                    for person in persons:
                        role = person.find("h3", class_="subtitle").string
                        if role is not None and role.strip().lower() == "principal investigator":
                            project["principalInvestigator"] = person.find("h2").string.strip()
                            break

            self.projects.append(project)


if __name__ == "__main__":

    project_scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
                                     include_deep_info=True)
    print(project_scraper)

    print("Done.")
