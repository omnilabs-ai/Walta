import { NextRequest, NextResponse } from "next/server";
import { addAgent } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId, agentName } = await request.json();

  try {
    const newAgent = await addAgent(userId, agentName);
    return NextResponse.json(newAgent, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating agent", error: error.message }, { status: 500 });
  }
}
