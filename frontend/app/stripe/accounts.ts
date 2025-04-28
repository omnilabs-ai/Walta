import stripe from "./config";

async function createAccount(name: string, email: string) {
    const account = await stripe.accounts.create({
        country: 'US',
        name: name,
        email: email,
        controller: {
            fees: {
                payer: 'application',
            },
            losses: {
                payments: 'application',
            },
            stripe_dashboard: {
                type: 'express',
            },
        },
    });
    return {account, accountId: account.id};
}

async function createAccountLink(accountId: string) {
    const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
    });
    return accountLink;
}

async function checkAccountStatus(accountId: string) {
    const account = await stripe.accounts.retrieve(accountId);

    const is_details_submitted = account.details_submitted
    // const is_charges_enabled = account.charges_enabled
    // const is_payouts_enabled = account.payouts_enabled

    return {is_details_submitted};
}

export { createAccount, createAccountLink, checkAccountStatus };
