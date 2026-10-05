import mongoose from 'mongoose';
import { initialHotels, initialRooms, initialArticles, initialAdditionalUsers, initialLoyaltyUser, initialAdminUser, initialBookings, initialPromotions, initialAdditionalPromotions, initialTourismSpots, initialAdditionalTourismSpots, initialReviews } from '../data/seedData.js';
import { MongooseHotel } from '../models/hotel.model.js';
import { MongooseRoom } from '../models/room.model.js';
import { MongooseArticle } from '../models/article.model.js';
import { MongooseUser } from '../models/user.model.js';
import { MongooseBooking } from '../models/booking.model.js';
import { MongoosePromotion } from '../models/promotion.model.js';
import { MongooseTourism } from '../models/tourism.model.js';
import { MongooseReview } from '../models/review.model.js';

let isConnected = false;

const seedCollection = async (model, records) => {
  if (!records.length) return;
  await model.bulkWrite(records.map(record => ({
    updateOne: {
      filter: { id: record.id },
      update: { $setOnInsert: record },
      upsert: true
    }
  })), { ordered: false });
};

const seedDatabase = async () => {
  const users = [
    initialAdminUser,
    { ...initialLoyaltyUser, role: 'user', password: 'Password123@' },
    ...initialAdditionalUsers
  ];
  const collections = [
    [MongooseHotel, initialHotels],
    [MongooseRoom, initialRooms],
    [MongooseArticle, initialArticles],
    [MongooseUser, users],
    [MongooseBooking, initialBookings],
    [MongoosePromotion, [...initialPromotions, ...initialAdditionalPromotions]],
    [MongooseTourism, [...initialTourismSpots, ...initialAdditionalTourismSpots]],
    [MongooseReview, initialReviews]
  ];

  for (const [model, records] of collections) {
    await seedCollection(model, records);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking';
  try {
    // Attempt connecting to MongoDB with a short timeout to prevent blocking dev server startup
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully to:', uri);
    try {
      await seedDatabase();
      console.log('✅ Initial AuraResort data is ready.');
    } catch (err) {
      console.warn('⚠️ Could not seed initial data:', err.message);
    }
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
