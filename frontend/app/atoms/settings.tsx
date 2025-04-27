import { atom } from "jotai"
import { atomWithStorage } from 'jotai/utils'

export type DashboardView = "developer" | "vendor"

export interface AppUser {
    uid: string
    name: string
    email: string
    mode: string
}

import { z } from "zod"
import { schema } from "@/components/agent-data-table"

export const currentUserAtom = atomWithStorage<AppUser | null>('currentUser', null)

export const dashboardViewAtom = atomWithStorage<DashboardView>("dashboardView", "developer")

export const agentListAtom = atom<z.infer<typeof schema>[]>([])