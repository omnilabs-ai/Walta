// app/(protected)/layout.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/firebase/config"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login")
      } else {
        setAuthChecked(true)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Authenticating...</p>
      </div>
    )
  }

  return <>{children}</>
}