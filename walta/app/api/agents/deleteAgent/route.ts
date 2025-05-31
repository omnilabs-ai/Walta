import { NextRequest, NextResponse } from "next/server";
import { deleteAgent } from "@/app/service/supabase/agents";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.agentId) {
      return NextResponse.json(
        { error: "Missing required field: agentId" },
        { status: 400 }
      );
    }

    const { agentId } = body;
    const result = await deleteAgent(agentId);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in deleteAgent route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
