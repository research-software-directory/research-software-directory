import flask
import requests
import markdown
import datetime

app = flask.Flask(__name__)

@app.route('/', methods = ['GET', 'POST'])
def index():
    url = "http://admin.research-software.nl/api/software"
    all_software_dictionary = requests.get(url).json()
    return flask.render_template('index_template.html', template_data = all_software_dictionary)

@app.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = "http://admin.research-software.nl/api/software/%s" % software_id
    software_dictionary = requests.get(url).json()
    description = software_dictionary.get("description")
    descriptionMarkup = flask.Markup(markdown.markdown(description))
    return flask.render_template('software_template.html', template_data = software_dictionary, descriptionMarkup = descriptionMarkup)

@app.template_filter('strftime')
def strftime(millis):
    format = "%Y-%m-%d %H:%M:%S"
    result = datetime.datetime.fromtimestamp(millis / 1e3).strftime(format)
    return result

if __name__ == '__main__':
    app.run(debug=True)
