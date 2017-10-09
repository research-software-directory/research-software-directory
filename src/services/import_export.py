import os
import shutil
import subprocess
import tempfile


class ImportExportService:
    def __init__(self, db, database_host, database_port, database_name):
        self.database_host = database_host
        self.database_port = database_port
        self.database_name = database_name
        self.db = db

    def data_export(self, filename):
        """export database to `filename` (.tar.gz)"""
        if not shutil.which('mongoexport'):
            raise IOError('command `mongoexport` not found')
        if not shutil.which('tar'):
            raise IOError('command `tar` not found')
        if not filename or len(filename) < 1:
            raise IOError("Missing filename")
        tmp_dir = tempfile.mkdtemp()
        for table in self.db.get_collections():
            if table != 'system.indexes':
                output_file = os.path.join(tmp_dir, table + '.json')
                subprocess.call([
                    'mongoexport',
                    '--host=' + self.database_host,
                    '--port=' + self.database_port,
                    '--db=' + self.database_name,
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

    def data_import(self, filename):
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
                    '--host=' + self.database_host,
                    '--port=' + self.database_port,
                    '--db=' + self.database_name,
                    '--file=' + os.path.join(tmp_dir, file)
                ])
            break

        shutil.rmtree(tmp_dir)
