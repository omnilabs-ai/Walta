import requests

to_test = "createAgent"

if to_test == "getAgent":
    json_data = {
        "userId": "0MVmaqHYJTg7AhyiYfk9lVwIvJr2"
    }
elif to_test == "createAgent":
    json_data = {
        "userId": "0MVmaqHYJTg7AhyiYfk9lVwIvJr2",
        "agentName": "Test Agent"
    }
elif to_test == "updateAgent":
    json_data = {
        "userId": "0MVmaqHYJTg7AhyiYfk9lVwIvJr2",
        "agentId": "0e064de2-99ce-47a7-ba06-bb5eec375041",
        "updatedFields": {
            "agentName": "Updated Agent",
            "active": False
        }
    }
elif to_test == "deleteAgent":
    json_data = {
        "userId": "0MVmaqHYJTg7AhyiYfk9lVwIvJr2",
        "agentId": "0e064de2-99ce-47a7-ba06-bb5eec375041"
    }


response = requests.post(f"http://localhost:3000/api/agents/{to_test}", json=json_data)

if response.status_code == 200:
    print(f"Success {to_test}")
    print(response.json())
else:
    print(f"Error {to_test}")
    print(response)