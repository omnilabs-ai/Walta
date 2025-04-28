"use client";

import { useEffect, useState } from "react";
import CardSetupForm from "./cardSetupForm";
import { currentUserAtom } from "@/app/atoms/settings";
import { useAtomValue } from "jotai";

export default function SetupPage() {
  const [clientSecret, setClientSecret] = useState(null);
  const currentUser = useAtomValue(currentUserAtom)

  useEffect(() => {
    fetch("/api/user/getUser?userId=" + currentUser?.uid + "&params=stripe_id")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data)
        fetch("/api/stripe/createSetupIntent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: data.stripe_id }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
      })
  }, []);

  return (
    <div className="p-[100px]">
      {clientSecret ? (
        <CardSetupForm clientSecret={clientSecret} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
