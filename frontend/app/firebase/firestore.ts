// https://firebase.google.com/docs/firestore/quickstart#node.js
// npx ts-node --compiler-options '{"module":"CommonJS"}' app/firebase/firestoreUtils.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT!);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// -------------------------------------- User Crud Operations --------------------------------------

async function createNewUser(userId: string, name: string, email: string) {
  const template = {
    user_name: name,
    user_email: email,
    transaction_history: [],
    total_amount: 0,
    agent_list: [],
    products: [],
    stripe_id: "",
    stripe_vendor_id: "",
  };

  try {
    await db.collection("users").doc(userId).set(template);
    console.log(`New user added: ${userId}`);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}

async function getUserById(userId: string) {
  try {
    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log(`No user found with ID: ${userId}`);
      return null;
    }

    const data = doc.data();
    console.log(`User data for ${userId}:`, data);
    return data;
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
}

// -------------------------------------- Agent Crud Operations --------------------------------------

async function getAgentListForUser(userId: string) {
  try {
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      console.warn(`No user found for ID: ${userId}`);
      return [];
    }

    const data = doc.data();
    const agentList = data?.agent_list || [];

    const normalizedAgents = agentList.map((agent: any) => ({
      ...agent,
      created_at:
        agent?.created_at?.toDate?.().toISOString?.() ??
        agent.created_at ??
        null,
    }));

    return normalizedAgents;
  } catch (error) {
    console.error("Error fetching agent list:", error);
    return [];
  }
}

// 1️⃣ Add a new agent
async function addAgentToUser(userId: string, agent: any) {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      agent_list: FieldValue.arrayUnion(agent),
    });
    console.log(`Added agent ${agent.agent_id} to user ${userId}`);
  } catch (error) {
    console.error("Error adding agent:", error);
  }
}

// 2️⃣ Update an existing agent by agent_id
async function updateAgentInUser(
  userId: string,
  agentId: string,
  updatedFields: Partial<any>
) {
  try {
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();
    const data = doc.data();

    if (!data || !data.agent_list) throw new Error("Agent list not found");

    const updatedAgentList = data.agent_list.map((agent: any) =>
      agent.agent_id === agentId ? { ...agent, ...updatedFields } : agent
    );

    await userRef.update({ agent_list: updatedAgentList });
    console.log(`Updated agent ${agentId} for user ${userId}`);
  } catch (error) {
    console.error("Error updating agent:", error);
  }
}

// 3️⃣ Update transaction_list for a specific agent
async function updateAgentTransactionList(
  userId: string,
  agentId: string,
  newTransactions: string[]
) {
  try {
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();
    const data = doc.data();

    if (!data || !data.agent_list) throw new Error("Agent list not found");

    const updatedAgentList = data.agent_list.map((agent: any) =>
      agent.agent_id === agentId
        ? {
            ...agent,
            transaction_list: [...agent.transaction_list, ...newTransactions],
          }
        : agent
    );

    await userRef.update({ agent_list: updatedAgentList });
    console.log(`Updated transactions for agent ${agentId} in user ${userId}`);
  } catch (error) {
    console.error("Error updating agent transactions:", error);
  }
}

// 4️⃣ Optional: Delete agent by agent_id
async function removeAgentFromUser(userId: string, agentId: string) {
  try {
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();
    const data = doc.data();

    if (!data || !data.agent_list) throw new Error("Agent list not found");

    const updatedAgentList = data.agent_list.filter(
      (agent: any) => agent.agent_id !== agentId
    );

    await userRef.update({ agent_list: updatedAgentList });
    console.log(`Removed agent ${agentId} from user ${userId}`);
  } catch (error) {
    console.error("Error removing agent:", error);
  }
}

export {
  db,
  createNewUser,
  getUserById,
  addAgentToUser,
  updateAgentInUser,
  updateAgentTransactionList,
  removeAgentFromUser,
  getAgentListForUser,
};
