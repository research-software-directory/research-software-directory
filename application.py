import json
import flask
import requests

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
    return flask.render_template('software_template.html', template_data = software_dictionary)

if __name__ == '__main__':
    app.run(debug=True)
