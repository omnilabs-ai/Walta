import { NextRequest, NextResponse } from "next/server";
import { createAccountLink } from "@/app/service/stripe/accounts";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || "";
    const accountLink = await createAccountLink(accountId);
    return NextResponse.json(accountLink);
}
