import mongoose from 'mongoose';
import { initialHotels } from '../data/seedData.js';

const HotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branchCode: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  tagline: { type: String },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  coverImage: { type: String, required: true },
  galleryImages: [{ type: String }],
  priceStarting: { type: Number, required: true },
  description: { type: String, required: true },
  amenities: [{ type: String }],
  phone: { type: String },
  email: { type: String }
}, { timestamps: true });

export const MongooseHotel = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);

// In-memory persistent cache synced with seed data for high performance & offline resiliency
let memoryHotels = [...initialHotels];

export const HotelModel = {
  async find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongooseHotel.find(query);
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory hotels:', e.message);
      }
    }
    let res = [...memoryHotels];
    if (query.city) {
      res = res.filter(h => h.city.toLowerCase().includes(query.city.toLowerCase()));
    }
    return res;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const found = await MongooseHotel.findOne({ id });
        if (found) return found;
      } catch (e) {
        console.warn('Fallback to memory hotel by id:', e.message);
      }
    }
    return memoryHotels.find(h => h.id === id) || null;
  },

  async updateRating(id, newRating, countDelta = 1) {
    const hotel = memoryHotels.find(h => h.id === id);
    if (hotel) {
      const totalScore = (hotel.rating * hotel.reviewCount) + newRating;
      hotel.reviewCount += countDelta;
      hotel.rating = Number((totalScore / hotel.reviewCount).toFixed(2));
      return hotel;
    }
    return null;
  }
};
