import requests
import json

def test_make_payment(product_id: str, quantity: int, metadata: dict):
    # API endpoint
    api_url = "http://localhost:3000/api/v1/sendPayment"
    
    # API key to authenticate (replace with your actual API key)
    api_key = "walta-2499571bd99bfa9fb77d66b22f279e34"
    
    # Request headers
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key
    }
    
    # Request payload
    payload = {
        "productId": product_id,  # Replace with actual product ID
        "quantity": quantity,                   # Quantity of products to purchase
        "metadata": metadata,  # Optional: Customer identifier
    }
    
    # Make the API request
    response = requests.post(api_url, headers=headers, json=payload)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Assert response 
    assert response.status_code == 200
    
    # Return response data for further inspection if needed
    return response.json()

if __name__ == "__main__":
    test_make_payment("b4978ec3-cfa1-4ddd-a60d-35d1d197c9ee", 1, {"notes": "test notes"})
