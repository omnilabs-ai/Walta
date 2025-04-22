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
    stripe_vendor_id: ""
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

export { db, createNewUser, getUserById };
