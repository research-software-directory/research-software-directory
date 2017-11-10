from src.database.database_dict import DictDatabase
from src.services.zotero import nlesc_library, library_type, ZoteroService
from pyzotero import zotero
from src.settings import settings
import pytest

data = {}

if settings.get('ZOTERO_API_KEY'):
    @pytest.fixture(autouse=True)
    def db():
        return DictDatabase({})

    @pytest.fixture(autouse=True)
    def service(db):
        return ZoteroService(db, settings['ZOTERO_API_KEY'])

    def test_get_projects(service):
        projects = service.get_projects()
        data['total_zotero_projects'] = len(projects) #  saves extra request for testing
        data['first_zotero_project'] = projects[0]
        assert len(projects) > 50

    def test_get_new_projects(service, db):
        if 'first_zotero_project' in data:
            new_project_data = {'id': 'dummy',
                                'projectCode': data['first_zotero_project']['data']['name'].split(' ')[0]}
            new_project = db.project.new(new_project_data)
            new_project.save()
        projects = service.new_projects()
        if 'total_zotero_projects' in data:
            assert len(projects) == data['total_zotero_projects'] - 1  # one was saved before
        else:
            assert len(projects) > 1

    def test_get_new_publications_no_crash(service):
        service.new_publications()