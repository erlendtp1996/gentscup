import pytest
from functools import wraps
from unittest.mock import patch

#mock authentication decorator
def mock_authentication(groups=[]):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            return f(*args, **kwargs)
        return decorated_function
    return decorator

patch('flask_cognito_lib.decorators.auth_required', mock_authentication).start()
# !important thing - import of app after patch()
from main import app

app.testing = True

def test_api_me():
    response = app.test_client().get('/api/me')
    assert response.status_code == 200


def test_list_cups():
    return None

def test_get_cup():
    return None




test_api_me()