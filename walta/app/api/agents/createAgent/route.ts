import { NextRequest, NextResponse } from "next/server";
import { createAgent } from "@/app/service/supabase/agents";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function POST(request: NextRequest) {
  try {
    const userId = await validateApiKey(request.headers.get('authorization') ?? '')
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agent_name } = await request.json();
    
    if (!agent_name) {
      return NextResponse.json(
        { message: "Agent name is required" },
        { status: 400 }
      );
    }

    const agent = await createAgent({ 
      name: agent_name,
      user_id: userId
    });
    return NextResponse.json({ agent }, { status: 200 });

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { 
        message: "Error creating agent",
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
