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

const users = [
    {
      user_name: "Alice Kim",
      user_email: "alice.kim@example.com",
      transaction_history: [
        {
          agent_id: "a1",
          vendor_id: "v1",
          merchant_type: "Retail",
          date_time: new Date(),
          amount: 120.5,
          status: "Completed",
          transaction_id: "t1",
        },
        {
          agent_id: "a1",
          vendor_id: "v2",
          merchant_type: "Food",
          date_time: new Date(),
          amount: 32.0,
          status: "Completed",
          transaction_id: "t2",
        }
      ],
      total_amount_spent: 152.5,
      agent_list: [
        {
          agent_id: "a1",
          api_key: "key_a1_alice",
          active: true,
          transaction_list: ["t1", "t2"],
          agent_name: "AlphaPay",
        }
      ],
    },
    {
      user_name: "Brian Lee",
      user_email: "brian.lee@example.com",
      transaction_history: [
        {
          agent_id: "a2",
          vendor_id: "v3",
          merchant_type: "Travel",
          date_time: new Date(),
          amount: 300.0,
          status: "Pending",
          transaction_id: "t3",
        }
      ],
      total_amount_spent: 300.0,
      agent_list: [
        {
          agent_id: "a2",
          api_key: "key_a2_brian",
          active: false,
          transaction_list: ["t3"],
          agent_name: "TravelMate",
        }
      ],
    },
    {
      user_name: "Cara Johnson",
      user_email: "cara.johnson@example.com",
      transaction_history: [],
      total_amount_spent: 0,
      agent_list: [],
    },
    {
      user_name: "Daniel Wu",
      user_email: "daniel.wu@example.com",
      transaction_history: [
        {
          agent_id: "a3",
          vendor_id: "v4",
          merchant_type: "Groceries",
          date_time: new Date(),
          amount: 88.99,
          status: "Completed",
          transaction_id: "t4",
        },
        {
          agent_id: "a4",
          vendor_id: "v5",
          merchant_type: "Entertainment",
          date_time: new Date(),
          amount: 45.00,
          status: "Failed",
          transaction_id: "t5",
        },
        {
          agent_id: "a4",
          vendor_id: "v6",
          merchant_type: "Streaming",
          date_time: new Date(),
          amount: 15.99,
          status: "Completed",
          transaction_id: "t6",
        }
      ],
      total_amount_spent: 149.98,
      agent_list: [
        {
          agent_id: "a3",
          api_key: "key_a3_daniel",
          active: true,
          transaction_list: ["t4"],
          agent_name: "FreshPay",
        },
        {
          agent_id: "a4",
          api_key: "key_a4_daniel",
          active: true,
          transaction_list: ["t5", "t6"],
          agent_name: "StreamAgent",
        }
      ],
    },
    {
      user_name: "Emily Zhang",
      user_email: "emily.zhang@example.com",
      transaction_history: [
        {
          agent_id: "a5",
          vendor_id: "v7",
          merchant_type: "Books",
          date_time: new Date(),
          amount: 22.5,
          status: "Completed",
          transaction_id: "t7",
        }
      ],
      total_amount_spent: 22.5,
      agent_list: [
        {
          agent_id: "a5",
          api_key: "key_a5_emily",
          active: true,
          transaction_list: ["t7"],
          agent_name: "BookBazaar",
        }
      ],
    }
  ];


users.forEach(async (user) => {
    await db.collection('users').doc(user.user_email).set(user);
});

console.log('Sample database created successfully');


