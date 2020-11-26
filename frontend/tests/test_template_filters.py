import pytest
from app.application import human_name_filter

@pytest.mark.parametrize('person, expected', [
    ({
        'givenNames': 'x',
        'familyNames': 'y',
    }, 'x y'),
    ({
        'nameParticle': 'de',
        'givenNames': 'x',
        'familyNames': 'y',
    }, 'x de y'),
    ({
        'givenNames': 'x',
        'familyNames': 'y',
        'nameSuffix': 'Jr.',
    }, 'x y Jr.'),
])
def test_human_name_filter(person, expected):
    result = human_name_filter(person)

    assert result == expected
