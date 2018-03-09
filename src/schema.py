import requests


class Schema:
    def __init__(self, server_url):
        """
        Throws if schema service is not available at server_url
        :param server_url: url of the schema service eg. 'http://schema:8000'
        """
        self._server_url = server_url

    def all(self):
        """
        :return: All schemas as dict with schema names as keys
        """
        return requests.get(self._server_url).json()

    def get(self, schema_name):
        """
        :param schema_name: name of the schema to fetch
        :return: schema as dict
        """
        return requests.get(self._server_url + '/' + schema_name).json()
