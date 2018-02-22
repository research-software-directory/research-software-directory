import time

from src.helpers import util


def test_rate_limit():
    @util.rate_limit('test', 10, 1)
    def test_dummy():
        pass

    start_time = time.time()
    for i in range(0, 25):
        test_dummy()

    assert 2 < (time.time() - start_time) < 2.5

