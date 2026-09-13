import mongoose from 'mongoose';
import { initialTourismSpots } from '../data/seedData.js';

const TourismSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  description: { type: String, required: true },
  highlight: { type: String },
  image: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  culturalSignificance: { type: String },
  bestTimeToVisit: { type: String },
  suggestedDuration: { type: String }
}, { timestamps: true });

export const MongooseTourism = mongoose.models.Tourism || mongoose.model('Tourism', TourismSchema);

let memoryTourism = [...initialTourismSpots];

export const TourismModel = {
  async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongooseTourism.find(filter);
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory tourism:', e.message);
      }
    }
    let res = [...memoryTourism];
    if (filter.hotelId) {
      res = res.filter(t => t.hotelId === filter.hotelId);
    }
    if (filter.category && filter.category !== 'all') {
      res = res.filter(t => t.category === filter.category);
    }
    return res;
  },

  async findById(id) {
    return memoryTourism.find(t => t.id === id) || null;
  }
};
