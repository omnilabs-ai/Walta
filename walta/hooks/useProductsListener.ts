import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { productsAtom, productSchema } from "@/app/atoms/settings";
import { db } from "@/app/service/firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { z } from "zod";

export function useProductListener(userId: string | undefined) {
  const setProducts = useSetAtom(productsAtom);

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        setProducts([]);
        return;
      }

      const data = docSnapshot.data();
      const productsData = data.products as Record<string, any> | undefined;

      if (!productsData) {
        setProducts([]);
        return;
      }

      const productsList = Object.entries(productsData).map(
        ([product_id, productData]) => ({
          product_id, // include id if needed for reference
          description: productData.description ?? "",
          name: productData.name ?? "",
          type: productData.type ?? "",
          price: productData.price ?? 0,
          vendorName: productData.vendorName ?? "",
          user_id: productData.user_id ?? "",
          created_at: productData.created_at ?? null,
        })
      );

      const validProducts: z.infer<typeof productSchema>[] =
        productsList.filter((product) => {
          return productSchema.safeParse(product).success;
        });

      setProducts(validProducts);
    });

    return () => unsubscribe();
  }, [userId, setProducts]);
}
