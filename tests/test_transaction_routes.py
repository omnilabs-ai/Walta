import requests

to_test = "createTransaction"

user_id = "0MVmaqHYJTg7AhyiYfk9lVwIvJr2"
# Using a valid agent ID from the examples
from_agent_id = "7506c6f1-00b0-4230-a8ad-3239575e6463"
# For transactions, we need both a sender and receiver
to_user_id = "TEST_USER"  # Can be same user for testing

if to_test == "getTransaction":
    json_data = {
        "userId": user_id,
        # Uncomment and add a transaction ID if you want to get a specific transaction
        # "transactionId": "transaction_id_here"
    }
elif to_test == "createTransaction":
    json_data = {
        "userId": user_id,
        "transaction": {
            "from_user_id": user_id,
            "to_user_id": to_user_id,
            "from_agent_id": from_agent_id,
            "amount": 25.99,
            "description": "Test transaction",
            "status": "completed"
        }
    }

response = requests.post(f"http://localhost:3000/api/transactions/{to_test}", json=json_data)

if response.status_code == 200:
    print(f"Success {to_test}")
    print(response.json())
else:
    print(f"Error {to_test}")
    print(response.text) 