import { NextRequest, NextResponse } from "next/server";
import { checkAccountStatus } from "@/app/service/stripe/accounts";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || "";
    if (accountId === "") {
        return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }
    const accountStatus = await checkAccountStatus(accountId);
    return NextResponse.json(accountStatus);
}
