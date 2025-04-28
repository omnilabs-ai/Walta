import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { userId, productId, updateData } = await request.json();

  try {
    const updatedProduct = await updateProduct(productId, updateData);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating product", error: error.message }, { status: 500 });
  }
} 