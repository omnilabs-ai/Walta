// /app/api/stripe/getPaymentMethods/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCustomerPaymentMethods } from "@/app/service/stripe/intent";
import stripe from "@/app/service/stripe/config";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const [paymentMethods, rawCustomer] = await Promise.all([
      getCustomerPaymentMethods(customerId),
      stripe.customers.retrieve(customerId),
    ]);

    const customer = rawCustomer as Stripe.Customer;

    return NextResponse.json({
      paymentMethods,
      defaultPaymentMethodId: customer.invoice_settings?.default_payment_method ?? null,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
  }
}
