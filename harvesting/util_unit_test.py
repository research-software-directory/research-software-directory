import unittest
import requests
from releases import rate_limit_reached


class RateLimitReachedTest(unittest.TestCase):

    def test_rate_limit_reached_none_input(self):
        actual_return = rate_limit_reached(None)
        expected_return = True
        self.assertEqual(expected_return, actual_return)

    def test_rate_limit_reached_irrelevant_url_input(self):
        r = requests.get("https://esciencecenter.nl", headers={})
        actual_return = rate_limit_reached(r)
        expected_return = True
        self.assertEqual(expected_return, actual_return)


if __name__ == '__main__':
    unittest.main()
