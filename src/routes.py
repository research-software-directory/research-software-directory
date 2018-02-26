import flask
from flask_cors import CORS

import src.exceptions as exceptions
from src.json_response import jsonify
from src.permission import require_permission
from src.settings import settings

from src.transformers import software as t_software
from src.transformers.software import list_entry


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
    @user.require_organization('nlesc')
    def _get_all_data():
        result = {}
        for resource_type in ['software', 'project', 'person', 'publication', 'organization']:
            result[resource_type] = list(db[resource_type].all())
        return result, 200

    @api.route('/organizations', methods=["GET"])
    @jsonify
    def _get_organizations():
        resources = list(db['organization'].all())
        # result = [list_entry(software) for software in resources]
        return resources, 200

    @api.route('/software', methods=["GET"])
    @jsonify
    def _get_software():
        if flask.request.args.get('published'):
            resources = list(db['software'].find({'published': True }))
        else:
            resources = list(db['software'].all())
        result = [list_entry(software, db) for software in resources]
        return result, 200

    @api.route('/latest_mentions', methods=["GET"])
    @jsonify
    def _get_latest_mentions():
        result = list(db['zotero_publication'].find({'data.relations': {'$ne': {}}}).sort("data.dateAdded", -1).limit(3))
        return result, 200

    @api.route('/<resource_type>/<id>', methods=["GET"])
    @jsonify
    def _get_resource(resource_type, id):
        resource = db[resource_type].find_by_id(id)
        if not resource:
            raise exceptions.NotFoundException('resource not found')
        if resource_type == 'software':
            t_software.transform(resource, db)

        return resource.data, 200

    @api.route('/schema')
    @jsonify
    def _schema():
        return service_controller.schema.schema, 200

    @api.route('/github_auth')
    def _github_auth():
        return flask.redirect('https://github.com/login/oauth/authorize/?client_id=%s' % settings['GITHUB_CLIENT_ID'])
        # return flask.redirect('https://github.com/login/oauth/authorize/?client_id=%s&scope=read:org' % settings['GITHUB_CLIENT_ID'])

    # get access token from auth token
    @api.route('/get_access_token/<token>')
    @jsonify
    def _login(token):
        res = user.login(token)
        res['user'] = user.get_user(res['access_token'])
        if not user.user_in_organization(res['access_token'], 'nlesc'):
            raise exceptions.UnauthorizedException(
                'Not a public member of organization NLeSC. Check https://github.com/orgs/NLeSC/people?query= %s' % res['user']['login']
            )
        return res, 200

    @api.route('/verify_access_token/<token>')
    @jsonify
    def _verify_access_token(token):
        logged_user = user.get_user(token)
        if not user.user_in_organization(token, 'nlesc'):
            raise exceptions.UnauthorizedException(
                'Not a public member of organization NLeSC. Check https://github.com/orgs/NLeSC/people?query= %s' % logged_user['login']
            )

        return {'user': logged_user}, 200

    @api.route('/update', methods=["POST"])
    @jsonify
    @user.require_organization('nlesc')
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
                    record.data.pop('updatedAt', None)
                    record.data.pop('createdAt', None)
                    record.data.update(resource_data)
                record.save()

        return {'status': 'ok'}, 200

    @api.route('/software/<software_id>/commits', methods=["GET"])
    @jsonify
    def _commits(software_id):
        return [commit.data for commit in list(db.commit.find({'software_id': software_id}))], 200

    @api.route('/new_projects', methods=['GET'])
    @require_permission('read')
    def _new_projects():
        return 'bla', 200

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

    @api.route('/corporate_projects', methods=['GET'])
    @jsonify
    def _corporate_projects():
        return list(db.corporate_project.all()), 200

    @api.route('/corporate_blogs', methods=['GET'])
    @jsonify
    def _corporate_blogs():
        return list(db.corporate_blog.all()), 200

    return api
