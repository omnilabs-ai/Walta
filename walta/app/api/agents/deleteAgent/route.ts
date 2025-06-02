import { NextRequest, NextResponse } from "next/server";
import { deleteAgent } from "@/app/service/supabase/agents";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function POST(request: NextRequest) {
  try {
    const userId = await validateApiKey(request.headers.get('authorization') ?? '')
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.agent_id) {
      return NextResponse.json(
        { error: "Missing required field: agent_id" },
        { status: 400 }
      );
    }

    const { agent_id } = body;
    await deleteAgent(agent_id);
    
    return NextResponse.json({ message: "Agent deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in deleteAgent route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
