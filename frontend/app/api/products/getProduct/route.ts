import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/app/firebase/firestore/products";

export async function POST(request: NextRequest) {
  const { userId, productId } = await request.json();

  try {
    if (productId) {
      const product = await getProducts(userId, productId);
      return NextResponse.json(product, { status: 200 });
    } else {
      const products = await getProducts(userId);
      return NextResponse.json(products, { status: 200 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error fetching products", error: errorMessage }, { status: 500 });
  }
} 