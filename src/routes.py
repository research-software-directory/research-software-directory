import flask
import datetime
import pymongo
import copy
from flask_cors import CORS
from jsonschema import validate
from bson.objectid import ObjectId

from src import exceptions
from src.json_response import jsonify
from src.permission import require_permission, get_sub


def time_now():
    return datetime.datetime.utcnow().replace(microsecond=0).isoformat()+'Z'


def get_routes(db, schema):
    api = flask.Blueprint("api", __name__)
    cors = CORS(api, resources={r"*": {"origins": "*"}})

    @api.route('/<resource_type>/<id>', methods=["GET"])
    @jsonify
    def _get_resource(resource_type, id):
        schemas = schema.all()
        if resource_type not in schemas.keys():
            raise exceptions.NotFoundException('Resource of type \'%s\' not found' % resource_type)

        resource = None
        if 'slug' in schemas[resource_type]['properties'].keys():
            resource = db[resource_type].find_one({'slug': id})
        if not resource:
            resource = db[resource_type].find_one({'primaryKey.id': id})
        if not resource:
            raise exceptions.NotFoundException('Resource not found')

        return resource, 200

    @api.route('/<resource_type>', methods=["GET"])
    @jsonify
    def _get_resources(resource_type):
        """
        Get list of resource `resource_type`, forwards GET parameters sort, direction, skip, limit to mongo query
        :param resource_type: The resource type
        :return: list of resources
        """
        schemas = schema.all()
        if resource_type not in schemas.keys():
            raise exceptions.NotFoundException('No such resource type exists: \'%s\'' % resource_type)

        keyword_arg_keys = ['sort', 'skip', 'limit', 'direction']
        searches = {}
        for key in [key for key in flask.request.args.keys() if key not in keyword_arg_keys]:
            searches[key] = flask.request.args[key]

        query = db[resource_type].find(searches)
        if 'sort' in flask.request.args.keys():
            direction = pymongo.DESCENDING if flask.request.args.get('direction') == 'desc' else pymongo.ASCENDING
            query.sort(flask.request.args.get('sort'), direction)

        query.skip(int(flask.request.args.get('skip', 0)))
        query.limit(int(flask.request.args.get('limit', 0)))





        return list(query), 200

    @api.route('/<resource_type>', methods=["POST"])
    @require_permission(['write'])
    @jsonify
    def _create_resources(resource_type):
        """
        Save a resource
        :param resource_type: The resource type
        :return: the saved resource
        """
        schemas = schema.all()
        if resource_type not in schemas.keys():
            raise exceptions.NotFoundException('No such resource type exists: \'%s\'' % resource_type)

        data = flask.request.get_json(force=True, silent=True)
        if not data or not isinstance(data, dict):
            raise exceptions.BadRequestException('Malformed JSON in POST data')

        data['createdAt'] = time_now()
        data['updatedAt'] = time_now()
        data['createdBy'] = get_sub()
        data['updatedBy'] = get_sub()

        if 'primaryKey' not in data:
            data['primaryKey'] = {
                'collection': resource_type,
                'id': str(ObjectId())
            }
        validate(data, schemas.get(resource_type))

        if db[resource_type].find_one({'primaryKey.id': data['primaryKey']['id']}):
            raise exceptions.DuplicatePrimaryKeyException(data['primaryKey']['id'])

        if 'test' not in flask.request.args:
            db[resource_type].insert(data)

        return data, 200

    @api.route('/<resource_type>/<id>', methods=["PATCH"])
    @require_permission(['write'])
    @jsonify
    def _update_resource(resource_type, id):
        """
        Update a resource, can update whole resource or a subset of fields
        :param resource_type: The resource type
        :return: the updated resource
        """
        schemas = schema.all()
        if resource_type not in schemas.keys():
            raise exceptions.NotFoundException('Resource of type \'%s\' not found' % resource_type)

        resource = None
        if 'slug' in schemas[resource_type]['properties'].keys():
            resource = db[resource_type].find_one({'slug': id})
        if not resource:
            resource = db[resource_type].find_one({'primaryKey.id': id})
        if not resource:
            raise exceptions.NotFoundException('Resource not found')

        if 'save_history' in flask.request.args:
            old_data = copy.deepcopy(resource)

        data = flask.request.get_json(force=True, silent=True)
        if not data or not isinstance(data, dict):
            raise exceptions.BadRequestException('Malformed JSON in PATCH data')

        # save keys that cannot be changed on update
        resource_id = resource.pop('_id')
        resource_primary_key = resource.pop('primaryKey')
        resource_created_at = resource.pop('createdAt')
        resource_created_by = resource.pop('createdBy', None)

        # update resource dict with POSTed data
        resource.update(data)

        # restore keys that cannot be changed on update
        resource['updatedAt'] = time_now()
        resource['updatedBy'] = get_sub()
        resource['createdAt'] = resource_created_at
        resource['createdBy'] = resource_created_by
        resource['primaryKey'] = resource_primary_key

        validate(resource, schemas.get(resource_type))

        # _id is not part of the schema, so restore this after validation
        resource['_id'] = resource_id

        if 'test' not in flask.request.args:
            db[resource_type].update_one({'_id': resource_id}, {'$set': resource})

        if 'save_history' in flask.request.args:
            old_data.pop('_id')
            db[resource_type+'_history'].insert(old_data)

        return resource, 200

    @api.route('/')
    @require_permission(['read'])
    @jsonify
    def _root():
        """
        Get all resources as a dict (only if there are less than 1000)
        :return: All resources
        """
        schemas = schema.all()
        results = {}
        for resource_type in schemas.keys():
            resource_cursor = db[resource_type].find()
            if resource_cursor.count() < 1000:
                results[resource_type] = list(resource_cursor)

        return results, 200


    @api.route('/schema')
    @jsonify
    def _schema():
        return schema.all(), 200

    return api
