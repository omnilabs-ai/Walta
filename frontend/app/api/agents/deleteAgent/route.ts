import { NextRequest, NextResponse } from "next/server";
import { deleteUserAgent } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId, agentId } = await request.json();

  const deletedAgent = await deleteUserAgent(userId, agentId);

  return NextResponse.json(deletedAgent);
}
