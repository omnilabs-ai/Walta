import { NextRequest, NextResponse } from "next/server";
// import { getAgents } from "@/app/service/supabase/agents";
import { validateApiKey } from "@/app/service/supabase/lib/validate";
import { getAgents } from "@/app/service/supabase/agents";

export async function GET(request: NextRequest) {
  try {
    const userId = await validateApiKey(request.headers.get('authorization') ?? '')
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agentId = request.nextUrl.searchParams.get("agentId");
    let data;
  
    if (agentId) {
      data = await getAgents(userId, agentId);
    } else {
      data = await getAgents(userId);
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
