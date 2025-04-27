import { NextRequest, NextResponse } from "next/server";
import { getAgents } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId, agentId } = await request.json();

  try {
    if (agentId) {
      const agent = await getAgents(userId, agentId);
      return NextResponse.json(agent, { status: 200 });
  } else {
    const agents = await getAgents(userId);
      return NextResponse.json(agents, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching agents", error: error.message }, { status: 500 });
  }
}
