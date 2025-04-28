import requests

to_test = "getProduct"

product_id = "e4f2d007-f9bb-4da4-9ead-0cb0420e12a7"

if to_test == "getProduct":
    response = requests.get(f"http://localhost:3000/api/v1/getProducts?productId={product_id}")
    print(response.json())
elif to_test == "getAllProducts":
    response = requests.get(f"http://localhost:3000/api/v1/getProducts")
    print(response.json())
