import stripe from "./config";

async function createCustomer(name: string, email: string) {
    const customer = await stripe.customers.create({
        name,
        email,
    });
    return customer;
}

async function getProductId(priceId: string, accountId: string) {
    const price = await stripe.prices.retrieve(priceId, {
        stripeAccount: accountId,
    });
    return price.product;
}

async function getCustomerPaymentMethod(customerId: string) {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    });
    return paymentMethods.data[0].id;
}

async function processPayment(customerId: string, paymentMethodId: string, productId: string, priceId: string, accountId: string) {
    try {
        // Get the price to determine the correct amount
        const price = await stripe.prices.retrieve(priceId, {
            stripeAccount: accountId,
        });

        console.log("price", price);

        const paymentMethod = await stripe.paymentMethods.create({
            customer: customerId,
            payment_method: paymentMethodId,
            stripeAccount: accountId,
            type: 'card',
        });

        console.log("paymentMethod", paymentMethod);

        const paymentIntent = await stripe.paymentIntents.create({
            customer: customerId,
            payment_method: paymentMethod,
            amount: price.unit_amount, // Use the actual unit_amount from the price
            currency: "usd",
            confirm: true,
            return_url: "http://localhost:3000/payment/success",
            metadata: {
                productId: productId,
                priceId: priceId,
            },
            stripeAccount: accountId,
        });

        console.log("paymentIntent", paymentIntent);

        return { success: true, paymentIntent };
    } catch (error) {
        console.error("Payment processing error:", error);
        return { success: false, error };
    }
}

export { createCustomer, getProductId, getCustomerPaymentMethod, processPayment };
