import time
import src.services.libraries_io as libraries_io
import traceback
from src.database import db

# 3 AnalyticalGraphicsInc/cesium
# 6 interedition/collatex
# 3 TNOCS/csWeb
# 1 benvanwerkhoven/kernel_tuner
# 1 NLeSC/mcfly
# 1 NLeSC/noodles
# 1 sara-nl/picasclient
# 1 nlesc-sherlock/punchcardjs
# 1 NLeSC/pyxenon
# 1 recipy/recipy
# 1 nlesc-sherlock/spiraljs
def generate_impact_report(id):
    save_stub(id)
    report = get_report_for_software(id)
    save_report(id, report)


def get_report_for_software(id):
    software = db.software.find_one({'id': id})
    try:
        return {
            'libraries_io': get_libraries_io_info(software['githubid']),
            'time_end': time.time(),
            'status': 'done'
        }
    except Exception as exception:
        return {
            'time_end': time.time(),
            'status': 'failed',
            'exception':  {
                "error": str(exception),
                "class": exception.__class__.__name__,
                "traceback": traceback.format_tb(exception.__traceback__),
            }
        }


def save_stub(id):
    db.impact_report.insert({
        'software_id': id,
        'time_start': time.time(),
        'status': 'generating'
    })


def save_report(id, report):
    db.impact_report.update({
        'software_id': id,
        'status': 'generating'
    }, {
        '$set': report
    })


def get_libraries_io_info(github_id):
    libraries_io_projects = libraries_io.get_projects(github_id)
    if not libraries_io_projects:
        return None
    else:
        projects = [{
            'platform': project['platform'],
            'name':     project['name'],
            'rank':     project['rank'],
            'stars':    project['stars'],
            'forks':    project['forks']
        } for project in libraries_io_projects]

        for project in projects:
            project['dependencies'] = libraries_io.get_dependencies(project)

        return projects
