import { NextRequest, NextResponse } from "next/server";
import { deleteAgent } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.userId || !body.agentId) {
      return NextResponse.json(
        { error: "Missing required fields: userId and agentId" },
        { status: 400 }
      );
    }

    const { userId, agentId } = body;
    const deletedAgent = await deleteAgent(userId, agentId);
    
    return NextResponse.json(deletedAgent, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in deleteAgent route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
