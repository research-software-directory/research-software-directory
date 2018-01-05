import re
import json
from bs4 import BeautifulSoup
import requests


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


class PersonScraper(AbstractScraper):
    def __init__(self, baseurl):
        super().__init__(baseurl)
        self.people = []
        self.get_people()

    def get_people(self):
        people_soup = self.soup.find_all('div', class_="teamMember")
        for idx, people_soup in enumerate(people_soup):
            person = dict()

            person['name'] = people_soup.find('div', class_='name').string.strip()
            person['function'] = people_soup.find('div', class_='function').string.strip()
            person['url'] = people_soup.find('a', class_='name').attrs["href"]
            img_style = people_soup.find('span', class_='circularImage').attrs["style"]
            person['image'] = re.findall('background:url\(\'(.*?)\'\)', img_style)[0]

            self.people.append(person)


class BlogPostScraper(AbstractScraper):
    def __init__(self, baseurl):
        super().__init__(baseurl)
        self.posts = []
        self.get_posts()

    def __str__(self):
        return json.dumps(self.posts, sort_keys=True, indent=4, separators=(", ", ": "))

    def get_posts(self):
        posts_soup = self.soup.find_all("div", class_="js-trackedPost")
        for idx, post_soup in enumerate(posts_soup):
            post = dict()
            post["id"] = post_soup.attrs["data-post-id"]
            post["url"] = post_soup.find("div", class_="postItem").a["href"].split("?")[0]
            style_string = post_soup.find("div", class_="postItem").a.attrs["style"]
            post["image"] = re.findall(r'"([^"]*)"', style_string)[0]
            if idx == 0:
                post["title"] = post_soup.parent.find_all(recursive=False)[1].find("h3").string
                post["author"] = post_soup.parent.find_all(recursive=False)[1]\
                    .find("div", class_="postMetaInline").a.string
                post["datetime-published"] = post_soup.parent.find_all(recursive=False)[1]\
                    .find("div", class_="postMetaInline").div.time.attrs["datetime"]
            else:
                divs_soup = post_soup.find_all("div", recursive=False)
                post["title"] = divs_soup[1].find("h3").string
                post["author"] = divs_soup[1].find("div", class_="postMetaInline").a.string
                post["datetime-published"] = divs_soup[1].find("div", class_="postMetaInline").div.time.attrs["datetime"]

            self.posts.append(post)


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
            project["url"] = project_soup.find("div", class_="text").find("a", class_="title")["href"]

            if self.include_deep_info:
                print(project["url"])
                r = requests.get(project["url"])
                if r.status_code != 200:
                    raise Exception("Something went wrong while retrieving the page. url:" + project["url"])
                else:
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
    blogpost_scraper = BlogPostScraper(baseurl="https://blog.esciencecenter.nl/")
    print(blogpost_scraper)

    project_scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
                                     include_deep_info=True)
    print(project_scraper)

    print("Done.")
