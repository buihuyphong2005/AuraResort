import mongoose from 'mongoose';
import { initialPromotions } from '../data/seedData.js';

const PromotionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  maxDiscount: { type: Number, default: 2000000 },
  description: { type: String, required: true },
  validUntil: { type: String, required: true },
  minTier: { type: String, default: 'Bronze' },
  category: { type: String },
  badge: { type: String },
  bannerImage: { type: String }
}, { timestamps: true });

export const MongoosePromotion = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);

let memoryPromotions = [...initialPromotions];

export const PromotionModel = {
  async find() {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongoosePromotion.find();
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory promotions:', e.message);
      }
    }
    return memoryPromotions;
  },

  async findByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return memoryPromotions.find(p => p.code.toUpperCase() === cleanCode) || null;
  }
};
