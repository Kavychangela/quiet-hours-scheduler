import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quiet_hours");
    const blocks = db.collection("blocks");

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

    // Find blocks that start in 10 minutes and haven't been notified
    const upcomingBlocks = await blocks.find({
      notified: false,
      startTime: { $lte: tenMinutesLater, $gte: now },
    }).toArray();

    if (upcomingBlocks.length === 0) {
      return new Response(JSON.stringify({ message: "No upcoming blocks" }), { status: 200 });
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const block of upcomingBlocks) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: block.userEmail, // make sure you store user email in MongoDB
        subject: "⏰ Quiet Hours Reminder",
        text: `Your quiet/study block starts at ${block.startTime.toLocaleString()}`,
      };

      await transporter.sendMail(mailOptions);

      // Mark as notified
      await blocks.updateOne({ _id: block._id }, { $set: { notified: true } });
    }

    return new Response(JSON.stringify({ success: true, notified: upcomingBlocks.length }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
