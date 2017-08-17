from flask import request
from flask_cors import CORS
from .json_handlers import json_response, init as json_handlers_init

from .database import sync_db, sync_schema
from .services.user import login, get_user


def init(app, db, schema):
    cors = CORS(app, resources={r"*": {"origins": "*"}})
    json_handlers_init(app)

    @app.route('/all', methods=["GET"])
    #@cross_origin(origins=['localhost:*','127.0.0.1','::1'])
    # @cross_origin(origins=r'.*localhost.*')
    def _get_all_data():
        return json_response(db)

    @app.route('/schema')
    # @cross_origin(origins=r'.*localhost.*')
    def _schema():
        return json_response(schema)

    # @app.route('/syncdb')
    # def _sync():
    #     sync_db()
    #     return json_response({'ok':'ok'})
    #
    # @app.route('/clear')
    # def _clear():
    #     db['software'] = "leeg"
    #     return json_response(id(db))

    # @app.route('/error')
    # def _err():
    #     return json_response(db)

    @app.route('/get_access_token/<token>')
    def _login(token):
        res = login(token)
        if 'error' in res:
            return json_response({'error': '%s: %s' % (res['error'], res['error_description'])}, 401)
        res['user'] = get_user(res['access_token'])
        return json_response(res)

    @app.route('/verify_access_token/<token>')
    def _verify_access_token(token):
        res = get_user(token)
        if 'error' in res:
            return json_response({'error': 'code %i: %s' % (res['status_code'], res['error'])}, 401)
        return json_response({'user': res})

    # @app.route('/enum/<resource_type>/<field>', methods=["GET"])
    # def _get_enum(resource_type, field):
    #     try:
    #         field = schema[resource_type]['properties'][field]
    #         if field['type'] == 'array':
    #             return json_response(field['items']['enum'])
    #         elif field['type'] == 'string':
    #             return json_response(field['enum'])
    #     except KeyError:
    #         return json_response({"error": "invalid type/field"}, 500)

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

    @app.route('/update', methods=["POST"])
    # @cross_origin(origins='*')
    def _post_update():
        value = request.get_json()
        if not value:
            raise Exception('no value provided')
        raise Exception('cant save (not yet implemented)')

    @app.route('/githubreleases', methods=["GET"])
    def _github_releases():
        id = request.args.get('id')
        if not id or id.find('/') == -1:
            return json_response({"error": "'id' parameter required"}, 400)
        from .services.user import releases
        rels = releases(request.headers.get('token'), id)
        if 'error' in rels:
            return json_response(rels, 500)
        return json_response(rels)

    @app.route('/images', methods=["GET"])
    def _images():
        import os
        return json_response([filename for filename in os.listdir('data/images') if not filename == '.gitkeep'])

    @app.route('/thumbnail/<filename>', methods=["GET"])
    def _thumbnail(filename):
        from .app import resize
        import os
        from flask import send_file
        base_path = os.path.dirname(os.path.abspath(__file__)) + '/..'
        filename = base_path + '/data/images/' + filename
        print(filename)
        if not os.path.isfile(filename):
            return send_file(base_path + '/data/image-not-found.png')
        resized_url = '../' + resize(filename, '100x100')
        return send_file(resized_url)

    @app.route('/image/<filename>', methods=["GET"])
    def _image(filename):
        import os
        from flask import send_file
        base_path = os.path.dirname(os.path.abspath(__file__)) + '/..'
        filename = base_path + '/data/images/' + filename
        print(filename)
        if not os.path.isfile(filename):
            return send_file(base_path + '/data/image-not-found.png')
        return send_file(filename)

    @app.route('/upload', methods=["POST", "PUT"])
    def _upload():
        import hashlib
        import os
        image = request.files['file']
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

        return json_response({'status': 'ok', 'filename': image.filename})
