// https://firebase.google.com/docs/firestore/quickstart#node.js
// npx ts-node --compiler-options '{"module":"CommonJS"}' app/firebase/firestoreUtils.ts
require("dotenv").config({ path: ".env.local" });
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT!);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// async function testFirestore() {
//   try {
//     const snapshot = await db.collection("users").get();
//     console.log(snapshot.docs.length);
//     snapshot.forEach((doc: any) => {
//       console.log(doc.id, "=>", doc.data());
//     });
//     console.log("Firestore query successful");
//   } catch (error) {
//     console.error("Error querying Firestore:", error);
//   }
// }

// //testFirestore();

// ----------------------------------- Actual utils for the app -----------------------------------------

async function createNewUser(userId: string, name: string, email: string) {
  const template = {
    user_name: name,
    user_email: email,
    transaction_history: [
      {
        agent_id: "",
        vendor_id: "",
        merchant_type: "",
        datetime: Timestamp.now(),
        amount: 0,
        status: "pending",
        transaction_id: "",
      },
    ],
    total_amount: 0,
    agent_list: [
      {
        agent_id: "",
        agent_name: "",
        api_key: "",
        active: false,
        transaction_list: [],
      },
    ],
    products: [
      {
        product_name: "",
        product_id: "",
        "product description": "",
        product_amount: 0,
      },
    ],
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
    const userRef = db.collection("users").doc(userId)
    const doc = await userRef.get()

    if (!doc.exists) {
      console.warn(`No user found for ID: ${userId}`)
      return []
    }

    const data = doc.data()
    return data?.agent_list || []
  } catch (error) {
    console.error("Error fetching agent list:", error)
    return []
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
  getAgentListForUser
};
