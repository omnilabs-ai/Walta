from langchain_core.tools import tool
from typing import Optional, Dict, Any, List
from WaltaApi import WaltaApi
from dotenv import load_dotenv
import os

load_dotenv()
WALTA_AGENT_KEY = os.getenv("WALTA_AGENT_KEY")
walta_api = WaltaApi(agent_key=WALTA_AGENT_KEY)

@tool
def get_vendors() -> List[str]:
    """Get a list of all available vendor names that can be used to filter products.
    
    Returns:
        List[str]: A list of vendor names that can be used with get_products(vendorName=...)
    """
    return {"name": "get_vendors", "output": walta_api.get_vendors()["vendors"], "type": "tool_output"}

@tool
def get_types() -> List[str]:
    """Get a list of all available product types that can be used to filter products.
    
    Returns:
        List[str]: A list of product types that can be used with get_products(type=...)
    """
    return {"name": "get_types", "output": walta_api.get_types()["types"], "type": "tool_output"}

@tool
def get_products(
    productId: Optional[str] = None,
    name: Optional[str] = None,
    type: Optional[str] = None,
    price: Optional[float] = None,
    vendorName: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Get a list of products based on optional filters.
    
    Args:
        productId (Optional[str]): Filter by product ID
        name (Optional[str]): Filter by product name
        type (Optional[str]): Filter by product type
        price (Optional[float]): Filter by product price
        vendorName (Optional[str]): Filter by vendor name
        metadata (Optional[Dict[str, Any]]): Filter by metadata

    Returns:
        Dict[str, Any]: A dictionary containing the list of products matching the filters
    """
    return { 
        "name": "get_products",
        "output": walta_api.get_products(
            product_id=productId,
            name=name,
            type=type,
            price=price,
            vendor_name=vendorName,
            metadata=metadata
        ),
        "type": "tool_output"
    }

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
    return {
        "name": "send_payment",
        "output": walta_api.send_payment(
            product_id=productId,
            quantity=quantity,
            metadata=metadata
        ),
        "type": "tool_output"
    }

