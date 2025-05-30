import { NextResponse } from "next/server";
import { getAllVendors } from "@/app/firebase/firestore/misc";

export async function GET() {
    try {
        const vendors = await getAllVendors();
        return NextResponse.json({ vendors }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: "Error getting vendors", error: errorMessage }, { status: 500 });
    }
}
