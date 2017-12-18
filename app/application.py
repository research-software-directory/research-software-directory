import datetime
import json
import random

import flask
import markdown
import requests

import ago

from app import plot_commits

application = flask.Flask(__name__, template_folder='../templates', static_folder='../static')

api_url = 'https://admin.research-software.nl/api'
#api_url = 'http://172.19.0.1:5001'

def format_software(sw):
    sw['lastUpdateAgo'] = ago.human(sw.get('lastUpdate'), precision=1)

@application.route('/', methods=['GET', 'POST'])
def index():
    url = api_url + '/software?published=true'
    latest_mentions = requests.get(api_url + '/latest_mentions').json()
    all_software = requests.get(url).json()
    for sw in all_software:
        format_software(sw)

    # template_data_json = flask.json.dumps(all_software_dictionary, sort_keys = True, indent = 4)
    random_integer = random.randint(1, 100)
    return flask.render_template('index_template.html',
                                 template_data=all_software,
                                 data_json=flask.Markup(json.dumps(all_software)),
                                 random_integer=str(random_integer),
                                 latest_mentions=latest_mentions
                                 )


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

    software_dictionary['mentionCount'] = sum([len(software_dictionary['mentions'][key]) for key in software_dictionary['mentions']])
    software_dictionary['contributorCount'] = len(software_dictionary['contributor'])

    commits_data = flask.Markup(get_commits_data(software_id))
    return flask.render_template('software_template.html', software_id=software_id, template_data=software_dictionary,
                                 organisation_logos=organisation_logos,
                                 mention_types=mention_types, commits_data=commits_data)


def get_citation(citeas_data, format):
    def get_export(export_name):
        return [value for value in citeas_data['exports'] if value['export_name'] == export_name][0]['export']

    if format == 'apa':
        return 'text/plain', 'txt', citeas_data['citations'][0]['citation']
    if format == 'bibtex':
        return 'application/x-bibtex', 'bib', get_export('bibtex')
    if format == 'csv':
        return 'text/csv', 'csv', get_export('csv')
    if format == 'enw':
        return 'application/x-endnote-refer', 'enw', get_export('enw')
    if format == 'ris':
        return 'application/x-research-info-systems', 'ris', get_export('ris')
    raise Exception('unknown format %s' % format)

@application.route('/cite/<software_id>')
def cite(software_id):
    url = api_url + "/software/%s" % software_id
    software_dictionary = requests.get(url).json()
    if "error" in software_dictionary:
        return "not found", 404
    if not 'githubid' in software_dictionary:
        return "not found", 404

    url = 'http://api.citeas.org/product/https://github.com/%s' % software_dictionary.get('githubid')

    res = requests.get(url).json()
    try:
        mime, extension, data = get_citation(res, flask.request.args.get('format'))
    except Exception:
        return "unknown format '%s'" % flask.request.args.get('format'), 400

    return flask.Response(
        data,
        mimetype=mime,
        headers={"Content-disposition": "attachment; filename=citation.%s" % extension}
    )

@application.route('/about')
def about_template():
    return flask.render_template('about_template.html')

@application.route('/launch')
def launch_template():
    return flask.render_template('launch.html')

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
        commits_data = None
        #if 'exception' in report_dictionary:
        #    commits_data = {'error': '%s: %s' % (
        #        str(report_dictionary['exception']['class']),
        #        str(report_dictionary['exception']['error'])
        #    )}
        #else:
        #    commits_data = None
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


@application.template_filter('listNames')
def listNames(contributors):
    return [c['name'] for c in contributors]

@application.route('/favicon.ico')
def serve_favicon():
    return application.send_static_file('favicon.ico')


