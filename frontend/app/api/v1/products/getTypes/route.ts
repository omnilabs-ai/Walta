import { NextRequest, NextResponse } from "next/server";
import { getAllTypes } from "@/app/firebase/firestore/misc";

export async function GET(req: NextRequest) {
    try {
        const types = await getAllTypes();
        return NextResponse.json({ types }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error getting types", error: error.message }, { status: 500 });
    }
}
