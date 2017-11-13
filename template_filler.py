import json
from flask import Flask
import requests
import jsonify
# read in dictionary with everything : http://admin.research-software.nl/api/all

app = Flask(__name__)

DATA = json.loads(requests.get("http://admin.research-software.nl/api/all"))

@app.route('/', methods = ['GET', 'POST'])

def index():
    # run template

    return DATA

def display_all_data():
    return jsonify(DATA)

if __name__ == '__main__':
    app.run(debug=True)


