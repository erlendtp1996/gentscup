import sys
import unittest
from unittest.mock import patch
import requests
from functools import wraps

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

# !important thing - import of app after patch()
from main import app

"""

BEGIN TESTS FOR TEAM MEMBERS

For Reference:
assert response.json["data"]["user"]["name"] == "Flask"

"""

app.testing = True

TEAM_MEMBER_URL = "/api/cup/1/cupTeams/1/teamMembers"

"""
Invalid Request - Must have at least one team member to a team always
"""
def test_update_team_members_request_empty_array():
    response = app.test_client().put(TEAM_MEMBER_URL, json=[])
    assert response.status_code == 400

def test_update_team_members_request_empty_object():
    response = app.test_client().put(TEAM_MEMBER_URL, json={})
    assert response.status_code == 400


"""
Validate that a captain must be a part of every team for PUT requests
Cannot have more than one captain

Items to Mock: 

Database.__init__ -> validate it's called
Database.__init__ = MagicMock()
Database.__init__ = MagicMock(return_value=3)
Database.insert() -> validate it's called
Database.insert() = MagicMock(return_value=((), ()))
    Need to mock the response of tuples -> need to get this from the DB
Database.close() -> validate it's called
Database.close() = MagicMock(return_value=((), ()))

"""
def test_update_team_members_missing_captain():
    response = app.test_client().put(TEAM_MEMBER_URL, json=[
        {
            "userName": "thomas",
            "userEmail": "thomas@email.com",
        }
    ])
    assert response.status_code == 400


def test_update_team_members():
    response = app.test_client().put(TEAM_MEMBER_URL, json=[
        {
            "userName": "thomas",
            "userEmail": "thomas@email.com",
            "isCaptain": True
        }
    ])
    assert response.status_code == 200

def test_update_team_members_insert_additional():
    response = app.test_client().put(TEAM_MEMBER_URL, json=[
        {
            "userName": "thomas",
            "userEmail": "thomas@email.com",
            "isCaptain": True,
            "cupTeamMemberId": 1
        },
        {
            "userName": "Josh",
            "userEmail": "josh@email.com",
        }
    ])
    assert response.status_code == 200

def test_update_team_members_many_captains():
    response = app.test_client().put(TEAM_MEMBER_URL, json=[
        {
            "userName": "thomas",
            "userEmail": "thomas@email.com",
            "isCaptain": True
        },
        {
            "userName": "Josh",
            "userEmail": "josh@email.com",
            "isCaptain": True
        }
    ])
    assert response.status_code == 400


"""
TODO - add description
"""
def test_update_team_members_update_all():
    pass


"""
TODO - add description
"""
def test_update_team_members_validate_bullets():
    pass