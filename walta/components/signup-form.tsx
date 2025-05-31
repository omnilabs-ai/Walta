// components/sign-up-form.tsx
"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
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
import { toast } from "sonner"
import { useAtom } from "jotai"
import { dashboardViewAtom, type DashboardView } from "@/app/atoms/settings"
import { signup } from '@/app/utils/supabase/actions'

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [view, setView] = useAtom(dashboardViewAtom)
    const [isDevelopment] = useState(process.env.NODE_ENV === "development")

    useEffect(() => {
        const initialView = searchParams.get('view')
        if (initialView === 'developer' || initialView === 'vendor') {
            setView(initialView as DashboardView)
        }
    }, [searchParams, setView]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
            return
        }

        try {
            setLoading(true)

            // For development - bypass authentication when using development mode
            if (isDevelopment && email === "dev@example.com" && password === "devmode") {
                toast.success("Development signup successful!")
                router.push(view === "vendor" ? "/vendor" : "/user")
                return
            }

            const result = await signup(email, password)

            if (!result.success) {
                throw new Error(result.error)
            }

            toast.success("Account created successfully!")
            router.push(view === "vendor" ? "/vendor" : "/user")
        } catch (error: unknown) {
            console.error(error)
            const errorMessage = error instanceof Error ? error.message : "Signup failed"
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
                        {view === 'vendor' ? "Create a Vendor Account" : "Create a Developer Account"}
                    </CardTitle>
                    <CardDescription>
                        {isDevelopment
                            ? "Development mode enabled. Use dev@example.com / devmode to bypass authentication."
                            : "Sign up with your email and password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp}>
                        <div className="grid gap-6">
                            {/* Input Fields */}
                            <div className="flex justify-center">
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">
                                        {view === 'vendor' ? "Company Name" : "Name"}
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={view === 'vendor' ? "Acme Corp" : isDevelopment ? "Dev User" : "John Doe"}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
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
                                <div className="grid gap-3">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder={isDevelopment ? "devmode" : "••••••••"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creating Account..." : "Create account"}
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <a
                                    href={`/login?view=${view}`}
                                    className="underline underline-offset-4"
                                >
                                    Login
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>.
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}