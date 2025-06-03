import { supabaseAdmin } from '@/app/service/supabase/lib/supabaseAdmin'

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
    user_id: string;
}

export interface UpdateAgentData {
    active?: boolean;
}

export async function getAgents(userId: string, agentId?: string): Promise<Agent | Agent[]> {
    let query = supabaseAdmin
        .from('agents')
        .select('*')
        .eq('user_id', userId)

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
    const { data: agent, error } = await supabaseAdmin
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
    const { data: agent, error } = await supabaseAdmin
        .from('agents')
        .update(updateData)
        .eq('id', agentId)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!agent) {
        throw new Error(`Agent with id ${agentId} not found or you don't have permission to update it`)
    }

    return agent
}

export async function deleteAgent(agentId: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('agents')
        .delete()
        .eq('id', agentId)

    if (error) {
        throw new Error(error.message)
    }
}
