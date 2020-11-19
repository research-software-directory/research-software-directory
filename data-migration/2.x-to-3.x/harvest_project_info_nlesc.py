import base64
import datetime
import json
import logging
import re
import sys
import time
import uuid

import requests
from bs4 import BeautifulSoup
from zotero import generate_jwt_token

logger = logging.getLogger(__name__)


def request_was_successful(response):
    return response.status_code == 200


def is_project_url(url):
    url_parts = url.split("/")
    return re.search("projects", url) and len(url_parts) > 4 and len(url_parts[4]) > 0


def get_project_field_and_status(project):
    project_field = ""
    project_status = ""
    if "data-filter-item" in project.attrs:
        project_field, project_status = project["data-filter-item"].split()
    return project_field, project_status


def get_project_urls(soup):
    project_urls = []
    for project in soup.findAll("article"):
        project_url = ""
        for a in project.findAll("a"):
            url = a.get("href")
            if is_project_url(url):
                project_url = url
        project_field, project_status = get_project_field_and_status(project)
        if project_url != "":
            project_urls.append(
                {"url": project_url, "field": project_field, "status": project_status}
            )
    return project_urls


def remove_titles(text):
    text = re.sub(r"\b(Prof|Drs?|Mr|Ir)\b\. *", "", text, flags=re.IGNORECASE)
    text = re.sub(r",? *\b(PhD|MSc|BSc|MA)\b", "", text, flags=re.IGNORECASE)
    return text.strip()


def get_project_slug(project_url):
    if len(project_url.split("/")) > 4:
        slug = project_url.split("/")[4]
    else:
        slug = ""
    return slug


def get_project_title(soup):
    title = ""
    h1s = soup.findAll("h1")
    for h1 in h1s:
        if title == "":
            title = h1.text.strip()
        else:
            title += " " + h1.text.strip()
    return title


def get_project_subtitle(soup):
    subtitle = ""
    large_texts = soup.findAll("div", {"class": "large-text"})
    for large_text in large_texts:
        if subtitle == "":
            subtitle = large_text.text.strip()
        else:
            subtitle += " " + large_text.text.strip()
    return subtitle


def get_project_text(soup):
    project_text = ""
    image_caption = ""
    texts = soup.findAll("section", {"class": "content"})
    for text in texts:
        for p in text.findAll("p"):
            if (
                p.text != ""
                and "social-share" not in p.parent["class"]
                and p.parent.name != "blockquote"
            ):
                if re.search("image:", p.text, flags=re.IGNORECASE):
                    image_caption += " " + str(p)
                else:
                    project_text += " " + str(p)
    return project_text, image_caption


def get_project_team(soup):
    project_team = []
    teams = soup.findAll("section", {"id": "team"})
    for team in teams:
        for team_member in team.findAll("div", {"class", "person"}):
            name = ""
            role = ""
            for h2 in team_member.findAll("h2"):
                if name == "":
                    name = remove_titles(h2.text)
                else:
                    name += " " + remove_titles(h2.text)
            for h3 in team_member.findAll("h3"):
                if role == "":
                    role = h3.text
                else:
                    role += " " + h3.text
            if name != "":
                project_team.append({"name": name, "role": role})
    return project_team


def make_url_secure(url):
    return re.sub("http:", "https:", url, flags=re.IGNORECASE)


def get_project_partners(soup):
    project_partners = []
    partner_lists = soup.findAll("section", {"class": "partners"})
    for partner_list in partner_lists:
        for partner in partner_list.findAll("img"):
            name = partner.get("alt", "")
            img_url = partner.get("src", "")
            if name != "":
                project_partners.append(
                    {"name": name, "img_url": make_url_secure(img_url)}
                )
    return project_partners


def get_project_related_projects(soup):
    project_related_projects = []
    related_project_lists = soup.findAll("section", {"class": "events"})
    for related_project_list in related_project_lists:
        for related_project in related_project_list.findAll(
            "article", {"class", "event"}
        ):
            name = ""
            for h2 in related_project.findAll("h2"):
                if name == "":
                    name = h2.text
                else:
                    name += " " + h2.text
            if name != "":
                project_related_projects.append(name)
    return project_related_projects


def get_project_image_url(soup):
    for figure in soup.findAll("figure"):
        for img in figure.findAll("img"):
            imageUrl = img.get("src")
            if imageUrl != "":
                return make_url_secure(imageUrl)
    return "https://FIXME"


