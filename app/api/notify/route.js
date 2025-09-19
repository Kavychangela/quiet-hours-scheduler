import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("quiet_hours");
  const blocks = db.collection("blocks");

  const now = new Date();
  const in10Min = new Date(now.getTime() + 10 * 60 * 1000);

  // Find blocks starting in next 10 min & not notified
  const upcomingBlocks = await blocks.find({
    notified: false,
    startTime: { $lte: in10Min, $gte: now },
  }).toArray();

  // Send emails
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const block of upcomingBlocks) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: block.userEmail, // make sure this is stored in MongoDB
      subject: "Quiet Hours Starting Soon",
      text: `Your quiet study block starts at ${block.startTime.toLocaleTimeString()}`,
    });

    await blocks.updateOne({ _id: block._id }, { $set: { notified: true } });
  }

  return new Response(JSON.stringify({ success: true, notified: upcomingBlocks.length }));
}
