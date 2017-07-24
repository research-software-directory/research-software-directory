"""
Reads old DB JSON (software.esciencecenter.nl) from stdin
and outputs TinyDB compatible JSON to stdout

usage: `python migrate_old_date.py < old_data.py > new_data.py
"""
import json
import sys
from tinydb import TinyDB
from tinydb.storages import MemoryStorage

with TinyDB(storage=MemoryStorage) as db:
    JSON_DATA = json.load(sys.stdin)
    for table_name in JSON_DATA:
        table = db.table(table_name)
        for row in JSON_DATA[table_name]:
            table.insert(row)
    print(json.dumps(db._storage.read()))
