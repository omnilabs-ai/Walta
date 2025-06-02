import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/app/service/supabase/products";
import { z } from "zod";
import { validateApiKey } from "@/app/service/supabase/lib/validate";
import { getUser } from "@/app/service/supabase/user";


const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price_cents: z.number().int().positive("Price must be a positive number"),
});

export async function POST(request: NextRequest) {
  try {
    const user_id = await validateApiKey(request.headers.get('authorization') ?? '')
    
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser(user_id)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const stripe_vendor_id = user.stripe_vendor_id

    const body = await request.json();
    
    const validationResult = createProductSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid request format",
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const result = await createProduct({
      ...body,
      stripe_vendor_id,
      user_id
    });
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