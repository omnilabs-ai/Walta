import { Timestamp, FieldValue } from "firebase-admin/firestore";
import db from "./config";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

async function getUserAgents(userId: string) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const agentDict = data?.agents || {};
  return agentDict;
}

async function addUserAgent(userId: string, agent_name: string) {
  const agent_id = uuidv4();
  const hash = crypto.randomBytes(16).toString("hex");
  const apikey = `walta-${hash}`;

  const newAgent = {
    apikey,
    agent_name,
    active: true,
    transaction_list: [],
    created_at: Timestamp.now(),
  };
  
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();

  const agentDict = data?.agents || {};
  
  await userRef.update({
    agents: {
      ...agentDict,
      [agent_id]: newAgent,
    },
  });

  const apiRef = db.collection("apikeys").doc(apikey);
  await apiRef.set({
    active: true,
    agent_name: agent_name,
    agent_id: agent_id,
    created_at: Timestamp.now(),
    userId: userId,
  });

  return newAgent;
}

async function updateUserAgent(userId: string, agent_id: string, updatedFields: Partial<any>) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const agentDict = data?.agents || {};

  if (updatedFields.apikey) {
    throw new Error("API key cannot be modified");
  }

  if (!agentDict[agent_id]) {
    throw new Error(`Agent with id ${agent_id} not found`);
  }

  const updatedAgent = {
    ...agentDict[agent_id],
    ...updatedFields,
  };

  await userRef.update({
    [`agents.${agent_id}`]: updatedAgent
  });

  return updatedAgent;
}

async function deleteUserAgent(userId: string, agent_id: string) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const agentDict = data?.agents || {};

  if (!agentDict[agent_id]) {
    throw new Error(`Agent with id ${agent_id} not found`);
  }

  await userRef.update({
    [`agents.${agent_id}`]: FieldValue.delete(),
  });

  return { message: `Agent with id ${agent_id} deleted successfully` };
}

export { getUserAgents, addUserAgent, updateUserAgent, deleteUserAgent };

