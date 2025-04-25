import stripe

stripe.api_key = "sk_test_51RGPxFFmFJe4gD9z7kksqUh1lQtupGTDGmv68jugqadS9J4oRBtGmJeLLu0jQa1jhypxViVBBdWLkC9hksmxDlks00scWQ15qq"

def get_product_id(price_id: str, account_id: str):
    price = stripe.Price.retrieve(price_id, stripe_account=account_id)
    return price.product

def get_cust_payment_method(customer_id: str):
    payment_methods = stripe.PaymentMethod.list(
        customer=customer_id,
        type="card"  # You can also use "sepa_debit", "acss_debit", etc.
    )
    return payment_methods.data[0].id

