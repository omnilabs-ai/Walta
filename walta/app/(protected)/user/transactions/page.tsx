"use client";


import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/app/atoms/settings";
import { transactionsAtom } from "@/app/atoms/settings";
import { useRealtimeTransactions } from "@/hooks/useRealtimeTransactions";
import { TransactionDataTable } from "@/components/transaction-data-table";


export default function TransactionTablePage() {
    const currentUser = useAtomValue(currentUserAtom);
    const transactions = useAtomValue(transactionsAtom);
    useRealtimeTransactions(currentUser?.stripe_customer_id);


    if (!currentUser) {
        return (
            <div className="px-4 lg:px-6">
                <div className="text-muted-foreground">Please log in to view your transactions.</div>
            </div>
        );
    }


    return (
        <div className="px-4 lg:px-6">
            <TransactionDataTable data={transactions} />
        </div>
    );
}
