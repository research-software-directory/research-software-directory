from celery.schedules import crontab

from src.tasks import app, zotero_sync, blogs_sync, projects_sync, report_all

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(2 * 60 * 60, zotero_sync.s(), name='Zotero sync')
    sender.add_periodic_task(2 * 60 * 60, blogs_sync.s(), name='Corporate blogs sync')
    sender.add_periodic_task(2 * 60 * 60, projects_sync.s(), name='Corporate projects sync')

    #Every night 2 oclock
    sender.add_periodic_task(
        crontab(hour=2, minute=0),
        report_all,
        name='Full report for all software'
    )

