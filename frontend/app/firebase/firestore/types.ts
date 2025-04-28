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

type Agent = {
    apikey: string;
    agent_name: string;
    active: boolean;
    transaction_list: string[];
    created_at: Timestamp;
    params: Record<string, any>;
}
  
type ApiData = {
    userId: string;
    agentId: string;
}

type Transaction = {
    transaction_id: string;
    from_user_id: string;
    to_user_id: string;
    from_agent_id: string;
    amount: number;
    status: string;
    created_at: Timestamp;
    metadata: Record<string, string>;
}

export type { User, Product, Agent, ApiData, Transaction };
