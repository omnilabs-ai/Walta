import { NextRequest, NextResponse } from "next/server";
import { getAllVendors } from "@/app/firebase/firestore/misc";

export async function GET(req: NextRequest) {
    try {
        const vendors = await getAllVendors();
        return NextResponse.json({ vendors }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error getting vendors", error: error.message }, { status: 500 });
    }
}
