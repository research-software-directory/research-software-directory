import logging
import pandas as pd
import re
import requests
import time
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def request_was_successful(response):
    return(response.status_code == requests.codes.ok)


def is_project_url(url):
    url_parts = url.split("/")
    return(re.search("projects",url) and len(url_parts) > 4 and len(url_parts[4]) > 0)


def get_project_urls(soup):
    project_urls = []
    for a in soup.findAll("a"):
        project_url = a.get("href")
        project_url_parts = project_url.split("/")
        if is_project_url(project_url):
            project_urls.append(project_url)
    return(project_urls)


def remove_titles(text):
    text = re.sub("(Prof|Drs?)\. *","",text)
    text = re.sub(",? *(MSc|BSc|MA) *","",text)
    return(text)


def get_project_slug(project_url):
    if len(project_url.split("/")) > 4: slug = project_url.split("/")[4]
    else: slug = ""
    return(slug)


def get_project_title(soup):
    title = ""
    h1s = soup.findAll("h1")
    for h1 in h1s:
        if title == "": title = h1.text.strip()
        else: title += " "+h1.text.strip()
    return(title)


def get_project_subtitle(soup):
    subtitle = ""
    large_texts = soup.findAll("div",{"class":"large-text"})
    for large_text in large_texts:
        if subtitle == "": subtitle = large_text.text.strip()
        else: subtitle += " "+large_text.text.strip()
    return(subtitle)


def get_project_text(soup):
    project_text = ""
    texts = soup.findAll("section",{"class":"content"})
    for text in texts:
        for p in text.findAll("p"):
            if not 'social-share' in p.parent["class"] and p.text != "":
                if project_text == "": project_text = str(p)
                else: project_text += " "+str(p)
    return(project_text)


def get_project_team(soup):
    project_team = []
    teams = soup.findAll("section",{"id":"team"})
    for team in teams:
        for team_member in team.findAll("div",{"class","person"}):
            name = ""
            role = ""
            for h2 in team_member.findAll("h2"):
                if name == "": name = remove_titles(h2.text)
                else: name += " "+remove_titles(h2.text)
            for h3 in team_member.findAll("h3"):
                if role == "": role = remove_titles(h3.text)
                else: role += " "+remove_titles(h3.text)
            if name != "":
                project_team.append({"name":name, "role":role})
    return(project_team)


def get_project_partners(soup):
    project_partners = []
    partner_lists = soup.findAll("section",{"class":"partners"})
    for partner_list in partner_lists:
        for partner in partner_list.findAll("img"):
            name = partner.get("alt","")
            img_url = partner.get("src","")
            if name != "":
                project_partners.append({"name":name, "img_url":img_url})
    return(project_partners)


def get_project_related_projects(soup):
    project_related_projects = []
    related_project_lists = soup.findAll("section",{"class":"events"})
    for related_project_list in related_project_lists:
        for related_project in related_project_list.findAll("article",{"class","event"}):
            name = ""
            for h2 in related_project.findAll("h2"):
                if name == "": name = remove_titles(h2.text)
                else: name += " "+remove_titles(h2.text)
            if name != "":
                project_related_projects.append(name)
    return(project_related_projects)


def get_project_data(project_urls):
    project_data = []
    for project_url in project_urls:
        logger.info(f"fetching page {project_url}")
        response_project = requests.get(project_url)
        if request_was_successful(response_project):
            project = {}
            soup = BeautifulSoup(response_project.text, 'html.parser')
            project["slug"] = get_project_slug(project_url)
            project["title"] = get_project_title(soup)
            project["subtitle"] = get_project_subtitle(soup)
            project["text"] = get_project_text(soup)
            project["team"] = get_project_team(soup)
            project["partners"] = get_project_partners(soup)
            project["related_project_data"] = get_project_related_projects(soup)
            project_data.append(project)
        else:
            logger.warning(f"failed fetching page {project_url}")
        time.sleep(1)
    return(project_data)


def save_project_data(project_data):
    pd.DataFrame(project_data).to_csv("projects.csv",index=False)

url = "https://www.esciencecenter.nl/projects/"
logger.info(f"fetching page {url}")
response = requests.get(url)
if request_was_successful(response):
    soup = BeautifulSoup(response.text, 'html.parser')
    project_urls = get_project_urls(soup)
    project_data = get_project_data(project_urls)
    save_project_data(project_data)
else:
    logger.warning(f"failed fetching page {url}")
