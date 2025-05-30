import { NextRequest, NextResponse } from "next/server";
import { addAgent } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId, agent_name } = await request.json();

  try {
    const newAgent = await addAgent(userId, agent_name);
    return NextResponse.json(newAgent, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: "Error creating agent", error: errorMessage }, { status: 500 });
  }
}
