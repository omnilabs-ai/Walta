import requests
import json

to_test = "getProduct"

product_id = "e4f2d007-f9bb-4da4-9ead-0cb0420e12a7"
metadata = json.dumps({'bathrooms': '1'})

if to_test == "getProduct":
    response = requests.get(f"http://localhost:3000/api/v1/products/getProducts?metadata={metadata}")
    print(response.json())
elif to_test == "getAllProducts":
    response = requests.get(f"http://localhost:3000/api/v1/products/getProducts")
    print(response.json())
