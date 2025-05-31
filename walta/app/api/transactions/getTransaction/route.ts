import { NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/app/service/firebase/firestore/transactions";

export async function POST(request: NextRequest) {
  const { userId, transactionId } = await request.json();

  try {
    if (transactionId) {
      const transactions = await getTransactions(userId, transactionId);
      return NextResponse.json(transactions, { status: 200 });
    } else {
      const transactions = await getTransactions(userId);
      return NextResponse.json(transactions, { status: 200 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error fetching transactions", error: errorMessage }, { status: 500 });
  }
} 