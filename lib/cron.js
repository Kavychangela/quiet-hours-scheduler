import cron from 'node-cron';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any email service
  auth: {
    user: process.env.EMAIL_USER,       // your email
    pass: process.env.EMAIL_PASS,       // your email password or app password
  },
});

async function checkSchedules() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('schedules');

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000);

    // Find tasks starting in the next 10 minutes
    const tasks = await collection.find({
      scheduleTime: { $gte: now, $lte: tenMinutesLater },
      notified: { $ne: true },
    }).toArray();

    for (const task of tasks) {
      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: task.userEmail, // make sure your schedule object has userEmail
        subject: 'Your Silent-Study Block is Starting Soon',
        text: `Hi ${task.userName || 'User'}, your silent-study block starting at ${new Date(
          task.scheduleTime
        ).toLocaleTimeString()} will begin in 10 minutes. Stay focused!`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${task.userEmail} for task: ${task.title}`);

      // Mark as notified
      await collection.updateOne(
        { _id: task._id },
        { $set: { notified: true } }
      );
    }
  } catch (err) {
    console.error('Cron error:', err);
  } finally {
    await client.close();
  }
}

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('Running scheduled check...');
  checkSchedules();
});
