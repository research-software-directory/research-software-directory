import os
from src.settings import settings
from celery import Celery
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

app = Celery('tasks', backend=settings.get('CELERY_BACKEND_URL'), broker=settings.get('CELERY_BROKER_URL'))


@app.task
def add(x, y):
    logger.info('Adding {0} + {1}'.format(x, y))
    return x + y

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))  # pragma: no cover
