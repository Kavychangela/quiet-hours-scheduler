"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Listener() {
  useEffect(() => {
    const channel = supabase
      .channel("public:schedules")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedules" },
        async (payload) => {
          console.log("Supabase change:", payload);

          // Send to an API route instead of importing syncToMongo directly
          await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
