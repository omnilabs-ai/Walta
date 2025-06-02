// lib/auth.ts
import { supabaseAdmin } from '@/app/service/supabase/lib/supabaseAdmin' // service role client

export async function validateApiKey(authHeader: string | undefined) {
  if (!authHeader?.startsWith('Bearer ')) return null
  const key = authHeader.replace('Bearer ', '')

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('user_id')
    .eq('api_key', key)
    .maybeSingle()

  if (error) {
    return null
  }

  return data?.user_id || null
}