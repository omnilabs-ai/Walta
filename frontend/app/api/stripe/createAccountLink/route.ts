import { NextRequest, NextResponse } from "next/server";
import { createAccountLink } from "@/app/stripe/accounts";

export async function POST(request: NextRequest) {
    const { accountId } = await request.json();
    const accountLink = await createAccountLink(accountId);
    return NextResponse.json({ accountLink });
}
