import logging

from pymongo import MongoClient

from src.database.database import Record, Cursor, Collection, Database

logger = logging.getLogger(__name__)


class MongoRecord(Record):
    def __init__(self, data, collection, is_new=False):
        super(MongoRecord, self).__init__(data, collection, is_new)
        self._id = self.data.pop('_id') if '_id' in self.data else None  # hide mongo _id from data


class MongoCursor(Cursor):  # wraps mongo cursor
    def __init__(self, cursor, collection):
        self._cursor = cursor
        self._collection = collection

    def __iter__(self):
        for resource in self._cursor:
            yield MongoRecord(resource, self._collection)

    def next(self):
        return MongoRecord(self._cursor.next(), self._collection)

    def count(self):
        return self._cursor.count()

    def sort(self, *args, **kwargs):
        self._cursor = self._cursor.sort(*args, **kwargs)
        return self

    def limit(self, *args, **kwargs):
        self._cursor = self._cursor.limit(*args, **kwargs)
        return self


class MongoCollection(Collection):
    def __init__(self, name, db):
        self._collection_name = name
        self._db = db
        self._collection = db[name]

    def all(self):
        return MongoCursor(self._collection.find(), self)

    def find(self, params):
        return MongoCursor(self._collection.find(params), self)

    def find_by_id(self, id):
        try:
            return MongoRecord(self._collection.find_one({'id': id}), self)
        except TypeError:
            return None

    def new(self, id_or_data=None):
        if isinstance(id_or_data, str) or id_or_data is None:
            new_record = MongoRecord({'id': id_or_data}, self, True)
        else:
            new_record = MongoRecord(id_or_data, self, True)
        return new_record

    def insert(self, record):
        if record.has_id() and record.data['id']:
            record.data['_id'] = record.data['id']
            self._collection.insert(record.data)  # can raise if id exists
        else:
            record.data['id'] = str(self._collection.insert(record.data))  # insert updates data with _id
            self._collection.update({'_id': record.data['_id']}, record.data)  # save `id`
        record._id = record.data.pop('_id')
        return record.data['id']

    def make_history_item(self, record):
        original = self._collection.find_one({'_id': record.data['_id']})
        original['original_id'] = original['_id']
        del original['_id']
        self._db['%s_history' % self._collection_name].insert(original)

    def update(self, record):
        record.data['_id'] = record._id  # restore mongo _id
        if record.save_history:
            self.make_history_item(record)
        self._collection.update({'_id': record.data['_id']}, record.data)
        record.data.pop('_id')


class MongoDatabase(Database):
    def __init__(self, host, port, database_name):
        self.client = MongoClient('mongodb://%s:%s/' % (host, port))
        self.db = self.client[database_name]
        self._create_indexes()

    def _create_indexes(self):
        self.db.impact_report.create_index([('software_id', 1)])
        self.db.commit.create_index([('software_id', 1)])

    def get_collections(self):
        return self.db.collection_names(False)

    def get_pymongo(self):
        return self.db

    def close(self):
        self.client.close()

    def __getattr__(self, item):
        return MongoCollection(item, self.db)
