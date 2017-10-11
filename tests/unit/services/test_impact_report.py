from src.database.database_dict import DictDatabase
from src.services import github, libraries_io, impact_report
from src.services.impact_report import guard
from src.settings import settings
import pytest

if settings.get('LIBRARIES_IO_API_KEY') and settings.get('GITHUB_ACCESS_TOKEN'):
    @pytest.fixture(autouse=True)
    def db():
        return DictDatabase({
            'software': [
                {
                    'id': 'NLeSC/mcfly',
                    'githubid': 'NLeSC/mcfly'
                }
            ]
        })


    @pytest.fixture(autouse=True)
    def service(db):
        github_service = github.GithubService(db, settings['GITHUB_ACCESS_TOKEN'])
        libraries_io_service = libraries_io.LibrariesIOService(settings['LIBRARIES_IO_API_KEY'])
        return impact_report.ImpactReportService(db, github_service, libraries_io_service)


    def test_service_exists(service):
        assert service is not None


    def test_guard():
        exception_msg = 'this is an exception'
        @guard
        def test_func():
            raise Exception(exception_msg)

        data = test_func()
        assert data['class'] == 'Exception'
        assert data['error'] == exception_msg
        assert len(data['traceback']) > 0


    def test_generate_report(service, db):
        service.generate_impact_report('NLeSC/mcfly')
        import pprint
        data = db.impact_report.all().next().data
        pprint.pprint(data)
        assert data['status'] == 'done'
        assert data['github']['repo']['forks'] > 20
        assert data['libraries_io']
