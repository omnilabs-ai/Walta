import { NextRequest, NextResponse } from "next/server";
import { deletePaymentMethod } from "@/app/service/stripe/intent";

export async function POST(request: NextRequest) {
  const { paymentMethodId } = await request.json();

  try {
    const result = await deletePaymentMethod(paymentMethodId);
    return NextResponse.json({ success: true, detached: result });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
