from dateutil import parser
from datetime import datetime
import json
import flask
import markdown
import requests
import htmlmin
import ago
import os
from flask import request

application = flask.Flask(__name__, template_folder='../templates', static_folder='../static')

api_url = os.environ.get('BACKEND_URL', 'http://localhost:5001')


@application.route('/sitemap.xml', methods=['GET'])
def sitemap():
    url = api_url + '/software?isPublished=true'
    all_software = requests.get(url).json()

    response = flask.Response(flask.render_template('sitemap.xml',
                                                    data=all_software
                                                    ))
    response.headers["Content-Type"] = "application/xml"
    return response


def serialize_software_list(swlist):
    def sw_dict(sw):
        last_update = sw.get('lastCommit', sw.get('updatedAt')) or '2015-01-01T12:00:00Z'
        return {
            'numCommits': sw.get('totalCommits'),
            'numMentions': len(sw.get('related').get('mentions')),
            'lastUpdate': last_update,
            'lastUpdateAgo': ago.human(str_to_datetime(last_update), precision=1),
            'tags': sw.get('tags'),
            'primaryKey': sw.get('primaryKey'),
            'brandName': sw.get('brandName'),
            'shortStatement': sw.get('shortStatement'),
            'isFeatured': sw.get('isFeatured'),
            'relatedOrganizations': [
                { 'foreignKey': { key: org['foreignKey'][key] for key in ['primaryKey', 'name'] } } for org in sw.get('related').get('organizations')],
            'slug': sw.get('slug'),
        }
    return json.dumps(list(map(lambda sw: sw_dict(sw), swlist)))


def get_software_mentions(software_list):
    mention_accessor = lambda s: s['related']['mentions']
    return get_mentions(software_list, mention_accessor)


def get_mentions(software_list, mention_accessor):
    if software_list is None:
        return []

    mentions = dict()
    for software in software_list:
        for mention in mention_accessor(software):
            mention_id = mention['foreignKey']['primaryKey']['id']
            mentions[mention_id] = {
                'date': (mention['foreignKey']['date']),
                'title': (mention['foreignKey']['title']),
                'url': (mention['foreignKey'].get('url'))  # url could be missing
            }

    past_mentions = remove_future_mentions(mentions)
    return sorted(past_mentions, key=lambda m: m['date'], reverse=True)


@application.route('/', methods=['GET'])
@application.route('/software/', methods=['GET'])
def index():
    url = api_url + '/software_cache?isPublished=true'
    organizations = [
        { key: org[key] for key in ['primaryKey', 'name'] } for org in requests.get(api_url + '/organization').json()
    ]
    all_software = requests.get(url).json()

    return flask.render_template('software_index/template.html',
                                 template_data=all_software,
                                 data_json=flask.Markup(serialize_software_list(all_software)),
                                 organizations=flask.Markup(json.dumps(organizations)),
                                 mentions=get_software_mentions(all_software),
                                 )


def set_markdown(software, fields):
    for field in fields:
        if field in software and software[field] and software[field] != '':
            software[field] = flask.Markup(markdown.markdown(software[field]))
        else:
            software[field] = None


@application.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = api_url + "/software_cache/%s" % software_id
    software_dictionary = requests.get(url).json()
    if "error" in software_dictionary:
        return page_not_found("Unknown software id")
    set_markdown(software_dictionary, ['statement', 'shortStatement', 'readMore'])

    return flask.render_template('software/template.html',
                                 software_id=software_id,
                                 template_data=software_dictionary,
                                 mention_types=_get_mention_types(),
                                 )


@application.route('/cite/<software_id>')
def cite(software_id):
    url = api_url + "/software_cache/%s" % software_id
    software_dictionary = requests.get(url).json()
    if "error" in software_dictionary:
        return page_not_found("Unknown software id")

    releases = software_dictionary['releases']

    for release in releases:
        if release['tag'] == flask.request.args.get('version'):
            for file_format in release['files'].keys():
                if file_format == flask.request.args.get('format'):
                    names_and_types = {
                        "bibtex": {
                            "name": "{0}.bib".format(software_id),
                            "content-type": "application/x-bibtex"
                        },
                        "cff": {
                            "name": "CITATION.cff",
                            "content-type": "text/yaml"
                        },
                        "codemeta": {
                            "name": "codemeta.json",
                            "content-type": "application/json"
                        },
                        "endnote": {
                            "name": "{0}.enw".format(software_id),
                            "content-type": "text/plain"
                        },
                        "ris": {
                            "name": "{0}.ris".format(software_id),
                            "content-type": "application/x-research-info-systems"
                        },
                    }
                    return flask.Response(
                        release['files'][file_format],
                        headers={
                            "Content-disposition": "attachment; filename={0}".format(names_and_types[file_format]["name"]),
                            "Content-Type": names_and_types[file_format]["content-type"]
                        }
                    )

    return flask.abort(404)


def project_status(start_str, end_str):
    start = str_to_datetime(start_str).replace(tzinfo=None)
    end = str_to_datetime(end_str).replace(tzinfo=None)
    today = datetime.now().replace(tzinfo=None)
    if end < today:
        return {
            'status': 'Finished',
            'progress': 1
        }
    elif start > today:
        return {
            'status': 'Starting',
            'progress': 0
        }
    else:
        return {
            'status': 'Running',
            'progress': (today - start ) / (end - start)
        }

