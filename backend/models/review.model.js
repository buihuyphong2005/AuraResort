import mongoose from 'mongoose';
import { initialReviews } from '../data/seedData.js';

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hotelId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  cleanRating: { type: Number, default: 5 },
  serviceRating: { type: Number, default: 5 },
  locationRating: { type: Number, default: 5 },
  comment: { type: String, required: true },
  roomType: { type: String },
  verifiedBooking: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export const MongooseReview = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

let memoryReviews = [...initialReviews];

export const ReviewModel = {
  async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongooseReview.find(filter).sort({ createdAt: -1 });
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory reviews find:', e.message);
      }
    }
    let res = [...memoryReviews];
    if (filter.hotelId) {
      res = res.filter(r => r.hotelId === filter.hotelId);
    }
    if (filter.rating) {
      res = res.filter(r => Math.floor(r.rating) === Number(filter.rating));
    }
    return res;
  },

  async create(reviewData) {
    if (mongoose.connection.readyState === 1) {
      try {
        const created = await MongooseReview.create(reviewData);
        memoryReviews.unshift(reviewData);
        return created;
      } catch (e) {
        console.warn('Fallback to memory review create:', e.message);
      }
    }
    memoryReviews.unshift(reviewData);
    return reviewData;
  },

  async likeReview(reviewId) {
    const rev = memoryReviews.find(r => r.id === reviewId);
    if (rev) {
      rev.likes = (rev.likes || 0) + 1;
      return rev;
    }
    return null;
  }
};
