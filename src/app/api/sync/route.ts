import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
            return NextResponse.json({ data: null, status: 'not_found' });
        }

        const data = await readDatabaseFile(session.accessToken, fileId);
        return NextResponse.json({ data });
    } catch (error: any) {
        console.error("Sync GET Error Details:", {
            message: error.message,
            code: error.code,
            status: error.status,
            data: error.response?.data
        });

        if (error.code === 401 || error.status === 401) {
            return NextResponse.json({ error: "Authentication expired. Please sign in again." }, { status: 401 });
        }

        return NextResponse.json({ error: "Failed to fetch data from Drive" }, { status: 500 });
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
    } catch (error: any) {
        console.error("Sync POST Error Details:", {
            message: error.message,
            code: error.code,
            status: error.status,
            data: error.response?.data
        });

        if (error.code === 401 || error.status === 401) {
            return NextResponse.json({ error: "Authentication expired. Please sign in again." }, { status: 401 });
        }

        return NextResponse.json({ error: "Failed to save data to Drive" }, { status: 500 });
    }
}

