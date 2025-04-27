"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/firebase/auth"
import { useSetAtom } from "jotai"
import { currentUserAtom } from "@/app/atoms/settings"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const setCurrentUser = useSetAtom(currentUserAtom)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Clear user in atom and redirect to login
        setCurrentUser(null)
        router.push("/login")
      } else {
        // Update user in atom
        try {
          // Optionally fetch additional user data from Firestore if needed
          // For example:
          // const response = await fetch(`/api/get-user?userId=${user.uid}`);
          // const userData = await response.json();

          setCurrentUser({
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || '', // Use userData?.name if you fetch additional data
          });
        } catch (error) {
          console.error('Error setting user data:', error);
          // Fallback to basic user info if fetch fails
          setCurrentUser({
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || '',
          });
        }

        setAuthChecked(true)
      }
    })

    return () => unsubscribe()
  }, [router, setCurrentUser])

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