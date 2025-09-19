// lib/syncToMongo.js (client-safe)
export async function syncToMongo(payload) {
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Sync to Mongo failed:", err);
  }
}
