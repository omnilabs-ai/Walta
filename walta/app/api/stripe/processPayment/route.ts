import { NextRequest, NextResponse } from "next/server";
import { processPayment } from "@/app/stripe/payment";

export async function POST(req: NextRequest) {
    const { customerId, paymentMethodId, productId, priceId, accountId } = await req.json();
    const paymentIntent = await processPayment(customerId, paymentMethodId, productId, priceId, accountId);
    return NextResponse.json({ paymentIntent });
}

