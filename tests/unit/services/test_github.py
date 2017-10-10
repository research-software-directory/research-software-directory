from src.database.database_dict import DictDatabase
from src.services import github
from src.settings import settings
import pytest


if settings['GITHUB_ACCESS_TOKEN']:
    @pytest.fixture(autouse=True)
    def db():
        return DictDatabase({
            'software': [
                {
                    'id': 'research-software-directory-backend',
                    'githubid': 'nlesc/research-software-directory-backend'
                }
            ]
        })

    @pytest.fixture(autouse=True)
    def service(db):
        return github.GithubService(db, settings['GITHUB_ACCESS_TOKEN'])

    def test_service_exists(service):
        assert service is not None

    def test_get_github_repo(service):
        repo = service.get_github_repo('nlesc/research-software-directory-backend')
        assert repo['name'] == 'research-software-directory-backend'

    def test_update_commits_fails_for_unknown_repo(service):
        with pytest.raises(Exception) as excinfo:
            service.update_commits('asdaddasfdfsdfds')
        assert 'not found' in str(excinfo)

    def test_update_commits(service, db):
        service.update_commits('research-software-directory-backend')
        assert db.commit.all().count() > 68

    def test_releases(service):
        releases = service.releases('NLeSC/DiVE')
        assert len(releases) >= 4