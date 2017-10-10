""" test for UserService
    tests UserService if there is an available github_access_token (normally you get this from user via github)
"""
from src.exceptions import UnauthorizedException
from src.services import user
from src.settings import settings
from flask import Flask, request
import pytest

if settings.get('GITHUB_ACCESS_TOKEN'):
    token = settings.get('GITHUB_ACCESS_TOKEN')

    @pytest.fixture(autouse=True)
    def service():
            return user.UserService(settings['GITHUB_CLIENT_ID'],
                                    settings['GITHUB_CLIENT_SECRET'],
                                    )

    def test_get_user(service):
        user = service.get_user(token)
        assert user.get('url')

    def test_user_in_organization(service):
        result = service.user_in_organization(token, 'NLeSC')
        assert result

    def test_wrapper_no_token(service):
        with pytest.raises(UnauthorizedException) as excinfo:
            app = Flask('test')
            with app.test_request_context():
                @service.require_organization('test')
                def test():
                    pass
                test()

    def test_wrapper_unauthorized(service):
        with pytest.raises(UnauthorizedException) as excinfo:
            app = Flask('test')
            with app.test_request_context(headers={'Token': token}):
                @service.require_organization('no_access_organization')
                def test():
                    pass

                test()

    def test_wrapper_authorized(service):
        app = Flask('test')
        with app.test_request_context(headers={'Token': token}):
            @service.require_organization('NLeSC')
            def test():
                pass
            test()
