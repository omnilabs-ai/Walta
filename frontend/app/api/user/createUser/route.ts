import { NextRequest, NextResponse } from "next/server";
import { createNewUser } from "@/app/firebase/firestore/user";

export async function POST(request: NextRequest) {
  const { userId, name, email } = await request.json();

  try {
    const newUser = await createNewUser(userId, name, email);
    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
