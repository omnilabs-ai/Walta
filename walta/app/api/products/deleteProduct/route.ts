import { NextRequest, NextResponse } from "next/server";
import { deleteProduct } from "@/app/service/supabase/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.productId) {
      return NextResponse.json(
        { error: "Missing required field: productId" },
        { status: 400 }
      );
    }

    const { productId } = body;
    await deleteProduct(productId);
    
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