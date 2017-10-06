import logging

from pymongo import MongoClient

from src.database.database import Record, Cursor, Collection, Database
from src.settings import settings

logger = logging.getLogger(__name__)


class MongoRecord(Record):
    def __init__(self, data, collection):
        super(MongoRecord, self).__init__(data)
        self.collection = collection
        self._id = self.data.pop('_id') if '_id' in self.data else None  # hide mongo _id from data

    def save(self):
        if not self._id:  # new record
            if self.data['id']:
                self.data['_id'] = self.data['id']
                self.collection.insert(self.data)  # can raise if id exists
            else:
                self.data['id'] = str(self.collection.insert(self.data))  # insert updates data with _id
            self._id = self.data.pop('_id')
        self.collection.update({'_id': self._id}, self.data)
        Record.save(self)


class MongoCursor(Cursor):  # wraps mongo cursor
    def __init__(self, cursor, collection):
        self.cursor = cursor
        self.collection = collection

    def __iter__(self):
        for resource in self.cursor:
            yield MongoRecord(resource, self.collection)

    def next(self):
        return self.cursor.next()


class MongoCollection(Collection):
    def __init__(self, name, db):
        self.collection = db[name]

    def all(self):
        return MongoCursor(self.collection.find(), self.collection)

    def find(self, params):
        return MongoCursor(self.collection.find(params), self.collection)

    def find_by_id(self, id):
        return MongoRecord(self.collection.find_one({'id': id}), self.collection)

    def new(self, id=None):
        new_record = MongoRecord({'id': id}, self.collection)
        return new_record


class MongoDatabase(Database):
    def __init__(self, host, port, database_name):
        self.client = MongoClient('mongodb://%s:%s/' % (host, port))
            # MongoClient('mongodb://%s:%s/' % (settings['DATABASE_HOST'], settings['DATABASE_PORT']))
        # self.db = self.client[settings['DATABASE_NAME']]
        self.db = self.client[database_name]
        self._create_indexes()

    def _create_indexes(self):
        self.db.impact_report.create_index([('software_id', 1)])
        self.db.commit.create_index([('software_id', 1)])

    def get_collections(self):
        return self.db.collection_names(False)

    def __getattr__(self, item):
        return MongoCollection(item, self.db)


db = MongoDatabase(settings['DATABASE_HOST'], settings['DATABASE_PORT'], 'test')
print(db.get_collections())