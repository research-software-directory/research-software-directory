from src.database.database_dict import DictDatabase
from src.services import github
import pytest


@pytest.fixture(autouse=True)
def zen():
    return github.GithubService('123', '123')

def test_rate_limit(zen):
   print (zen)

   # db = DictDatabase({'software' : [{'id': 'asd', 'a': '123'}, {'id': 'dsa', 'a': '123'}]})
   # db.software.insert({'id': 'new'})
   # print(list(db.software.all()))



   # raise(1)