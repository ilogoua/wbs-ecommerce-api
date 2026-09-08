import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error('MONGO_URL is not defined');
  }

  await mongoose.connect(mongoUri);

  console.log('Connected to MongoDB');
}