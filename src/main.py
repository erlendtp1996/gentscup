from flask import Flask, request, redirect, jsonify, send_file
from flask_awscognito import AWSCognitoAuthentication
from common.env import read_env_vars
from model.cup import create_cup_entry
from model.users import list_application_users

import os
import json

read_env_vars()

app = Flask(__name__, static_folder='./web/gentscup-spa/build', static_url_path='/')

app.config['AWS_DEFAULT_REGION'] = os.environ["AWS_DEFAULT_REGION"]
app.config['AWS_COGNITO_DOMAIN'] = os.environ["AWS_COGNITO_DOMAIN"]
app.config['AWS_COGNITO_USER_POOL_ID'] = os.environ["AWS_COGNITO_USER_POOL_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_ID'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_SECRET'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_SECRET"]
app.config['AWS_COGNITO_REDIRECT_URL'] = os.environ["AWS_COGNITO_REDIRECT_URL"]

aws_auth = AWSCognitoAuthentication(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/api/sign_in")
def sign_in():
    return redirect(aws_auth.get_sign_in_url())

@app.route('/api/token', methods=["POST"])
def aws_cognito_redirect():
    print ("here")
    access_token = aws_auth.get_access_token(request.json)
    return jsonify({'access_token': access_token})

#Authenticated Endpoints
@app.route("/api/me", methods=["GET"])
@aws_auth.authentication_required
def me():
    claims = aws_auth.claims
    return jsonify({'claims': claims})

@app.route('/api/users', methods=["GET"])
@aws_auth.authentication_required
def list_users():
    users = list_application_users()
    return jsonify(users)

@app.route('/api/cup', methods=['POST'])
@aws_auth.authentication_required
def create_cup():
    response = None
    try:
        response = create_cup_entry(**request.json)
        response = jsonify(response)
    except:
        response = "Bad request", 400
    return response