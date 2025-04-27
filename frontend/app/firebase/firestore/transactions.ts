import { Timestamp } from "firebase-admin/firestore";
import db from "./config";
import { Transaction } from "./types";
import { v4 as uuidv4 } from 'uuid';

async function addTransaction(user_id: string, transaction: Omit<Transaction, 'transaction_id' | 'created_at'>) {
  const transaction_id = uuidv4();

  const transactionRef = db.collection("users").doc(user_id)
  const doc = await transactionRef.get();
  const data = doc.data();

  const newTransaction = {
    ...transaction,
    transaction_id,
    created_at: Timestamp.now()
  };
  
  await transactionRef.update({
    transactions: {
      ...data?.transactions,
      [transaction_id]: newTransaction
    }
  });
  
  return { newTransaction, transaction_id };
}

async function getTransactions(user_id: string, transaction_id?: string) {
  const userRef = db.collection("users").doc(user_id);
  const doc = await userRef.get();
  const data = doc.data();
  const transactions = data?.transactions || {};

  if (transaction_id) {
    if (!transactions[transaction_id]) {
      throw new Error(`Transaction with id ${transaction_id} not found`);
    }
    return transactions[transaction_id];
  }

  return transactions;
}

export { addTransaction, getTransactions };
