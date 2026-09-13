import mongoose from 'mongoose';
import { initialArticles } from '../data/seedData.js';

const ArticleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  hotelId: { type: String },
  location: { type: String },
  category: { type: String },
  readTime: { type: String },
  publishedDate: { type: String },
  author: {
    name: String,
    role: String,
    avatar: String
  },
  coverImage: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export const MongooseArticle = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

let memoryArticles = [...initialArticles];

export const ArticleModel = {
  async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongooseArticle.find(filter);
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory articles:', e.message);
      }
    }
    let res = [...memoryArticles];
    if (filter.hotelId) {
      res = res.filter(a => a.hotelId === filter.hotelId);
    }
    if (filter.category && filter.category !== 'all') {
      res = res.filter(a => a.category === filter.category);
    }
    return res;
  },

  async findById(id) {
    return memoryArticles.find(a => a.id === id || a.slug === id) || null;
  }
};
