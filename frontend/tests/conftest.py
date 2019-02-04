def pytest_addoption(parser):
    parser.addoption("--live", action="store_true",
        help="run render tests with live data")
