import requests

customer_id = "cus_SAuc1FDcFZeJ52"
vendor_id = "acct_1RGo452EJ37e8i9f"
price_id = "price_1RGocZ2EJ37e8i9fwF3ogq3X"

# Derived from the above
product_id = "prod_SBAyFYKtiQeSUP"
payment_method_id = "pm_1RGl6YFmFJe4gD9zlPx8NNfM"

route = "processPayment"
json_data = {
    "customerId": customer_id,
    "paymentMethodId": payment_method_id,
    "productId": product_id,
    "priceId": price_id,
    "accountId": vendor_id
}

response = requests.post("http://localhost:3000/api/stripe/" + route, json=json_data)
print(response.json())
