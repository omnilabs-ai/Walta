import { Agent } from "./agents"
import { supabaseAdmin } from "./lib/supabaseAdmin"


export async function getAgentByKey(key: string): Promise<Agent> {
    const { data, error } = await supabaseAdmin
        .from('agents')
        .select('*')
        .eq('agent_key', key)
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!data) {
        throw new Error('Agent not found')
    }

    return data
}
