import os
import uuid
import random
from datetime import datetime, timedelta
import argparse
import sys

from firebase_client import FirebaseClient
from user_types import User, Agent, Product, Transaction, ApiKeyEntry, ProductEntry

# Generate sample users
def generate_sample_users(num_users=5):
    """Generate sample user data with random number of agents and products."""
    users = []
    user_ids = [f"user{i}" for i in range(1, num_users + 1)]
    
    for i, user_id in enumerate(user_ids, 1):
        # Create basic user with blank/default values
        user = User(
            user_name=f"User {i}",
            user_email=f"user{i}@example.com",
            stripe_id=f"stripe_id_{uuid.uuid4()}",
            stripe_vendor_id=f"stripe_vendor_id_{uuid.uuid4()}"
        )
        
        # Add random number of agents (0-4) per user
        num_agents = random.randint(0, 4)
        for j in range(1, num_agents + 1):
            agent = Agent(
                agent_id=f"agent-{uuid.uuid4()}",
                agent_name=f"Agent {j} for User {i}",
                api_key=f"sk-sample-{uuid.uuid4()}",
                active=True,
                created_at=(datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
            )
            user.agent_list.append(agent)
        
        # Add random number of products (0-2) per user
        num_products = random.randint(0, 2)
        for k in range(1, num_products + 1):
            product_id = f"prod-{uuid.uuid4()}"
            product = Product(
                product_id=product_id,
                name=f"Product {k} of User {i}",
                description=f"This is a sample product {k} for user {i}",
                price=round(random.uniform(5.0, 99.99), 2)
            )
            user.products.append(product)
        
        users.append((user_id, user))
    
    return users

def generate_random_transactions(users, num_transactions=10):
    """Generate random transactions between users' agents."""
    all_transactions = []
    
    # Create flat list of all agents with their user info for easier access
    all_agents = []
    for user_id, user in users:
        for agent in user.agent_list:
            all_agents.append((user_id, agent, user))
    
    # Skip if not enough agents
    if len(all_agents) < 2:
        print("Warning: Not enough agents to create transactions.")
        return users
    
    # Generate random transactions
    for _ in range(num_transactions):
        # Select random sender and receiver (ensure they're different)
        sender_info = random.choice(all_agents)
        sender_user_id, sender_agent, sender_user = sender_info
        
        # Make sure we can find a different agent to receive
        receiver_candidates = [a for a in all_agents if a[1].agent_id != sender_agent.agent_id]
        if not receiver_candidates:
            continue
            
        receiver_info = random.choice(receiver_candidates)
        receiver_user_id, receiver_agent, receiver_user = receiver_info
        
        # Create transaction
        transaction_id = f"txn_{uuid.uuid4()}"
        amount = round(random.uniform(1.0, 100.0), 2)
        days_ago = random.randint(0, 60)
        timestamp = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        transaction = Transaction(
            transaction_id=transaction_id,
            from_user_id=sender_user_id,
            from_agent_id=sender_agent.agent_id,
            to_user_id=receiver_user_id,
            amount=amount,
            timestamp=timestamp,
            description=f"Transaction from {sender_agent.agent_name} to {receiver_agent.agent_name}",
            status=random.choice(["completed", "pending", "failed", "completed", "completed"])  # Weight toward completed
        )
        
        # Add transaction to both users' histories
        sender_user.transaction_history.append(transaction)
        receiver_user.transaction_history.append(transaction)
        
        # Update agent transaction lists
        sender_agent.transaction_list.append(transaction_id)
        receiver_agent.transaction_list.append(transaction_id)
        
        all_transactions.append(transaction)
    
    # Sort all users' transaction histories by timestamp
    for _, user in users:
        user.transaction_history.sort(key=lambda t: t.timestamp, reverse=True)
    
    return users

def populate_apikeys_collection(firebase_client, users):
    """Populate the apikeys collection with keys from all agents."""
    print("Populating apikeys collection...")
    
    # Delete existing apikeys
    firebase_client.delete_all_apikeys()
    print("Deleted existing apikeys")
    
    # Add new apikeys
    keys_added = 0
    for user_id, user in users:
        for agent in user.agent_list:
            # Create an API key entry
            api_key = agent.api_key
            apikey_entry = ApiKeyEntry(
                user_id=user_id,
                agent_id=agent.agent_id,
                created_at=agent.created_at,
                active=agent.active
            )
            
            # Add to collection
            try:
                firebase_client.create_apikey_entry(api_key, apikey_entry)
                keys_added += 1
            except Exception as e:
                print(f"Error adding API key for agent {agent.agent_id}: {str(e)}")
    
    print(f"Added {keys_added} API keys to the apikeys collection")
    return keys_added

def populate_products_collection(firebase_client, users):
    """Populate the products collection with all products."""
    print("Populating products collection...")
    
    # Delete existing products
    firebase_client.delete_all_products()
    print("Deleted existing products")
    
    # Add new products
    products_added = 0
    for user_id, user in users:
        for product in user.products:
            # Create a product entry
            product_entry = ProductEntry(
                product_id=product.product_id,
                name=product.name,
                description=product.description,
                price=product.price,
                user_id=user_id
            )
            
            # Add to collection
            try:
                firebase_client.create_product_entry(product.product_id, product_entry)
                products_added += 1
            except Exception as e:
                print(f"Error adding product {product.product_id}: {str(e)}")
    
    print(f"Added {products_added} products to the products collection")
    return products_added

def populate_database(firebase_client, users):
    """Populate Firebase with sample users, API keys, and products."""
    for user_id, user in users:
        try:
            firebase_client.create_user(user_id, user)
            print(f"Created user: {user.user_name} (ID: {user_id}) with {len(user.agent_list)} agents, {len(user.products)} products, and {len(user.transaction_history)} transactions")
        except Exception as e:
            print(f"Error creating user {user_id}: {str(e)}")
    
    # Populate separate collections
    populate_apikeys_collection(firebase_client, users)
    populate_products_collection(firebase_client, users)

def main():
    parser = argparse.ArgumentParser(description='Populate database with sample users and transactions')
    parser.add_argument('--num_users', type=int, default=5, help='Number of users to create')
    parser.add_argument('--num_transactions', type=int, default=10, help='Number of transactions to generate')
    parser.add_argument('--credentials', type=str, default="backend/build_db/firebaseCred.json", help='Path to Firebase credentials')
    parser.add_argument('--use_sample', action='store_true', default=True, help='Use sample Firebase instance')
    
    args = parser.parse_args()
    
    # Initialize Firebase client
    try:
        firebase_client = FirebaseClient(credentials_path=args.credentials, use_sample=args.use_sample)
        
        firebase_client.delete_all_users()
        firebase_client.delete_all_apikeys()
        firebase_client.delete_all_products()
        print("Deleted existing users, apikeys, and products")

        # Generate sample users
        users = generate_sample_users(args.num_users)
        print(f"Generated {len(users)} sample users")
        
        # Generate random transactions between agents
        users = generate_random_transactions(users, args.num_transactions)
        print(f"Generated random transactions")
        
        # Populate database
        populate_database(firebase_client, users)
        
        print(f"Successfully populated Firebase with {args.num_users} sample users and {args.num_transactions} transactions")
    except Exception as e:
        print(f"Error populating database: {str(e)}")
        # Print traceback for better debugging
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 