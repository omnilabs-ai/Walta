import requests

to_test = "getUser"  # Change this to test different routes: "createUser" or "getUser"

user_id = "0MVmaqHYJTg7AhyiYfk9lVwIvJr2"

if to_test == "getUser":
    json_data = {
        "userId": user_id,
        # Optionally include specific params to fetch only certain fields
        # "params": ["user_name", "user_email"]
    }
elif to_test == "createUser":
    json_data = {
        "userId": user_id,
        "name": "Test User",
        "email": "test@test.com"
    }

response = requests.post(f"http://localhost:3000/api/user/{to_test}", json=json_data)

if response.status_code == 200:
    print(f"Success {to_test}")
    print(response.json())
else:
    print(f"Error {to_test}")
    print(response.text)