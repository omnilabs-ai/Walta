import db from "./config";

async function createNewUser(userId: string, name: string, email: string) {
  const newUser = {
    user_name: name,
    user_email: email,
    transactions: {},
    total_amount: 0,
    agents: {},
    products: {},
    stripe_id: "",
    stripe_vendor_id: "",
  };

  try {
    await db.collection("users").doc(userId).set(newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
}

export { createNewUser };


