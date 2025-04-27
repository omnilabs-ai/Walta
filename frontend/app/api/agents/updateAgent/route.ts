import { updateUserAgent } from "@/app/firebase/firestore/agents";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, agentId, updatedFields } = await request.json();

  const updatedAgent = await updateUserAgent(userId, agentId, updatedFields);

  return NextResponse.json(updatedAgent);
}

