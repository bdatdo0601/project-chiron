import boto3
import argparse


parser = argparse.ArgumentParser(description="Add User to Admin Group")
parser.add_argument("--username", type=str, help="user id that need to be added")
parser.add_argument("--userpool", type=str, help="userpool id that contain the group", default="us-east-1_dc519uwuR")


args = parser.parse_args()

client = boto3.client("cognito-idp")

response = client.admin_add_user_to_group(
    UserPoolId=args.userpool,
    Username=args.userID,
    GroupName="Admins"
)

print(response)