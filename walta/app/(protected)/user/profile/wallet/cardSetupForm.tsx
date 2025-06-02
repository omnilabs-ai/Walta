"use client";

// CardSetupForm.tsx
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

// Access environment variable securely
const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey || "");

export default function CardSetupForm({ clientSecret, onComplete }: { clientSecret: string, onComplete?: () => void }) {
  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <SetupForm onComplete={onComplete} />
    </Elements>
  );
}

function SetupForm({ onComplete }: { onComplete?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || "An unknown error occurred");
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });
    
    if (error) {
      setErrorMessage(error.message || "An unknown error occurred");
    } else {
      alert("Card saved!");
      onComplete?.();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md mt-4 w-full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Save Card"}
      </button>
      {errorMessage && (
        <div className="text-red-500 mt-2">{errorMessage}</div>
      )}
    </form>
  );
}

