import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/app/service/supabase/products";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function GET(request: NextRequest) {
  try {
    const user_id = await validateApiKey(request.headers.get('authorization') ?? '')
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    let result;
    if (productId) {
      result = await getProducts(productId);
    } else {
      result = await getProducts();
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