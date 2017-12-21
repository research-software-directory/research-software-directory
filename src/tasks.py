from src.settings import settings
from celery import Celery
from celery.utils.log import get_task_logger
from src.database.database_mongo import MongoDatabase
from src.service_controller import ServiceController
from celery.signals import after_task_publish,task_success,task_prerun,task_postrun

logger = get_task_logger(__name__)

app = Celery('tasks', backend=settings.get('CELERY_BACKEND_URL'), broker=settings.get('CELERY_BROKER_URL'))
db = None

def prerun(**kwargs):
    global db
    logger.info('Prerunning')
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
def add(x, y):
    logger.info('Adding {0} + {1}'.format(x, y))
    logger.info(db['software'])
    return x + y




@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))  # pragma: no cover
