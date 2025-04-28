"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/app/atoms/settings";
import { AgentDataTable } from "@/components/agent-data-table";
import { toast } from "sonner";
import { z } from "zod";

interface AgentRecord {
  agent_name: string;
  apikey: string;
  active: boolean;
  transaction_list: any[];
  created_at?: any;
}

export const agentSchema = z.object({
  transaction_list: z.array(z.any()),
  agent_id: z.string(),
  agent_name: z.string(),
  apiKey: z.string(),
  active: z.boolean(),
  created_at: z.any(),
});

export default function AgentTablePage() {
  const currentUser = useAtomValue(currentUserAtom);
  const [agentData, setAgentData] = useState<z.infer<typeof agentSchema>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgentList = async () => {
    if (!currentUser?.uid) return;

    try {
      const res = await fetch(`/api/agents/getAgent?userId=${currentUser.uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Failed to fetch agent list.");
        console.error(json.error || "Unknown error");
        return;
      }

      const agentsData = json as Record<string, AgentRecord>;

      const agentArray = Object.entries(agentsData).map(([agent_id, agentData]) => ({
        agent_id,
        agent_name: agentData.agent_name ?? "Unnamed Agent",
        apiKey: agentData.apikey ?? "",
        active: agentData.active ?? false,
        transaction_list: agentData.transaction_list ?? [],
        created_at: agentData.created_at ?? null,
      }));

      setAgentData(agentArray);
    } catch (error) {
      console.error("Error fetching agent list:", error);
      toast.error("Could not fetch agent data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentList();
  }, [currentUser?.uid]);

  if (!currentUser) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-muted-foreground">Please log in to view your agents.</div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      {loading ? (
        <div className="text-muted-foreground">Loading agent data...</div>
      ) : (
        <AgentDataTable initialData={agentData} refreshData={fetchAgentList} />
      )}
    </div>
  );
}
