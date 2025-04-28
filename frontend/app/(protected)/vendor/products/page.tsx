"use client";

import { useAtomValue } from "jotai";
import { currentUserAtom, productsAtom } from "@/app/atoms/settings";
import { useProductListener } from "@/hooks/useProductsListener";
import { ProductDataTable } from "@/components/product-data-table";

export default function ProductTablePage() {
  const currentUser = useAtomValue(currentUserAtom);
  const products = useAtomValue(productsAtom);

  useProductListener(currentUser?.uid);

  if (!currentUser) {
    return <div>Please log in to view your products.</div>;
  }

  return (
    <div className="px-4 lg:px-6">
      <ProductDataTable data={products} />
    </div>
  );
}