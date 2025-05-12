import { NextRequest, NextResponse } from "next/server";
import { getAgents } from "@/app/firebase/firestore/agents";

export async function GET(request: NextRequest) {
  // Extract parameters from the URL query string instead of request body
  const userId = request.nextUrl.searchParams.get("userId");
  const agentId = request.nextUrl.searchParams.get("agentId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    if (agentId) {
      const agent = await getAgents(userId, agentId);
      return NextResponse.json(agent, { status: 200 });
    } else {
      const agents = await getAgents(userId);
      return NextResponse.json(agents, { status: 200 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: "Error fetching agents", error: errorMessage }, { status: 500 }
    );
  }
}
