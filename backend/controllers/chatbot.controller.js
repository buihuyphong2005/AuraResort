import { GeminiService } from '../services/gemini.service.js';

export const ChatbotController = {
  async chat(req, res) {
    try {
      const { message, history } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Tin nhắn không được để trống' });
      }
      const response = await GeminiService.chatWithConcierge(message.trim(), history || []);
      res.json({ success: true, data: response });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async recommend(req, res) {
    try {
      const { city, maxPrice, guests, features } = req.body || {};
      const recommendation = await GeminiService.getRoomRecommendation({ city, maxPrice, guests, features });
      res.json({ success: true, data: recommendation });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getSuggestions(req, res) {
    try {
      const suggestions = GeminiService.getQuickSuggestions();
      res.json({ success: true, data: suggestions });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getConfig(req, res) {
    try {
      const config = GeminiService.getAIConfig();
      res.json({ success: true, data: config });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateConfig(req, res) {
    try {
      const { apiKey } = req.body || {};
      const result = GeminiService.updateApiKey(apiKey);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

