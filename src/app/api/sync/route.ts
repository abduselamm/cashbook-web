import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { findDatabaseFile, createDatabaseFile, readDatabaseFile, updateDatabaseFile } from "@/lib/drive";

// GET: Retrieve data from Drive
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let fileId = await findDatabaseFile(session.accessToken);

        if (!fileId) {
            // If no file exists, return null (client will trigger a create with initial data if needed, or we can create empty here)
            // Better: Return empty object or specific status so client knows to initialize
            return NextResponse.json({ data: null, status: 'not_found' });
        }

        const data = await readDatabaseFile(session.accessToken, fileId);
        return NextResponse.json({ data });
    } catch (error) {
        console.error("Sync GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// POST: Save data to Drive (Create or Update)
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { data } = body;

        let fileId = await findDatabaseFile(session.accessToken);

        if (fileId) {
            await updateDatabaseFile(session.accessToken, fileId, data);
        } else {
            fileId = await createDatabaseFile(session.accessToken, data);
        }

        return NextResponse.json({ success: true, fileId });
    } catch (error) {
        console.error("Sync POST Error:", error);
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
