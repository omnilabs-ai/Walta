"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAtomValue } from "jotai"
import { dashboardViewAtom } from "@/app/atoms/settings"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dashboardView = useAtomValue(dashboardViewAtom)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (dashboardView === "vendor") {
      router.replace("/vendor")  // If vendor, redirect to vendor dashboard
    } else {
      setChecked(true) // Allow rendering
    }
  }, [dashboardView, router])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Verifying access...</p>
      </div>
    )
  }

  return <>{children}</>
}
