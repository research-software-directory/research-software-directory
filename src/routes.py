import flask
import os
import hashlib

from flask_cors import CORS

from src.json_response import jsonify
from src.extensions import resize
from src.database import db
import src.exceptions as exceptions
import src.services.user as user
import src.services.github as github
import src.constants as constants
from src.services.report import load_reports

from src.services.util import worker


api = flask.Blueprint("api", __name__)
cors = CORS(api, resources={r"*": {"origins": "*"}})


@api.route('/all', methods=["GET"])
@jsonify
@user.require_organization('nlesc')
def _get_all_data():
    result = {}
    for resource_type in ['software', 'project', 'person', 'publication', 'organization']:
        result[resource_type] = list(db[resource_type].find())
    return result, 200


@api.route('/schema')
@jsonify
def _schema():
    # print(list(db.schema.find())[])
    from src.app import mongo
    return list(mongo.db.schema.find()), 200
    # return list(db.schema.find()), 200

@api.route('/get_access_token/<token>')
@jsonify
def _login(token):
    res = user.login(token)
    res['user'] = user.get_user(res['access_token'])
    return res, 200

@api.route('/verify_access_token/<token>')
@jsonify
def _verify_access_token(token):
    return {'user': user.get_user(token)}, 200

@api.route('/enum/<resource_type>/<field_name>', methods=["POST"])
@jsonify
@user.require_organization('nlesc')
def _post_enum(resource_type, field_name):
    value = flask.request.get_json()['value']
    if not value:
        raise exceptions.RouteException('no value provided', 401)
    try:
        return database.apiend_to_schema_enum(resource_type, field_name, value), 200
    except KeyError:
        raise exceptions.RouteException("invalid type/field", 500)

@api.route('/update', methods=["POST"])
@jsonify
@user.require_organization('nlesc')
def _post_update():
    value = flask.request.get_json()
    if not value:
        raise exceptions.RouteException('no value provided', 401)

    for resource_type in value:
        for resource in value[resource_type]:
            for (index, item) in enumerate(db[resource_type]):
                if item['id'] == resource['id']:
                    print('match')
                    db[resource_type][index] = resource

    return {'status': 'ok'}, 200

@api.route('/githubreleases', methods=["GET"])
@jsonify
def _github_releases():
    id = flask.request.args.get('id')
    if not id or id.find('/') == -1:
        raise exceptions.RouteException("'id' parameter required", 400)
    return github.releases(flask.request.headers.get('token'), id), 200

@api.route('/images', methods=["GET"])
@jsonify
def _images():
    return [filename for filename in os.listdir('data/images') if not filename == '.gitkeep'], 200

@api.route('/thumbnail/<filename>', methods=["GET"])
def _thumbnail(filename):
    filename = constants.BASE_PATH + '/data/images/' + filename
    if not os.path.isfile(filename):
        return flask.send_file(constants.BASE_PATH + '/data/image-not-found.png')
    resized_url = '../' + resize(filename, '100x100')
    return flask.send_file(resized_url)

@api.route('/image/<filename>', methods=["GET"])
def _image(filename):
    filename = constants.BASE_PATH + '/data/images/' + filename
    if not os.path.isfile(filename):
        return flask.send_file(constants.BASE_PATH + '/data/image-not-found.png')
    return flask.send_file(filename)

@api.route('/upload', methods=["POST", "PUT"])
@jsonify
@user.require_organization('nlesc')
def _upload():
    image = flask.request.files['file']
    contents = image.stream.read()
    md5 = hashlib.md5(contents).hexdigest()
    image.filename = md5 + '.' + image.filename.split(".")[-1]
    if "/" in image.filename:
        raise Exception('invalid filename')

    full_path = 'data/images/'+image.filename
    if os.path.isfile(full_path):
        raise Exception('file exists')

    with open(full_path, 'wb') as file:
        file.write(contents)

    return {'status': 'ok', 'filename': image.filename}, 200

@api.route('/generate_report/software/<software_id>', methods=["GET"])
@jsonify
def _generate_report(software_id):
    id = '/software/' + software_id
    if not database.get_resource_by_id('software', id):
        raise Exception("Resource %s not found" % id)
    worker('report', id)
    return {'status': 'ok'}, 200

@api.route('/reports/software/<software_id>', methods=["GET"])
@jsonify
def _reports(software_id):
    id = '/software/' + software_id
    reports = load_reports()
    return reports[id], 200