import os
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any, List, Optional
import json

from build_db.user_types import User, user_to_dict, dict_to_user, ApiKeyEntry, ProductEntry, apikey_to_dict, product_to_dict, dict_to_apikey, dict_to_product

class FirebaseClient:
    def __init__(self, credentials_path=None, use_sample=True):
        """Initialize Firebase client with admin credentials.
        
        Args:
            credentials_path: Path to the Firebase credentials file
            use_sample: If True, use users-sample collection instead of users
        """
        if not firebase_admin._apps:
            if credentials_path:
                cred = credentials.Certificate(credentials_path)
            else:
                # If no credentials path provided, try to get from environment variable
                cred_json = os.environ.get("FIREBASE_CREDENTIALS")
                if cred_json:
                    cred_dict = json.loads(cred_json)
                    cred = credentials.Certificate(cred_dict)
                else:
                    raise ValueError("Firebase credentials not provided")
            
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
        self.sample_suffix = '-sample' if use_sample else ''
        self.collection_name = f'users{self.sample_suffix}'
        self.apikeys_collection = f'apikeys{self.sample_suffix}'
        self.products_collection = f'products{self.sample_suffix}'
    
    # User operations
    def create_user(self, user_id: str, user: User) -> None:
        """Create a new user document in Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_ref.set(user_to_dict(user))
    
    def get_user(self, user_id: str) -> Optional[User]:
        """Retrieve a user by ID from Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_data = user_ref.get()
        
        if user_data.exists:
            return dict_to_user(user_data.to_dict())
        return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by email from Firestore."""
        users_ref = self.db.collection(self.collection_name)
        query = users_ref.where('user_email', '==', email).limit(1)
        results = query.get()
        
        for doc in results:
            return dict_to_user(doc.to_dict())
        return None
    
    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> None:
        """Update user fields in Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_ref.update(user_data)
    
    # Agent operations
    def add_agent(self, user_id: str, agent_data: Dict[str, Any]) -> None:
        """Add an agent to a user's agent_list in Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            agent_list = user_data.get('agent_list', [])
            agent_list.append(agent_data)
            
            user_ref.update({
                'agent_list': agent_list
            })
    
    def update_agent(self, user_id: str, agent_id: str, agent_data: Dict[str, Any]) -> None:
        """Update an agent in a user's agent_list in Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            agent_list = user_data.get('agent_list', [])
            
            updated = False
            for i, agent in enumerate(agent_list):
                if agent.get('agent_id') == agent_id:
                    # Update agent fields
                    for key, value in agent_data.items():
                        agent_list[i][key] = value
                    updated = True
                    break
            
            if updated:
                user_ref.update({
                    'agent_list': agent_list
                })
    
    # Product operations
    def add_product(self, user_id: str, product_data: Dict[str, Any]) -> None:
        """Add a product to a user's products list in Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            products = user_data.get('products', [])
            products.append(product_data)
            
            user_ref.update({
                'products': products
            })
    
    # Transaction operations
    def add_transaction(self, user_id: str, transaction_data: Dict[str, Any]) -> None:
        """Add a transaction to a user's transaction_history in Firestore."""
        user_ref = self.db.collection(self.collection_name).document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            transactions = user_data.get('transaction_history', [])
            transactions.append(transaction_data)
            
            user_ref.update({
                'transaction_history': transactions
            }) 
    
    def delete_all_users(self) -> None:
        """Delete all documents in the users collection."""
        collection_ref = self.db.collection(self.collection_name)
        docs = collection_ref.get()
        for doc in docs:
            try:
                # Try using ref attribute first (newer Firebase SDK)
                doc.ref.delete()
            except AttributeError:
                # Fallback for older Firebase SDK versions
                self.db.collection(self.collection_name).document(doc.id).delete()

    # ApiKeys collection operations
    def create_apikey_entry(self, api_key: str, apikey_entry: ApiKeyEntry) -> None:
        """Create a new API key entry in the apikeys collection."""
        apikey_ref = self.db.collection(self.apikeys_collection).document(api_key)
        apikey_ref.set(apikey_to_dict(apikey_entry))

    def get_apikey_entry(self, api_key: str) -> Optional[ApiKeyEntry]:
        """Retrieve API key entry by key from Firestore."""
        apikey_ref = self.db.collection(self.apikeys_collection).document(api_key)
        apikey_data = apikey_ref.get()
        
        if apikey_data.exists:
            return dict_to_apikey(apikey_data.to_dict())
        return None

    def update_apikey_entry(self, api_key: str, apikey_data: Dict[str, Any]) -> None:
        """Update API key entry fields in Firestore."""
        apikey_ref = self.db.collection(self.apikeys_collection).document(api_key)
        apikey_ref.update(apikey_data)

    def delete_apikey_entry(self, api_key: str) -> None:
        """Delete an API key entry from Firestore."""
        apikey_ref = self.db.collection(self.apikeys_collection).document(api_key)
        apikey_ref.delete()

    def delete_all_apikeys(self) -> None:
        """Delete all documents in the apikeys collection."""
        collection_ref = self.db.collection(self.apikeys_collection)
        docs = collection_ref.get()
        for doc in docs:
            try:
                doc.ref.delete()
            except AttributeError:
                self.db.collection(self.apikeys_collection).document(doc.id).delete()

    def get_all_apikeys(self) -> List[ApiKeyEntry]:
        """Retrieve all API keys from Firestore."""
        apikeys_ref = self.db.collection(self.apikeys_collection)
        docs = apikeys_ref.get()
        return [dict_to_apikey(doc.to_dict()) for doc in docs]

    # Products collection operations
    def create_product_entry(self, product_id: str, product_entry: ProductEntry) -> None:
        """Create a new product entry in the products collection."""
        product_ref = self.db.collection(self.products_collection).document(product_id)
        product_ref.set(product_to_dict(product_entry))

    def get_product_entry(self, product_id: str) -> Optional[ProductEntry]:
        """Retrieve product entry by ID from Firestore."""
        product_ref = self.db.collection(self.products_collection).document(product_id)
        product_data = product_ref.get()
        
        if product_data.exists:
            return dict_to_product(product_data.to_dict())
        return None

    def update_product_entry(self, product_id: str, product_data: Dict[str, Any]) -> None:
        """Update product entry fields in Firestore."""
        product_ref = self.db.collection(self.products_collection).document(product_id)
        product_ref.update(product_data)

    def delete_product_entry(self, product_id: str) -> None:
        """Delete a product entry from Firestore."""
        product_ref = self.db.collection(self.products_collection).document(product_id)
        product_ref.delete()

    def get_all_products(self) -> List[ProductEntry]:
        """Retrieve all products from Firestore."""
        products_ref = self.db.collection(self.products_collection)
        docs = products_ref.get()
        return [dict_to_product(doc.to_dict()) for doc in docs]

    def delete_all_products(self) -> None:
        """Delete all documents in the products collection."""
        collection_ref = self.db.collection(self.products_collection)
        docs = collection_ref.get()
        for doc in docs:
            try:
                doc.ref.delete()
            except AttributeError:
                self.db.collection(self.products_collection).document(doc.id).delete()

