import { HotelService } from '../services/hotel.service.js';

export const HotelController = {
  async getAllHotels(req, res) {
    try {
      const hotels = await HotelService.getAllHotels(req.query);
      res.json({ success: true, data: hotels });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getHotelById(req, res) {
    try {
      const hotel = await HotelService.getHotelById(req.params.id);
      res.json({ success: true, data: hotel });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async getRoomsByHotel(req, res) {
    try {
      const rooms = await HotelService.getRoomsByHotel(req.params.hotelId, req.query);
      res.json({ success: true, data: rooms });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getRoomById(req, res) {
    try {
      const room = await HotelService.getRoomById(req.params.id);
      res.json({ success: true, data: room });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
};
