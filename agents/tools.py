from langchain_core.tools import tool
from typing import Optional, Dict, Any, List
from WaltaApi import WaltaApi
from dotenv import load_dotenv
import os

load_dotenv()
HOST_URL = os.getenv("HOST_URL")
WALTA_AGENT_KEY = os.getenv("WALTA_AGENT_KEY")

walta_api = WaltaApi(host_url=HOST_URL, agent_key=WALTA_AGENT_KEY)

@tool
def get_vendors() -> List[str]:
    """Get a list of all available vendor names that can be used to filter products.
    
    Returns:
        List[str]: A list of vendor names that can be used with get_products(vendorName=...)
    """
    return walta_api.get_vendors()

@tool
def get_types() -> List[str]:
    """Get a list of all available product types that can be used to filter products.
    
    Returns:
        List[str]: A list of product types that can be used with get_products(type=...)
    """
    return walta_api.get_types()

@tool
def get_products(
    productId: Optional[str] = None,
    name: Optional[str] = None,
    type: Optional[str] = None,
    price: Optional[float] = None,
    vendorName: Optional[str] = None
) -> Dict[str, Any]:
    """Get a list of products based on optional filters.
    
    Args:
        productId (Optional[str]): Filter by product ID
        name (Optional[str]): Filter by product name
        type (Optional[str]): Filter by product type
        price (Optional[float]): Filter by product price
        vendorName (Optional[str]): Filter by vendor name
        
    Returns:
        Dict[str, Any]: A dictionary containing the list of products matching the filters
    """
    return walta_api.get_products(
        product_id=productId,
        name=name,
        type=type,
        price=price,
        vendor_name=vendorName
    )

@tool
def send_payment(productId: str, quantity: int, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Send a payment for a product.
    
    Args:
        productId (str): The ID of the product to purchase
        quantity (int): The quantity of the product to purchase
        metadata (Optional[Dict[str, Any]]): Additional metadata to include with the payment
        
    Returns:
        Dict[str, Any]: The payment intent response containing payment details
    """
    return walta_api.send_payment(
        product_id=productId,
        quantity=quantity,
        metadata=metadata
    )
