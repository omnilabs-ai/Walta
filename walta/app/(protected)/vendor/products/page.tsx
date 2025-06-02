"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/app/atoms/settings";
import { ProductDataTable } from "@/components/product-data-table";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";

export default function ProductTablePage() {
  const products = useAtomValue(productsAtom);

  useRealtimeProducts();

  return (
    <div className="px-4 lg:px-6">
      <ProductDataTable data={products} />
    </div>
  );
}