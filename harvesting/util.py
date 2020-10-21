import logging
import time
import os

import jwt
import pymongo

logger = logging.getLogger(__name__)

request_times = {}


def rate_limit(name, calls, period):
    """
        Decorator to limit the rate of function calls
        use eg. @rate_limit('some_api', 60, 60) to limit to 60 calls/minute

        :param name: name to use limit on several functions
        :type name: string
        :param calls: number of calls allowed per period
        :type calls: int
        :param period: period where #calls are allowed (in seconds)
        :type period: int
        :return: wrapper
    """

    def wrapper(func):
        def func_wrapper(*args, **kwargs):
            if name not in request_times:
                request_times[name] = []
            while len(request_times[name]) >= calls:
                sleep_for = period - (time.time() - min(request_times[name]))
                if sleep_for > 1:
                    logger.info('Rate limit hit for "%s", sleeping for %f seconds', name, sleep_for)
                time.sleep(max([sleep_for, 0]))
                request_times[name] = [
                    timestamp for timestamp in request_times[name]
                    if (time.time() - timestamp) < period
                ]
            request_times[name].append(time.time())
            return func(*args, **kwargs)

        return func_wrapper

    return wrapper


def generate_jwt_token(name='Scraper', read=True, write=True):
    permissions = []
    if read:
        permissions.append('read')
    if write:
        permissions.append('write')
    payload = {
        'sub': name,
        'subType': 'TASK_ISSUED',
        'permissions': permissions,
        'iat': round(time.time())
    }
    issued_jwt = jwt.encode(payload, os.environ.get('JWT_SECRET'), algorithm='HS256')
    return issued_jwt.decode('ascii')


def db_connect():
    return pymongo.MongoClient(host=os.environ.get('DATABASE_HOST'),
                               port=int(os.environ.get('DATABASE_PORT')),
                               connectTimeoutMS=100,
                               serverSelectionTimeoutMS=100
                               )[os.environ.get('DATABASE_NAME')]

def rate_limit_reached(requests_response):
    if requests_response is None:
        return True
    rate_limit_remaining = requests_response.headers.get('x-ratelimit-remaining', None)
    if rate_limit_remaining is None:
        return True
    if int(rate_limit_remaining) < 10:
        return True
    return False
