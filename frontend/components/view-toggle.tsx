"use client"

import { useAtom } from "jotai"
import { dashboardViewAtom } from "@/app/atoms/settings"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

const views = ["vendor", "developer"] as const

export function ViewToggle() {
    const [view, setView] = useAtom(dashboardViewAtom)
    const index = views.indexOf(view)

    return (
        <div className="relative inline-flex h-8 rounded-full border border-border bg-muted text-sm">
            {/* Sliding background */}
            <div
                className="absolute left-0 top-0 z-0 h-full w-1/2 rounded-full bg-background shadow-sm transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(${index * 100}%)` }}
            />

            {/* Buttons */}
            {views.map((v) => (
                <Button
                    key={v}
                    variant="ghost"
                    size="sm"
                    onClick={() => setView(v)}
                    className={cn(
                        "relative z-10 h-8 w-28 rounded-full px-4 py-0 text-xs font-medium transition-colors duration-200",
                        view === v ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {v === "vendor" ? "Vendor View" : "Developer View"}
                </Button>
            ))}
        </div>
    )
}
