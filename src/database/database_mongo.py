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
        self.cursor = cursor
        self.collection = collection

    def __iter__(self):
        for resource in self.cursor:
            yield MongoRecord(resource, self.collection)

    def next(self):
        return MongoRecord(self.cursor.next(), self.collection)

    def count(self):
        return self.cursor.count()

    def sort(self, *args, **kwargs):
        self.cursor = self.cursor.sort(*args, **kwargs)

    def limit(self, *args, **kwargs):
        self.cursor = self.cursor.limit(*args, **kwargs)


class MongoCollection(Collection):
    def __init__(self, name, db):
        self._collection = db[name]

    def all(self):
        return MongoCursor(self._collection.find(), self)

    def find(self, params):
        return MongoCursor(self._collection.find(params), self)

    def find_by_id(self, id):
        return MongoRecord(self._collection.find_one({'id': id}), self)

    def new(self, id=None):
        new_record = MongoRecord({'id': id}, self, True)
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

    def update(self, record):
        pass


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

    def __getattr__(self, item):
        return MongoCollection(item, self.db)
