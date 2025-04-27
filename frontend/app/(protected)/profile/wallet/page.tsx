"use client";

import { useEffect, useState } from "react";
import CardSetupForm from "./cardSetupForm";

export default function SetupPage() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch("/api/stripe/createSetupIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: "cus_SAuc1FDcFZeJ52" }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
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
