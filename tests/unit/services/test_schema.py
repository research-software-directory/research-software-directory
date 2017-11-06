from src.database.database_dict import DictDatabase
from src.services import schema
import pytest
@pytest.fixture(autouse=True)
def db():
    return DictDatabase({
        'software': [
            {
                'id': 'research-software-directory-backend',
                'githubid': 'nlesc/research-software-directory-backend'
            }
        ]
    })

@pytest.fixture(autouse=True)
def service(db):
    return schema.SchemaService(db)

def test_service_exists(service):
    assert service is not None

def test_has_extra_properties(service):
    assert service.schema['software']['properties']['createdAt']['editable'] is False