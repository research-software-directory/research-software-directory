from flask import abort, request
from flask_cors import CORS, cross_origin
from json_handlers import json_response, init as json_handlers_init
from database import sync_db, sync_schema
from settings import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
import requests

import json

def init(app, db, schema):
    cors = CORS(app, resource={r"*": {"origins": "*"}})
    json_handlers_init(app)

    @app.route('/all', methods=["GET"])
    #@cross_origin(origins=['localhost:*','127.0.0.1','::1'])
    @cross_origin(origins=r'.*localhost.*')
    def _get_all_data():
        return json_response(db)

    @app.route('/schema')
    @cross_origin(origins=r'.*localhost.*')
    def _schema():
        return json_response(schema)

    @app.route('/syncdb')
    def _sync():
        sync_db()
        return json_response({'ok':'ok'})

    @app.route('/clear')
    def _clear():
        db['software'] = "leeg"
        return json_response(id(db))

    @app.route('/error')
    def _err():
        return json_response(db)

    @app.route('/login/<token>')
    def _login(token):
        url = 'https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s&accept=json' %\
            (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, token)
        req = requests.get(url)
        import urllib.parse
        query = urllib.parse.parse_qsl(req.text)
        return json_response({'trying': token, 'url':url, 'result':query})


    @app.route('/enum/<resource_type>/<field>', methods=["GET"])
    def _get_enum(resource_type, field):
        try:
            field = schema[resource_type]['properties'][field]
            if field['type'] == 'array':
                return json_response(field['items']['enum'])
            elif field['type'] == 'string':
                return json_response(field['enum'])
        except KeyError:
            return json_response({"error": "invalid type/field"}, 500)

    @app.route('/enum/<resource_type>/<field>', methods=["POST"])
    # @cross_origin(origins='*')
    def _post_enum(resource_type, field):
        value = request.get_json()['value']
        if not value:
            raise Exception('no value provided')
        try:
            field = schema[resource_type]['properties'][field]
            if field['type'] == 'array':
                enum = field['items']['enum']
            elif field['type'] == 'string':
                enum = field['enum']
            enum.append(value)
            enum.sort()
            sync_schema()
            return json_response(enum)
        except KeyError:
            return json_response({"error": "invalid type/field"}, 500)
