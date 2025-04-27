import { NextResponse, NextRequest } from "next/server";
import {
  addAgentToUser,
  updateAgentInUser,
  updateAgentTransactionList,
  removeAgentFromUser,
  getAgentListForUser,
} from "@/app/firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";

type Agent = {
  agent_id: string;
  agent_name: string;
  api_key: string;
  active: boolean;
  transaction_list: any[]; // or more specific if you have a type
  created_at: FirebaseFirestore.Timestamp | string | Date;
};

// 🔁 GET — Get all agents for a user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    const agentList: Agent[] = await getAgentListForUser(userId);

    const normalizedList = agentList.map((agent) => ({
      ...agent,
      created_at:
        agent.created_at instanceof Timestamp
          ? agent.created_at.toDate().toISOString()
          : agent.created_at instanceof Date
          ? agent.created_at.toISOString()
          : agent.created_at, // string or already normalized
    }));

    return NextResponse.json({ agent_list: normalizedList });
  } catch (error: any) {
    console.error("Error fetching agent list:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { operation, userId } = body;

    if (!operation || !userId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    switch (operation) {
      case "add": {
        const { agent_name } = body;
        if (!agent_name) {
          return NextResponse.json(
            { error: "Missing agent_name." },
            { status: 400 }
          );
        }

        const agent_id = uuidv4();
        const hash = crypto.randomBytes(16).toString("hex");
        const api_key = `walta-${hash}`;

        const newAgent = {
          agent_id,
          api_key,
          agent_name,
          active: true,
          transaction_list: [],
          created_at: Timestamp.now(),
        };

        await addAgentToUser(userId, newAgent);

        // ✅ Normalize for response
        const normalizedAgent = {
          ...newAgent,
          created_at: newAgent.created_at.toDate().toISOString(),
        };

        return NextResponse.json({
          status: "Agent added successfully.",
          agent: normalizedAgent,
        });
      }

      case "update": {
        const { agentId, updatedFields } = body;
        if (!agentId || !updatedFields) {
          return NextResponse.json(
            { error: "Missing agentId or updatedFields." },
            { status: 400 }
          );
        }

        await updateAgentInUser(userId, agentId, updatedFields);
        return NextResponse.json({ status: "Agent updated successfully." });
      }

      case "update-transactions": {
        const { agentId, newTransactions } = body;
        if (!agentId || !Array.isArray(newTransactions)) {
          return NextResponse.json(
            { error: "Missing agentId or newTransactions." },
            { status: 400 }
          );
        }

        await updateAgentTransactionList(userId, agentId, newTransactions);
        return NextResponse.json({ status: "Agent transaction list updated." });
      }

      case "delete": {
        const { agentId } = body;
        if (!agentId)
          return NextResponse.json(
            { error: "Missing agentId." },
            { status: 400 }
          );

        await removeAgentFromUser(userId, agentId);
        return NextResponse.json({ status: "Agent removed successfully." });
      }

      default:
        return NextResponse.json(
          { error: "Invalid operation." },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Agent operations API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
