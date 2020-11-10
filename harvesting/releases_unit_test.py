import unittest
from releases import ReleaseScraper


class ReleaseScraperTest(unittest.TestCase):

    def test_conceptdoi_is_none(self):
        conceptdoi = None
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "record has no doi value of any kind."
        self.assertEqual(expected_message, actual_message)

    def test_conceptdoi_is_not_a_string(self):
        conceptdoi = {
            "a": 4,
            "b": "the_string"
        }
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "doi should be a string."
        self.assertEqual(expected_message, actual_message)

    def test_conceptdoi_is_empty_string(self):
        conceptdoi = ""
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "doi should not be an empty string."
        self.assertEqual(expected_message, actual_message)


if __name__ == '__main__':
    unittest.main()
