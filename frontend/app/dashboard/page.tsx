"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/app/firebase/config"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Signed out successfully!")
      router.push("/login") // ⬅️ Navigate to login
    } catch (error: any) {
      toast.error("Error signing out")
      console.error(error)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {user ? (
          <>
            <h1 className="text-xl font-semibold">Hello, {user.email}!</h1>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <h1 className="text-xl font-semibold">Loading user...</h1>
        )}
      </main>
    </div>
  )
}
