import { NextRequest, NextResponse } from "next/server";
import { setDefaultPaymentMethod } from "@/app/service/stripe/intent";

export async function POST(request: NextRequest) {
  try {
    const { customerId, paymentMethodId } = await request.json();

    if (!customerId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Missing customerId or paymentMethodId" },
        { status: 400 }
      );
    }

    const updatedCustomer = await setDefaultPaymentMethod(
      customerId,
      paymentMethodId
    );

    return NextResponse.json({
      success: true,
      defaultPaymentMethodId:
        updatedCustomer.invoice_settings?.default_payment_method || null,
    });
  } catch (error) {
    console.error("Error setting default payment method:", error);
    return NextResponse.json(
      { error: "Failed to set default payment method" },
      { status: 500 }
    );
  }
}
