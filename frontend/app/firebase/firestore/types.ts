import { Timestamp } from "firebase-admin/firestore";

type User = {
    user_name: string;
    user_email: string;
    transactions: Record<string, Transaction>;
    total_amount: number;
    agents: Record<string, Agent>;
    products: Record<string, Product>;
    stripe_id: string;
    stripe_vendor_id: string;
}

type Product = {
    description: string;
    name: string;
    type: string;
    price: number;
    vendorName: string;
    user_id: string;
    created_at: Timestamp;
    metadata: Record<string, string>;
}

type Agent = {
    apikey: string;
    agent_name: string;
    active: boolean;
    transaction_list: string[];
    created_at: Timestamp;
    params: Record<string, string | number | boolean>;
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
