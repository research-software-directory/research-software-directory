from flask import abort
from flask_cors import CORS, cross_origin
from json_handlers import json_response, init as json_handlers_init
from database import sync

def init(app, db, schema):
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

    @app.route('/sync')
    def _sync():
        sync(db)
        return json_response({'ok':'ok'})

    @app.route('/clear')
    def _clear():
        db['software'] = "leeg"
        return json_response(id(db))

    @app.route('/error')
    def _err():
        return json_response(db)

