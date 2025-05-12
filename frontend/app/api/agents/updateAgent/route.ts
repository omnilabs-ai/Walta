import { updateAgent } from "@/app/firebase/firestore/agents";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, agentId, updatedFields } = await request.json();

  const updatedAgent = await updateAgent(userId, agentId, updatedFields);
  try {
    return NextResponse.json(updatedAgent, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error updating agent", error: errorMessage }, { status: 500 });
  }
}

