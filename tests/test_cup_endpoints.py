import sys
import unittest
from unittest.mock import patch
from unittest.mock import MagicMock
import requests
from functools import wraps
import os

sys.path.append(os.getcwd() + '/src/api')

#mock authentication decorator
def mock_authentication(groups=[]):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            return f(*args, **kwargs)
        return decorated_function
    return decorator

patch('flask_cognito_lib.decorators.auth_required', mock_authentication).start()

class MockDB:
    def __init__(self):
        self.testing = True

patch('integrations.Database', MockDB).start()

# !important thing - import of app after patch()
from main import app, Database
from integrations import Database
"""

BEGIN TESTS FOR CUPS

For Reference:
assert response.json["data"]["user"]["name"] == "Flask"

"""

app.testing = True

CUPS_URL = "/api/cups"

def test_list_cups():
    db = Database()
    print (db.testing)
    #assert db.testing == True
    #response = app.test_client().get(CUPS_URL)
    #assert response.status_code == 400
    assert db.testing == True