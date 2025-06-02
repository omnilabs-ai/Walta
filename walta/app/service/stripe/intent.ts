import stripe from "./config";

const createSetupIntent = async (customerId: string) => {
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
  });
  return setupIntent.client_secret;
};

const getCustomerPaymentMethods = async (customerId: string) => {
  const paymentMethods = await stripe.customers.listPaymentMethods(customerId);
  return paymentMethods;
};

const deletePaymentMethod = async (paymentMethodId: string) => {
  const detached = await stripe.paymentMethods.detach(paymentMethodId);
  return detached;
};

const setDefaultPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
) => {
  const updatedCustomer = await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
  return updatedCustomer;
};

export { createSetupIntent, getCustomerPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod};