def get_project_data(project_urls):
    project_data = []
    counter = 0
    for project_url in project_urls:
        counter += 1
        print(
            f'fetching project page {counter}/{len(project_urls)} {project_url["url"]}'
        )
        response_project = requests.get(project_url["url"])
        if request_was_successful(response_project):
            project = {}
            soup = BeautifulSoup(response_project.text, "html.parser")
            project["slug"] = get_project_slug(project_url["url"])
            project["title"] = get_project_title(soup)
            project["subtitle"] = get_project_subtitle(soup)
            project["imageUrl"] = make_url_secure(get_project_image_url(soup))
            project["text"], project["imageCaption"] = get_project_text(soup)
            project["team"] = get_project_team(soup)
            project["partners"] = get_project_partners(soup)
            project["related_project_data"] = get_project_related_projects(soup)
            project["field"] = project_url["field"]
            project["status"] = project_url["status"]
            project_data.append(project)
        else:
            logger.warning(
                f'failed fetching project page {counter} {project_url["url"]}'
            )
        time.sleep(1)
    return project_data


def get_project_data_from_website():
    url = "https://www.esciencecenter.nl/projects/"
    print(f"fetching project overview page {url}")
    response = requests.get(url)
    if request_was_successful(response):
        soup = BeautifulSoup(response.text, "html.parser")
        project_urls = get_project_urls(soup)
        project_data = get_project_data(project_urls)
        return project_data
    else:
        logger.warning(f"failed fetching project overview page {url}")
        return {}


def replace_paragraph_tags(text):
    text = re.sub("<p>", r"\n\n", text, flags=re.IGNORECASE)
    text = re.sub("</p>", r"\n\n", text, flags=re.IGNORECASE)
    return text


def remove_tags(text):
    text = re.sub("<[^<>]*>", "", text, flags=re.IGNORECASE)
    return text


def fix_html(text):
    text = replace_paragraph_tags(text)
    text = remove_tags(text)
    return text.strip()


def get_data_from_rsd(token, directory):
    api_url = "https://localhost/api" + directory
    api_response = requests.get(
        api_url, headers={"Authorization": "Bearer %s" % token}, verify=False
    )
    if not request_was_successful(api_response):
        api_data = {}
    else:
        api_soup = BeautifulSoup(api_response.text, "html.parser")
        api_data = json.loads(remove_tags(str(api_soup)))
    return api_data


def get_data_by_title(api_data, title):
    for data in api_data[::-1]:
        if data["title"] == title:
            return dict(data)
    return {}


def get_data_by_name(api_data, name):
    for data in api_data[::-1]:
        if data["name"] == name:
            return dict(data)
    return {}


def make_person_name(person_data):
    name = ""
    if person_data["givenNames"].strip() != "":
        name = person_data["givenNames"].strip()
    if (
        "nameParticle" in person_data
        and person_data["nameParticle"] is not None
        and person_data["nameParticle"].strip() != ""
    ):
        if name != "":
            name += " "
        name += person_data["nameParticle"].strip()
    if person_data["familyNames"].strip() != "":
        if name != "":
            name += " "
        name += person_data["familyNames"].strip()
    if (
        "nameSuffix" in person_data
        and person_data["nameSuffix"] is not None
        and person_data["nameSuffix"].strip() != ""
    ):
        if name != "":
            name += " "
        name += person_data["nameSuffix"].strip()
    return name


def find_team_member(person_data_target, name):
    for person_data in person_data_target:
        if make_person_name(person_data) == name:
            return person_data
    return {}


def get_current_time_string():
    return datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")


def split_name(name):
    name_part_list = name.strip().split()
    if len(name_part_list) > 0:
        given_names = name_part_list.pop(0)
    else:
        given_names = ""
    while len(name_part_list) > 0 and (
        len(name_part_list[0]) == 1 or name_part_list[0][-1] == "."
    ):
        given_names += " " + name_part_list.pop(0)
    name_particle = ""
    while len(name_part_list) > 0 and re.search(
        "^(d|d'|de|der|het|t|'t|uit|uyt|van|vande|vander)$",
        name_part_list[0],
        flags=re.IGNORECASE,
    ):
        if name_particle == "":
            name_particle = name_part_list.pop(0)
        else:
            name_particle += " " + name_part_list.pop(0)
    family_names = " ".join(name_part_list)
    return given_names, name_particle, family_names


