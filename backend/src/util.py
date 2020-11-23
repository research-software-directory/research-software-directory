import logging
import time

logger = logging.getLogger(__name__)

request_times = {}


def rate_limit(name, calls, period):
    """
        Decorator to limit the rate of function calls
        use eg. @rate_limit('some_api', 60, 60) to limit to 60 calls/minute

        :param name: name to use limit on several functions
        :type name: string
        :param calls: number of calls allowed per period
        :type calls: int
        :param period: period where #calls are allowed (in seconds)
        :type period: int
        :return: wrapper
    """
    def wrapper(func):
        def func_wrapper(*args, **kwargs):
            if name not in request_times:
                request_times[name] = []
            while len(request_times[name]) >= calls:
                sleep_for = period - (time.time() - min(request_times[name]))
                if sleep_for > 1:
                    logger.info('Rate limit hit for "%s", sleeping for %f seconds', name, sleep_for)
                time.sleep(max([sleep_for, 0]))
                request_times[name] = [
                    timestamp for timestamp in request_times[name]
                    if (time.time() - timestamp) < period
                ]
            request_times[name].append(time.time())
            return func(*args, **kwargs)
        return func_wrapper
    return wrapper


def find_schema_links(resource_type, schemas):
    """
    returns a dict with schema and paths pointing to resource_type
    e.g.
    find_schema_links("person", schemas) should return:
    {
        "software": [
            [
                "contributors",
                "foreignKey"
            ]
        ]
    },

    Because software->contributors->foreignKey is a link to a person.
    """
    def parse_property(property, foreign_resource_type, path, results):
        if len(path) > 0 and path[-1] == 'foreignKey' and property['properties']['collection']['enum'][0] == foreign_resource_type:
            results.append(path)

        elif "properties" in property: # has sub properties
            for property_name in property['properties']:
                parse_property(
                    property['properties'][property_name],
                    foreign_resource_type, path[:] + [property_name],
                    results
                )

        elif property.get('type') == 'array':
            parse_property(
                property['items'],
                foreign_resource_type, path,
                results
            )

    results = {}
    for schema_name in schemas.keys():
        schema = schemas[schema_name]
        if '$schema' in schema:  # filters out weird stuff like software_cache
            result = []
            parse_property(schema, resource_type, [], result)
            if len(result) > 0:
                results[schema_name] = result

    return results


def find_data_links(db, schemas, resource_type, id):
    # find links to resource_type/id in all data, returns array of paths
    def get_links_to_id(id, resource, path_to_link, current_path, matches):
        if path_to_link[0] == 'foreignKey':
            if resource['foreignKey'].get('id') == id:
                matches.append(current_path)
        else:
            sub_resource = resource.get(path_to_link[0])
            if isinstance(sub_resource, list):
                for idx, item in enumerate(sub_resource):
                    get_links_to_id(id, item, path_to_link[1:], current_path + [path_to_link[0], idx], matches)
            elif isinstance(sub_resource, dict):
                get_links_to_id(id, sub_resource, path_to_link[1:], current_path + [path_to_link[0]], matches)

    schema_links = find_schema_links(resource_type, schemas)
    data_links = []

    for schema_name in schema_links.keys():
        resources = db[schema_name].find()
        for resource in resources:
            for path in schema_links[schema_name]:
                get_links_to_id(id, resource, path, [schema_name, resource['primaryKey']['id']], data_links)

    return data_links

def resource2update(schema, resource):
    """Generates update variable for MongoDB update_one(filter, update)

    """
    update = {'$set': resource}
    fields2remove = field2unset(schema, resource)
    if fields2remove:
        update['$unset'] = fields2remove
    return update

def field2unset(schema, data):
    """"Fields which are optional and missing in request data should be unset
    """
    all_fields = set(schema['properties'].keys())
    required_fields = set(schema['required'])
    optional_fields = all_fields - required_fields
    fields2remove = list(optional_fields - set(data.keys()))
    return {k: '' for k in fields2remove}