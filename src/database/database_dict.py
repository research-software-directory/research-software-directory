import logging
import random
import string

from src.database.database import Record, Cursor, Collection, Database

logger = logging.getLogger(__name__)


def random_id():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(25))


class DictRecord(Record):
    def __init__(self, data, collection):
        super(DictRecord, self).__init__(data)
        self.collection = collection

    def save(self):
        self.collection.insert(self)
        Record.save(self)


class DictCursor(Cursor):
    def __init__(self, data_set, collection):
        self.data_set = data_set
        self.data_set_iterator = iter(data_set)
        self.collection = collection

    def __iter__(self):
        for resource in self.data_set:
            yield DictRecord(resource, self.collection)

    def next(self):
        return next(self.data_set_iterator)


class DictCollection(Collection):
    def __init__(self, name, db):
        self._collection = db[name]

    def all(self):
        return DictCursor(self._collection, self)

    def find(self, params):
        return DictCursor(self._collection.find(params), self)

    def find_by_id(self, id):
        for index, item in enumerate(self._collection):
            if item['id'] == id:
                return item
        return None

    def new(self, id=None):
        new_record = DictRecord({'id': id}, self)
        return new_record

    def insert(self, record):
        print("inserting")
        if 'id' not in record:  # or not record['id']:
            record['id'] = random_id()
        self._collection.append(record)
        return record['id']

    def update(self, record):
        for index, item in enumerate(self._collection):
            print(record)
            if item['id'] == record['id']:
                self._collection[index] = record
                return
        raise Exception('not found...')



class DictDatabase(Database):
    def __init__(self, data=None):
        self.db = data or {}

    def __getattr__(self, item):
        return DictCollection(item, self.db)
