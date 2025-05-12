import { NextRequest, NextResponse } from "next/server";
import { queryProductData } from "@/app/firebase/firestore/misc";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const price = searchParams.get('price');
    const vendorName = searchParams.get('vendorName');
    const metadata = searchParams.get('metadata');

    try {
        const products = await queryProductData({
            productId,
            name,
            type,
            price: price ? Number(price) : undefined,
            vendorName,
            metadata: metadata ? JSON.parse(metadata) : undefined,
        });
    
        return NextResponse.json({ products }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: "Error getting products", error: errorMessage }, { status: 500 });
    }
}
