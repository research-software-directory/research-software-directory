import flask
from flask_cors import CORS

import src.exceptions as exceptions

from src.schema import schema
from src.json_response import jsonify
from src.permission import require_permission

from src.transformers import software as t_software
from src.transformers.software import list_entry


def get_routes(db):
    def collection_to_object(collection):
        result = {}
        for resource in collection:
            result[resource['_id']] = resource
        return result

    api = flask.Blueprint("api", __name__)
    cors = CORS(api, resources={r"*": {"origins": "*"}})

    @api.route('/all', methods=["GET"])
    @jsonify
    @require_permission(['read'])
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
        return schema, 200

    @api.route('/update', methods=["POST"])
    @jsonify
    @require_permission(['write'])
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

    return api
