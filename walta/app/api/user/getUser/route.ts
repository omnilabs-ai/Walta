import { NextRequest, NextResponse } from "next/server";
import { getUser, User } from "@/app/service/supabase/user";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const params = searchParams.get("params")?.split(",") || [];

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userData = await getUser(userId);

    // If specific params were requested, filter the response
    if (params.length > 0) {
      const filteredData: Partial<User> = {};
      params.forEach((param) => {
        if (param in userData) {
          filteredData[param as keyof User] = userData[param as keyof User];
        }
      });
      return NextResponse.json(filteredData);
    }

    return NextResponse.json(userData);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
