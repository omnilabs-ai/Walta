
// Use npx ts-node app/firebase/firestoreUtils.ts to test the firestore connection
// https://firebase.google.com/docs/firestore/quickstart#node.js

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


async function testFirestore() {
  try {
    const snapshot = await db.collection('Users').get();
    console.log(snapshot.docs.length);
    snapshot.forEach((doc: any) => {
      console.log(doc.id, '=>', doc.data());
    });
    console.log('Firestore query successful');
  } catch (error) {
    console.error('Error querying Firestore:', error);
  }
}

testFirestore();

module.exports = { db };