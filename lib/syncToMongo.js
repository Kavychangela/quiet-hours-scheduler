import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'quiet_hours';

export async function syncToMongo(payload) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const schedules = db.collection('schedules');

    const { eventType, new: newData, old: oldData } = payload;

    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      await schedules.updateOne(
        { id: newData.id },
        { $set: newData },
        { upsert: true }
      );
    } else if (eventType === 'DELETE') {
      await schedules.deleteOne({ id: oldData.id });
    }

    console.log('MongoDB sync done!');
  } catch (err) {
    console.error('MongoDB sync error:', err);
  } finally {
    await client.close();
  }
}
