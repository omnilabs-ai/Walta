import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/firebase/firestore/user";

export async function POST(request: NextRequest) {
  const { userId, params } = await request.json();

  try {
    const user = await getUser(userId, params);
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching user", error: error.message }, { status: 500 });
  }
}
