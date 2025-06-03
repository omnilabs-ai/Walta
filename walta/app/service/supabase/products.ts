import { supabaseAdmin } from "@/app/service/supabase/lib/supabaseAdmin";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface Product {
  id: string;
  user_id: string;
  created_at: string;
  stripe_vendor_id: string;
  name: string;
  price_cents: number;
  description: string | null;
  metadata: Record<string, JsonValue> | null;
}

export interface CreateProductData {
  user_id: string;
  stripe_vendor_id: string;
  name: string;
  price_cents: number;
  description?: string;
  type?: string; // ✅ Add this
  metadata?: Record<string, JsonValue>;
}

export interface UpdateProductData {
  product_id: string;
  name?: string;
  price_cents?: number;
  description?: string;
  type?: string; // ✅ Add this
  metadata?: Record<string, JsonValue>;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return product;
}

export async function getProducts(productId?: string): Promise<Product[]> {
  let query = supabaseAdmin.from("products").select().eq("deleted", false); // 🔍 Exclude deleted rows

  if (productId) {
    query = query.eq("id", productId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  if (productId) {
    if (!data || data.length === 0) {
      throw new Error("Product not found");
    }
    return [data[0]];
  }

  return data;
}

export async function updateProduct(
  productId: string,
  updateData: UpdateProductData
): Promise<Product> {
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return product;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("products")
    .update({ deleted: true })
    .eq("id", productId);

  if (error) throw new Error(error.message);
}
