import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { userId, name, description, price, type, vendorName } = await request.json();

  try {
    const newProduct = await createProduct(userId, { name, description, price, type, vendorName });
    return NextResponse.json(newProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating product", error: error.message }, { status: 500 });
  }
} 