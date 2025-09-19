// lib/cron.js
import cron from 'node-cron';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any SMTP service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
  }
}

async function checkSchedules() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('schedules');

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000);

    // Find schedules starting in the next 10 minutes and not yet notified
    const tasks = await collection
      .find({
        scheduleTime: { $gte: now, $lte: tenMinutesLater },
        notified: { $ne: true },
      })
      .toArray();

    for (const task of tasks) {
      const emailText = `Hi ${task.userName}, your silent-study block starting at ${task.scheduleTime.toLocaleTimeString()} will begin in 10 minutes. Stay focused!`;

      // Send email
      await sendEmail(task.userEmail, 'Your Silent-Study Block is Starting Soon', emailText);

      // Mark as notified
      await collection.updateOne({ _id: task._id }, { $set: { notified: true } });
      console.log(`Notification sent for block: ${task.title}`);
    }
  } catch (err) {
    console.error('Cron error:', err);
  } finally {
    await client.close();
  }
}
console.log(`Found ${tasks.length} upcoming blocks:`, tasks);

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('Running scheduled check...');
  checkSchedules();
});
