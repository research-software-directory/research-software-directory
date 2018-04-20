from dateutil import parser
import json
import flask
import markdown
import requests
import htmlmin
import ago
import os

from app.citation import get_citation

application = flask.Flask(__name__, template_folder='../templates', static_folder='../static')

api_url = os.environ.get('BACKEND_URL', 'http://localhost:5001')


@application.route('/sitemap.xml', methods=['GET'])
def sitemap():
    url = api_url + '/software?published=true'
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


@application.route('/', methods=['GET'])
def index():
    url = api_url + '/software_cache?isPublished=true'
    latest_mentions = requests.get(api_url + '/mention?sort=date&direction=desc&limit=5').json()
    organizations = requests.get(api_url + '/organization').json()
    all_software = requests.get(url).json()
    blog_posts = requests.get(api_url + '/mention?isCorporateBlog=true&sort=date&direction=desc&limit=4').json()

    return flask.render_template('index_template.html',
                                 template_data=all_software,
                                 data_json=flask.Markup(serialize_software_list(all_software)),
                                 organizations=flask.Markup(json.dumps(organizations)),
                                 latest_mentions=latest_mentions,
                                 blog_posts=blog_posts
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

    organisation_logos = {"astron": "astron.gif", "cbs-knaw": "cbs-knaw.png", "commit": "commit.png", "cwi": "cwi.png",
                          "dans": "dans.jpg", "deltares": "deltares.jpe", "dtl": "dtl.png", "fugro": "fugro.png",
                          "geodan": "geodan.gif", "huygens": "huygens.png", "icl": "icl.jpg", "ign": "ign.jpg",
                          "jhu": "jhu.png", "knir": "knir.png", "knmi": "knmi.png",
                          "leiden-university": "leiden-university.png", "lumc": "lumc.png", "meertens": "meertens.png",
                          "monetdb": "monetdb.png", "nfi": "nfi.gif", "nikhef": "nikhef.jpg", "nlesc": "nlesc.png",
                          "ntu": "ntu.gif", "oracle": "oracle.png", "potree": "potree.png",
                          "radboud.university.nijmegen": "radboud.university.nijmegen.png",
                          "rijkswaterstaat": "rijkswaterstaat.png", "spinlab": "spinlab.jpg",
                          "surfsara": "surfsara.png", "tno": "tno.jpg", "tudelft": "tu-delft.png",
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

    # software_dictionary['mentionCount'] = sum([len(software_dictionary['mentions'][key]) for key in software_dictionary['mentions']])
    # software_dictionary['contributorCount'] = len(software_dictionary['contributor'])

    # if len(software_dictionary['contributingOrganization']) == 1 and software_dictionary['contributingOrganization'][0]['id'] == 'nlesc':
    #     software_dictionary['contributingOrganization'] = []

    # commits_data = get_commits_data(software_id)
    # if commits_data and 'last' in commits_data:
    #     commits_data['last'] = dateparser.parse(commits_data['last']).strftime("%B %d, %Y")
    # commits_data = flask.Markup(commits_data)

    return flask.render_template('software/software_template.html',
                                 software_id=software_id,
                                 template_data=software_dictionary,
                                 organisation_logos=organisation_logos,
                                 mention_types=mention_types,
                                 )


@application.route('/cite/<software_id>')
def cite(software_id):
    url = api_url + "/software_cache/%s" % software_id
    software_dictionary = requests.get(url).json()

    if "error" in software_dictionary:
        return "not found", 404
    if 'conceptDOI' not in software_dictionary:
        return "not found", 404

    citation_cff_urls = list(map(
        lambda github_url: github_url['url'],
        filter(lambda x: x['isCitationcffSource'], software_dictionary['githubURLs'])
    ))

    try:
        mime, extension, data = get_citation(citation_cff_urls[0], flask.request.args.get('format'))
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
    name = person['givenNames']
    if person['nameParticle']:
        name += ' ' + person['nameParticle']
    return name + ' ' + person['familyNames']


@application.template_filter()
def list_names_filter(contributors):
    return [c['name'] for c in contributors]


@application.template_filter()
def markdown_filter(input_string):
    if not input_string:
        return ''
    return flask.Markup(markdown.markdown(input_string))


@application.template_filter()
def no_none_filter(l):
    return list(filter(lambda x: x is not None, l))


@application.route('/favicon.ico')
def serve_favicon():
    return application.send_static_file('favicon.ico')


@application.route('/robots.txt')
def serve_robots():
    return application.send_static_file('robots.txt')
