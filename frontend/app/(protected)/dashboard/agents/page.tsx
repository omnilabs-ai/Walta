"use client"

import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { currentUserAtom } from "@/app/atoms/settings"
import { DataTable } from "@/components/data-table"
import { schema } from "@/components/data-table"
import { toast } from "sonner"

export default function AgentTable() {
  const currentUser = useAtomValue(currentUserAtom)
  const [agentData, setAgentData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip if no user is available yet
    if (!currentUser?.uid) return
    
    const fetchAgentList = async () => {
      try {
        const res = await fetch(`/api/agent-operations?userId=${currentUser.uid}`)
        const json = await res.json()

        if (!res.ok) {
          toast.error("Failed to fetch agent list.")
          console.error(json.error || "Unknown error")
          return
        }

        if (!Array.isArray(json.agent_list)) {
          toast.error("Invalid data received from server.")
          console.error("Expected an array, got:", json.agent_list)
          return
        }

        setAgentData(json.agent_list)
        toast.success("Agent data loaded!")
      } catch (error) {
        console.error("Error fetching agent list:", error)
        toast.error("Could not fetch agent data.")
      } finally {
        setLoading(false)
      }
    }

    fetchAgentList()
  }, [currentUser?.uid])

  // This shouldn't happen in protected routes, but just in case
  if (!currentUser) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-muted-foreground">Please log in to view your agents.</div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      {loading ? (
        <div className="text-muted-foreground">Loading agent data...</div>
      ) : (
        <DataTable data={agentData} />
      )}
    </div>
  )
}