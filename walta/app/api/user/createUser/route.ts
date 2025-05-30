import { NextRequest, NextResponse } from "next/server";
import { createNewUser } from "@/app/firebase/firestore/user";
import { createAccount } from "@/app/stripe/accounts";
import { createCustomer } from "@/app/stripe/get";

export async function POST(request: NextRequest) {
  const { userId, name, email } = await request.json();

  try {
    const { customer, customerId } = await createCustomer(name, email);
    const { account, accountId } = await createAccount(email);

    const newUser = await createNewUser(userId, name, email, {
      stripe_id: customerId,
      stripe_vendor_id: accountId,
    });
    
    return NextResponse.json({ newUser, account, accountId, customer }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: "Error creating user", error: errorMessage }, { status: 500 });
  }
}
