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

async function testFirestore() {
  try {
    const snapshot = await db.collection("users").get();
    console.log(snapshot.docs.length);
    snapshot.forEach((doc: any) => {
      console.log(doc.id, "=>", doc.data());
    });
    console.log("Firestore query successful");
  } catch (error) {
    console.error("Error querying Firestore:", error);
  }
}

testFirestore();

async function createNewUser(userId: any, name: any, email: any) {
  const template = {
    user_name: name,
    user_email: email,
    transaction_history: {
      agent_id: "",
      vendor_id: "",
      merchant_type: "",
      date_time: Timestamp.now(),
      amount: 0,
      status: "Pending",
      transaction_id: "",
    },
    total_amount_spent: 0,
    agent_list: {
      agent_id: "",
      api_key: "",
      active: false,
      transaction_list: [],
      agent_name: "",
    },
  };

  try {
    await db.collection("users").doc(userId).set(template);
    console.log(`New user added: ${userId}`);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}

export { db, createNewUser };
