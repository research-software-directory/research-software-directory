import re
import json
from bs4 import BeautifulSoup
import requests

import logging

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

    def get_projects(self):
        projects_soup = self.soup.find_all("div", class_="projectNode")
        for project_soup in projects_soup:
            project = dict()
            project["title"] = project_soup.find("div", class_="text").find("a", class_="title").string
            project["subtitle"] = project_soup.find("div", class_="text").find("a", class_="subtitle").string
            project["image"] = project_soup.find("div", class_="image").find("img")["src"]

            project_href = project_soup.find("div", class_="text").find("a", class_="title")["href"]
            project["url"] = re.sub(r'^//', 'https://', project_href)

            if self.include_deep_info:
                logger.info(project["url"])
                r = requests.get(project["url"])
                if r.status_code != 200:
                    logger.error("Something went wrong while retrieving the page. url:" + project["url"])
                    continue
                project_soup = BeautifulSoup(r.text, 'html.parser')
                teams_soup = project_soup.find_all("div", class_="team")
                team = list()
                for team_soup in teams_soup:
                    team_is_pi = team_soup.find("h5").string == "Principal Investigator"
                    team_is_nlesc = team_soup.find("h5").string == "eScience Center Team"
                    if team_is_pi:
                        team.append({
                            "role": "Principal Investigator",
                            "url": team_soup.find("a")["href"],
                            "name": team_soup.find("div", class_="text").span.string,
                            "affiliation": team_soup.find("div", class_="text").text.split("\n")[-1].strip()
                        })
                    elif team_is_nlesc:
                        for member_soup in team_soup.find_all("a", class_="member"):
                            team.append({
                                "role": member_soup.find("div", class_="text").text.split("\n")[-1].strip(),
                                "url": member_soup["href"],
                                "name": member_soup.find("div", class_="text").span.string,
                                "affiliation": "Netherlands eScience Center"
                            })
                    else:
                        raise Warning("This should not happen.")
                project["team"] = team

            self.projects.append(project)


if __name__ == "__main__":

    project_scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
                                     include_deep_info=True)
    print(project_scraper)

    print("Done.")
