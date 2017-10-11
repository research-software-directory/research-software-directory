import json
from abc import ABC, abstractmethod
import logging

logger = logging.getLogger(__name__)


class Record():
    def __init__(self, data, collection, is_new=False):
        self.data = data
        self.is_new = is_new
        self.collection = collection

    def is_new(self):
        return self.is_new

    def has_id(self):
        return 'id' in self.data and self.data['id'] is not None

    def has_key(self, key):
        return key in self.data

    def save(self):
        if self.is_new:
            self.collection.insert(self)
        else:
            self.collection.update(self)
        self.is_new = False

    def __str__(self):
        return str(self.data)

    def __getitem__(self, key):
        if key in self.data:
            return self.data[key]
        else:
            raise KeyError(key)

    def __setitem__(self, key, value):
        self.data[key] = value

    def to_dict(self):
        return self.data


class Cursor(ABC):
    @abstractmethod
    def __iter__(self):
        pass

    @abstractmethod
    def next(self):
        pass

    @abstractmethod
    def count(self):
        pass


class Collection(ABC):
    @abstractmethod
    def all(self):
        pass

    @abstractmethod
    def find(self, params):
        pass

    @abstractmethod
    def find_by_id(self, id):
        pass

    @abstractmethod
    def insert(self, record):
        pass

    @abstractmethod
    def update(self, record):
        pass

    @abstractmethod
    def new(self):
        pass


class Database(ABC):
    @abstractmethod
    def get_collections(self):
        pass

    @abstractmethod
    def __getattr__(self, item):
        pass

    def __getitem__(self, item):
        return self.__getattr__(item)