import { NextRequest, NextResponse } from "next/server";
import { addTransaction } from "@/app/firebase/firestore/transactions";

export async function POST(request: NextRequest) {
  const { userId, transaction } = await request.json();

  try {
    const { newTransaction, transaction_id } = await addTransaction(userId, transaction);
    return NextResponse.json({ newTransaction, transaction_id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating transaction", error: error.message }, { status: 500 });
  }
} 