import stripe from "./config";

async function createCustomer(name: string, email: string) {
    const customer = await stripe.customers.create({
        name,
        email,
    });
    return {customer, customerId: customer.id};
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

    if (paymentMethods.data.length === 0) {
        throw new Error("No payment methods found");
    }

    return paymentMethods.data[0].id;
}

export { createCustomer, getProductId, getCustomerPaymentMethod };
