import { createClient } from '@/app/service/supabase/server';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface Product {
    id: string;
    created_at: string;
    vendor_id: string;
    name: string;
    price_cents: number;
    description: string | null;
    metadata: Record<string, JsonValue> | null;
}

export interface CreateProductData {
    vendor_id: string;
    name: string;
    price_cents: number;
    description?: string;
    metadata?: Record<string, JsonValue>;
}

export interface UpdateProductData {
    name?: string;
    price_cents?: number;
    description?: string;
    metadata?: Record<string, JsonValue>;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
    const supabase = await createClient();
    
    const { data: product, error } = await supabase
        .from('products')
        .insert([data])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return product;
}

export async function getProduct(productId: string): Promise<Product> {
    const supabase = await createClient();
    
    const { data: product, error } = await supabase
        .from('products')
        .select()
        .eq('id', productId)
        .single();

    if (error) throw error;
    return product;
}

export async function getProducts(vendorId?: string): Promise<Product[]> {
    const supabase = await createClient();
    
    let query = supabase
        .from('products')
        .select();

    if (vendorId) {
        query = query.eq('vendor_id', vendorId);
    }

    const { data: products, error } = await query;

    if (error) throw error;
    return products;
}

export async function updateProduct(productId: string, updateData: UpdateProductData): Promise<Product> {
    const supabase = await createClient();
    
    const { data: product, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

    if (error) throw error;
    return product;
}

export async function deleteProduct(productId: string): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) throw error;
}
