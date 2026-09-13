import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking';
  try {
    // Attempt connecting to MongoDB with a short timeout to prevent blocking dev server startup
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully to:', uri);
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ MongoDB connection not available or unreachable:', err.message);
    console.log('ℹ️ Running seamlessly with the built-in resilient database storage layer.');
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'MongoDB Server' : 'Resilient In-Memory & File Store'
});
