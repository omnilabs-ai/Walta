import { NextRequest, NextResponse } from "next/server";
import { addTransaction } from "@/app/service/firebase/firestore/transactions";

export async function POST(request: NextRequest) {
  const { userId, transaction } = await request.json();

  try {
    const { newTransaction, transaction_id } = await addTransaction(userId, transaction);
    return NextResponse.json({ newTransaction, transaction_id }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error creating transaction", error: errorMessage }, { status: 500 });
  }
} 