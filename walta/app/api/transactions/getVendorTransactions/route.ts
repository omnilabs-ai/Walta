import { NextRequest, NextResponse } from "next/server";
import { getVendorTransactions } from "@/app/service/supabase/transactions";
import { validateApiKey } from "@/app/service/supabase/lib/validate";
import { getUser } from "@/app/service/supabase/user";

export async function GET(request: NextRequest) {
  try {
    const userId = await validateApiKey(request.headers.get('authorization') ?? '')
        
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser(userId);

    const transaction_id = request.nextUrl.searchParams.get('transactionId');

    if (transaction_id) {
      const transactions = await getVendorTransactions(user.stripe_vendor_id, transaction_id);
      return NextResponse.json(transactions, { status: 200 });
    } else {
      const transactions = await getVendorTransactions(user.stripe_vendor_id);
      return NextResponse.json(transactions, { status: 200 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error fetching transactions", error: errorMessage }, { status: 500 });
  }
} 