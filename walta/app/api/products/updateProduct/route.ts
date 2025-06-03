import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/app/service/supabase/products";
import { validateApiKey } from "@/app/service/supabase/lib/validate";

export async function POST(request: NextRequest) {
  try {
    const user_id = await validateApiKey(
      request.headers.get("authorization") ?? ""
    );

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.product_id || !body.update_data) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: product_id and update_data are required",
        },
        { status: 400 }
      );
    }

    const { product_id, update_data } = body;

    // 🔁 Convert price (dollars) → price_cents (integer cents)
    if ("price" in update_data) {
      update_data.price_cents = Math.round(update_data.price * 100);
      delete update_data.price; // avoid passing invalid key to Supabase
    }

    const result = await updateProduct(product_id, update_data);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in updateProduct route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
