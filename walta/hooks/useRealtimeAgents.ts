import { useEffect, useCallback, useRef } from "react";
import { useSetAtom } from "jotai";
import { createClient } from "@/app/service/supabase/client";
import { agentsAtom } from "@/app/atoms/settings";
import { isEqual } from "lodash-es";

const supabase = createClient();

type AgentRow = {
  id: string;
  agent_key: string;
  created_at: string;
  user_id: string;
  name: string;
  active: boolean;
};

export function useRealtimeAgents() {
  const setAgents = useSetAtom(agentsAtom);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isMountedRef = useRef(true);

  const formatAgent = useCallback((agent: AgentRow) => ({
    transaction_list: [],
    id: agent.id,
    name: agent.name,
    agent_key: agent.agent_key,
    active: agent.active,
    created_at: agent.created_at
  }), []);

  const handleRealtimeChange = useCallback(
    (payload: any) => {
      if (!isMountedRef.current) return;

      setAgents(prev => {
        switch (payload.eventType) {
          case "INSERT": {
            const newAgent = formatAgent(payload.new);
            return prev.some(a => a.id === newAgent.id) 
              ? prev 
              : [...prev, newAgent];
          }
          
          case "UPDATE": {
            const formatted = formatAgent(payload.new);
            return prev.map(agent => 
              agent.id === payload.new.id && !isEqual(agent, formatted)
                ? formatted
                : agent
            );
          }
          
          case "DELETE": {
            return prev.filter(agent => agent.id !== payload.old.id);
          }
          
          default:
            return prev;
        }
      });
    },
    [setAgents, formatAgent]
  );

  useEffect(() => {
    isMountedRef.current = true;

    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !isMountedRef.current) return;

        setAgents(data?.map(formatAgent) || []);
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };

    const setupSubscription = () => {
      const channel = supabase.channel("agents", {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: "agents" }
        }
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "agents",
      }, handleRealtimeChange);

      return channel.subscribe();
    };

    fetchInitialData();
    channelRef.current = setupSubscription();

    return () => {
      isMountedRef.current = false;
      channelRef.current?.unsubscribe();
    };
  }, [setAgents, formatAgent, handleRealtimeChange]);

  return useCallback(() => {
    channelRef.current?.unsubscribe();
  }, []);
}
