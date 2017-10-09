import pytest
from src.database.database_dict import DictDatabase
from tests.database_common_tests import *


@pytest.fixture(autouse=True)
def db():
    return DictDatabase({
        'project': [
            project1, project2
        ]
    })


