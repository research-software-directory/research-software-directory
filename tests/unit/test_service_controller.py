from src.service_controller import ServiceController


def test_makes_singletons():
    a = ServiceController({}, {'GITHUB_ACCESS_TOKEN': 12345})
    assert a.github is a.github
