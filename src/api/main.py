from flask import Flask, request, redirect, jsonify, send_file, session, abort
from integrations import Database
from model.cup import Cup, create_cup_entry, list_cups, get_single_cup
from model.cupTeam import CupTeam, create_cup_team_entry, update_cup_team_members, valid_num_of_captains, CupTeamMember, put_cup_team_members, list_teams_for_cup
from model.users import list_application_users

import os
import json

from flask_cognito_lib import CognitoAuth
from flask_cognito_lib.decorators import (
    auth_required,
    cognito_login,
    cognito_login_callback,
    cognito_logout
)

def read_env_vars():
    File_object = open(".env", "r")
    lines = File_object.readlines()
    for line in lines:
        var = line.split("=")
        os.environ[var[0]] = var[1].strip()
    File_object.close()


read_env_vars()
app = Flask(__name__, static_folder='./web/gentscup-spa/build', static_url_path='/')
app.secret_key = "98348934898934894893"

app.config['AWS_REGION'] = os.environ["AWS_DEFAULT_REGION"]
app.config['AWS_COGNITO_DOMAIN'] = os.environ["AWS_COGNITO_DOMAIN"]
app.config['AWS_COGNITO_USER_POOL_ID'] = os.environ["AWS_COGNITO_USER_POOL_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_ID'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_SECRET'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_SECRET"]
app.config['AWS_COGNITO_REDIRECT_URL'] = os.environ["AWS_COGNITO_REDIRECT_URL"]
app.config['AWS_COGNITO_LOGOUT_URL'] = os.environ["AWS_COGNITO_LOGOUT_URL"]
#FOR TESTING
app.config['AWS_COGNITO_EXPIRATION_LEEWAY'] = 50

aws_auth = CognitoAuth(app)

@app.errorhandler(500)
def system_error(e):
    return "System Error", 500

@app.errorhandler(400)
def bad_request(e):
    return "Bad Request", 400

#------------------------------------------------------------------------------------
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/api/sign_in")
@cognito_login
def sign_in():
    pass

@app.route("/api/token")
@cognito_login_callback
def postlogin():
    print(app.debug)
    if app.debug:
        print("I am in debug mode, redirecting to localhost:3000")
        return redirect(os.environ["REACT_HOST_URL"])
    return redirect(url_for("index"))

@app.route("/api/me", methods=["GET"])
@auth_required()
def me():
    claims = session["claims"]
    return jsonify({'claims': claims})

@app.route("/api/logout")
@cognito_logout
def logout():
    # Logout of the Cognito User pool and delete the cookies that were set
    # on login.
    # No logic is required here as it simply redirects to Cognito.
    pass

@app.route('/api/users', methods=["GET"])
@auth_required()
def list_users():
    users = list_application_users()
    return jsonify(users)

#------------------------------------------------------------------------------------
#Cup Table Endpoints
@app.route('/api/cups', methods=['POST'])
def create_cup():
    gentsCup = Cup(**request.json)
    if not gentsCup.isValidForInsert():
        abort(400)
    db = Database()
    create_cup_entry(gentsCup, db)
    db.close()
    return jsonify(gentsCup)

@app.route('/api/cups/<cupId>', methods=['GET'])
def get_cup(cupId):
    gentsCup = Cup(id=cupId)
    db = Database()
    gentsCup = get_single_cup(gentsCup, db)
    db.close()
    return jsonify(gentsCup)

@app.route('/api/cups', methods=['GET'])
def get_cups():
    db = Database()
    cups = list_cups(db)
    db.close()
    return jsonify(cups)

#------------------------------------------------------------------------------------
#Cup Team
@app.route('/api/cups/<cupId>/cupTeams', methods=['POST'])
def create_cup_team(cupId):
    gentsCupTeam = CupTeam(cupId=cupId, **request.json)
    if not gentsCupTeam.isValidForInsert():
        abort(400)
    db = Database()
    create_cup_team_entry(gentsCupTeam, db)
    db.close()
    return jsonify(gentsCupTeam)

@app.route('/api/cups/<cupId>/cupTeams', methods=['GET'])
def list_cup_teams(cupId):
    gentsCup = Cup(id=cupId)
    db = Database()
    teams = list_teams_for_cup(gentsCup, db)
    db.close()
    return jsonify(teams)

# UNDER DEV
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/cups/<cupId>/cupTeams/<cupTeamId>/teamMembers', methods=['PUT'])
def update_team_member(cupId, cupTeamId):
    
    #Up front validations
    if not type(request.json) == 'list' and len(request.json) < 1:
        abort(400)

    cupTeamMemberList = []
    for item in request.json:
        if 'cupTeamId' in item:
            cupTeamMemberList.append(CupTeamMember(**item))
        else:
            cupTeamMemberList.append(CupTeamMember(**item, cupTeamId=cupTeamId))

    if not valid_num_of_captains(cupTeamMemberList):
        abort(400)

    # TODO: validate total bullet count <= total team bullets

    db = Database()
    cupTeamMemberList = put_cup_team_members(cupTeamMemberList, db)
    db.close()

    return jsonify(cupTeamMemberList)