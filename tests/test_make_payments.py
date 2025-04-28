import requests
import json

def test_make_payment(product_id: str, quantity: int, metadata: dict):
    # API endpoint
    api_url = "http://localhost:3000/api/v1/sendPayment"
    
    # API key to authenticate (replace with your actual API key)
    api_key = "walta-95df5c2b006c05af77ac50fe6db7c0c3"
    
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
    test_make_payment("e4f2d007-f9bb-4da4-9ead-0cb0420e12a7", 1, {"notes": "test notes"})
