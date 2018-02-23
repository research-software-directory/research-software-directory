import logging

import click

logger = logging.getLogger(__name__)


def init(app, service_controller, db):
    @app.cli.command('impact_report')
    @click.argument('id')
    def _report(id):
        service_controller.impact_report.generate_impact_report(id)

    @app.cli.command('report_all')
    def _report_all():
        i = 1
        softwares = db.software.all()
        for software in softwares:
            print('(%i / %i) generating report for %s' % (i, softwares.count(), software['id']))
            service_controller.impact_report.generate_impact_report(software['id'])
            i += 1

    @app.cli.command('commits')
    @click.argument('repo')
    def _commits(repo):
        service_controller.github.update_commits(repo)

    @app.cli.command('verify_data')
    def _verify_data():
        service_controller.schema.verify_data()

    @app.cli.command('set_descriptions')
    def _descriptions():
        service_controller.original_data_importer.set_descriptions()

    @app.cli.command('list_projects')
    def _projects():
        service_controller.zotero.list_projects()

    @app.cli.command('zotero_sync_publications')
    def _zotero_publications():
        service_controller.zotero.sync_publications()
