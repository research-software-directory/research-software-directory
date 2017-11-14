import time
import traceback

# import src.services.libraries_io as libraries_io
# from src.database.database import db
# from src.services.github import update_commits, get_github_repo


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

def format_exception(exception):
    return {
        "error": str(exception),
        "class": exception.__class__.__name__,
        "traceback": traceback.format_tb(exception.__traceback__),
    }


def guard(func):
    """guard surrounds func with try/catch block and outputs a
       dict representation of exception instead of raising
    :param func: function to guard
    :return: func output | { error: str, class: str, traceback: trace[] }
    """
    def func_wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return format_exception(e)
    return func_wrapper


class ImpactReportService:
    def __init__(self, db, github_service, libraries_io_service):
        self.libraries_io_service = libraries_io_service
        self.github_service = github_service
        self.db = db

    def generate_impact_report(self, id):
        self.save_stub(id)
        report = self.get_report_for_software(id)
        self.save_report(id, report)

    def get_report_for_software(self, id):
        software = self.db.software.find_by_id(id)
        try:
            return {
                'libraries_io': self.get_libraries_io_info(software['githubid']),
                'github': self.get_github_info(id, software['githubid']),
                'time_end': time.time(),
                'status': 'done'
            }
        except Exception as exception:
            return {
                'time_end': time.time(),
                'status': 'failed',
                'exception':  format_exception(exception)
            }

    def save_stub(self, id):
        data = {
            'software_id': id,
            'time_start': time.time(),
            'status': 'generating'
        }
        report = self.db.impact_report.new(data)
        print(report.data)
        report.save(False)

    def save_report(self, id, report_data):
        report = self.db.impact_report.find({
            'software_id': id,
            'status': 'generating'
        }).next()
        report.data.update(report_data)
        # print(report)
        report.save(False)

    @guard
    def get_github_info(self, software_id, github_id):
        @guard
        def repo_info(github_id):
            return self.github_service.get_github_repo(github_id)

        @guard
        def get_github_commit_info(software_id):
            self.github_service.update_commits(software_id)
            return [commit.data for commit in list(self.db.commit.find({'software_id': software_id}))]

        return {
            'commits': get_github_commit_info(software_id),
            'repo': repo_info(github_id)
        }

    @guard
    def get_libraries_io_info(self, github_id):
        libraries_io_projects = self.libraries_io_service.get_projects(github_id)
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
                project['dependencies'] = self.libraries_io_service.get_dependencies(project)

            return projects
