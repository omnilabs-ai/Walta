import requests

customer_id = "cus_SDVCUETwOaNGUo"
vendor_id = "acct_1RGo452EJ37e8i9f"
price_id = "price_1RGocZ2EJ37e8i9fwF3ogq3X"

# Derived from the above
product_id = "prod_SBAyFYKtiQeSUP"
payment_method_id = "pm_1RGl6YFmFJe4gD9zlPx8NNfM"

route = "getPaymentIntent"
params = {
    "customerId": customer_id,
}

response = requests.get(
    "http://localhost:3000/api/stripe/" + route,
    params=params
)
print(response.json())

# route = "getPaymentMethod"
# json_data = {
#     "customerId": customer_id,
#     "paymentMethodId": payment_method_id,
#     "accountId": vendor_id
# }

# response = requests.post("http://localhost:3000/api/stripe/" + route, json=json_data)
# print(response.json())

