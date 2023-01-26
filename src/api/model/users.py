import os
import boto3

# need to accept pagination & attribute list
def list_application_users():
    client = boto3.client('cognito-idp', 
        region_name=os.environ["AWS_DEFAULT_REGION"], 
        aws_access_key_id=os.environ["AWS_ACCESS_KEY"], 
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"])

    response = client.list_users(
        UserPoolId=os.environ["AWS_COGNITO_USER_POOL_ID"],
        AttributesToGet=[
            'email'
        ],
        Limit=10,
    )
    
    #need to flatten response before returning
    users = []

    for user in response["Users"]:
        userWithAttributes = {}
        for attr in user["Attributes"]:
            userWithAttributes.update({ attr["Name"]: attr["Value"] })
        userWithAttributes.update({ "username": user["Username"] })
        users.append(userWithAttributes)

    return users