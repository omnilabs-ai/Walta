import { createSetupIntent } from "@/app/stripe/intent";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { customerId } = await request.json();
    const clientSecret = await createSetupIntent(customerId);
    return NextResponse.json({ clientSecret });
}
