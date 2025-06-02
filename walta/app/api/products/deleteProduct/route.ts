import { NextRequest, NextResponse } from "next/server";
import { deleteProduct } from "@/app/service/supabase/products";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function POST(request: NextRequest) {
  try {
    const user_id = await validateApiKey(request.headers.get('authorization') ?? '')
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.product_id) {
      return NextResponse.json(
        { error: "Missing required field: product_id" },
        { status: 400 }
      );
    }

    const { product_id } = body;
    await deleteProduct(product_id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in deleteProduct route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 