def make_new_person_data(name):
    new_person_data = {"primaryKey": {"id": str(uuid.uuid4()), "collection": "person"}}
    (
        new_person_data["givenNames"],
        new_person_data["nameParticle"],
        new_person_data["familyNames"],
    ) = split_name(name)
    new_person_data["createdAt"] = get_current_time_string()
    new_person_data["createdBy"] = "esciencecenter.nl.crawler"
    new_person_data["updatedAt"] = new_person_data["createdAt"]
    new_person_data["updatedBy"] = new_person_data["createdBy"]
    return new_person_data


def add_new_person_to_database(token, api_persons_data, name):
    new_person_data = make_new_person_data(name)
    person_api_url = "https://localhost/api/person"
    person_api_response = requests.post(
        person_api_url,
        json=new_person_data,
        headers={"Authorization": "Bearer %s" % token},
        verify=False,
    )
    if request_was_successful(person_api_response):
        api_persons_data.append(new_person_data)
        print(f'added new person "{name}"')
        return new_person_data
    else:
        logger.warning(f"failed storing person in database: {name}")


def get_suffix(url):
    url_parts = url.strip().split(".")
    if len(url_parts) > 0:
        return url_parts[-1]
    else:
        return ""


def make_new_organization_data(name_data):
    new_organization_data = {
        "primaryKey": {"id": str(uuid.uuid4()), "collection": "organization"}
    }
    new_organization_data["createdAt"] = get_current_time_string()
    new_organization_data["createdBy"] = "esciencecenter.nl.crawler"
    new_organization_data["updatedAt"] = new_organization_data["createdAt"]
    new_organization_data["updatedBy"] = new_organization_data["createdBy"]
    new_organization_data["url"] = "https://FIXME"
    if "name" in name_data:
        new_organization_data["name"] = name_data["name"]
    img_data = ""
    img_suffix = "png"
    if "img_url" in name_data:
        img_response = requests.get(name_data["img_url"])
        if request_was_successful(img_response):
            img_data = base64.b64encode(img_response.content).decode("utf-8")
            img_suffix = get_suffix(name_data["img_url"])
    new_organization_data["logo"] = {
        "data": img_data,
        "mimeType": "image/" + img_suffix,
    }
    return new_organization_data


def add_new_organization_to_database(token, api_organizations_data, name_data):
    new_organization_data = make_new_organization_data(name_data)
    organization_api_url = "https://localhost/api/organization"
    organization_api_response = requests.post(
        organization_api_url,
        json=new_organization_data,
        headers={"Authorization": "Bearer %s" % token},
        verify=False,
    )
    if request_was_successful(organization_api_response):
        api_organizations_data.append(new_organization_data)
        print(f'added new organization "{name_data["name"]}"')
        return new_organization_data
    else:
        logger.warning(f'failed storing organization in database: {name_data["name"]}')


# see required list and patterns in backend/schemas/project.json
def make_new_project_data(project_data_source):
    new_project_data = {}
    new_project_data["callUrl"] = "https://doi.org/FIXME"
    new_project_data["codeUrl"] = "https://github.com/FIXME"
    new_project_data["createdAt"] = get_current_time_string()
    new_project_data["createdBy"] = "esciencecenter.nl.crawler"
    new_project_data["dateEnd"] = "1900-12-31"
    new_project_data["dateStart"] = "1900-01-01"
    new_project_data["description"] = fix_html(project_data_source["text"])
    new_project_data["grantId"] = "FIXME"
    new_project_data["imageCaption"] = "FIX ME FIX ME"
    new_project_data["imageUrl"] = make_url_secure(project_data_source["imageUrl"])
    new_project_data["impact"] = []
    new_project_data["isPublished"] = True
    new_project_data["output"] = []
    new_project_data["primaryKey"] = {"id": str(uuid.uuid4()), "collection": "project"}
    new_project_data["related"] = {"organizations": [], "projects": [], "software": []}
    new_project_data["slug"] = "fixme"
    new_project_data["subtitle"] = project_data_source["subtitle"]
    new_project_data["tags"] = []
    new_project_data["team"] = []
    new_project_data["title"] = project_data_source["title"]
    new_project_data["updatedAt"] = new_project_data["createdAt"]
    new_project_data["updatedBy"] = new_project_data["createdBy"]
    return new_project_data


