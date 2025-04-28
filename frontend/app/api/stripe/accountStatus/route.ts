import { NextRequest, NextResponse } from "next/server";
import { checkAccountStatus } from "@/app/stripe/accounts";

export async function POST(request: NextRequest) {
    const { accountId } = await request.json();
    const accountStatus = await checkAccountStatus(accountId);
    return NextResponse.json({ accountStatus });
}
