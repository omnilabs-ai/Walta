// hooks/useRealtimeAgents.ts
import { useEffect } from 'react'
import { createClient } from '@/app/service/supabase/client'
import { useSetAtom } from 'jotai'
import { agentsAtom } from '@/app/atoms/settings'
const supabase = createClient();

type AgentRow = {
  id: string
  agent_key: string
  created_at: string
  user_id: string
  name: string
  active: boolean
}

export function useRealtimeAgents() {
  const setAgents = useSetAtom(agentsAtom);


  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('agents')
        .select('*')

      if (data) {
        const formatted = data.map(formatAgent)
        setAgents(formatted)
      }
    }

    fetchData()

    const channel = supabase
      .channel('realtime:agents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agents' },
        (payload) => {
          const newRow = payload.new as AgentRow
          const oldRow = payload.old as AgentRow

          setAgents((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prev, formatAgent(newRow)]
              case 'UPDATE':
                return prev.map((agent) =>
                  agent.apiKey === newRow.agent_key ? formatAgent(newRow) : agent
                )
              case 'DELETE':
                return prev.filter((agent) => agent.apiKey !== oldRow.agent_key)
              default:
                return prev
            }
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [setAgents])
}

function formatAgent(agent: AgentRow) {
  return {
    transaction_list: [],
    agent_id: agent.id,
    agent_name: agent.name,
    apiKey: agent.agent_key,
    active: agent.active,
    created_at: agent.created_at
  }
}
