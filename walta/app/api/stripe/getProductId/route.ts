import { NextRequest, NextResponse } from "next/server";
import { getProductId } from "@/app/service/stripe/get";

export async function POST(req: NextRequest) {
    const { priceId, accountId } = await req.json();
    const productId = await getProductId(priceId, accountId);
    return NextResponse.json({ productId });
}
