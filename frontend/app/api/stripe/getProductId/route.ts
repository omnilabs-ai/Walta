import { NextRequest, NextResponse } from "next/server";
import { getProductId } from "@/app/stripe/utils";

export async function POST(req: NextRequest) {
    const { priceId, accountId } = await req.json();
    const productId = await getProductId(priceId, accountId);
    return NextResponse.json(productId);
}
