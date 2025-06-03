import { useEffect, useCallback, useRef } from "react";
import { createClient } from "@/app/service/supabase/client";
import { useSetAtom } from "jotai";
import { productsAtom } from "@/app/atoms/settings";
import { Timestamp } from "firebase/firestore";
import isEqual from "lodash-es/isEqual";

const supabase = createClient();

type ProductRow = {
  id: string;
  description: string;
  name: string;
  type: string;
  price_cents: number;
  user_id: string;
  created_at: string;
  deleted: boolean;
};

function formatProduct(product: ProductRow) {
  return {
    product_id: product.id,
    description: product.description ?? "",
    name: product.name ?? "",
    type: product.type ?? "",
    price: (product.price_cents ?? 0) / 100,
    user_id: product.user_id ?? "",
    created_at: product.created_at
      ? Timestamp.fromDate(new Date(product.created_at))
      : Timestamp.now(),
    deleted: product.deleted,
  };
}

export function useRealtimeProducts() {
  const setProducts = useSetAtom(productsAtom);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isMountedRef = useRef(true);

  // Memoize the formatter
  const memoizedFormatProduct = useCallback(formatProduct, []);

  // Memoize the realtime handler
  const handleRealtimeChange = useCallback(
    (payload: any) => {
      const newRow = payload.new as ProductRow;
      const oldRow = payload.old as ProductRow;

      setProducts((prev) => {
        switch (payload.eventType) {
          case "INSERT":
            if (!payload.new || payload.new.deleted) return prev;
            if (prev.some((p) => p.product_id === newRow.id)) return prev;
            return [...prev, memoizedFormatProduct(newRow)];

          case "UPDATE":
            if (newRow.deleted) {
              return prev.filter((product) => product.product_id !== newRow.id);
            }
            return prev.map((product) => {
              if (product.product_id === newRow.id) {
                const updated = formatProduct(newRow);
                // Only replace if something actually changed
                return !isEqual(product, updated) ? updated : product;
              }
              return product;
            });

          case "DELETE":
            return prev.filter((product) => product.product_id !== oldRow.id);

          default:
            return prev;
        }
      });
    },
    [setProducts, memoizedFormatProduct]
  );

  useEffect(() => {
    isMountedRef.current = true;

    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("deleted", false);

        if (error) {
          console.error("Error fetching products:", error);
          return;
        }

        if (isMountedRef.current && data) {
          setProducts(data.map(memoizedFormatProduct));
        }
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
      }
    };

    fetchInitialData();

    // Setup realtime subscription
    const channel = supabase
      .channel("products-realtime", {
        config: {
          broadcast: { self: false, ack: true },
          presence: { key: "products" },
        },
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        handleRealtimeChange
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [setProducts, memoizedFormatProduct, handleRealtimeChange]);
}
