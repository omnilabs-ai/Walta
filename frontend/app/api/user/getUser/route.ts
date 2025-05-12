import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/firebase/firestore/user";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || "";
  const params = searchParams.get('params')?.split(',') || [];

  try {
    const user = await getUser(userId, params);
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error fetching user", error: errorMessage }, { status: 500 });
  }
}
