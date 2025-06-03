import { updateAgent } from "@/app/service/supabase/agents";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function POST(request: NextRequest) {
  try {
    const userId = await validateApiKey(
      request.headers.get("authorization") ?? ""
    );

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, update_data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Agent ID is required" },
        { status: 400 }
      );
    }

    if (!update_data || Object.keys(update_data).length === 0) {
      return NextResponse.json(
        { message: "Update data is required" },
        { status: 400 }
      );
    }

    const updatedAgent = await updateAgent(id, update_data);
    return NextResponse.json(updatedAgent, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Error updating agent", error: errorMessage },
      { status: 500 }
    );
  }
}
