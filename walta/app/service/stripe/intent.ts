import stripe from "./config";

const createSetupIntent = async (customerId: string) => {
    const setupIntent = await stripe.setupIntents.create(
        {
            customer: customerId,
        },
    );
    return setupIntent.client_secret;
}

const getCustomerPaymentMethods = async (customerId: string) => {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId);
    return paymentMethods;
}

export { createSetupIntent, getCustomerPaymentMethods };
