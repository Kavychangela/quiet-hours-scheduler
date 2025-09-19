import clientPromise from "@/lib/mongodb";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("quiet_hours");

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { startTime, endTime, tz } = body;

  const block = {
    userId: user.id, // Supabase UUID
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    notified: false,
    createdAt: new Date(),
    tz: tz || null,
  };

  await db.collection("blocks").insertOne(block);

  return new Response(JSON.stringify({ success: true, block }), {
    status: 200,
  });
}
