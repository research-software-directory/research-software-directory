project1 = {'id': 'dict', 'prop': 'database', 'equal_prop': 3}
project2 = {'id': 'mongo', 'prop': 'db', 'equal_prop': 3}

def test_data(db):
    all = list(db.project.all())
    assert(all[0].data == project1)
    assert(all[1].data == project2)


def test_find_by_id(db):
    project = db.project.find_by_id('dict')
    assert project.data == project1


def test_access_empty_collection(db):
    some_collection = db.some_collection
    assert some_collection is not None


def test_direct_update(db):
    project = db.project.find_by_id('dict')
    project['newprop'] = 5
    project.save()
    assert db.project.all().next().data == project.data


def test_insert_no_id(db):
    new_project = db.project.new()
    new_project['someProp'] = 54
    new_project.save()
    all = list(db.project.all())
    assert len(all) == 3
    assert all[2].data == new_project.data
    assert new_project.has_id()
    assert new_project['id']


def test_insert_with_id(db):
    new_project = db.project.new()
    new_project['someProp'] = 54
    new_id = 'project_id'
    new_project['id'] = new_id
    new_project.save()
    all = list(db.project.all())
    assert len(all) == 3
    assert all[2].data == new_project.data
    assert new_project.has_id()
    assert str(new_project['id']) == new_id


def test_find_multi(db):
    results = db.project.find({'equal_prop': 3})
    assert results.count() == 2


def test_find_single(db):
    results = db.project.find({'id': 'dict'})
    assert results.count() == 1