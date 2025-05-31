import { NextRequest, NextResponse } from "next/server";
import { createAgent } from "@/app/service/supabase/agents";

export async function POST(request: NextRequest) {
  try {
    const { agent_name, publicKey } = await request.json();
    
    if (!agent_name) {
      return NextResponse.json(
        { message: "Agent name is required" },
        { status: 400 }
      );
    }

    const agent = await createAgent({ name: agent_name, public_key: publicKey });
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
