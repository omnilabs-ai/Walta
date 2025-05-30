import stripe from "./config";

const createSetupIntent = async (customerId: string) => {
    const setupIntent = await stripe.setupIntents.create(
        {
            customer: customerId,
        },
    );
    return setupIntent.client_secret;
}

export { createSetupIntent };
