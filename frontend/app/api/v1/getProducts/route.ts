import { NextRequest, NextResponse } from "next/server";
import { queryProductData } from "@/app/firebase/firestore/misc";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) {
        const products = await queryProductData();
        return NextResponse.json({ products });
    }
    const product = await queryProductData(productId);
    return NextResponse.json({ product });
}
