import { NextRequest, NextResponse } from "next/server";
import { getUserAgents } from "@/app/firebase/firestore/agents";

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  const agents = await getUserAgents(userId);

  return NextResponse.json(agents);
}
