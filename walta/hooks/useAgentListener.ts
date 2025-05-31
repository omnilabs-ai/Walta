// app/hooks/useAgentListener.ts
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { agentsAtom } from "@/app/atoms/settings";
import { createClient } from "@/app/service/supabase/client";
import { agentSchema } from "@/app/atoms/settings";
import { z } from "zod";

export function useAgentListener() {
  const setAgents = useSetAtom(agentsAtom);

  useEffect(() => {

    const supabase = createClient();

    // Set up real-time subscription to agents table
    const subscription = supabase
      .channel('agents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
        },
        async () => {
          // Fetch all agents for the user when any change occurs
          const { data: agentsData, error } = await supabase
            .from('agents')
            .select('*')

          if (error) {
            console.error('Error fetching agents:', error);
            setAgents([]);
            return;
          }

          if (!agentsData) {
            setAgents([]);
            return;
          }

          // Transform Supabase data to match the expected schema
          const agentsList = agentsData.map((agent) => ({
            agent_id: agent.id,
            agent_name: agent.name,
            apiKey: agent.public_key,
            active: agent.active,
            transaction_list: [], // You might want to fetch this separately if needed
            created_at: agent.created_at,
          }));

          // Validate each agent with Zod schema
          const validAgents: z.infer<typeof agentSchema>[] = agentsList.filter(agent => {
            return agentSchema.safeParse(agent).success;
          });

          // Update atom with the validated agents
          setAgents(validAgents);
        }
      )
      .subscribe();

    // Initial fetch
    const fetchAgents = async () => {
      const { data: agentsData, error } = await supabase
        .from('agents')
        .select('*')

      if (error) {
        console.error('Error fetching agents:', error);
        setAgents([]);
        return;
      }

      if (!agentsData) {
        setAgents([]);
        return;
      }

      const agentsList = agentsData.map((agent) => ({
        agent_id: agent.id,
        agent_name: agent.name,
        apiKey: agent.public_key,
        active: agent.active,
        transaction_list: [], // You might want to fetch this separately if needed
        created_at: agent.created_at,
      }));

      const validAgents: z.infer<typeof agentSchema>[] = agentsList.filter(agent => {
        return agentSchema.safeParse(agent).success;
      });

      setAgents(validAgents);
    };

    fetchAgents();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setAgents]);
}
