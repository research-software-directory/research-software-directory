import pytest

from app.application import get_project_mentions
from tests.helpers import get_json_mock

project_without_mentions = [get_json_mock('projects/emetabolomics_without_mentions.json')]
project_with_output = [get_json_mock('projects/many-core-boost_with_output.json')]
project_with_impact = [get_json_mock('projects/many-core-boost_with_impact.json')]
mention1 = [{
    'date': "2017-11-13T00:00:00Z",
    'title': "PyXenon 2.2.0: Python interface to Xenon 2.2",
    'url': "https://doi.org/10.5281/zenodo.1045888"
}]


@pytest.mark.parametrize('projects, expected', [
    pytest.param([], [], id='empty project list'),
    pytest.param(project_without_mentions, [], id='project without mentions'),
    pytest.param(project_with_output, mention1, id='project with single output'),
    pytest.param(project_with_impact, mention1, id='project with single impact'),
])
def test_get_project_mentions(projects, expected):
    result = get_project_mentions(projects)
    assert expected == result
