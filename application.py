import flask
import requests
import markdown
import random
import datetime

app = flask.Flask(__name__)

#def json_dumps(json_object):
#    json_dump = flask.json.dumps(json_object,
#                                 sort_keys = True,
#                                 indent = 4,
#                                 seperators = (',', ': '))
#    return json_dump
#app.jinja_env.filters['dump_json'] = json_dumps

@app.route('/', methods = ['GET', 'POST'])
def index():
    url = "http://admin.research-software.nl/api/software"
    all_software_dictionary = requests.get(url).json()
    template_data_json = flask.json.dumps(all_software_dictionary, sort_keys = True, indent = 4)
    random_integer = random.randint(1,100)
    return flask.render_template('index_template.html', template_data = all_software_dictionary,
                                                        template_data_json = template_data_json,
                                                        random_integer = str(random_integer))

@app.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = "http://admin.research-software.nl/api/software/%s" % software_id
    software_dictionary = requests.get(url).json()
    description = software_dictionary.get("description")
    descriptionMarkup = flask.Markup(markdown.markdown(description))
    return flask.render_template('software_template.html', template_data = software_dictionary, descriptionMarkup = descriptionMarkup)

@app.route('/dynamic/data.js')
def get_data():
    url = "http://admin.research-software.nl/api/software"
    all_software_dictionary = requests.get(url).json()
    template_data_json = flask.json.dumps(all_software_dictionary, sort_keys = True, indent = 4)
    return "var ALL_DATA = "+template_data_json

@app.template_filter('strftime')
def strftime(millis):
    format = "%Y-%m-%d %H:%M:%S"
    result = datetime.datetime.fromtimestamp(millis / 1e3).strftime(format)
    return result

if __name__ == '__main__':
    app.run(debug=True)
