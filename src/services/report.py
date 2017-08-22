import json
import time
import src.services.libraries_io as libraries_io
import traceback
from src.database import get_resource_by_id
from collections import OrderedDict


filename = 'data/reports.json'


def load_reports():
    with open(filename) as reportsfile:
        reports = json.load(reportsfile, object_pairs_hook=OrderedDict)
        return reports


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
def generate_report_for_software(id):
    save_stub(id)
    report = get_report_for_software(id)
    save_report(id, report)


def get_report_for_software(id):
    software = get_resource_by_id('software', id)
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
    reports = load_reports()
    if id not in reports:
        reports[id] = []
    reports[id].append({
        'time_start': time.time(),
        'status': 'generating'
    })
    with open(filename, 'w') as file:
        file.write(json.dumps(reports, indent=4))


def save_report(id, report):
    reports = load_reports()

    stubs = [report for report in reports[id] if report['status'] == 'generating']
    stubs[0].update(report)

    with open(filename, 'w') as file:
        file.write(json.dumps(reports, indent=4))


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
