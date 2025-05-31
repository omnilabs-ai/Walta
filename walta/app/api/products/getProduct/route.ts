import { NextRequest, NextResponse } from "next/server";
import { getProduct, getProducts } from "@/app/service/supabase/products";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const vendorId = searchParams.get('vendorId');

    let result;
    if (productId) {
      result = await getProduct(productId);
    } else {
      result = await getProducts(vendorId || undefined);
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in getProduct route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 