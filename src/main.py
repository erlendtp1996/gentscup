from flask import Flask, request, redirect, jsonify, send_file, session
from common.env import read_env_vars
from model.cup import create_cup_entry, list_cups
from model.users import list_application_users

import os
import json

from flask_cognito_lib import CognitoAuth
from flask_cognito_lib.decorators import (
    auth_required,
    cognito_login,
    cognito_login_callback,
)

read_env_vars()

app = Flask(__name__, static_folder='./web/gentscup-spa/build', static_url_path='/')
app.secret_key = "98348934898934894893"

app.config['AWS_REGION'] = os.environ["AWS_DEFAULT_REGION"]
app.config['AWS_COGNITO_DOMAIN'] = os.environ["AWS_COGNITO_DOMAIN"]
app.config['AWS_COGNITO_USER_POOL_ID'] = os.environ["AWS_COGNITO_USER_POOL_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_ID'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_SECRET'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_SECRET"]
app.config['AWS_COGNITO_REDIRECT_URL'] = os.environ["AWS_COGNITO_REDIRECT_URL"]

aws_auth = CognitoAuth(app)

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

#Authenticated Endpoints
@app.route("/api/me", methods=["GET"])
@auth_required()
def me():
    claims = session["claims"]
    return jsonify({'claims': claims})

@app.route('/api/users', methods=["GET"])
@auth_required()
def list_users():
    users = list_application_users()
    return jsonify(users)

@app.route('/api/cup', methods=['POST'])
def create_cup():
    response = None
    try:
        response = create_cup_entry(**request.json)
        response = jsonify(response)
    except:
        response = "Bad request", 400
    return response


@app.route('/api/cups', methods=['GET'])
def get_cups():
    response = None
    try:
        response = list_cups()
        response = jsonify(response)
    except:
        response = "Error processing request", 500
    return response