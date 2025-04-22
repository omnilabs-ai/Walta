import { NextResponse } from "next/server";
import { createNewUser } from "../../firebase/firestoreUtils"

export async function POST(req: Request) {
  const { userId, name, email } = await req.json();

  try {
    await createNewUser(userId, name, email);
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("API error:", error);

    // Narrow the error type
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { status: "error", message: errorMessage },
      { status: 500 }
    );
  }
}
