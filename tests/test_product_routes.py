import requests

to_test = "createProduct"

user_id = "0MVmaqHYJTg7AhyiYfk9lVwIvJr2"
product_id = "e4f2d007-f9bb-4da4-9ead-0cb0420e12a7"


if to_test == "getProduct":
    json_data = {
        "userId": user_id,
    }
elif to_test == "createProduct":
    json_data = {
        "userId": user_id,
        "name": "Test Product",
        "description": "This is a test product",
        "price": 19.99,
        "type": "test",
        "vendorName": "Test Vendor"
    }
elif to_test == "updateProduct":
    json_data = {
        "productId": product_id,
        "updateData": {
            "name": "Updated Product",
            "description": "Updated description",
            "price": 29.99,
            "type": "test",
            "vendorName": "Updated Vendor"
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
    print(response.json()) 