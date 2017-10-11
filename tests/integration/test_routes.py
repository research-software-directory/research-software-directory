import json
import pytest
from src.settings import settings
from src.app import create_app
from src.database.database_dict import DictDatabase

initial_data = {
    'software': [
        {'id': 'example'}
    ]
}

payload_one_new_software = {"software":[{"publications":[], "id": "newsw", "schema": "", "name": "New Software", "githubid": "nlesc/newsw", "doi": "", "tagLine": "", "website": "", "contactPerson": "", "description": "", "user":[], "dependencyOf":[], "technologyTag":[], "endorsedBy":[], "owner":[], "dependency":[], "status": "", "competence":[], "contributor":[], "expertise":[], "downloadUrl": "", "license":[], "discipline":[], "codeRepository": "", "usedIn":[], "badges":[], "startDate": "", "involvedOrganization":[], "contributingOrganization":[], "programmingLanguage":[], "documentationUrl":"", "supportLevel":"", "nlescWebsite":"", "logo":"", "releases":[]}]}


@pytest.fixture(autouse=True)
def db():
    return DictDatabase(initial_data.copy())


@pytest.fixture(autouse=True)
def app(db):
    return create_app(db)


@pytest.fixture(autouse=True)
def get(app):
    def _get(url):
        client = app.test_client()
        response = client.get(url, headers={'Token': settings.get('GITHUB_ACCESS_TOKEN') or ''})
        return json.loads(response.data.decode('utf-8'))
    return _get


@pytest.fixture(autouse=True)
def post(app):
    def _post(url, data=None):
        client = app.test_client()
        response = client.post(url,
                               data=json.dumps(data) or json.dumps({}),
                               headers={
                                   'Token': settings.get('GITHUB_ACCESS_TOKEN') or '',
                                   'Content-Type': 'application/json'
                               })
        return response.status_code, json.loads(response.data.decode('utf-8'))
    return _post


def test_get_all(get):
    data = get('/all')
    assert data['software'] == initial_data['software']


def test_update_with_one_new(post, db):
    status_code, data = post('/update', payload_one_new_software)
    assert status_code == 200
    software = list(db.software.all())
    assert len(software) == 2
    assert software[1].data == payload_one_new_software['software'][0]
