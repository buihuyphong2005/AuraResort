import { HotelModel } from '../models/hotel.model.js';
import { RoomModel } from '../models/room.model.js';

export const HotelService = {
  async getAllHotels(query = {}) {
    return await HotelModel.find(query);
  },

  async getHotelById(id) {
    const hotel = await HotelModel.findById(id);
    if (!hotel) {
      throw new Error('Không tìm thấy thông tin chi nhánh khách sạn');
    }
    const rooms = await RoomModel.find({ hotelId: id });
    return {
      ...hotel,
      rooms
    };
  },

  async getRoomsByHotel(hotelId, filter = {}) {
    return await RoomModel.find({ hotelId, ...filter });
  },

  async getRoomById(roomId) {
    const room = await RoomModel.findById(roomId);
    if (!room) {
      throw new Error('Không tìm thấy thông tin hạng phòng');
    }
    const hotel = await HotelModel.findById(room.hotelId);
    return {
      ...room,
      hotel
    };
  }
};
