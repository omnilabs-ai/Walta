"use client";

import { useEffect, useState } from "react";
import CardSetupForm from "./cardSetupForm";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/app/atoms/settings";
import type { PaymentMethod } from "@stripe/stripe-js";

export default function UserWallet() {
  const currentUser = useAtomValue(currentUserAtom);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [addingCard, setAddingCard] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user's Stripe customer ID
  useEffect(() => {
    if (!currentUser?.uid) return;

    fetch("/api/user/getUser?userId=" + currentUser.uid + "&params=stripe_customer_id")
      .then((res) => res.json())
      .then((data) => {
        console.log(currentUser.uid);
        console.log("Received user data:", data);
        if (data.stripe_customer_id) {
          setCustomerId(data.stripe_customer_id);
          fetchPaymentMethods(data.stripe_customer_id);
        } else {
          console.warn("No stripe_customer_id returned for user.");
        }
      });
  }, [currentUser?.uid]);

  // Fetch payment methods
  const fetchPaymentMethods = async (customerId: string) => {
    setLoading(true);
    const res = await fetch("/api/stripe/getPaymentMethods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const data = await res.json();
    setPaymentMethods(data.paymentMethods?.data || []);
    setLoading(false);
  };

  const handleAddCard = async () => {
    if (!customerId) return;

    const res = await fetch("/api/stripe/createSetupIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const data = await res.json();
    setClientSecret(data.clientSecret);
    setAddingCard(true);
  };

  const handleSetupComplete = () => {
    setAddingCard(false);
    if (customerId) fetchPaymentMethods(customerId);
  };
  const handleDelete = async (paymentMethodId: string) => {
    const res = await fetch("/api/stripe/deletePayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId }),
    });

    const result = await res.json();
    if (result.success) {
      fetchPaymentMethods(customerId!);
    } else {
      alert("Failed to delete card: " + result.error);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Saved Cards</h2>

      {loading ? (
        <p className="text-gray-500 mb-6 animate-pulse">Loading payment methods...</p>
      ) : paymentMethods.length === 0 ? (
        <p className="text-gray-500 mb-6">No cards saved yet.</p>
      ) : (
        <ul className="mb-6 space-y-4">
          {paymentMethods.map((pm) => (
            <li key={pm.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    •••• {pm.card?.last4}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {pm.card?.exp_month}/{pm.card?.exp_year}
                  </p>
                </div>
                <span className="uppercase text-gray-500 text-xs">
                  {pm.card?.brand}
                </span>
              </div>
              <button
                onClick={() => handleDelete(pm.id)}
                className="text-red-600 text-sm ml-4 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {!addingCard ? (
        <button
          onClick={handleAddCard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Card
        </button>
      ) : (
        clientSecret && (
          <div className="mt-6">
            <CardSetupForm clientSecret={clientSecret} onComplete={handleSetupComplete} />
          </div>
        )
      )}
    </div>
  );
}
