import { NextRequest, NextResponse } from "next/server";
import { createCustomer } from "@/app/service/stripe/get";

export async function POST(req: NextRequest) {
    const { name, email } = await req.json();
    const { customer, customerId } = await createCustomer(name, email);
    return NextResponse.json({ customer, customerId });
}
