from flask import Flask, request, redirect, url_for, make_response, jsonify
from flask_awscognito import AWSCognitoAuthentication
from common.env import read_env_vars
from db.db_connector import get_users
import os

read_env_vars()

app = Flask(__name__)

app.config['AWS_DEFAULT_REGION'] = os.environ["AWS_DEFAULT_REGION"]
app.config['AWS_COGNITO_DOMAIN'] = os.environ["AWS_COGNITO_DOMAIN"]
app.config['AWS_COGNITO_USER_POOL_ID'] = os.environ["AWS_COGNITO_USER_POOL_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_ID'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_ID"]
app.config['AWS_COGNITO_USER_POOL_CLIENT_SECRET'] = os.environ["AWS_COGNITO_USER_POOL_CLIENT_SECRET"]
app.config['AWS_COGNITO_REDIRECT_URL'] = os.environ["AWS_COGNITO_REDIRECT_URL"]

aws_auth = AWSCognitoAuthentication(app)

read_env_vars()

@app.route('/')
@aws_auth.authentication_required
def index():
    claims = aws_auth.claims # or g.cognito_claims
    return jsonify({'claims': claims})

@app.route("/sign_in")
def sign_in():
    return redirect(aws_auth.get_sign_in_url())

@app.route('/aws_cognito_redirect')
def aws_cognito_redirect():
    access_token = aws_auth.get_access_token(request.args)
    return jsonify({'access_token': access_token})

@app.route('/secret')
@aws_auth.authentication_required
def authenticated_endpoint(): 
    return jsonify({'testing': 'hello, there'})

@app.route('/users')
@aws_auth.authentication_required
def list_users():
    return jsonify({'users': get_users()})
