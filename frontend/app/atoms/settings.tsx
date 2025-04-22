import { atom } from "jotai"

export type DashboardView = "developer" | "vendor"

export interface AppUser {
    uid: string
    name: string
    email: string
}

export const currentUserAtom = atom<AppUser | null>(null)

export const dashboardViewAtom = atom<DashboardView>("developer")