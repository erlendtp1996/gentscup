import os
import boto3

# need to accept pagination & attribute list
def list_application_users():
    client = boto3.client('cognito-idp', 
        region_name=os.environ["AWS_DEFAULT_REGION"], 
        aws_access_key_id=os.environ["AWS_ACCESS_KEY"], 
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"]
    )

    #captain
    #commissioner
    #player
    userMap = {}
    get_users_in_groups(client, "captain", userMap)
    get_users_in_groups(client, "commissioner", userMap)
    get_users_in_groups(client, "player", userMap)

    users = []
    for username in userMap:
        users.append(userMap[username])
    return users

def get_users_in_groups(client, groupName, userMap):
    response = client.list_users_in_group(
        UserPoolId=os.environ["AWS_COGNITO_USER_POOL_ID"],
        GroupName=groupName
    )
    for user in response['Users']:
        if user['Username'] in userMap:
            # append group to groups
            userMap[user['Username']]['groups'].append(groupName)
        else:
            userWithAttributes = {}
            for attr in user["Attributes"]:
                userWithAttributes.update({ attr["Name"]: attr["Value"] })
            userWithAttributes.update({ "username": user["Username"], "groups": [groupName] })
            userMap.update({ user['Username']: userWithAttributes})