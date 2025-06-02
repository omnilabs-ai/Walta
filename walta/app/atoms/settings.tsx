import { atom } from "jotai"
import { atomWithStorage } from 'jotai/utils'
import { Timestamp } from "firebase/firestore";

import { z } from "zod"

export type DashboardView = "developer" | "vendor"

export interface AppUser {
  uid: string
  api_key: string
  stripe_vendor_id: string
  stripe_customer_id: string
  name: string
  email: string
  mode: string
}

export const agentSchema = z.object({
  transaction_list: z.array(z.any()),
  agent_id: z.string(),
  agent_name: z.string(),
  apiKey: z.string(),
  active: z.boolean(),
  created_at: z.any(),
})

export const transactionSchema = z.object({
  transaction_id: z.string(),
  from_user_id: z.string(),
  to_user_id: z.string(),
  from_agent_id: z.string(),
  amount: z.number(),
  status: z.string(),
  created_at: z.instanceof(Timestamp),
  metadata: z.record(z.string()),
});

export const productSchema = z.object({
  product_id: z.string(),
  description: z.string(),
  name: z.string(),
  type: z.string(),
  price: z.number(),
  vendorName: z.string(),
  user_id: z.string(),
  created_at: z.instanceof(Timestamp),
});

export const agentsAtom = atom<z.infer<typeof agentSchema>[]>([])

export const currentUserAtom = atomWithStorage<AppUser | null>('currentUser', null)

export const dashboardViewAtom = atomWithStorage<DashboardView>("dashboardView", "developer")

export const transactionsAtom = atom<z.infer<typeof transactionSchema>[]>([]);
export const productsAtom = atom<z.infer<typeof productSchema>[]>([])