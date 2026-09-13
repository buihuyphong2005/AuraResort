import { TourismModel } from '../models/tourism.model.js';
import { HotelModel } from '../models/hotel.model.js';

export const TourismService = {
  async getTourismByHotel(hotelId, filter = {}) {
    return await TourismModel.find({ hotelId, ...filter });
  },

  async getAllTourism(filter = {}) {
    return await TourismModel.find(filter);
  },

  async getTourismDetail(id) {
    const spot = await TourismModel.findById(id);
    if (!spot) throw new Error('Không tìm thấy điểm đến du lịch');
    const hotel = await HotelModel.findById(spot.hotelId);
    return {
      ...spot,
      hotel
    };
  }
};
