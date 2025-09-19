import { NextResponse } from "next/server";
import { syncToMongo } from "@/lib/syncToMongo";

export async function POST(req) {
  try {
    const body = await req.json();
    await syncToMongo(body); // safe, runs only on server
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
