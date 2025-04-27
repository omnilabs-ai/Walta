import { NextRequest, NextResponse } from "next/server";
import { createCustomer } from "@/app/stripe/utils";

export async function POST(req: NextRequest) {
    const { name, email } = await req.json();
    const customer = await createCustomer(name, email);
    return NextResponse.json(customer);
}
