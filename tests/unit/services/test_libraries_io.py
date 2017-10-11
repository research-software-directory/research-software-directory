from src.services import libraries_io
from src.settings import settings
import pytest

if settings.get('LIBRARIES_IO_API_KEY'):
    @pytest.fixture(autouse=True)
    def service():
        return libraries_io.LibrariesIOService(settings['LIBRARIES_IO_API_KEY'])


    def test_service_exists(service):
        assert service is not None


    def test_get_projects(service):
        data = service.get_projects('NLeSC/McFly')
        assert len(data) > 0
        if len(data) == 1:
            assert data[0]['platform'] == 'Pypi'


    def test_get_dependencies(service):
        projects = service.get_projects('NLeSC/McFly')
        data = service.get_dependencies(projects[0])
        assert isinstance(data, list)