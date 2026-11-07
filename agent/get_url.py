import boto3

# Explicitly load the 'digital-twin' profile
session = boto3.Session(profile_name="digital-twin-dev", region_name="ap-south-1")
client = session.client("lambda")

try:
    response = client.create_function_url_config(
        FunctionName="digital-twin-agentcore-backend",
        AuthType="NONE",
        Cors={
            "AllowOrigins": ["*"],
            "AllowMethods": ["POST"],
            "AllowHeaders": ["content-type"]
        }
    )
    print("SUCCESS! Your Lambda Function URL:")
    print(response["FunctionUrl"])
except Exception as e:
    if "ResourceInUseException" in str(e):
        res = client.get_function_url_config(FunctionName="digital-twin-agentcore-backend")
        print("URL already exists. Your Lambda Function URL:")
        print(res["FunctionUrl"])
    else:
        print(f"Error: {e}")