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

// export async function getUser() {
//     const supabase = await createClient();

//     const { data, error } = await supabase.from('users').select('*').single();

//     if (error) {
//         throw new Error(error.message);
//     }

//     return data;
// }

// export async function getUser() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (authError || !user) {
//     throw new Error("User not authenticated");
//   }

//   const { data, error } = await supabase
//     .from("users")
//     .select("*")
//     .eq("user_id", user.id)
//     .single();

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// }
export async function getUser(userId: string) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
  
    if (error || !data) {
      throw new Error(error?.message || "User not found");
    }
  
    return data;
  }