def fix_empty_team(token, project_data_target, api_persons_data, project_data_source):
    if len(project_data_target["team"]) > 0:
        return project_data_target
    elif len(project_data_source["team"]) > 0:
        project_data_target["team"] = get_source_team(
            token, project_data_source, api_persons_data, {}
        )
        return project_data_target
    elif project_data_target["title"] == "Deep learning OCR post-correction":
        project_data_source["team"] = [
            {"name": "Janneke van der Zwaan", "role": "eScience Research Engineer"}
        ]
        project_data_target["team"] = get_source_team(
            token, project_data_source, api_persons_data, {}
        )
        return project_data_target
    else:
        logger.warning(f'project {project_data_target["title"]} has no team members!')
        return project_data_target


def add_new_project_to_database(
    token, api_projects_data, api_persons_data, project_data_source
):
    new_project_data = make_new_project_data(project_data_source)
    new_project_data = fix_empty_team(
        token, new_project_data, api_persons_data, project_data_source
    )
    project_api_url = "https://localhost/api/project"
    project_api_response = requests.post(
        project_api_url,
        json=new_project_data,
        headers={"Authorization": "Bearer %s" % token},
        verify=False,
    )
    if request_was_successful(project_api_response):
        api_projects_data.append(new_project_data)
        print(f'added new project "{new_project_data["title"]}"')
        return new_project_data
    else:
        logger.warning(
            f'failed storing project in database: {project_api_response} {project_data_source["title"]}'
        )


def fix_role(role):
    role = re.sub(
        "Principal Investigator", "Principal investigator", role, flags=re.IGNORECASE
    )
    role = re.sub(
        "eScience Senior Research Engineer",
        "Senior eScience Research Engineer",
        role,
        flags=re.IGNORECASE,
    )
    role = re.sub(
        "Project Coordinator", "eScience Coordinator", role, flags=re.IGNORECASE
    )
    role = re.sub("Technical Lead.*", "Technical Lead", role, flags=re.IGNORECASE)
    role = re.sub("Community Manager.*", "Community Manager", role, flags=re.IGNORECASE)
    return role


def add_team_member(team_member_list, updated_team_member):
    update = False
    for team_member in team_member_list:
        if team_member["foreignKey"]["id"] == updated_team_member["foreignKey"]["id"]:
            team_member = updated_team_member
            update = True
    if not update:
        team_member_list.append(updated_team_member)


def guess_affiliation(team_member, related_organizations):
    if re.search(
        "(escience|lead|director|manager|phd)", team_member["role"], flags=re.IGNORECASE
    ):
        team_member["affiliations"] = [
            {"foreignKey": {"id": "nlesc", "collection": "organization"}}
        ]
    elif (
        re.search("principal investigator", team_member["role"], flags=re.IGNORECASE)
        and len(related_organizations) == 1
    ):
        team_member["affiliations"] = [related_organizations[0]]
    else:
        team_member["affiliations"] = []
    return team_member


def get_source_team(
    token, project_data_source, api_persons_data, related_organizations
):
    acceptable_roles = [
        "Principal investigator",
        "eScience Research Engineer",
        "Senior eScience Research Engineer",
        "eScience Coordinator",
        "Technical Lead",
        "PhD student",
        "Community Manager",
        "Director of Operations",
        "Director of Technology",
    ]

    team = []
    for team_member_data_source in project_data_source["team"]:
        team_member_data_target = find_team_member(
            api_persons_data, team_member_data_source["name"]
        )
        if len(team_member_data_target) == 0:
            team_member_data_target = add_new_person_to_database(
                token, api_persons_data, team_member_data_source["name"]
            )
        team_member_data_update = {"foreignKey": team_member_data_target["primaryKey"]}
        team_member_data_update["isContactPerson"] = False
        if "role" in team_member_data_source and team_member_data_source["role"] != "":
            team_member_data_update["role"] = fix_role(
                team_member_data_source["role"].strip()
            )
            if team_member_data_update["role"] == "Contact person":
                team_member_data_update["isContactPerson"] = True
            if team_member_data_update["role"] not in acceptable_roles:
                logger.warning(f'unknown role: {team_member_data_update["role"]}')
        else:
            team_member_data_update["role"] = "eScience Research Engineer"
        team_member_data_update = guess_affiliation(
            team_member_data_update, related_organizations
        )
        add_team_member(team, team_member_data_update)
    return team


