import json
import logging
import pprint
import re
import subprocess
from os import walk

import click

from src.database import sync_db
from src.services.report import generate_report_for_software

logger = logging.getLogger(__name__)

def init(app, db):
    @app.cli.command('report')
    @click.argument('id')
    def _report(id):
        generate_report_for_software(id)

    @app.cli.command('fill_software_github_id')
    def _fillswghid():
        for index, software in enumerate(db['software']):
            if 'githubid' not in software and 'codeRepository' in software:
                matches = re.match(r'https://github.com/(.*?/.*?)/?$', str(software['codeRepository']))
                if matches:
                    db['software'][index]['githubid'] = matches.group(1)
        sync_db()

    @app.cli.command('bundleschema')
    def _bundleschemas():
        schema = {}
        for (_, _, files) in walk('schema'):
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
    
