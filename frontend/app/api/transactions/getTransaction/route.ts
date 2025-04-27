import { NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/app/firebase/firestore/transactions";

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
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching transactions", error: error.message }, { status: 500 });
  }
} 