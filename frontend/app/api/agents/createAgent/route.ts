import { NextRequest, NextResponse } from "next/server";
import { addUserAgent } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId, agentName } = await request.json();

  try {
    const newAgent = await addUserAgent(userId, agentName);
    return NextResponse.json(newAgent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating agent" }, { status: 500 });
  }
}
