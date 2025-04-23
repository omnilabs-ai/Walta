from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field


class Transaction(BaseModel):
    transaction_id: str
    from_user_id: str
    from_agent_id: str
    to_user_id: str
    amount: float
    timestamp: str
    description: Optional[str] = None
    status: str
   

class Agent(BaseModel):
    agent_id: str
    agent_name: str
    api_key: str
    active: bool = True
    created_at: str  # ISO timestamp string
    transaction_list: List[str] = []  # List of transaction IDs


class Product(BaseModel):
    product_id: str
    name: str
    description: str
    price: float


class User(BaseModel):
    user_name: str
    user_email: str
    stripe_id: str
    stripe_vendor_id: str
    agent_list: List[Agent] = []
    transaction_history: List[Transaction] = []
    products: List[Product] = []


# New models for separate collections
class ApiKeyEntry(BaseModel):
    """Model for the apikeys collection, indexed by the API key."""
    user_id: str
    agent_id: str
    created_at: str
    last_used: Optional[str] = None
    active: bool = True


class ProductEntry(BaseModel):
    """Model for the products collection, indexed by product_id."""
    product_id: str
    name: str
    description: str
    price: float
    user_id: str  # Owner of the product


# Dictionary representation for Firebase
def user_to_dict(user: User) -> Dict[str, Any]:
    """Convert User model to Firebase-compatible dictionary."""
    return {
        "user_name": user.user_name,
        "user_email": user.user_email,
        "stripe_id": user.stripe_id,
        "stripe_vendor_id": user.stripe_vendor_id,
        "agent_list": [agent.dict() for agent in user.agent_list],
        "transaction_history": [transaction.dict() for transaction in user.transaction_history],
        "products": [product.dict() for product in user.products]
    }


def dict_to_user(user_dict: Dict[str, Any]) -> User:
    """Convert Firebase dictionary to User model."""
    return User(**user_dict)


def apikey_to_dict(apikey: ApiKeyEntry) -> Dict[str, Any]:
    """Convert ApiKeyEntry model to Firebase-compatible dictionary."""
    return apikey.dict()


def dict_to_apikey(apikey_dict: Dict[str, Any]) -> ApiKeyEntry:
    """Convert Firebase dictionary to ApiKeyEntry model."""
    return ApiKeyEntry(**apikey_dict)


def product_to_dict(product: ProductEntry) -> Dict[str, Any]:
    """Convert ProductEntry model to Firebase-compatible dictionary."""
    return product.dict()


def dict_to_product(product_dict: Dict[str, Any]) -> ProductEntry:
    """Convert Firebase dictionary to ProductEntry model."""
    return ProductEntry(**product_dict) 