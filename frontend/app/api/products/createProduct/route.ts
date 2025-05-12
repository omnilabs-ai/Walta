import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { userId, name, description, price, type, vendorName, metadata } = await request.json();

  try {
    const newProduct = await createProduct(userId, { name, description, price, type, vendorName, metadata});
    return NextResponse.json(newProduct, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error creating product", error: errorMessage }, { status: 500 });
  }
} 