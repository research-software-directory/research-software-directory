import datetime
import json
import random

import flask
import markdown
import requests

import dateparser
import htmlmin
import ago
import os

from app import plot_commits
from app.citation import get_citation
from app.corporate_scraper.Scraper import BlogPostScraper, ProjectScraper

application = flask.Flask(__name__, template_folder='../templates', static_folder='../static')

api_url = os.environ.get('API_URL', 'https://api.research-software.nl')
#api_url = 'http://172.19.0.1:5001'

def format_software(sw):
    sw['lastUpdateAgo'] = 'Last update: ' + ago.human(sw.get('lastUpdate'), precision=1)

def get_blogs():
    return requests.get(api_url + '/corporate_blogs').json()

def get_projects():
    scraper = ProjectScraper(baseurl="https://www.esciencecenter.nl/projects",
        include_deep_info=True)
    return scraper.projects

@application.route('/sitemap.xml', methods=['GET'])
def sitemap():
    url = api_url + '/software?published=true'
    all_software = requests.get(url).json()

    response = flask.Response(flask.render_template('sitemap.xml',
                                 data=all_software
                                 ))
    response.headers["Content-Type"] = "application/xml"
    return response

@application.route('/', methods=['GET'])
def index():
    url = api_url + '/software?published=true'
    latest_mentions = requests.get(api_url + '/latest_mentions').json()
    organizations = requests.get(api_url + '/organizations').json()
    all_software = requests.get(url).json()
    for sw in all_software:
        format_software(sw)
    blog_posts = get_blogs()[:4]
    for post in blog_posts:
        format = "%B %d, %Y"
        post['datetime'] = dateparser.parse(post['datetime-published']).strftime(format)

    return htmlmin.minify(flask.render_template('index_template.html',
                                 template_data=all_software,
                                 data_json=flask.Markup(json.dumps(all_software)),
                                 organizations=flask.Markup(json.dumps(organizations)),
                                 latest_mentions=latest_mentions,
                                 blog_posts=blog_posts
                                 ))


def set_markdown(software, fields):
    for field in fields:
        if field in software and software[field] and software[field] is not '':
            software[field] = flask.Markup(markdown.markdown(software[field]))
        else:
            software[field] = None

@application.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = api_url + "/software/%s" % software_id
    software_dictionary = requests.get(url).json()
    if ("error" in software_dictionary):
        return flask.redirect("/", code=302)
    set_markdown(software_dictionary, ['statement', 'shortStatement','readMore'])

    for sw in software_dictionary['relatedSoftware']:
        format_software(sw)

    organisation_logos = {"astron": "astron.gif", "cbs-knaw": "cbs-knaw.png", "commit": "commit.png", "cwi": "cwi.png",
                          "dans": "dans.jpg", "deltares": "deltares.jpe", "dtl": "dtl.png", "fugro": "fugro.png",
                          "geodan": "geodan.gif", "huygens": "huygens.png", "icl": "icl.jpg", "ign": "ign.jpg",
                          "jhu": "jhu.png", "knir": "knir.png", "knmi": "knmi.png",
                          "leiden-university": "leiden-university.png", "lumc": "lumc.png", "meertens": "meertens.png",
                          "monetdb": "monetdb.png", "nfi": "nfi.gif", "nikhef": "nikhef.jpg", "nlesc": "nlesc.png",
                          "ntu": "ntu.gif", "oracle": "oracle.png", "potree": "potree.png",
                          "radboud.university.nijmegen": "radboud.university.nijmegen.png",
                          "rijkswaterstaat": "rijkswaterstaat.png", "spinlab": "spinlab.jpg",
                          "surfsara": "surfsara.png", "tno": "tno.jpg", "tu-delft": "tu-delft.png",
                          "university.of.groningen": "university.of.groningen.png",
                          "university.of.southampton": "university.of.southampton.svg", "upv": "upv.png",
                          "utwente": "utwente.png", "uu": "uu.svg", "uva": "uva.jpg", "vua": "vua.png",
                          "wur": "wur.jpg"}
    mention_types = {
        'blogPost': {"singular": "Blog post", "plural": "Blog posts"},
        'book': {"singular": "Book", "plural": "Books"},
        'bookSection': {"singular": "Book section", "plural": "Book sections"},
        'computerProgram': {"singular": "Computer program", "plural": "Computer programs"},
        'conferencePaper': {"singular": "Conference paper", "plural": "Conference papers"},
        'dataset': {"singular": "Data set", "plural": "Data sets"},
        'document': {"singular": "Document", "plural": "Documents"},
        'journalArticle': {"singular": "Journal article", "plural": "Journal articles"},
        'magazineArticle': {"singular": "Magazine article", "plural": "Magazine articles"},
        'manuscript': {"singular": "Manuscript", "plural": "Manuscripts"},
        'newspaperArticle': {"singular": "Newspaper article", "plural": "Newspaper articles"},
        'presentation': {"singular": "Presentation", "plural": "Presentations"},
        'report': {"singular": "Report", "plural": "Reports"},
        'thesis': {"singular": "Thesis", "plural": "Theses"},
        'videoRecording': {"singular": "Video recording", "plural": "Video recordings"},
        'webpage': {"singular": "Web page", "plural": "Web pages"},
    }

    software_dictionary['mentionCount'] = sum([len(software_dictionary['mentions'][key]) for key in software_dictionary['mentions']])
    software_dictionary['contributorCount'] = len(software_dictionary['contributor'])
    
    if len(software_dictionary['contributingOrganization']) == 1 and software_dictionary['contributingOrganization'][0]['id'] == 'nlesc':
        software_dictionary['contributingOrganization'] = []
    
    commits_data = get_commits_data(software_id)
    if commits_data and 'last' in commits_data:
        commits_data['last'] = dateparser.parse(commits_data['last']).strftime("%B %d, %Y")
    commits_data = flask.Markup(commits_data)

    return htmlmin.minify(flask.render_template('software_template.html',
                                 software_id=software_id,
                                 template_data=software_dictionary,
                                 organisation_logos=organisation_logos,
                                 mention_types=mention_types,
                                 commits_data=commits_data,
                                 ))

