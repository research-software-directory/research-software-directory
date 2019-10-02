import unittest
from releases import ReleaseScraper


class ReleaseScraperTest(unittest.TestCase):

    def test_conceptdoi_cannot_be_resolved(self):
        conceptdoi = "10.0000/FIXME"
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "error resolving doi."
        self.assertEqual(expected_message, actual_message)

    def test_conceptdoi_is_not_a_zenodo_doi(self):
        # just a random, valid doi to a publicly accessible paper
        conceptdoi = "10.5194/hess-17-3455-2013"
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "doi is not a Zenodo doi."
        self.assertEqual(expected_message, actual_message)

    def test_conceptdoi_is_not_a_concept_doi(self):
        # use a zenodo versioned doi
        conceptdoi = "10.5281/zenodo.1154131"
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "doi is not a concept doi."
        self.assertEqual(expected_message, actual_message)

    def test_conceptdoi_no_releases_with_valid_cff(self):
        # use a doi that has no associated releases with valid CFF data
        conceptdoi = "10.5281/zenodo.1193639"
        self.scraper = ReleaseScraper(conceptdoi)
        actual_message = self.scraper.message
        expected_message = "no valid CITATION.cff found in any release."
        self.assertEqual(expected_message, actual_message)


if __name__ == '__main__':
    unittest.main()
