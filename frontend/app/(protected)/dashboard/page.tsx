"use client"

import { signOut } from "firebase/auth"
import { auth } from "@/app/firebase/config"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Optional: grab user info to show
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Signed out successfully!")
      router.push("/login")
    } catch (error) {
      toast.error("Error signing out")
      console.error(error)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-semibold">Hello, {user?.email || "user"}!</h1>
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </main>
    </div>
  )
}
