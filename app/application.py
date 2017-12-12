import datetime
import json
import random

import flask
import markdown
import requests

from app import plot_commits

application = flask.Flask(__name__, template_folder='../templates', static_folder='../static')

api_url = 'https://admin.research-software.nl/api'

@application.route('/', methods=['GET', 'POST'])
def index():
    url = api_url + '/software'
    all_software_dictionary = requests.get(url).json()
    # template_data_json = flask.json.dumps(all_software_dictionary, sort_keys = True, indent = 4)
    random_integer = random.randint(1, 100)
    return flask.render_template('index_template.html', template_data=all_software_dictionary,
                                 data_json=flask.Markup(json.dumps(all_software_dictionary)),
                                 random_integer=str(random_integer))


@application.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = api_url + "/software/%s" % software_id
    software_dictionary = requests.get(url).json()
    if ("error" in software_dictionary):
        return flask.redirect("/", code=302)
    statement = software_dictionary.get("statement", '')
    statementMarkup = flask.Markup(markdown.markdown(statement))
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
        'journalArticle': 'Journal article',
        'presentation': 'Presentation',
        'videoRecording': 'Video recording',
        'bookSection': 'Book section'
    }
    commits_data = get_commits_data(software_id)
    return flask.render_template('software_template.html', software_id=software_id, template_data=software_dictionary,
                                 statementMarkup=statementMarkup, organisation_logos=organisation_logos,
                                 mention_types=mention_types, commits_data=commits_data)


@application.route('/about')
def about_template():
    return flask.render_template('about_template.html')


@application.route('/rsd')
def rsd_template():
    return flask.render_template('rsd_template.html')


@application.errorhandler(404)
def page_not_found(e):
    return flask.redirect("/", code=302)


def get_commits_data(software_id):
    url = api_url + "/software/%s/report" % software_id
    report_dictionary = requests.get(url).json()
    if 'github' in report_dictionary:
        commits = report_dictionary['github']['commits']
        if isinstance(commits, list):
            commits_data = plot_commits.bin_commits_data(commits)
        else:
            commits_data = commits
    else:
        commits_data = {'error': '%s: %s' % (
            str(report_dictionary['exception']['class']),
            str(report_dictionary['exception']['error'])
        )}
    return commits_data


@application.template_filter('strftime')
def strftime(millis):
    format = "%Y-%m-%d %H:%M:%S"
    result = datetime.datetime.fromtimestamp(millis).strftime(format)
    return result


@application.template_filter('listNames')
def listNames(contributors):
    return [c['name'] for c in contributors]
