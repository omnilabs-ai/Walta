import { supabaseAdmin } from "./lib/supabaseAdmin";

export interface Transaction {
    agent_id: string;
    vendor_id: string;
    product_id: string;
    customer_id: string;
    amount_cents: number;
    status: string;
    metadata: Record<string, string>;
}

export async function addTransaction(transaction: Transaction) {

    const { data: newTransaction, error} = await supabaseAdmin
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return newTransaction;
}

export async function getCustomerTransactions(customer_id: string, transaction_id?: string) {
    let query = supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('customer_id', customer_id);

    if (transaction_id) {
        query = query.eq('id', transaction_id);
    }

    const { data, error } = await query;    

    if (error) throw new Error(error.message);
    return data;
}

export async function getVendorTransactions(vendor_id: string, transaction_id?: string) {
    console.log("getVendorTransactions", vendor_id, transaction_id);

    let query = supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('vendor_id', vendor_id);

    if (transaction_id) {
        query = query.eq('id', transaction_id);
    }

    const { data, error } = await query;
    console.log("data", data);

    if (error) throw new Error(error.message);
    return data;
}   
