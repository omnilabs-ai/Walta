// hooks/useRealtimeProducts.ts
import { useEffect } from 'react'
import { createClient } from '@/app/service/supabase/client'
import { useSetAtom } from 'jotai'
import { productsAtom } from '@/app/atoms/settings'
import { Timestamp } from 'firebase/firestore'
const supabase = createClient();

type ProductRow = {
  id: string
  description: string
  name: string
  type: string
  price: number
  vendor_name: string
  user_id: string
  created_at: string
}

export function useRealtimeProducts() {
  const setProducts = useSetAtom(productsAtom);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')

      if (data) {
        const formatted = data.map(formatProduct)
        setProducts(formatted)
      }
    }

    fetchData()

    const channel = supabase
      .channel('realtime:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          const newRow = payload.new as ProductRow
          const oldRow = payload.old as ProductRow

          setProducts((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prev, formatProduct(newRow)]
              case 'UPDATE':
                return prev.map((product) =>
                  product.product_id === newRow.id ? formatProduct(newRow) : product
                )
              case 'DELETE':
                return prev.filter((product) => product.product_id !== oldRow.id)
              default:
                return prev
            }
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [setProducts])
}

function formatProduct(product: ProductRow) {
  return {
    product_id: product.id,
    description: product.description ?? "",
    name: product.name ?? "",
    type: product.type ?? "",
    price: product.price ?? 0,
    vendorName: product.vendor_name ?? "",
    user_id: product.user_id ?? "",
    created_at: product.created_at ? Timestamp.fromDate(new Date(product.created_at)) : Timestamp.now(),
  }
}
