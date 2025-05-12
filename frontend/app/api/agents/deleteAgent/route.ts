import { NextRequest, NextResponse } from "next/server";
import { deleteAgent } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId, agentId } = await request.json();

  const deletedAgent = await deleteAgent(userId, agentId);

  try {
    return NextResponse.json(deletedAgent, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error deleting agent", error: errorMessage }, { status: 500 });
  }
}
