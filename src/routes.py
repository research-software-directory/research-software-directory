import os
import datetime
import copy

import flask
import pymongo
from flask_cors import CORS
from jsonschema import validate
from bson.objectid import ObjectId

from src import exceptions
from src.json_response import jsonify
from src.permission import require_permission, get_sub

def time_now():
    return datetime.datetime.utcnow().replace(microsecond=0).isoformat()+'Z'


def get_routes(db, schemas):
    api = flask.Blueprint("api", __name__, url_prefix=os.environ.get('BACKEND_ROOT', '/'))
    cors = CORS(api, resources={r"*": {"origins": "*"}})

    @api.route('/<resource_type>/<id>', methods=["GET"])
    @jsonify
    def _get_resource(resource_type, id):
        splitted = resource_type.split('_')
        if (len(splitted) > 1 and splitted[1]) == 'cache':
            raw_type = splitted[0]
        else:
            raw_type = resource_type

        if raw_type not in schemas.keys():
            raise exceptions.NotFoundException('Resource of type \'%s\' not found' % raw_type)

        resource = None
        if 'slug' in schemas[raw_type]['properties'].keys():
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
        splitted = resource_type.split('_')
        if (len(splitted) > 1 and splitted[1]) == 'cache':
            raw_type = splitted[0]
        else:
            raw_type = resource_type

        if raw_type not in schemas.keys():
            raise exceptions.NotFoundException('No such resource type exists: \'%s\'' % resource_type)

        keyword_arg_keys = ['sort', 'skip', 'limit', 'direction', 'count']
        searches = {}
        for key in [key for key in flask.request.args.keys() if key not in keyword_arg_keys]:
            arg_value = flask.request.args[key]
            if arg_value in ['true', 'True']:
                arg_value = True
            if arg_value in ['false', 'False']:
                arg_value = False
            searches[key] = arg_value

        query = db[resource_type].find(searches)
        if 'sort' in flask.request.args.keys():
            direction = pymongo.DESCENDING if flask.request.args.get('direction') == 'desc' else pymongo.ASCENDING
            query.sort(flask.request.args.get('sort'), direction)

        query.skip(int(flask.request.args.get('skip', 0)))
        query.limit(int(flask.request.args.get('limit', 0)))

        if 'count' in flask.request.args:
            return {'count': query.count()}, 200

        return list(query), 200

    @api.route('/<resource_type>', methods=["POST"])
    @require_permission(['write'])
    @jsonify
    def _create_resources(resource_type):
        """
        Save one or more new resources
        :param resource_type: The resource type
        :return: the saved resource
        """
        def add_fields_and_validate(res):
            res['createdAt'] = time_now()
            res['updatedAt'] = time_now()
            res['createdBy'] = get_sub()
            res['updatedBy'] = get_sub()

            if 'primaryKey' not in res:
                res['primaryKey'] = {
                    'collection': resource_type,
                    'id': str(ObjectId())
                }

            validate(res, schemas.get(resource_type))

            if db[resource_type].find_one({'primaryKey.id': res['primaryKey']['id']}):
                raise exceptions.DuplicatePrimaryKeyException(res['primaryKey']['id'])

        if resource_type not in schemas.keys():
            raise exceptions.NotFoundException('No such resource type exists: \'%s\'' % resource_type)

        data = flask.request.get_json(force=True, silent=True)
        if not data or not (isinstance(data, dict) or isinstance(data, list)):
            raise exceptions.BadRequestException('Malformed JSON in POST data')

        if isinstance(data, dict):
            add_fields_and_validate(data)
            if 'test' not in flask.request.args:
                db[resource_type].insert(data)

            return data, 200

        else:  # list
            for resource in data:
                add_fields_and_validate(resource)
                if 'test' not in flask.request.args:
                    db[resource_type].insert(resource)
            return 'ok', 200

    @api.route('/<resource_type>', methods=["PUT"])
    @require_permission(['write'])
    @jsonify
    def _update_or_insert(resource_type):
        """
        Update or insert a list of resources
        :param resource_type: The resource type
        :return: the resources list.
        """
        if resource_type not in schemas.keys():
            raise exceptions.NotFoundException('Resource of type \'%s\' not found' % resource_type)

        data = flask.request.get_json(force=True, silent=True)
        if not data or not isinstance(data, list):
            raise exceptions.BadRequestException('Malformed JSON in PATCH data (expected JSON list)')

        resources_to_update = []
        resources_to_create = []

        for resource in data:
            if 'primaryKey' not in resource:
                resource['primaryKey'] = {
                    'collection': resource_type,
                    'id': str(ObjectId())
                }

            old_resource = db[resource_type].find_one({'primaryKey.id': resource['primaryKey']['id']})
            if not old_resource:
                resource['createdAt'] = time_now()
                resource['updatedAt'] = time_now()
                resource['createdBy'] = get_sub()
                resource['updatedBy'] = get_sub()
                validate(resource, schemas.get(resource_type))

                resources_to_create.append(resource)
            else:
                updated_resource = {}
                updated_resource['createdAt'] = old_resource['createdAt']
                updated_resource['createdBy'] = old_resource['createdBy']
                updated_resource['primaryKey'] = old_resource['primaryKey']
                updated_resource['updatedAt'] = time_now()
                updated_resource['updatedBy'] = get_sub()

                resource.pop('_id')
                resource.pop('createdAt')
                resource.pop('createdBy')
                resource.pop('updatedAt')
                resource.pop('updatedBy')
                resource.pop('primaryKey')

                # update resource dict with POSTed data
                updated_resource.update(resource)

                validate(updated_resource, schemas.get(resource_type))
                updated_resource['_id'] = old_resource['_id']
                resources_to_update.append(updated_resource)

        if 'test' not in flask.request.args:
            for resource in resources_to_create:
                db[resource_type].insert(resource)
            for resource in resources_to_update:
                db[resource_type].update_one({'_id': resource['_id']}, {'$set': resource})

        return 'ok', 200

    @api.route('/<resource_type>/<id>', methods=["PUT"])
    @require_permission(['write'])
    @jsonify
    def _update_resource(resource_type, id):
        """
        Update a resource, can update whole resource or a subset of fields
        :param resource_type: The resource type
        :return: the updated resource
        """
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

        # restore keys that cannot be changed on update
        data['updatedAt'] = time_now()
        data['updatedBy'] = get_sub()
        data['createdAt'] = resource.pop('createdAt')
        data['createdBy'] = resource.pop('createdBy', 'Unknown')
        data['primaryKey'] = resource.pop('primaryKey')

        validate(data, schemas.get(resource_type))

        # _id is not part of the schema, so restore this after validation
        data['_id'] = resource_id

        if 'test' not in flask.request.args:
            db[resource_type].update_one({'_id': resource_id}, {'$set': data})

        if 'save_history' in flask.request.args:
            old_data.pop('_id')
            db[resource_type+'_history'].insert(old_data)

        return data, 200

    @api.route('/')
    @require_permission(['read'])
    @jsonify
    def _root():
        """
        Get all resources as a dict (only if there are less than 1000)
        :return: All resources
        """
        results = {}
        for resource_type in schemas.keys():
            resource_cursor = db[resource_type].find()
            if resource_cursor.count() < 1000:
                resources = list(resource_cursor)
                for resource in resources:
                    if '_id' in resource:
                        del resource['_id']
                results[resource_type] = resources

        return results, 200


    @api.route('/schema')
    @jsonify
    def _schema():
        return schemas, 200

    return api
