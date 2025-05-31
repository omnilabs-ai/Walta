import { createClient } from '@/app/service/supabase/server'

export interface Agent {
    id: string;
    created_at: string;
    name: string;
    user_id: string;
    active: boolean;
    public_key: string;
}

export interface CreateAgentData {
    name: string;
    public_key: string;
}

export interface UpdateAgentData {
    active?: boolean;
}

export async function getAgents(agentId?: string): Promise<Agent | Agent[]> {
    const supabase = await createClient()

    let query = supabase
        .from('agents')
        .select('*')

    if (agentId) {
        query = query.eq('id', agentId)
    }

    const { data, error } = await query

    if (error) {
        throw new Error(error.message)
    }

    if (agentId && (!data || data.length === 0)) {
        throw new Error(`Agent with id ${agentId} not found`)
    }

    return agentId ? data[0] : data
}

export async function createAgent(data: CreateAgentData): Promise<Agent> {
    const supabase = await createClient()

    const { data: agent, error } = await supabase
        .from('agents')
        .insert(data)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!agent) {
        throw new Error('Failed to create agent')
    }

    return agent
}

export async function updateAgent(agentId: string, updateData: UpdateAgentData): Promise<Agent> {
    const supabase = await createClient()

    const { data: agent, error } = await supabase
        .from('agents')
        .update(updateData)
        .eq('id', agentId)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!agent) {
        throw new Error(`Agent with id ${agentId} not found`)
    }

    return agent
}

export async function deleteAgent(agentId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId)

    if (error) {
        throw new Error(error.message)
    }
}