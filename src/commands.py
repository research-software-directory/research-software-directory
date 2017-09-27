import json
import logging
import pprint
import re
import os
import shutil
import tempfile
import subprocess
from src.settings import settings

import click

from src.database import db
from src.services.report import generate_impact_report

logger = logging.getLogger(__name__)


def init(app):
    @app.cli.command('impact_report')
    @click.argument('id')
    def _report(id):
        generate_impact_report(id)

    @app.cli.command('fill_software_github_id')
    def _fillswghid():
        for index, software in enumerate(db['software']):
            if 'githubid' not in software and 'codeRepository' in software:
                matches = re.match(r'https://github.com/(.*?/.*?)/?$', str(software['codeRepository']))
                if matches:
                    db['software'][index]['githubid'] = matches.group(1)
        # sync_db()

    @app.cli.command('bundleschema')
    def _bundleschemas():
        schema = {}
        for (_, _, files) in os.walk('schema'):
            for (filename, file) in [(file, open('schema/'+file)) for file in files]:
                schema[filename] = json.load(file)
        print (json.dumps(schema))

    @app.cli.command('print')
    @click.argument('path')
    def _printer(path):
        def split_index(part):
            matches = re.match(r'^(.*)\[(\d*)]$',part)
            if matches is None:
                return part, None
            else:
                return matches.group(1), int(matches.group(2))

        def nav_list(path):
            path_parts = []
            for part in path.split('->'):
                path, index = split_index(part)
                path_parts.append(path)
                if (index is not None):
                    path_parts.append(index)
            return path_parts

        path_parts = nav_list(path)
        current = db.table(path_parts[0]).all()
        path_parts.pop(0)
        for path in path_parts:
            current = current[path]

        pprint.pprint(current)

    @app.cli.command('export')
    @click.argument('filename')
    def _export(filename):
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
                output_file = os.path.join(tmp_dir, table+'.json')
                subprocess.call([
                    'mongoexport',
                    '--host='+settings['DATABASE_HOST'],
                    '--port='+settings['DATABASE_PORT'],
                    '--db='+settings['DATABASE_NAME'],
                    '--collection='+table,
                    '--out='+output_file
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

    @app.cli.command('import')
    @click.argument('filename')
    def _import(filename):
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

    @app.cli.command('commits')
    @click.argument('repo')
    def _commits(repo):
        from src.services.github import update_commits
        update_commits(repo)

    @app.cli.command('report_all')
    def _report_all():
        i = 1
        softwares = db.software.find()
        for software in softwares:
            print('(%i / %i) generating report for %s' % (i, softwares.count(), software['id']))
            generate_impact_report(software['id'])
            i += 1

    @app.cli.command('cleanup')
    def _cleanup():
        """Cleanup unused keys (not in schema)"""
        for resource_type in ['software', 'person', 'project', 'organization']:
            for resource in db[resource_type].find():
                for key in resource:
                    if key not in ['id', '@id', '_id', 'schema'] and \
                            key not in db.schema.find_one({'_id': resource_type})['properties']:
                        print(resource['_id'] + ' ' + key)
                        db[resource_type].update({'_id' : resource['_id']}, {'$unset': { key: ''}})

    @app.cli.command('zotero_test')
    def _czp():
        from src.services.zotero import zotero_test
        zotero_test()

    @app.cli.command('zenodo_test')
    def _zt():
        from src.services.zenodo import version_info
        import pprint
        for software in [sw for sw in db['software'].find() if 'githubid' in sw]:
            print(software['githubid'])
            print(version_info(software['githubid']))
            print('\n')
        # pprint.pprint(version_info('NLeSC/Massive-PotreeConverter'))

                        # @app.cli.command('set_person_github')
    # def _set_person_github():
    #     table = db.table('person')
    #     result = table.search(Query().githubUrl.exists())
    #     for person in result:
    #         github_username = re.match(r'https://github.com/(.*)/?$', person['githubUrl']).group(1)
    #         table.update({"githubUser" : github_username}, Query().id == person['id'])
    #         print(github_username)

    # @app.cli.command('set_missing_github_usernames')
    # def _test():
    #     table = db.table('person')
    #     result = table.search((~Query().githubUrl.exists()) | (Query().githubUrl == ''))
    #     for person in result:
    #         print(person['id'])
    #         github_username = person['githubUser'] if ('githubUser' in person and person['githubUser'] != "") else input('Github username> ')
    #         if github_username == "": github_username = None
    #         url = None if github_username is None else ('https://github.com/'+github_username)
    #         table.update({"githubUser" : github_username, "githubUrl" : url }, Query().id == person['id'])

