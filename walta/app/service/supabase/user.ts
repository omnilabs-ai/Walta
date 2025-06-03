import { supabaseAdmin } from '@/app/service/supabase/lib/supabaseAdmin'

export interface User {
    email: string;
    name: string;
    stripe_customer_id: string;
    stripe_vendor_id: string;
}

export async function createUser(user: User) {

    const { data, error } = await supabaseAdmin.from('users').insert(user).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getUser(userId: string) {
  
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
  
    if (error || !data) {
      throw new Error(error?.message || "User not found");
    }
  
    return data;
  }