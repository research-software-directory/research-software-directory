import hashlib
import os

import flask
from flask_cors import CORS

import src.exceptions as exceptions
import src.services.github as github
import src.services.user as user
from src.extensions import resize
from src.json_response import jsonify
from src.services.database import db
from src.services.publication import get_mapping
from src.services.schema import schema
from src.services.util import worker
from src.services.zotero import zotero_sync
# from src.services.report import load_reports
from src.settings import settings


def collection_to_object(collection):
    result = {}
    for resource in collection:
        result[resource['_id']] = resource
    return result


api = flask.Blueprint("api", __name__)
cors = CORS(api, resources={r"*": {"origins": "*"}})


@api.route('/all', methods=["GET"])
@jsonify
# @user.require_organization('nlesc')
def _get_all_data():
    result = {}
    for resource_type in ['software', 'project', 'person', 'publication', 'organization']:
        result[resource_type] = list(db[resource_type].find())
    return result, 200


@api.route('/schema')
@jsonify
def _schema():
    return schema, 200


@api.route('/github_auth')
def _github_auth():
    return flask.redirect('https://github.com/login/oauth/authorize/?client_id=%s' % settings['GITHUB_CLIENT_ID'])

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

# @api.route('/enum/<resource_type>/<field_name>', methods=["POST"])
# @jsonify
# @user.require_organization('nlesc')
# def _post_enum(resource_type, field_name):
#     value = flask.request.get_json()['value']
#     if not value:
#         raise exceptions.RouteException('no value provided', 401)
#     try:
#         return database.apiend_to_schema_enum(resource_type, field_name, value), 200
#     except KeyError:
#         raise exceptions.RouteException("invalid type/field", 500)


@api.route('/update', methods=["POST"])
@jsonify
@user.require_organization('nlesc')
def _post_update():
    value = flask.request.get_json()
    if not value:
        raise exceptions.RouteException('no value provided', 401)

    for resource_type in value:
        for resource in value[resource_type]:
            db[resource_type].update({'_id': resource['id'], 'id': resource['id']}, resource, upsert=True)

    return {'status': 'ok'}, 200


@api.route('/githubreleases', methods=["GET"])
@jsonify
def _github_releases():
    id = flask.request.args.get('id')
    if not id or id.find('/') == -1:
        raise exceptions.RouteException("'id' parameter required", 400)
    return github.releases(flask.request.headers.get('token'), id), 200

@api.route('/githubdescription', methods=["GET"])
@jsonify
def _github_description():
    id = flask.request.args.get('id')
    if not id or id.find('/') == -1:
        raise exceptions.RouteException("'id' parameter required", 400)
    return github.description(flask.request.headers.get('token'), id), 200


@api.route('/images', methods=["GET"])
@jsonify
def _images():
    return [filename for filename in os.listdir(settings['DATA_FOLDER']+'/images') if not filename == '.gitkeep'], 200


@api.route('/thumbnail/<filename>', methods=["GET"])
def _thumbnail(filename):
    filename = settings['DATA_FOLDER']+'/images/' + filename
    if not os.path.isfile(filename):
        return flask.send_file('data/image-not-found.png')
    resized_url = resize(filename, '100x100')
    return flask.send_file(resized_url)


@api.route('/image/<filename>', methods=["GET"])
def _image(filename):
    filename = settings['DATA_FOLDER']+'/images/' + filename
    if not os.path.isfile(filename):
        return flask.send_file('data/image-not-found.png')
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

    full_path = settings['DATA_FOLDER']+'/images/'+image.filename
    if os.path.isfile(full_path):
        raise Exception('file exists')

    with open(full_path, 'wb') as file:
        file.write(contents)

    return {'status': 'ok', 'filename': image.filename}, 200


@api.route('/software/<software_id>/generate_report', methods=["POST"])
@jsonify
def _generate_report(software_id):
    id = '/software/' + software_id
    if not db.software.find_one({'id': id}):
        raise Exception("Resource %s not found" % id)
    worker('impact_report', id)
    return {'status': 'ok'}, 200


@api.route('/software/<software_id>/reports', methods=["GET"])
@jsonify
def _reports(software_id):
    id = '/software/' + software_id
    reports = list(db.impact_report.find({'software_id': id}))
    return reports, 200


@api.route('/zotero_sync', methods=["GET"])
@jsonify
def _zoterotest():
    zotero_sync()
    return {'status': 'ok'}, 200


@api.route('/author_mapping/publication/<id>', methods=["GET"])
@jsonify
def _author_mapping(id):
    id = '/publication/'+id
    return get_mapping(id), 200


@api.route('/save_author_mapping', methods=["POST"])
@jsonify
def _save_mapping():
    value = flask.request.get_json()

    value.update({'_id': value['id'], 'type': 'saved'})
    db.publication_creator_person_map.update({'_id': value['_id']}, value, upsert=True)

    return value, 200


@api.route('/new_projects', methods=['GET'])
@jsonify
def _new_projects():
    from src.services.zotero import new_projects
    return new_projects(), 200


@api.route('/new_publications', methods=['GET'])
@jsonify
def _new_publications():
    from src.services.zotero import new_publications
    publications, software = new_publications()
    return publications, 200


@api.route('/new_software', methods=['GET'])
@jsonify
def _new_software():
    from src.services.zotero import new_publications
    publications, software = new_publications()
    return software, 200




@api.route('/project/<id>', methods=['GET'])
@jsonify
def _project(id):
    project = db.project.find_one({'id': id})
    if project:
        return project, 200
    else:
        raise exceptions.NotFoundException('project not found')
