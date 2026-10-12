import { HotelModel } from '../models/hotel.model.js';
import { RoomModel } from '../models/room.model.js';

export const HotelService = {
  async getAllHotels(query = {}) {
    const hotels = await HotelModel.find(query);
    const rooms = await RoomModel.find({});
    return hotels.map(hotel => {
      const hotelObj = hotel && typeof hotel.toObject === 'function' ? hotel.toObject() : { ...hotel };
      return {
        ...hotelObj,
        rooms: rooms.filter(r => r.hotelId === (hotel.id || hotelObj.id))
      };
    });
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

  async getAllRooms() {
    return await RoomModel.find({});
  },

  async updateRoomStock(roomId, totalRooms) {
    return await RoomModel.updateTotalRooms(roomId, totalRooms);
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
