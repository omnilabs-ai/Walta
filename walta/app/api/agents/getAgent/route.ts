import { NextRequest, NextResponse } from "next/server";
import { getAgents } from "@/app/service/supabase/agents";

export async function GET(request: NextRequest) {
  // Extract parameters from the URL query string
  const agentId = request.nextUrl.searchParams.get("agentId");
  let data;

  try {
    if (agentId) {
      data = await getAgents(agentId);
    } else {
      data = await getAgents();
    }
    return NextResponse.json(data, { status: 200 });
  
  } catch (error: unknown) {
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        message: "Error fetching agents", 
        error: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
