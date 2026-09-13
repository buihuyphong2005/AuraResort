import { ReviewModel } from '../models/review.model.js';
import { HotelModel } from '../models/hotel.model.js';

export const ReviewService = {
  async getReviewsByHotel(hotelId, filter = {}) {
    return await ReviewModel.find({ hotelId, ...filter });
  },

  async addReview(data) {
    const { hotelId, customerName, rating, cleanRating, serviceRating, locationRating, comment, roomType } = data;

    if (!hotelId || !customerName || !rating || !comment) {
      throw new Error('Vui lòng điền họ tên, số sao đánh giá và nội dung cảm nhận');
    }

    const reviewRecord = {
      id: 'rev-' + Date.now(),
      hotelId,
      customerName,
      customerAvatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(customerName)}`,
      rating: Number(rating),
      cleanRating: Number(cleanRating || rating),
      serviceRating: Number(serviceRating || rating),
      locationRating: Number(locationRating || rating),
      comment,
      roomType: roomType || 'Hạng phòng cao cấp',
      verifiedBooking: true,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const saved = await ReviewModel.create(reviewRecord);

    // Update hotel average rating
    await HotelModel.updateRating(hotelId, Number(rating));

    return saved;
  },

  async likeReview(reviewId) {
    const updated = await ReviewModel.likeReview(reviewId);
    if (!updated) {
      throw new Error('Không tìm thấy đánh giá');
    }
    return updated;
  }
};
