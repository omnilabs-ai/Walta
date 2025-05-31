import { NextResponse } from "next/server";
import { getAllTypes } from "@/app/service/firebase/firestore/misc";

export async function GET() {
    try {
        const types = await getAllTypes();
        return NextResponse.json({ types }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: "Error getting types", error: errorMessage }, { status: 500 });
    }
}