def get_source_related_organizations(
    token, project_data_source, api_organizations_data
):
    related_organizations = []
    for related_organization_name in project_data_source["partners"]:
        related_organization = get_data_by_name(
            api_organizations_data, related_organization_name["name"]
        )
        if "primaryKey" not in related_organization or (
            "logo" in related_organization
            and related_organization["logo"]["data"] == ""
        ):
            related_organization = add_new_organization_to_database(
                token, api_organizations_data, related_organization_name
            )
        related_organizations.append({"foreignKey": related_organization["primaryKey"]})
    return related_organizations


def get_source_related_projects(project_data_source, api_projects_data):
    related_projects = []
    for related_project_title in project_data_source["related_project_data"]:
        related_project = get_data_by_title(api_projects_data, related_project_title)
        if "primaryKey" not in related_project:
            logger.warning(f"unknown project [1] {related_project_title}")
        else:
            related_projects.append({"foreignKey": related_project["primaryKey"]})
    return related_projects


def update_project_data(
    token,
    api_projects_data,
    api_organizations_data,
    api_persons_data,
    project_data_source,
    project_data_target,
):
    project_data_target["description"] = fix_html(project_data_source["text"])
    imageCaption = fix_html(project_data_source["imageCaption"])
    if len(imageCaption) >= 10:
        project_data_target["imageCaption"] = imageCaption
    project_data_target["slug"] = project_data_source["slug"]
    project_data_target["imageUrl"] = make_url_secure(project_data_source["imageUrl"])
    project_data_target["updatedBy"] = "esciencecenter.nl.crawler"
    project_data_target["updatedAt"] = get_current_time_string()
    project_data_target["related"]["organizations"] = get_source_related_organizations(
        token, project_data_source, api_organizations_data
    )
    project_data_target["related"]["projects"] = get_source_related_projects(
        project_data_source, api_projects_data
    )
    project_data_target["team"] = get_source_team(
        token,
        project_data_source,
        api_persons_data,
        project_data_target["related"]["organizations"],
    )
    return project_data_target


def fix_shortened_dates(project_data_target):
    project_data_target["dateStart"] = project_data_target["dateStart"][:10]
    project_data_target["dateEnd"] = project_data_target["dateEnd"][:10]
    return project_data_target


def fix_empty_lines(project_data_target):
    project_data_target["description"] = re.sub(
        r"\s*\n\s*\n\s*", r"\n\n", project_data_target["description"]
    ).strip()
    return project_data_target


def update_project_in_database(
    token,
    api_projects_data,
    api_organizations_data,
    api_persons_data,
    project_data_source,
    project_data_target,
):
    project_data_target = update_project_data(
        token,
        api_projects_data,
        api_organizations_data,
        api_persons_data,
        project_data_source,
        project_data_target,
    )
    project_data_target = fix_empty_team(
        token, project_data_target, api_persons_data, project_data_source
    )
    project_data_target = fix_shortened_dates(project_data_target)
    project_data_target = fix_empty_lines(project_data_target)
    project_api_url = (
        "https://localhost/api/project/" + project_data_target["primaryKey"]["id"]
    )
    project_api_response = requests.put(
        project_api_url,
        json=project_data_target,
        headers={"Authorization": "Bearer %s" % token},
        verify=False,
    )
    if request_was_successful(project_api_response):
        print(f'updated project "{project_data_source["title"]}"')
        return True
    else:
        logger.warning(
            f'failed updating project in database: {project_api_response} {project_data_source["title"]} '
            + f' {project_api_response.json()["error"]}'
        )
        return False


def find_project_in_database(
    token, api_projects_data, api_persons_data, project_data_source
):
    for project_data_target in api_projects_data:
        if project_data_source["title"] == project_data_target["title"]:
            return project_data_target
    return add_new_project_to_database(
        token, api_projects_data, api_persons_data, project_data_source
    )


def main(argv):
    project_data_website = get_project_data_from_website()
    token = generate_jwt_token()
    api_persons_data = get_data_from_rsd(token, "/person")
    api_projects_data = get_data_from_rsd(token, "/project")
    api_organizations_data = get_data_from_rsd(token, "/organization")

    failed_project_updates = 0
    for project_data_source in project_data_website:
        project_data_target = find_project_in_database(
            token, api_projects_data, api_persons_data, project_data_source
        )
        success = update_project_in_database(
            token,
            api_projects_data,
            api_organizations_data,
            api_persons_data,
            project_data_source,
            project_data_target,
        )
        if not success:
            failed_project_updates += 1
    print(f"number of project updates that failed: {failed_project_updates}")
    sys.exit(0)


if __name__ == "__main__":
    main(sys.argv)
