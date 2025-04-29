import requests
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv

class WaltaApi:
    def __init__(self, host_url: Optional[str] = None, agent_key: Optional[str] = None):
        """Initialize the Walta API client.
        
        Args:
            host_url (Optional[str]): The base URL for the API. If not provided, will be loaded from environment.
            api_key (Optional[str]): The API key for authentication. If not provided, will be loaded from environment.
        """
        load_dotenv()
        self.host_url = host_url or os.getenv("HOST_URL")
        self.agent_key = agent_key or os.getenv("WALTA_AGENT_KEY")
        
        if not self.host_url:
            raise ValueError("HOST_URL must be provided either through constructor or environment variable")
            
        self._headers = {'x-api-key': self.agent_key} if self.agent_key else {}

    def get_vendors(self) -> List[str]:
        """Get a list of all available vendor names.
        
        Returns:
            List[str]: A list of vendor names
        """
        response = requests.get(f"{self.host_url}/products/getVendors", headers=self._headers)
        return response.json()

    def get_types(self) -> List[str]:
        """Get a list of all available product types.
        
        Returns:
            List[str]: A list of product types
        """
        response = requests.get(f"{self.host_url}/products/getTypes", headers=self._headers)
        return response.json()

    def get_products(
        self,
        product_id: Optional[str] = None,
        name: Optional[str] = None,
        type: Optional[str] = None,
        price: Optional[float] = None,
        vendor_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get a list of products based on optional filters.
        
        Args:
            product_id (Optional[str]): Filter by product ID
            name (Optional[str]): Filter by product name
            type (Optional[str]): Filter by product type
            price (Optional[float]): Filter by product price
            vendor_name (Optional[str]): Filter by vendor name
            
        Returns:
            Dict[str, Any]: A dictionary containing the list of products matching the filters
        """
        filters = {
            'productId': product_id,
            'name': name,
            'type': type,
            'price': str(price) if price is not None else None,
            'vendorName': vendor_name
        }
        # Remove None values from filters
        filters = {k: v for k, v in filters.items() if v is not None}
        
        response = requests.get(f"{self.host_url}/products/getProducts", params=filters, headers=self._headers)
        return response.json()

    def send_payment(
        self,
        product_id: str,
        quantity: int,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Send a payment for a product.
        
        Args:
            product_id (str): The ID of the product to purchase
            quantity (int): The quantity of the product to purchase
            metadata (Optional[Dict[str, Any]]): Additional metadata to include with the payment
            
        Returns:
            Dict[str, Any]: The payment intent response containing payment details
        """
        payload = {
            'productId': product_id,
            'quantity': quantity
        }
        
        if metadata:
            payload['metadata'] = metadata
            
        response = requests.post(
            f"{self.host_url}/sendPayment",
            json=payload,
            headers=self._headers
        )
        return response.json()
