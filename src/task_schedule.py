from celery.schedules import crontab

from src.tasks import app, zotero_sync, blogs_sync, projects_sync, people_sync, commits_sync

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(2 * 60 * 60, zotero_sync.s(), name='Zotero sync')
    sender.add_periodic_task(2 * 60 * 60, blogs_sync.s(), name='Corporate blogs sync')
    sender.add_periodic_task(2 * 60 * 60, projects_sync.s(), name='Corporate projects sync')
    sender.add_periodic_task(2 * 60 * 60, people_sync.s(), name='Corporate people sync')

    #Every night 2 oclock
    sender.add_periodic_task(
        crontab(hour=2, minute=0),
        commits_sync,
        name='Sync software github commits'
    )

