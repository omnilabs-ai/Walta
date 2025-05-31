'use client'

import { useState } from 'react'
import { generateKeyPair } from '@/lib/crypto'

interface AgentData {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

interface ErrorResponse {
  message: string;
  error: string;
}

export default function TestPage() {
    const [data, setData] = useState<AgentData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [newAgent, setNewAgent] = useState({
        name: '',
        id: ''
    })

    const createNewAgent = async () => {
        setLoading(true)
        try {
            const { publicKey, privateKey } = await generateKeyPair();

            const response = await fetch('/api/agents/createAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agent_name: 'created_agent', publicKey })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(result)
            alert(privateKey)
            setNewAgent({ name: '', id: '' })
            setError(null)
        } catch (err) {
            console.error('Error caught:', err)
            setError(err instanceof Error ? err.message : 'An unknown error occurred')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const getAgents = async (agentId?: string) => {
        setLoading(true)
        try {
            let response;
            if (agentId) {
                response = await fetch(`/api/agents/getAgent?agentId=${agentId}`)
            } else {
                response = await fetch('/api/agents/getAgent')
            }
            const result = await response.json()
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(result)
            setError(null)
        } catch (err) {
            console.error('Error caught:', err)
            setError(err instanceof Error ? err.message : 'An unknown error occurred')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const updateAgent = async () => {
        if (!newAgent.id.trim()) {
            setError('Please enter an agent ID');
            return;
        }
        if (!newAgent.name.trim()) {
            setError('Please enter a new name');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/agents/updateAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agentId: newAgent.id,
                    updateData: { active: newAgent.name }
                })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(result);
            setNewAgent({ name: '', id: '' });
            setError(null);
        } catch (err) {
            console.error('Error caught:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    const deleteAgent = async () => {
        if (!newAgent.id.trim()) {
            setError('Please enter an agent ID');
            return;
        }

        if (!confirm('Are you sure you want to delete this agent?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/agents/deleteAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agentId: newAgent.id })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const errorData = result as ErrorResponse;
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            setData(null);
            setNewAgent({ name: '', id: '' });
            setError(null);
        } catch (err) {
            console.error('Error caught:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Agents Test Page</h1>
            
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Agent name"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        value={newAgent.id}
                        onChange={(e) => setNewAgent(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="Agent ID"
                        className="border p-2 rounded"
                    />
                </div>

                <div className="space-x-4">
                    <button 
                        onClick={createNewAgent}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create New Agent'}
                    </button>

                    <button 
                        onClick={() => getAgents()}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Get Agents'}
                    </button>
                </div>
            </div>

            {data && (
                <div className="mt-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={updateAgent}
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Agent'}
                            </button>
                            <button
                                onClick={deleteAgent}
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete Agent'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {error ? (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            ) : data && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p className="font-bold">Success!</p>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
