import requests

to_test = "deleteProduct"

user_id = "0MVmaqHYJTg7AhyiYfk9lVwIvJr2"
product_id = "d6527ea2-9acd-4fd8-99ad-9b0009e453e1"


if to_test == "getProduct":
    json_data = {
        "userId": user_id,
    }
elif to_test == "createProduct":
    json_data = {
        "userId": user_id,
        "name": "Test Product",
        "description": "This is a test product",
        "price": 19.99
    }
elif to_test == "updateProduct":
    json_data = {
        "userId": user_id,
        "productId": product_id,
        "updateData": {
            "name": "Updated Product",
            "description": "Updated description",
            "price": 29.99
        }
    }
elif to_test == "deleteProduct":
    json_data = {
        "userId": user_id,
        "productId": product_id
    }

response = requests.post(f"http://localhost:3000/api/products/{to_test}", json=json_data)

if response.status_code == 200:
    print(f"Success {to_test}")
    print(response.json())
else:
    print(f"Error {to_test}")
    print(response) 