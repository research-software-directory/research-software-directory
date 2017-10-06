from src.database.database_dict import DictDatabase
from src.services import github
import pytest


project1 = {'id': 'dict', 'prop': 'database'}
project2 = {'id': 'mongo', 'prop': 'db'}


@pytest.fixture(autouse=True)
def db():
    return DictDatabase({
        'project': [
            project1, project2
        ]
    })


def test_data(db):
    all = list(db.project.all())
    assert(str(all[0]) == str(project1))
    assert(str(all[1]) == str(project2))


def test_find_by_id(db):
    project = db.project.find_by_id('dict')
    assert (str(project) == str(project1))


def test_insert(db):
    new_project = {'id': 'test', 'someProp': 'new'}
    db.project.insert(new_project)
    all = list(db.project.all())
    assert len(all) == 3
    assert (str(all[2]) == str(new_project))


def test_collection_update(db):
    updated_project = project1.copy()
    updated_project.update({'prop': 'updatedProp'})
    db.project.update(updated_project)
    assert str(db.project.all().next()) == str(updated_project)


def test_direct_update(db):
    project = db.project.find_by_id('dict')
    project['newprop'] = 5
    assert str(db.project.all().next()) == str(project)


def test_insert_no_id(db):
    new_project = {'someProp': 'new'}
    db.project.insert(new_project)
    all = list(db.project.all())
    assert len(all) == 3
    assert (str(all[2]) == str(new_project))
    assert 'id' in new_project
    assert new_project['id']


def test_insert_from_new(db):
    new_project = db.project.new()
    new_project['someProp'] = 54
    new_project.save()
    all = list(db.project.all())
    assert len(all) == 3
    assert (str(all[2]) == str(new_project))
    assert 'id' in new_project
    assert new_project['id']

