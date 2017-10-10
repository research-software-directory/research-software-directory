import pytest
from src.database.database_dict import DictDatabase
from src.services import original_data_importer


@pytest.fixture(autouse=True)
def db():
    return DictDatabase({})


@pytest.fixture(autouse=True)
def service(db):
    return original_data_importer.OriginalDataImporterService(db)


def test_data_available(service):
    assert service.original_data.get('software') is not None
    assert service.original_data.get('project') is not None
    assert service.original_data.get('person') is not None
    assert service.original_data.get('organization') is not None


def test_remove_id_prefix(service):
    input = {
        'a': '/software/test',
        'b': '/someotherthing/asdsad',
        'c': 'http://www.google.com',
        'd': '/project/12345'
    }
    output = {
        'a': 'test',
        'b': '/someotherthing/asdsad',
        'c': 'http://www.google.com',
        'd': '12345'
    }
    assert service.remove_id_prefix(input) == output


def test_import_software(service, db):
    service.import_software()
    first_software = db.software.all().next()
    assert first_software['id']


def test_import_project(service, db):
    service.import_projects()
    first_project = db.project.all().next()
    assert first_project['id']


def test_import_person(service, db):
    service.import_people()
    first_person = db.person.all().next()
    assert first_person['id']


def test_import_organization(service, db):
    service.import_organizations()
    first_organization = db.organization.all().next()
    assert first_organization['id']
