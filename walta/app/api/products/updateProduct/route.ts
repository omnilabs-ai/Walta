import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/app/service/supabase/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.productId || !body.updateData) {
      return NextResponse.json(
        { error: "Missing required fields: productId and updateData are required" },
        { status: 400 }
      );
    }

    const { productId, updateData } = body;
    const result = await updateProduct(productId, updateData);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in updateProduct route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 