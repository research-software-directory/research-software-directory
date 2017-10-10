import logging
import random
import string

from src.database.database import Record, Cursor, Collection, Database

logger = logging.getLogger(__name__)


def random_id():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(25))


class DictCursor(Cursor):
    def __init__(self, data_set, collection):
        self.data_set = data_set
        self.data_set_iterator = iter(data_set)
        self.collection = collection

    def __iter__(self):
        for resource in self.data_set:
            yield Record(resource, self.collection)

    def next(self):
        return Record(next(self.data_set_iterator), self.collection)

    def count(self):
        return len(self.data_set)

    def sort(self, *args, **kwargs):
        return self

    def limit(self, count):
        self.data_set = self.data_set[:count]
        return self


class DictCollection(Collection):
    def __init__(self, name, db):
        self._collection = db[name]

    def all(self):
        return DictCursor(self._collection, self)

    def find(self, params):
        def find_filter(record_dict):
            for key in params:
                if key not in record_dict or record_dict[key] != params[key]:
                    return False
            return True

        return DictCursor(list(filter(find_filter, self._collection)), self)

    def find_by_id(self, id):
        for index, item in enumerate(self._collection):
            if item['id'] == id:
                return Record(item, self)
        return None

    def new(self, id_or_data=None):
        if isinstance(id_or_data, str) or id_or_data is None:
            new_record = Record({'id': id_or_data}, self, True)
        else:
            new_record = Record(id_or_data, self, True)
        return new_record

    def insert(self, record):
        if not record.has_id():
            record['id'] = random_id()
        self._collection.append(record.data)
        return record['id']

    def update(self, record):
        pass  # not needed, records are directly updated


class DictDatabase(Database):
    def __init__(self, data=None):
        self.db = data or {}

    def get_collections(self):
        return list(self.db.keys())

    def __getattr__(self, item):
        if item not in self.db:
            self.db[item] = []
        return DictCollection(item, self.db)
