import { NextRequest, NextResponse } from "next/server";
import { getCustomerTransactions } from "@/app/service/supabase/transactions";
import { getUser } from "@/app/service/supabase/user";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function GET(request: NextRequest) {
  try {
    const userId = await validateApiKey(request.headers.get('authorization') ?? '')
        
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser(userId);

    const transaction_id = request.nextUrl.searchParams.get('transactionId');

    if (transaction_id) {
      const transactions = await getCustomerTransactions(user.stripe_customer_id, transaction_id);
      return NextResponse.json(transactions, { status: 200 });
    } else {
      const transactions = await getCustomerTransactions(user.stripe_customer_id);
      return NextResponse.json(transactions, { status: 200 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error fetching transactions", error: errorMessage }, { status: 500 });
  }
} 