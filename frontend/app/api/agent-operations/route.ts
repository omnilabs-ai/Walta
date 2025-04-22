import { NextResponse } from "next/server"
import {
  addAgentToUser,
  updateAgentInUser,
  updateAgentTransactionList,
  removeAgentFromUser
} from "@/app/firebase/firestoreUtils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { operation, userId } = body

    if (!operation || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    switch (operation) {
      case "add": {
        const { agent } = body
        if (!agent) return NextResponse.json({ error: "Missing agent object." }, { status: 400 })

        await addAgentToUser(userId, agent)
        return NextResponse.json({ status: "Agent added successfully." })
      }

      case "update": {
        const { agentId, updatedFields } = body
        if (!agentId || !updatedFields) {
          return NextResponse.json({ error: "Missing agentId or updatedFields." }, { status: 400 })
        }

        await updateAgentInUser(userId, agentId, updatedFields)
        return NextResponse.json({ status: "Agent updated successfully." })
      }

      case "update-transactions": {
        const { agentId, newTransactions } = body
        if (!agentId || !Array.isArray(newTransactions)) {
          return NextResponse.json({ error: "Missing agentId or newTransactions." }, { status: 400 })
        }

        await updateAgentTransactionList(userId, agentId, newTransactions)
        return NextResponse.json({ status: "Agent transaction list updated." })
      }

      case "delete": {
        const { agentId } = body
        if (!agentId) return NextResponse.json({ error: "Missing agentId." }, { status: 400 })

        await removeAgentFromUser(userId, agentId)
        return NextResponse.json({ status: "Agent removed successfully." })
      }

      default:
        return NextResponse.json({ error: "Invalid operation." }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Agent operations API error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
