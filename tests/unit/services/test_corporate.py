from src.database.database_dict import DictDatabase
# from src.settings import settings
from src.services.corporate import get_blogs, get_projects, get_people, CorporateService
import pytest

data = {}

@pytest.fixture(autouse=True)
def db():
    return DictDatabase({})

@pytest.fixture(autouse=True)
def service(db):
    return CorporateService(db)

def test_get_projects(service):
    projects = get_projects()
    assert len(projects) > 50

def test_get_blogs(service):
    blogs = get_blogs()
    assert len(blogs) > 10

def test_get_people(service):
    people = get_people()
    assert len(people) > 40