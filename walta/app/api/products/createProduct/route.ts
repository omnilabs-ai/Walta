import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/app/service/supabase/products";
import { validateApiKey } from "@/app/service/supabase/lib/validate";
import { getUser } from "@/app/service/supabase/user";
import { z } from "zod";

// Expect price from frontend in dollars
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  description: z.string().optional(),
  type: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const user_id = await validateApiKey(authHeader);

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUser(user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request format",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, price, description, type, metadata } = parsed.data;
    const price_cents = Math.round(price * 100); // convert dollars to cents

    const result = await createProduct({
      name,
      price_cents,
      description: description ?? "",
      type: type ?? "",
      metadata: metadata ?? {},
      user_id,
      stripe_vendor_id: user.stripe_vendor_id,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: unknown) {
    console.error("Error in createProduct route:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
