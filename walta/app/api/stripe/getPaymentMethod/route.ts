import { NextRequest, NextResponse } from "next/server";
import { getCustomerPaymentMethod } from "@/app/stripe/get";

export async function POST(req: NextRequest) {
    const { customerId } = await req.json();
    const paymentMethodId = await getCustomerPaymentMethod(customerId);
    return NextResponse.json({ paymentMethodId });
}
