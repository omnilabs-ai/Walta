import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/app/service/supabase/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.vendor_id || !body.name || !body.price_cents) {
      return NextResponse.json(
        { error: "Missing required fields: vendor_id, name, and price_cents are required" },
        { status: 400 }
      );
    }

    const result = await createProduct(body);
    return NextResponse.json(result, { status: 201 });

  } catch (error: unknown) {
    
    console.error("Error in createProduct route:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 