"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/app/atoms/settings";
import { useProductListener } from "@/hooks/useProductsListener";
import { ProductDataTable } from "@/components/product-data-table";

export default function ProductTablePage() {
  const products = useAtomValue(productsAtom);

  useProductListener();

  return (
    <div className="px-4 lg:px-6">
      <ProductDataTable data={products} />
    </div>
  );
}