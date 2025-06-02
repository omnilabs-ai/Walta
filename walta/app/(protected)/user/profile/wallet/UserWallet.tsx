"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/app/atoms/settings";
import CardSetupForm from "./cardSetupForm";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaymentMethod } from "@stripe/stripe-js";

export default function UserWallet() {
  const currentUser = useAtomValue(currentUserAtom);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingCard, setAddingCard] = useState(false);

  // Step 1: Get customerId once
  useEffect(() => {
    if (!currentUser?.uid) return;

    fetch(`/api/user/getUser?userId=${currentUser.uid}&params=stripe_customer_id`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stripe_customer_id) {
          setCustomerId(data.stripe_customer_id);
        } else {
          console.warn("No stripe_customer_id returned for user.");
        }
      });
  }, [currentUser?.uid]);

  // Step 2: Only fetch payment methods when customerId is available
  useEffect(() => {
    if (!customerId) return;
    fetchPaymentMethods(customerId);
  }, [customerId]);

  const fetchPaymentMethods = async (customerId: string) => {
    setLoading(true);
    const res = await fetch("/api/stripe/getPaymentMethods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const data = await res.json();
    setPaymentMethods(data.paymentMethods?.data || []);
    setDefaultPaymentMethodId(data.defaultPaymentMethodId || null);
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

  const handleDelete = async (paymentMethodId: string) => {
    const res = await fetch("/api/stripe/deletePaymentMethod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId }),
    });
    const result = await res.json();
    if (result.success && customerId) {
      fetchPaymentMethods(customerId);
    } else {
      alert("Failed to delete card: " + result.error);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!customerId) return;

    const res = await fetch("/api/stripe/setDefaultPaymentMethod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, paymentMethodId }),
    });

    const result = await res.json();
    if (result.success) {
      setDefaultPaymentMethodId(result.defaultPaymentMethodId);
    } else {
      alert("Failed to set default payment method: " + result.error);
    }
  };

  const handleSetupComplete = () => {
    setAddingCard(false);
    if (customerId) fetchPaymentMethods(customerId);
  };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-8">Your Saved Cards</h2>

      {loading ? (
        <div className="space-y-4 mb-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
        </div>
      ) : paymentMethods.length === 0 ? (
        <p className="text-muted-foreground mb-6">No cards saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paymentMethods.map((pm) => (
            <Card
              key={pm.id}
              className={pm.id === defaultPaymentMethodId ? "border-blue-600 shadow-lg" : ""}
            >
              <CardHeader className="flex justify-between items-center p-4 pb-0">
                <div>
                  <p className="text-sm font-semibold">•••• {pm.card?.last4}</p>
                  <p className="text-xs text-muted-foreground">
                    Expires {pm.card?.exp_month}/{pm.card?.exp_year}
                  </p>
                </div>
                <Badge variant="outline" className="uppercase text-xs">
                  {pm.card?.brand}
                </Badge>
              </CardHeader>
              <CardFooter className="p-4 pt-2 flex justify-between items-center">
                {pm.id === defaultPaymentMethodId ? (
                  <span className="text-xs text-blue-600 font-medium">Default</span>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSetDefault(pm.id)}
                  >
                    Make Default
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(pm.id)}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}

        </div>
      )}

      {!addingCard ? (
        <Button onClick={handleAddCard}>Add New Card</Button>
      ) : (
        clientSecret && (
          <div className="mt-6">
            <CardSetupForm
              clientSecret={clientSecret}
              onComplete={handleSetupComplete}
            />
          </div>
        )
      )}
    </div>
  );
}
