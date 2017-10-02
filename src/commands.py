import logging

import click

from src.services.database import db
from src.services.import_export import data_import, data_export
from src.services.original_data_importer import cleanup, import_original
from src.services.report import generate_impact_report

logger = logging.getLogger(__name__)


def init(app):
    @app.cli.command('impact_report')
    @click.argument('id')
    def _report(id):
        generate_impact_report(id)

    @app.cli.command('export')
    @click.argument('filename')
    def _export(filename):
        """export database to `filename` (.tar.gz)"""
        data_export(filename)

    @app.cli.command('import')
    @click.argument('filename')
    def _import(filename):
        """import exported `filename` to database"""
        data_import(filename)

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
        cleanup()

    @app.cli.command('import_old_data')
    def _import_oringinal():
        import_original()
