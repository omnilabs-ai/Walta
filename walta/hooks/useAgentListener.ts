// app/hooks/useAgentListener.ts
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { agentsAtom } from "@/app/atoms/settings"; // <-- your atom holding agents
import { db } from "@/app/service/firebase/auth"; // <-- use the client Firestore
import { doc, onSnapshot } from "firebase/firestore";
import { agentSchema } from "@/app/atoms/settings";
import { z } from "zod";

export function useAgentListener(userId: string | undefined) {
  const setAgents = useSetAtom(agentsAtom);

  useEffect(() => {
    if (!userId) return;

    // reference the specific user's document
    const userDocRef = doc(db, "users", userId);

    // set up real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        setAgents([]);
        return;
      }

      const data = docSnapshot.data();
      const agentsData = data.agents as Record<string, any> | undefined;

      if (!agentsData) {
        setAgents([]);
        return;
      }

      const agentsList = Object.entries(agentsData).map(([agent_id, agentData]) => ({
        agent_id,
        agent_name: agentData.agent_name ?? "Unnamed Agent",
        apiKey: agentData.apikey ?? "", // Note: apikey vs apiKey naming
        active: agentData.active ?? false,
        transaction_list: agentData.transaction_list ?? [],
        created_at: agentData.created_at ?? null,
      }));

      // Validate each agent with Zod schema
      const validAgents: z.infer<typeof agentSchema>[] = agentsList.filter(agent => {
        return agentSchema.safeParse(agent).success;
      });

      // Update atom with the validated agents
      setAgents(validAgents);
    });

    // clean up listener on unmount
    return () => unsubscribe();
  }, [userId, setAgents]);
}
