from src.settings import settings
from celery import Celery
from celery.utils.log import get_task_logger
from src.database.database_mongo import MongoDatabase
from src.service_controller import ServiceController
from celery.signals import after_task_publish,task_success,task_prerun,task_postrun

logger = get_task_logger(__name__)

app = Celery('tasks', backend=settings.get('CELERY_BACKEND_URL'), broker=settings.get('CELERY_BROKER_URL'))
db = None
service_controller = None

def prerun(**kwargs):
    global db, service_controller
    db = MongoDatabase(settings['DATABASE_HOST'],
        settings['DATABASE_PORT'],
        settings['DATABASE_NAME'],
        )
    service_controller = ServiceController(db, settings)

def postrun(**kwargs):
    db.close()

task_prerun.connect(prerun)
task_postrun.connect(postrun)

@app.task
def zotero_sync():
    logger.info('Syncing Zotero')
    service_controller.zotero.sync_publications()

@app.task
def blogs_sync():
    logger.info('Syncing blogs')
    service_controller.corporate.sync_blogs()

@app.task
def projects_sync():
    logger.info('Syncing projects')
    service_controller.corporate.sync_projects()

@app.task
def people_sync():
    logger.info('Syncing people')
    service_controller.corporate.sync_people()

@app.task
def commits_sync():
    logger.info('Syncing github commits')
    i = 1
    softwares = db.software.all()
    for software in softwares:
        logger.info('(%i / %i) updating github commit history for %s' % (i, softwares.count(), software['id']))
        service_controller.github.update_commits(software['id'])
        i += 1

@app.task
def report_all():
    i = 1
    softwares = db.software.all()
    for software in softwares:
        logger.info('(%i / %i) generating report for %s' % (i, softwares.count(), software['id']))
        service_controller.impact_report.generate_impact_report(software['id'])
        i += 1