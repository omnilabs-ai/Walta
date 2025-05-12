import { NextRequest, NextResponse } from "next/server";
import { deleteProduct } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { userId, productId } = await request.json();

  try {
    const result = await deleteProduct(userId, productId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error deleting product", error: errorMessage }, { status: 500 });
  }
} 