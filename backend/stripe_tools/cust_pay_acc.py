import stripe
stripe.api_key = "sk_test_51RGPxFFmFJe4gD9z7kksqUh1lQtupGTDGmv68jugqadS9J4oRBtGmJeLLu0jQa1jhypxViVBBdWLkC9hksmxDlks00scWQ15qq"

def process_payment(customer_id, payment_method, product_id, price_id, account_id):
    price = stripe.Price.retrieve(
        price_id,
        stripe_account=account_id,
    )

    print("price")
    print(price)

    payment_method = stripe.PaymentMethod.create(
        customer=customer_id,
        payment_method=payment_method,
        stripe_account=account_id,
    )

    print("payment_method")
    print(payment_method)

    payment_intent = stripe.PaymentIntent.create(
        payment_method=payment_method,
        currency="USD",
        amount=price.unit_amount,
        off_session=True,
        confirm=True,
        stripe_account=account_id,
        metadata={
            "price_id": price_id,
            "product_id": product_id,
        }
    )

    print("payment_intent")
    print(payment_intent)
    
    return payment_intent

# Example usage
if __name__ == "__main__":
    # Sample values
    customer_id = "cus_SAuc1FDcFZeJ52"
    payment_method = "pm_1RGl6YFmFJe4gD9zlPx8NNfM"
    product_id = "prod_SBAyFYKtiQeSUP"
    price_id = "price_1RGocZ2EJ37e8i9fwF3ogq3X"
    account_id = "acct_1RGo452EJ37e8i9f"
    
    process_payment(customer_id, payment_method, product_id, price_id, account_id)