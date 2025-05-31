import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { productsAtom, productSchema } from "@/app/atoms/settings";
import { createClient } from "@/app/service/supabase/client";
import { z } from "zod";

export function useProductListener() {
  const setProducts = useSetAtom(productsAtom);

  useEffect(() => {
    const supabase = createClient();

    // Set up real-time subscription to products table
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        async () => {
          // Fetch all products when any change occurs
          const { data: productsData, error } = await supabase
            .from('products')
            .select('*')

          if (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            return;
          }

          if (!productsData) {
            setProducts([]);
            return;
          }

          // Transform Supabase data to match the expected schema
          const productsList = productsData.map((product) => ({
            product_id: product.id,
            description: product.description ?? "",
            name: product.name ?? "",
            type: product.type ?? "",
            price: product.price ?? 0,
            vendorName: product.vendor_name ?? "",
            user_id: product.user_id ?? "",
            created_at: product.created_at ?? null,
          }));

          // Validate each product with Zod schema
          const validProducts: z.infer<typeof productSchema>[] = productsList.filter(product => {
            return productSchema.safeParse(product).success;
          });

          // Update atom with the validated products
          setProducts(validProducts);
        }
      )
      .subscribe();

    // Initial fetch
    const fetchProducts = async () => {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        return;
      }

      if (!productsData) {
        setProducts([]);
        return;
      }

      const productsList = productsData.map((product) => ({
        product_id: product.id,
        description: product.description ?? "",
        name: product.name ?? "",
        type: product.type ?? "",
        price: product.price ?? 0,
        vendorName: product.vendor_name ?? "",
        user_id: product.user_id ?? "",
        created_at: product.created_at ?? null,
      }));

      const validProducts: z.infer<typeof productSchema>[] = productsList.filter(product => {
        return productSchema.safeParse(product).success;
      });

      setProducts(validProducts);
    };

    fetchProducts();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setProducts]);
}
