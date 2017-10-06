import os
import shutil
import subprocess
import tempfile

from src.database.database import db
from src.settings import settings


def data_export(filename):
    """export database to `filename` (.tar.gz)"""
    if not shutil.which('mongoexport'):
        raise IOError('command `mongoexport` not found')
    if not shutil.which('tar'):
        raise IOError('command `tar` not found')
    if not filename or len(filename) < 1:
        raise IOError("Missing filename")
    tmp_dir = tempfile.mkdtemp()
    for table in db.collection_names():
        if table != 'system.indexes':
            output_file = os.path.join(tmp_dir, table + '.json')
            subprocess.call([
                'mongoexport',
                '--host=' + settings['DATABASE_HOST'],
                '--port=' + settings['DATABASE_PORT'],
                '--db=' + settings['DATABASE_NAME'],
                '--collection=' + table,
                '--out=' + output_file
            ])
    subprocess.call([
        'tar',
        'zcf',
        filename,
        '-C',
        tmp_dir,
        '.'
    ])
    shutil.rmtree(tmp_dir)


def data_import(filename):
    """import exported `filename` to database"""
    if not shutil.which('mongoimport'):
        raise IOError('command `mongoimport` not found')
    if not shutil.which('tar'):
        raise IOError('command `tar` not found')
    if not filename or len(filename) < 1:
        raise IOError("Missing filename")
    tmp_dir = tempfile.mkdtemp()
    subprocess.call([
        'tar',
        'zxf',
        filename,
        '-C',
        tmp_dir
    ])
    for subdir, dirs, files in os.walk(tmp_dir):
        for file in files:
            subprocess.call([
                'mongoimport',
                '--host=' + settings['DATABASE_HOST'],
                '--port=' + settings['DATABASE_PORT'],
                '--db='+settings['DATABASE_NAME'],
                '--file=' + os.path.join(tmp_dir, file)
            ])
        break

    shutil.rmtree(tmp_dir)
