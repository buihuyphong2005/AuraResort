import { ReviewService } from '../services/review.service.js';

export const ReviewController = {
  async getReviewsByHotel(req, res) {
    try {
      const reviews = await ReviewService.getReviewsByHotel(req.params.hotelId, req.query);
      res.json({ success: true, data: reviews });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async addReview(req, res) {
    try {
      const review = await ReviewService.addReview(req.body);
      res.status(201).json({
        success: true,
        message: 'Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được ghi nhận.',
        data: review
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async likeReview(req, res) {
    try {
      const review = await ReviewService.likeReview(req.params.id);
      res.json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
