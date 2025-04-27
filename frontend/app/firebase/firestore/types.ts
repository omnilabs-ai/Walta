import { Timestamp } from "firebase-admin/firestore";

type User = {
    user_name: string;
    user_email: string;
    transactions: Record<string, any>;
    total_amount: number;
    agents: Record<string, any>;
    products: Record<string, any>;
    stripe_id: string;
    stripe_vendor_id: string;
}

type Product = {
    description: string;
    name: string;
    price: number;
    user_id: string;
    created_at: Timestamp;
}
  
type ProductData = {
    user_id: string;
}

type Agent = {
    apikey: string;
    agent_name: string;
    active: boolean;
    transaction_list: string[];
    created_at: Timestamp;
}
  
type ApiData = {
    userId: string;
}

type Transaction = {
    transaction_id: string;
    from_user_id: string;
    to_user_id: string;
    from_agent_id: string;
    amount: number;
    description: string;
    status: string;
    created_at: Timestamp;
}

export type { User, Product, ProductData, Agent, ApiData, Transaction };
