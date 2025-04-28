import { Timestamp, FieldValue } from "firebase-admin/firestore";
import db from "./config";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { Agent, ApiData } from "./types";

async function getAgents(userId: string, agent_id?: string) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const agentDict = data?.agents || {};

  if (agent_id) {
    if (!agentDict[agent_id]) {
      throw new Error(`Agent with id ${agent_id} not found`);
    }
    return agentDict[agent_id];
  }

  return agentDict;
}

async function addAgent(userId: string, agent_name: string) {
  const agent_id = uuidv4();
  const hash = crypto.randomBytes(16).toString("hex");
  const apikey = `walta-${hash}`;

  const newAgent: Agent = {
    apikey,
    agent_name,
    active: true,
    transaction_list: [],
    created_at: Timestamp.now(),
    params: {},
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
  const apiData: ApiData = {
    userId: userId,
  };

  await apiRef.set(apiData);

  return { newAgent, agent_id };
}

async function updateAgent(userId: string, agent_id: string, updatedFields: Partial<Agent>) {
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

async function deleteAgent(userId: string, agent_id: string) {
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();
  const data = doc.data();
  const agentDict = data?.agents || {};

  if (!agentDict[agent_id]) {
    throw new Error(`Agent with id ${agent_id} not found`);
  }

  const deletedAgent = agentDict[agent_id];

  await userRef.update({
    [`agents.${agent_id}`]: FieldValue.delete(),
  });

  return deletedAgent;
}

export { getAgents, addAgent, updateAgent, deleteAgent };

