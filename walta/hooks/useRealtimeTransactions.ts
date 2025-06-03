// hooks/useRealtimeTransactions.ts
import { useEffect } from 'react'
import { createClient } from '@/app/service/supabase/client'
import { useSetAtom } from 'jotai'
import { transactionsAtom } from '@/app/atoms/settings'
const supabase = createClient();

type TransactionRow = {
  id: string
  agent_id: string
  vendor_id: string
  product_id: string
  customer_id: string
  amount_cents: number
  status: string
  metadata: Record<string, string>
  timestamp: string
}

export function useRealtimeTransactions(userId?: string) {
  const setTransactions = useSetAtom(transactionsAtom);

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase
        .from('transactions')
        .select('*');
      
      // If userId is provided, filter by vendor_id or customer_id
      if (userId) {
        query = query.or(`vendor_id.eq.${userId},customer_id.eq.${userId}`);
      }

      const { data } = await query;

      if (data) {
        const formatted = data.map(formatTransaction)
        setTransactions(formatted)
      }
    }

    fetchData()

    const channel = supabase
      .channel('realtime:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          const newRow = payload.new as TransactionRow
          const oldRow = payload.old as TransactionRow

          setTransactions((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                // If userId filter is active, only add if transaction involves this user
                if (userId && !transactionInvolvesUser(newRow, userId)) {
                  return prev;
                }
                return [...prev, formatTransaction(newRow)]
              case 'UPDATE':
                return prev.map((transaction) =>
                  transaction.id === newRow.id ? formatTransaction(newRow) : transaction
                )
              case 'DELETE':
                return prev.filter((transaction) => transaction.id !== oldRow.id)
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
  }, [setTransactions, userId])
}

function formatTransaction(transaction: TransactionRow) {
  return {
    id: transaction.id,
    agent_id: transaction.agent_id,
    vendor_id: transaction.vendor_id,
    product_id: transaction.product_id,
    customer_id: transaction.customer_id,
    amount_cents: transaction.amount_cents,
    status: transaction.status,
    metadata: transaction.metadata || {},
    timestamp: transaction.timestamp
  }
}

function transactionInvolvesUser(transaction: TransactionRow, userId: string): boolean {
  return transaction.vendor_id === userId || transaction.customer_id === userId;
}
