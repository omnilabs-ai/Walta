import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { transactionsAtom, transactionSchema } from "@/app/atoms/settings";
import { db } from "@/app/firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { z } from "zod";

export function useTransactionListener(userId: string | undefined) {
  const setTransactions = useSetAtom(transactionsAtom);

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        setTransactions([]);
        return;
      }

      const data = docSnapshot.data();
      const transactionsData = data.transactions as
        | Record<string, any>
        | undefined;

      if (!transactionsData) {
        setTransactions([]);
        return;
      }

      const transactionsList = Object.entries(transactionsData).map(
        ([transaction_id, transactionData]) => ({
          transaction_id,
          from_user_id: transactionData.from_user_id ?? "",
          to_user_id: transactionData.to_user_id ?? "",
          from_agent_id: transactionData.from_agent_id ?? "",
          amount: transactionData.amount ?? 0,
          status: transactionData.status ?? "",
          created_at: transactionData.created_at ?? null,
          metadata: transactionData.metadata ?? {},
        })
      );

      // Validate each transaction with Zod schema
      const validTransactions: z.infer<typeof transactionSchema>[] =
        transactionsList.filter((transaction) => {
          return transactionSchema.safeParse(transaction).success;
        });

      // Update atom with the validated transactions
      setTransactions(validTransactions);
    });

    return () => unsubscribe();
  }, [userId, setTransactions]);
}
