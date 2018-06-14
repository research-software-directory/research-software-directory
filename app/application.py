from dateutil import parser
import json
import flask
import markdown
import requests
import htmlmin
import ago
import os

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
            'lastUpdate': last_update,
            'lastUpdateAgo': ago.human(str_to_datetime(last_update), precision=1),
            'tags': sw.get('tags'),
            'primaryKey': sw.get('primaryKey'),
            'brandName': sw.get('brandName'),
            'shortStatement': sw.get('shortStatement'),
            'isFeatured': sw.get('isFeatured'),
            'relatedOrganizations': sw.get('related').get('organizations'),
        }
    return json.dumps(list(map(lambda sw: sw_dict(sw), swlist)))


def get_mentions(software_list):
    nested_mentions = list(map(lambda sw: sw['related'].get('mentions', []), software_list))
    mentions = [item['foreignKey'] for sublist in nested_mentions for item in sublist]
    unique_mentions = []
    for mention in mentions:
        if True not in [m['primaryKey']['id'] == mention['primaryKey']['id'] for m in unique_mentions]:
            unique_mentions.append(mention)
    return sorted(unique_mentions, key=lambda m: m['date'], reverse=True)


@application.route('/', methods=['GET'])
def index():
    url = api_url + '/software_cache?isPublished=true'
    organizations = requests.get(api_url + '/organization').json()
    all_software = requests.get(url).json()

    return flask.render_template('index_template.html',
                                 template_data=all_software,
                                 data_json=flask.Markup(serialize_software_list(all_software)),
                                 organizations=flask.Markup(json.dumps(organizations)),
                                 mentions=get_mentions(all_software),
                                 )


def set_markdown(software, fields):
    for field in fields:
        if field in software and software[field] and software[field] is not '':
            software[field] = flask.Markup(markdown.markdown(software[field]))
        else:
            software[field] = None


@application.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = api_url + "/software_cache/%s" % software_id
    software_dictionary = requests.get(url).json()
    if "error" in software_dictionary:
        return flask.redirect("/", code=302)
    set_markdown(software_dictionary, ['statement', 'shortStatement', 'readMore'])

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

    return flask.render_template('software/software_template.html',
                                 software_id=software_id,
                                 template_data=software_dictionary,
                                 mention_types=mention_types,
                                 )


@application.route('/cite/<software_id>')
def cite(software_id):
    url = api_url + "/software_cache/%s" % software_id
    software_dictionary = requests.get(url).json()
    if "error" in software_dictionary:
        return flask.redirect("/", code=302)

    releases = software_dictionary['releases']

    for release in releases:
        if release['tag'] == flask.request.args.get('version'):
            for file_format in release['files'].keys():
                if file_format == flask.request.args.get('format'):
                    return flask.Response(
                        release['files'][file_format],
                        headers={"Content-disposition": "attachment; filename=%s.%s" % (software_id, file_format)}
                    )

    return flask.abort(404)


@application.route('/about')
def about_template():
    return htmlmin.minify(flask.render_template('about_template.html'))


@application.errorhandler(404)
def page_not_found(e):
    return flask.redirect("/", code=302)


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
