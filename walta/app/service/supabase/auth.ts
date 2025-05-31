'use server'

import { createClient } from './server'
import { createCustomer } from '@/app/service/stripe/get'
import { createAccount } from '@/app/service/stripe/accounts'

type AuthResponse = {
  success: boolean
  error?: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
    
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const supabase = await createClient()

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name: name
        }
      }
    })

    if (authError) {
      return {
        success: false,
        error: authError.message
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create user'
      }
    }

    // Create Stripe customer and account
    const { customerId } = await createCustomer(name, email);
    const { accountId } = await createAccount(email);

    // Create user record in database
    const { error: userError } = await supabase.from('users').insert({
      email,
      name,
      stripe_customer_id: customerId,
      stripe_vendor_id: accountId
    });

    if (userError) {
      // If user creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        error: userError.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}