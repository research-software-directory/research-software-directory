import logging
import time
import subprocess
import os

logger = logging.getLogger(__name__)

request_times = {}


def rate_limit(name, calls, period):
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


def worker(*args):
    env = os.environ.copy()
    env['FLASK_APP'] = './src/server.py'
    subprocess.Popen(["flask", *args], env=env)
