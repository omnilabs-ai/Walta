import { createClient } from './server';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
    transaction_id: string;
    from_user_id: string;
    to_user_id: string;
    from_agent_id: string;
    amount: number;
    status: string;
    created_at: string;
    metadata: Record<string, string>;
}

export async function addTransaction(user_id: string, transaction: Omit<Transaction, 'transaction_id' | 'created_at'>) {
    const supabase = await createClient();
    const transaction_id = uuidv4();
    const created_at = new Date().toISOString();

    const newTransaction = {
        ...transaction,
        transaction_id,
        created_at
    };

    // First, update the user's transactions
    const { error: transactionError } = await supabase
        .from('users')
        .update({
            transactions: {
                [transaction_id]: newTransaction
            }
        })
        .eq('id', user_id);

    if (transactionError) throw new Error(transactionError.message);

    // Then, update the agent's transaction list
    const { error: agentError } = await supabase
        .from('agents')
        .update({
            transaction_list: supabase.rpc('append_to_array', {
                arr: 'transaction_list',
                value: transaction_id
            })
        })
        .eq('id', transaction.from_agent_id);

    if (agentError) throw new Error(agentError.message);

    return { newTransaction, transaction_id };
}

export async function getTransactions(user_id: string, transaction_id?: string) {
    const supabase = await createClient();

    if (transaction_id) {
        const { data, error } = await supabase
            .from('users')
            .select('transactions')
            .eq('id', user_id)
            .single();

        if (error) throw new Error(error.message);
        if (!data?.transactions?.[transaction_id]) {
            throw new Error(`Transaction with id ${transaction_id} not found`);
        }
        return data.transactions[transaction_id];
    }

    const { data, error } = await supabase
        .from('users')
        .select('transactions')
        .eq('id', user_id)
        .single();

    if (error) throw new Error(error.message);
    return data?.transactions || {};
}
