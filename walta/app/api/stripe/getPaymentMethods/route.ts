// /app/api/stripe/getPaymentMethods/route.ts
import { NextResponse } from "next/server";
import { getCustomerPaymentMethods } from "@/app/service/stripe/intent";

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const paymentMethods = await getCustomerPaymentMethods(customerId);
    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}
