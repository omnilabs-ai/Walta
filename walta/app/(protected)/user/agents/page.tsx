"use client";

import { useAtomValue } from "jotai";
import { agentsAtom } from "@/app/atoms/settings";
import { useAgentListener } from "@/hooks/useAgentListener";
import { AgentDataTable } from "@/components/agent-data-table";

export default function AgentTablePage() {
  const agentData = useAtomValue(agentsAtom);

  useAgentListener(); // sets up the real-time listener

  // if (!currentUser) {
  //   return (
  //     <div className="px-4 lg:px-6">
  //       <div className="text-muted-foreground">Please log in to view your agents.</div>
  //     </div>
  //   );
  // }

  return (
    <div className="px-4 lg:px-6">
      <AgentDataTable data={agentData} />
    </div>
  );
}
