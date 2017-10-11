import pytest

from src.database.database_dict import DictDatabase
from tests.unit.database.database_common_tests import *


@pytest.fixture(autouse=True)
def db():
    return DictDatabase({
        'project': [
            project1.copy(), project2.copy()
        ]
    })


