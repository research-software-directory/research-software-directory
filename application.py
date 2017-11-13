import flask
import requests
import markdown

app = flask.Flask(__name__)

@app.route('/', methods = ['GET', 'POST'])
def index():
    url = "http://admin.research-software.nl/api/software"
    all_software_dictionary = requests.get(url).json()
    id_list = [software_data["id"] for software_data in all_software_dictionary]
    return flask.render_template('index_template.html', template_data = id_list)

@app.route('/software/<software_id>')
def software_product_page_template(software_id):
    url = "http://admin.research-software.nl/api/software/%s" % software_id
    software_dictionary = requests.get(url).json()
    description = software_dictionary.get("description")
    descriptionMarkup = flask.Markup(markdown.markdown(description))
    return flask.render_template('software_template.html', template_data = software_dictionary, descriptionMarkup = descriptionMarkup)

if __name__ == '__main__':
    app.run(debug=True)
