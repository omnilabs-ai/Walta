"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { login } from '@/app/utils/supabase/actions'
import { useAtom } from "jotai"
import { dashboardViewAtom, type DashboardView } from "@/app/atoms/settings"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [view, setView] = useAtom(dashboardViewAtom)
  const [isDevelopment] = useState(process.env.NODE_ENV === "development")

  useEffect(() => {
    const initialView = searchParams.get('view')
    if (initialView === 'developer' || initialView === 'vendor') {
      setView(initialView as DashboardView)
    }
  }, [searchParams, setView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // For development - bypass authentication when using development option
      if (isDevelopment && email === "dev@example.com" && password === "devmode") {
        toast.success("Development login successful!")
        router.push(view === "vendor" ? "/vendor" : "/user")
        return
      }

      const result = await login(email, password)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success("Login successful!")
      router.push(view === "vendor" ? "/vendor" : "/user")
    } catch (error: unknown) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {view === 'vendor' ? "Login to your Vendor Account" : "Login to your Developer Account"}
          </CardTitle>
          <CardDescription>
            {isDevelopment ? "Development mode enabled. Use dev@example.com / devmode to bypass authentication." : "Enter your email and password to login."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {/* Social Buttons - dummy for now */}
              <div className="flex justify-center">
              </div>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {/* Login Form Fields */}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={isDevelopment ? "dev@example.com" : "m@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isDevelopment ? "devmode" : "••••••••"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href={`/signup?view=${view}`}
                  className="underline underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
