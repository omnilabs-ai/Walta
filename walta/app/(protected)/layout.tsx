"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAtom, useSetAtom } from "jotai"
import { currentUserAtom } from "@/app/atoms/settings"
import { dashboardViewAtom } from "@/app/atoms/settings"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from "@/app/service/supabase/client"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const setCurrentUser = useSetAtom(currentUserAtom)
  const [view] = useAtom(dashboardViewAtom)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setCurrentUser(null)
        router.push("/login")
        return
      }

      setCurrentUser({
        uid: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || '',
        mode: view || "developer",
      })
      setAuthChecked(true)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null)
        router.push("/login")
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setCurrentUser({
          uid: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          mode: view || "developer",
        })
      }

      setAuthChecked(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, setCurrentUser, view])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Authenticating...</p>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}