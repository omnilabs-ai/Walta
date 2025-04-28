"use client"

import * as React from "react"
import { useAtom, useAtomValue } from "jotai"
import { dashboardViewAtom } from "@/app/atoms/settings" // Adjust this path if needed

import {
  IconDashboard,
  IconKey,
  IconUserCog,
  IconExchange,
  IconPlug,
  IconBoxSeam,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { currentUserAtom } from "@/app/atoms/settings"


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useAtomValue(currentUserAtom);

  const user = {
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    avatar: "/logoIcon.svg",
  };
  const [view] = useAtom(dashboardViewAtom)

  const navMain =
    view === "developer"
      ? [
        { title: "Dashboard", url: "/user", icon: IconDashboard },
        { title: "Agent Keys", url: "/user/agents", icon: IconUsers },
        { title: "Transactions", url: "/user/transactions", icon: IconExchange },
        { title: "Integration", url: "/user/integration", icon: IconPlug },
      ]
      : [
        { title: "Dashboard", url: "/vendor", icon: IconDashboard },
        { title: "Transactions", url: "/vendor/transactions", icon: IconExchange },
        { title: "Products", url: "/vendor/products", icon: IconBoxSeam },
      ]

  const navSecondary = [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Get Help", url: "/help", icon: IconHelp },
    { title: "Search", url: "/search", icon: IconSearch },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img src="/logo.svg" alt="Walta Logo" className="ml-[-8px]" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

