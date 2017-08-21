import flask
import flask_resize
import os
import hashlib

from flask_cors import CORS


from src.json_response import jsonify

import src.exceptions as exceptions
import src.database as database
import src.services.user as user
import src.services.github as github
import src.constants as constants


def init(app, db, schema):
    resize = flask_resize.Resize(app)
    cors = CORS(app, resources={r"*": {"origins": "*"}})

    @app.route('/all', methods=["GET"])
    @jsonify
    @user.require_organization('nlesc')
    def _get_all_data():
        return db, 200

    @app.route('/schema')
    @jsonify
    def _schema():
        return schema, 200

    @app.route('/get_access_token/<token>')
    @jsonify
    def _login(token):
        res = user.login(token)
        res['user'] = user.get_user(res['access_token'])
        return res, 200

    @app.route('/verify_access_token/<token>')
    @jsonify
    def _verify_access_token(token):
        return {'user': user.get_user(token)}, 200

    @app.route('/enum/<resource_type>/<field_name>', methods=["POST"])
    @jsonify
    @user.require_organization('nlesc')
    def _post_enum(resource_type, field_name):
        value = flask.request.get_json()['value']
        if not value:
            raise exceptions.RouteException('no value provided', 401)
        try:
            return database.append_to_schema_enum(resource_type, field_name, value), 200
        except KeyError:
            raise exceptions.RouteException("invalid type/field", 500)

    @app.route('/update', methods=["POST"])
    @jsonify
    @user.require_organization('nlesc')
    def _post_update():
        value = flask.request.get_json()
        if not value:
            raise exceptions.RouteException('no value provided', 401)
        raise Exception('cant save (not yet implemented)')

    @app.route('/githubreleases', methods=["GET"])
    @jsonify
    def _github_releases():
        id = flask.request.args.get('id')
        if not id or id.find('/') == -1:
            raise exceptions.RouteException("'id' parameter required", 400)
        return github.releases(flask.request.headers.get('token'), id), 200

    @app.route('/images', methods=["GET"])
    @jsonify
    def _images():
        return [filename for filename in os.listdir('data/images') if not filename == '.gitkeep'], 200

    @app.route('/thumbnail/<filename>', methods=["GET"])
    def _thumbnail(filename):
        filename = constants.BASE_PATH + '/data/images/' + filename
        if not os.path.isfile(filename):
            return flask.send_file(constants.BASE_PATH + '/data/image-not-found.png')
        resized_url = '../' + resize(filename, '100x100')
        return flask.send_file(resized_url)

    @app.route('/image/<filename>', methods=["GET"])
    def _image(filename):
        filename = constants.BASE_PATH + '/data/images/' + filename
        if not os.path.isfile(filename):
            return flask.send_file(constants.BASE_PATH + '/data/image-not-found.png')
        return flask.send_file(filename)

    @app.route('/upload', methods=["POST", "PUT"])
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
