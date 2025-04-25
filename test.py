import requests

# response = requests.get("http://localhost:8000/products", headers={"Authorization": "Bearer sk-sample-121f2e0a-fdbc-482f-b84e-524251181f42"})
# print(response.json())

customer_id = "cus_SAuc1FDcFZeJ52"
vendor_id = "acct_1RGo452EJ37e8i9f"
price_id = "price_1RGocZ2EJ37e8i9fwF3ogq3X"
amount = 100

response = requests.post("http://localhost:8000/payment", headers={"Authorization": "Bearer sk-sample-121f2e0a-fdbc-482f-b84e-524251181f42"}, json={"price_id": price_id, "customer_id": customer_id, "vendor_id": vendor_id, "amount": amount})
print(response.json())
