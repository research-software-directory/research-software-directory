import requests
import unittest
import esciencecenter_2_1_x_to_3_x as esciencecenter


class eScienceCenterTest(unittest.TestCase):

    def test_request_was_successful_success(self):
        response = requests.get("https://www.esciencecenter.nl/projects")
        actual_value = esciencecenter.request_was_successful(response)
        self.assertTrue(actual_value)

    def test_request_was_successful_failure(self):
        response = requests.get("https://www.esciencecenter.nl/projects/unknown-project.html")
        actual_value = esciencecenter.request_was_successful(response)
        self.assertFalse(actual_value)

    def test_is_project_url_success(self):
        actual_value = esciencecenter.is_project_url("https://www.esciencecenter.nl/projects/project.html")
        self.assertTrue(actual_value)

    def test_is_project_url_fails(self):
        actual_value = esciencecenter.is_project_url("https://www.esciencecenter.nl/projects/")
        self.assertFalse(actual_value)

    def test_remove_titles(self):
        actual_value = esciencecenter.remove_titles("Prof.Mr.Dr.Drs.Ir. John Smith, PhD MSc BSc MA")
        expected_value = "John Smith"
        self.assertEqual(expected_value, actual_value)

    def test_remove_tags(self):
        actual_value = esciencecenter.remove_tags('<a href="url">text</a>')
        expected_value = "text"
        self.assertEqual(expected_value, actual_value)

    def test_replace_paragraph_tags(self):
        actual_value = esciencecenter.replace_paragraph_tags('<p>text</p>')
        expected_value = "\n\ntext\n\n"
        self.assertEqual(expected_value, actual_value)

    def test_make_person_name_basic(self):
        actual_value = esciencecenter.make_person_name({"givenNames":"John","familyNames":"Smith","nameParticle":"","nameSuffix":""})
        expected_value = "John Smith"
        self.assertEqual(expected_value, actual_value)

    def test_make_person_name_complex(self):
        actual_value = esciencecenter.make_person_name({"givenNames":"Jan","familyNames":"Jong","nameParticle":"de","nameSuffix":"jr."})
        expected_value = "Jan de Jong jr."
        self.assertEqual(expected_value, actual_value)

    def test_split_name_basic(self):
        actual_value = esciencecenter.split_name("John Smith")
        expected_value = ("John","","Smith")
        self.assertEqual(expected_value, actual_value)

    def test_split_name_complex(self):
        actual_value = esciencecenter.split_name("Jan de Jong jr.")
        expected_value = ("Jan","de","Jong jr.")
        self.assertEqual(expected_value, actual_value)

    def test_get_suffix(self):
        actual_value = esciencecenter.get_suffix("file.png")
        expected_value = "png"
        self.assertEqual(expected_value, actual_value)

    def test_fix_role(self):
        actual_value = esciencecenter.fix_role("COMMUNITY MANAGER & TECHNICAL LEAD")
        expected_value = "Community Manager"
        self.assertEqual(expected_value, actual_value)

    def test_guess_affiliations_engineer(self):
        actual_value = esciencecenter.guess_affiliation({"role":"eScience Research Engineer"},[])
        expected_value = {"role":"eScience Research Engineer","affiliations":[{"foreignKey":{"id":"nlesc","collection":"organization"}}]}
        self.assertEqual(expected_value, actual_value)

    def test_guess_affiliations_pi(self):
        actual_value = esciencecenter.guess_affiliation({"role":"Principal investigator"},["University"])
        expected_value = {"role":"Principal investigator","affiliations":["University"]}
        self.assertEqual(expected_value, actual_value)

    def test_make_url_secure(self):
        actual_value = esciencecenter.make_url_secure("http://fix.me")
        expected_value = "https://fix.me"
        self.assertEqual(expected_value, actual_value)


if __name__ == '__main__':
    unittest.main()
