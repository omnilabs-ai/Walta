import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { productId, updatedFields } = await request.json();

  try {
    const updatedProduct = await updateProduct(productId, updatedFields);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error updating product", error: errorMessage }, { status: 500 });
  }
} 