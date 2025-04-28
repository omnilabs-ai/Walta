"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { currentUserAtom } from "@/app/atoms/settings"
import { useAtomValue } from "jotai"

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const currentUser = useAtomValue(currentUserAtom)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!currentUser) {
        router.push("/login")
        return
      }

      try {
        // Get user's Stripe vendor ID from their profile
        const userData = await fetch(`/api/user/getUser?userId=${currentUser.uid}&params=stripe_vendor_id`).then(res => res.json())

        const accountId = userData.stripe_vendor_id

        if (!accountId) {
          console.error("No Stripe vendor account ID found")
          setIsLoading(false)
          return
        }

        // Check account onboarding status
        const statusResponse = await fetch(`/api/stripe/accountStatus?accountId=${accountId}`).then(res => res.json())
        console.log("statusResponse", statusResponse)

        // If onboarding not complete, get onboarding link and redirect
        if (!statusResponse.is_details_submitted) {
          const linkResponse = await fetch(`/api/stripe/createAccountLink?accountId=${accountId}`).then(res => res.json())
          console.log("linkResponse", linkResponse)

          // Redirect to Stripe onboarding
          if (linkResponse.url) {
            router.push(linkResponse.url)
            return
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [currentUser, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking account status...</p>
      </div>
    )
  }

  return <>{children}</>
}
