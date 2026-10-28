import mongoose from 'mongoose';

let isDbConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set. Database persistence will be disabled (in-memory mode for offline dev/tests).');
    isDbConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    isDbConnected = false;
    return false;
  }
}

export function getDbStatus() {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return {
    connected: state === 1,
    state: states[state] || 'unknown',
    hasUri: Boolean(process.env.MONGODB_URI)
  };
}
