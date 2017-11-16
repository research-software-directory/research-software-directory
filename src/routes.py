import hashlib
import os
from random import randint
import time

import flask
from flask_cors import CORS

import src.exceptions as exceptions
from src.extensions import resize
from src.helpers.util import worker
from src.json_response import jsonify
# from src.services.report import load_reports
from src.settings import settings

def unpack_person(entry, db):
    if isinstance(entry, str):
        person = db['person'].find_by_id(entry)
        return {
            'id': person.data.get('id'),
            'name': person.data.get('name'),
            'website': person.data.get('website'),
            'email': person.data.get('email')
        }
    else:
        return entry

def unpack_organization(entry, db):
    if isinstance(entry, str):
        organization = db['organization'].find_by_id(entry)
        return {
            'id': organization.data.get('id'),
            'name': organization.data.get('name'),
            'website': organization.data.get('website'),
            'logo': organization.data.get('logo')
        }
    else:
        return entry


def get_routes(service_controller, db):
    user = service_controller.user

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
            result[resource_type] = list(db[resource_type].all())
        return result, 200

    @api.route('/software', methods=["GET"])
    @jsonify
    def _get_software():
        resources = list(db['software'].all())
        result = [{
            'id': software.data.get('id'),
            'name': software.data.get('name'),
            'tagLine': software.data.get('tagLine'),
            'discipline': software.data.get('discipline'),
            'expertise': software.data.get('expertise'),
            'tags': software.data.get('tags'),
            'mentions': randint(0, 50),
            'commits': randint(0, 3000),
            'lastUpdate': int(time.time()) - randint(0, 3600*24*365),
            'highlighted': software.data.get('highlighted') or False,
            'published': software.data.get('published') or False
        } for software in resources]
        return result, 200

    @api.route('/software/<id>/report', methods=["GET"])
    @jsonify
    def _get_report(id):
        reports = list(db.impact_report.find({'software_id': id}))
        if not reports:
            raise exceptions.NotFoundException('resource not found')
        return reports[0], 200

    @api.route('/<resource_type>/<id>', methods=["GET"])
    @jsonify
    def _get_resource(resource_type, id):
        resource = db[resource_type].find_by_id(id)
        if not resource:
            raise exceptions.NotFoundException('resource not found')
        if resource_type == 'software':
            for idx, contributor in enumerate(resource['contributor']):
                resource.data['contributor'][idx] = unpack_person(contributor, db)
            resource.data['contactPerson'] = unpack_person(resource.data['contactPerson'], db)
            for idx, organization in enumerate(resource['contributingOrganization']):
                resource.data['contributingOrganization'][idx] = unpack_organization(organization, db)
            resource.data['mentions'] = {}
            if 'zoteroKey' in resource.data:
                def has_relation(key, publication):
                    if 'dc:relation' in publication['data']['relations']:
                        relations = publication['data']['relations']['dc:relation']
                        if isinstance(relations, str):
                            relations = [relations]
                        for relation in relations:
                            if relation[-8::] == key:
                                return True
                    return False
                all_publications = list(db['zotero_publication'].all())
                related = filter(lambda x: has_relation(resource.data['zoteroKey'], x), all_publications)
                for item in related:
                    if not item['data']['itemType'] in resource.data['mentions']:
                        resource.data['mentions'][item['data']['itemType']] = []
                    resource.data['mentions'][item['data']['itemType']].append(item)

        return resource.data, 200

    @api.route('/schema')
    @jsonify
    def _schema():
        return service_controller.schema.schema, 200

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

    @api.route('/update', methods=["POST"])
    @jsonify
    # @user.require_organization('nlesc')
    def _post_update():
        value = flask.request.get_json()
        if not value:
            raise exceptions.RouteException('no value provided', 401)

        for resource_type in value:
            for resource_data in value[resource_type]:
                record = db[resource_type].find_by_id(resource_data['id'])
                if not record:
                    record = db[resource_type].new(resource_data)
                else:
                    record.data.update(resource_data)
                record.save()
                # db[resource_type].update({'_id': resource['id'], 'id': resource['id']}, resource, upsert=True)

        return {'status': 'ok'}, 200

    @api.route('/githubreleases', methods=["GET"])
    @jsonify
    def _github_releases():
        id = flask.request.args.get('id')
        if not id or id.find('/') == -1:
            raise exceptions.RouteException("'id' parameter required", 400)
        # return service_controller.github.releases(flask.request.headers.get('token'), id), 200
        return service_controller.github.releases(id), 200

    @api.route('/githubdescription', methods=["GET"])
    @jsonify
    def _github_description():
        id = flask.request.args.get('id')
        if not id or id.find('/') == -1:
            raise exceptions.RouteException("'id' parameter required", 400)
        return service_controller.github.description(id), 200

    @api.route('/images', methods=["GET"])
    @jsonify
    def _images():
        return [filename for
                filename in os.listdir(settings['DATA_FOLDER']+'/images') if not filename == '.gitkeep'], 200

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
        if not db.software.find_by_id(software_id):
            raise Exception("Resource %s not found" % software_id)
        worker('impact_report', software_id)
        return {'status': 'ok'}, 200

    @api.route('/software/<software_id>/reports', methods=["GET"])
    @jsonify
    def _reports(software_id):
        reports = list(db.impact_report.find({'software_id': software_id}))
        return reports, 200

    @api.route('/new_projects', methods=['GET'])
    @jsonify
    def _new_projects():
        return service_controller.zotero.new_projects(), 200

    @api.route('/new_publications', methods=['GET'])
    @jsonify
    def _new_publications():
        publications, software = service_controller.zotero.new_publications()
        return publications, 200

    @api.route('/new_software', methods=['GET'])
    @jsonify
    def _new_software():
        publications, software = service_controller.zotero.new_publications()
        return software, 200

    @api.route('/project/<id>', methods=['GET'])
    @jsonify
    def _project(id):
        project = db.project.find_one({'id': id})
        if project:
            return project, 200
        else:
            raise exceptions.NotFoundException('project not found')

    return api
