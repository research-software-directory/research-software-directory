from src.database.database_mongo import MongoDatabase
from src.settings import settings
from tests.database_common_tests import project1, project2

import pytest

test_db_name = 'TESTING_DB'

if 'DATABASE_HOST' in settings and 'DATABASE_PORT' in settings:
    @pytest.fixture(autouse=True)
    def db():
        database = MongoDatabase(settings['DATABASE_HOST'], settings['DATABASE_PORT'], test_db_name)
        raw_db = database.get_pymongo()
        project1_mongo = project1.copy()
        project1_mongo['_id'] = project1_mongo['id']
        project2_mongo = project2.copy()
        project2_mongo['_id'] = project2_mongo['id']
        raw_db.project.insert(project1_mongo)
        raw_db.project.insert(project2_mongo)
        yield database
        raw_db.client.drop_database(test_db_name)


    from tests.database_common_tests import *
