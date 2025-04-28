import { atom } from "jotai"
import { atomWithStorage } from 'jotai/utils'

import { z } from "zod"
import { schema } from "@/components/agent-data-table"

export type DashboardView = "developer" | "vendor"

export interface AppUser {
    uid: string
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
  
export const agentsAtom = atom<z.infer<typeof agentSchema>[]>([])

export const currentUserAtom = atomWithStorage<AppUser | null>('currentUser', null)

export const dashboardViewAtom = atomWithStorage<DashboardView>("dashboardView", "developer")

export const agentListAtom = atom<z.infer<typeof schema>[]>([])