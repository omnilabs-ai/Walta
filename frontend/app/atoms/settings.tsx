import { atom } from "jotai"

export type DashboardView = "developer" | "vendor"

export const dashboardViewAtom = atom<DashboardView>("developer")