@application.route('/projects/<project_id>')
def project_page_template(project_id):
    url = api_url + "/project_cache/%s" % project_id
    project_dictionary = requests.get(url).json()
    if "error" in project_dictionary:
        return page_not_found("Unknown project id")

    set_markdown(project_dictionary, ['description'])

    status = project_status(project_dictionary['dateStart'], project_dictionary['dateEnd'])

    return flask.render_template('project/template.html',
                                 project_id=project_id,
                                 template_data=project_dictionary,
                                 status=status,
                                 mention_types=_get_mention_types())


def get_year_from_date_string(date_string):
    return(date_string[0:4])

@application.route('/projects/')
def project_index_template():
    url = api_url + "/project_cache"
    project_data = requests.get(url).json()
    projects = []
    for project in project_data:
        status = project_status(project["dateStart"], project["dateEnd"])["status"]
        projects.append({"id": project["primaryKey"]["id"],
                         "title": project["title"],
                         "subtitle": project["subtitle"],
                         "imageUrl": project["imageUrl"],
                         "yearStart": get_year_from_date_string(project["dateStart"]),
                         "yearEnd": get_year_from_date_string(project["dateEnd"]),
                         "status": status,
                         "lastUpdateAgo": ago.human(str_to_datetime(project["updatedAt"]), precision=1),
                         })
    mentions = get_project_mentions(project_data)
    status_choices = ['Starting','Running', 'Finished']

    return flask.render_template('project_index/template.html',
                                 data_json=flask.Markup(json.dumps(projects)),
                                 projects=projects,
                                 status_choices_json=flask.Markup(json.dumps(status_choices)),
                                 mentions=mentions)


def get_project_mentions(projects):
    mention_accessor = lambda o:  o['impact'] + o['output']
    return get_mentions(projects, mention_accessor)


def remove_future_mentions(mentions):
    now = datetime.strftime(datetime.utcnow(), '%Y-%m-%dT%H:%M:%SZ')
    past_mentions = [mention for mention in mentions.values() if mention['date'] < now]
    return past_mentions


@application.route('/about')
def about_template():
    return htmlmin.minify(flask.render_template('about/template.html'))


@application.errorhandler(404)
def page_not_found(e):
    return flask.render_template('404/template.html',e=e,url=request.path)


def str_to_datetime(input_string):
    return parser.parse(input_string)


@application.template_filter()
def brand_code_filter(input_string):
    return input_string[:2].capitalize()


@application.template_filter()
def date_time_filter(input_string):
    output_format = "%Y-%m-%d %H:%M:%S"
    return str_to_datetime(input_string).strftime(output_format)


@application.template_filter()
def date_filter(input_string):
    output_format = "%Y-%m-%d"
    return str_to_datetime(input_string).strftime(output_format)


@application.template_filter()
def human_date_filter(input_string):
    output_format = "%B %d, %Y"
    return str_to_datetime(input_string).strftime(output_format)


@application.template_filter()
def human_date_month_filter(input_string):
    output_format = "%B %Y"
    return str_to_datetime(input_string).strftime(output_format)


@application.template_filter()
def human_name_filter(person):
    name = person.get('givenNames') or ''
    if 'nameParticle' in person and person['nameParticle']:
        name += ' ' + person.get('nameParticle', '')
    return name + ' ' + person.get('familyNames', '')


@application.template_filter()
def list_names_filter(contributors):
    return [c['name'] for c in contributors]


@application.template_filter()
def markdown_filter(input_string):
    if not input_string:
        return ''
    return flask.Markup(markdown.markdown(input_string))


@application.template_filter()
def releases_filter(releases):
    return [{
        'doi': release['doi'],
        'tag': release['tag'],
        'citability': release['citability']
    } for release in releases]

@application.template_filter()
def no_none_filter(l):
    return list(filter(lambda x: x is not None, l))

@application.route('/favicon.ico')
def serve_favicon():
    return application.send_static_file('favicon.ico')


@application.route('/robots.txt')
def serve_robots():
    return application.send_static_file('robots.txt')

@application.route('/oai-pmh')
def oai_pmh():

    supported_verbs = ["ListRecords", "GetRecord"]
    verb = flask.request.args.get('verb')
    if not verb in supported_verbs:
        response = flask.make_response("OAI-PMH verb should be one of [" +
                   ", ".join(supported_verbs) + "]; other verbs are not " +
                   "supported at the moment.")
        return response

    supported_metadata_prefixes = ["datacite4"]
    metadata_prefix = flask.request.args.get('metadataPrefix')
    if not metadata_prefix in supported_metadata_prefixes:
        response = flask.make_response("'metadataPrefix' should be one of [" +
                   ", ".join(supported_metadata_prefixes) + "]; other verbs " +
                   "are not supported at the moment.")
        return response

    oaipmh_cache_dir = os.path.join('/', 'static', 'oaipmh-cache')

    if verb=='ListRecords':
        d = os.path.join(oaipmh_cache_dir,'datacite4')
        f = 'listrecords.xml'
        return flask.send_from_directory(d, f, as_attachment=False)
    elif verb=='GetRecord':
        identifier = flask.request.args.get('identifier')
        if identifier is None:
            response = flask.make_response("You need to specify an identifier.")
            return response
        if not identifier[:15]=="oai:zenodo.org:":
            response = flask.make_response("'oai:zenodo.org:<record_number>' is the only supported identifier format at the moment.")
            return response
        d = os.path.join(oaipmh_cache_dir,'datacite4')
        f = 'record-' + identifier.split(':')[-1] + '.xml'
        return flask.send_from_directory(d, f, as_attachment=False)

def _get_mention_types():
    return {
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
