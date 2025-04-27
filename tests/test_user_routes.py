import requests

json_data = {
    "userId": "0MVmaqHYJTg7AhyiYfk9lVwIvJr2",
    "name": "Test User",
    "email": "test@test.com"
}

response = requests.post("http://localhost:3000/api/user/createUser", json=json_data)

if response.status_code == 200:
    print("User created successfully")
    print(response.json())
else:
    print("Error creating user")
    print(response)