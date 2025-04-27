import { NextRequest, NextResponse } from "next/server";
import { deleteProduct } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { userId, productId } = await request.json();

  try {
    const result = await deleteProduct(userId, productId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting product", error: error.message }, { status: 500 });
  }
} 