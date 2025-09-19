import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // make sure the path is correct
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("MONGODB_DB:", process.env.MONGODB_DB);

import cron from "node-cron";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB;

// Supabase setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function checkSchedules() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("schedules");

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

    // Find schedules starting in 10 minutes and not yet notified
    const tasks = await collection
      .find({
        scheduleTime: { $gte: now, $lte: tenMinutesLater },
        notified: { $ne: true },
      })
      .toArray();

    for (const task of tasks) {
      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: task.user_email, // make sure your schedule has user_email field
        subject: "Your Silent-Study Block is Starting Soon",
        text: `Hi ${task.user_name || "User"}, your silent-study block starting at ${task.scheduleTime.toLocaleTimeString()} will begin in 10 minutes. Stay focused!`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${task.user_email}`);

      // Send Supabase notification
      await supabase.from("notifications").insert([
        {
          user_id: task.user_id,
          message: `Your silent-study block at ${task.scheduleTime.toLocaleTimeString()} starts in 10 minutes!`,
        },
      ]);

      // Mark as notified
      await collection.updateOne(
        { _id: task._id },
        { $set: { notified: true } }
      );
    }
  } catch (err) {
    console.error("Cron error:", err);
  } finally {
    await client.close();
  }
}

// Run every minute
cron.schedule("* * * * *", () => {
  console.log("Running scheduled check...");
  checkSchedules();
});
