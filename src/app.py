from flask import Flask
import logging
logger = logging.getLogger(__name__)

logger.info('init app')
app = Flask(__name__)
