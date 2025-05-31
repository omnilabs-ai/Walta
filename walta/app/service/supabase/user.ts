import { createClient } from '@/app/service/supabase/server';

export interface User {
    email: string;
    name: string;
    stripe_customer_id: string;
    stripe_vendor_id: string;
}

export async function createUser(user: User) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('users').insert(user).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getUser() {
    const supabase = await createClient();

    const { data, error } = await supabase.from('users').select('*').single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}