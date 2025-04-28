import db from "./config";
import { User } from "./types";


async function createNewUser(userId: string, name: string, email: string, prefill: Partial<User> = {}): Promise<User> {
  const newUser: User = {
    user_name: name,
    user_email: email,
    transactions: {},
    total_amount: 0,
    agents: {},
    products: {},
    stripe_id: "",
    stripe_vendor_id: "",
    ...prefill // Merge any prefill values
  };

  try {
    await db.collection("users").doc(userId).set(newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
}

async function getUser(userId: string, params: string[] = []): Promise<Partial<User>> {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();

  if (!data) {
    throw new Error("User not found");
  }

  // If no specific params requested, return full user data
  if (params.length === 0) {
    return data as User;
  }

  // Otherwise return only requested fields
  const filteredData: Partial<User> = {};
  params.forEach(param => {
    if (param in data) {
      filteredData[param as keyof User] = data[param];
    }
  });

  return filteredData;
}

export { createNewUser, getUser };
