import mongoose from 'mongoose';
import { initialRooms } from '../data/seedData.js';

const RoomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  bedType: { type: String, required: true },
  areaSqm: { type: Number, required: true },
  view: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export const MongooseRoom = mongoose.models.Room || mongoose.model('Room', RoomSchema);

let memoryRooms = [...initialRooms];

export const RoomModel = {
  async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongooseRoom.find(filter);
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory rooms:', e.message);
      }
    }
    let res = [...memoryRooms];
    if (filter.hotelId) {
      res = res.filter(r => r.hotelId === filter.hotelId);
    }
    if (filter.capacity) {
      res = res.filter(r => r.capacity >= Number(filter.capacity));
    }
    if (filter.type && filter.type !== 'all') {
      res = res.filter(r => r.type.toLowerCase() === filter.type.toLowerCase());
    }
    return res;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const found = await MongooseRoom.findOne({ id });
        if (found) return found;
      } catch (e) {
        console.warn('Fallback to memory room by id:', e.message);
      }
    }
    return memoryRooms.find(r => r.id === id) || null;
  }
};
