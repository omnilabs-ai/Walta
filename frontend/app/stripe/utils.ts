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
                amount: price.unit_amount, // Use the actual unit_amount from the price
                currency: "usd",
                confirm: true,
                return_url: "http://localhost:3000/payment/success",
                metadata: {
                    productId: productId,
                    priceId: priceId,
                },
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

const createSetupIntent = async (customerId: string) => {
    const setupIntent = await stripe.setupIntents.create(
        {
            customer: customerId,
        },
    );
    return setupIntent.client_secret;
}

export { createCustomer, getProductId, getCustomerPaymentMethod, processPayment, createSetupIntent };
