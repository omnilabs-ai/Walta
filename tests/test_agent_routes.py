import requests

to_test = "createAgent"
user_id = "0MVmaqHYJTg7AhyiYfk9lVwIvJr2"

if to_test == "getAgent":
    json_data = {
        "userId": user_id
    }
elif to_test == "createAgent":
    json_data = {
        "userId": user_id,
        "agent_name": "Test Agent"
    }
elif to_test == "updateAgent":
    json_data = {
        "userId": user_id,
        "agentId": "9825e61b-fb16-470e-add0-5d58c5f88993",
        "updatedFields": {
            "agentName": "Updated Agent",
            "active": False
        }
    }
elif to_test == "deleteAgent":
    json_data = {
        "userId": user_id,
        "agentId": "8a1627b6-b1b8-4d21-87b3-4f69575036ec"
    }


response = requests.post(f"http://localhost:3000/api/agents/{to_test}", json=json_data)

if response.status_code == 200:
    print(f"Success {to_test}")
    print(response.json())
else:
    print(f"Error {to_test}")
    print(response.json())