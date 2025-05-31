import { updateAgent } from "@/app/service/supabase/agents";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { agentId, updateData } = await request.json();

    if (!agentId) {
      return NextResponse.json({ message: "Agent ID is required" }, { status: 400 });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Update data is required" }, { status: 400 });
    }

    const updatedAgent = await updateAgent(agentId, updateData);
    return NextResponse.json(updatedAgent, { status: 200 });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error updating agent", error: errorMessage }, { status: 500 });
  }
}

