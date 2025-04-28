import stripe from "./config";

async function processPayment(customerId: string, paymentAmount: number, paymentMethodId: string, accountId: string, metadata: Record<string, string>) {
    try {
        const paymentMethod = await stripe.paymentMethods.create(
            {
                payment_method: paymentMethodId,
                customer: customerId,
            },
            {
                stripeAccount: accountId,
            }
        );

        const paymentIntent = await stripe.paymentIntents.create(
            {
                payment_method: paymentMethod.id,
                amount: paymentAmount * 100,
                currency: "usd",
                confirm: true,
                return_url: "http://localhost:3000/payment/success",
                metadata: metadata,
            },
            {
                stripeAccount: accountId,
            }
        );


        return { success: true, paymentIntent };
    } catch (error) {
        console.error("Payment processing error:", error);
        return { success: false, error };
    }
}

export { processPayment };
