def pytest_configure(config):
    config.addinivalue_line(
        "markers", "live: Test against server of BACKEND_URL env var"
    )