@application.route('/cite/<software_id>')
def cite(software_id):
    url = api_url + "/software/%s" % software_id
    software_dictionary = requests.get(url).json()

    if "error" in software_dictionary:
        return "not found", 404
    if not 'githubid' in software_dictionary:
        return "not found", 404

    try:
        mime, extension, data = get_citation(software_dictionary.get('githubid'), flask.request.args.get('format'))
    except Exception:
        return "unknown format '%s'" % flask.request.args.get('format'), 400

    return flask.Response(
        data,
        mimetype=mime,
        headers={"Content-disposition": "attachment; filename=citation.%s" % extension}
    )

@application.route('/about')
def about_template():
    return htmlmin.minify(flask.render_template('about_template.html'))

@application.errorhandler(404)
def page_not_found(e):
    return flask.redirect("/", code=302)


def get_commits_data(software_id, current_ym=datetime.date.today().year * 12 + datetime.date.today().month):
    url = api_url + "/software/%s/commits" % software_id
    commits = requests.get(url).json()
    if commits and len(commits) > 0:
        commits_data = plot_commits.bin_commits_data(sorted(commits, key=lambda k: k['date'], reverse=True), current_ym)
    else:
        commits_data = None

    return commits_data

@application.template_filter('strftime')
def strftime(millis):
    format = "%Y-%m-%d %H:%M:%S"
    return datetime.datetime.fromtimestamp(millis).strftime(format)

@application.template_filter('strfdatehuman')
def strfdatehuman(millis):
    format = "%B %d, %Y"
    return datetime.datetime.fromtimestamp(millis).strftime(format)

@application.template_filter('strfdate')
def strfdate(millis):
    format = "%Y/%m/%d"
    return datetime.datetime.fromtimestamp(millis).strftime(format)

@application.template_filter('strfdatedash')
def strfdatedash(millis):
    format = "%Y-%m-%d"
    return datetime.datetime.fromtimestamp(millis).strftime(format)

@application.template_filter('listNames')
def listNames(contributors):
    return [c['name'] for c in contributors]

@application.template_filter('pickPI')
def pickPI(team):
    pis = list(filter(lambda x: x['role'] == 'Principal Investigator', team))
    if len(pis) > 0:
        return pis[0]
    else:
        return team[0]

@application.template_filter('noNone')
def noNone(l):
    return list(filter(lambda x: x is not None, l))

@application.route('/favicon.ico')
def serve_favicon():
    return application.send_static_file('favicon.ico')


@application.route('/robots.txt')
def serve_robots():
    return application.send_static_file('robots.txt')
