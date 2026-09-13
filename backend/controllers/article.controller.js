import { ArticleModel } from '../models/article.model.js';

export const ArticleController = {
  async getAll(req, res) {
    try {
      const { hotelId, category } = req.query;
      const articles = await ArticleModel.find({ hotelId, category });
      res.json({
        success: true,
        data: articles
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const article = await ArticleModel.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ success: false, error: 'Bài viết không tồn tại' });
      }
      res.json({
        success: true,
        data: article
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
