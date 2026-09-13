import { TourismService } from '../services/tourism.service.js';

export const TourismController = {
  async getAllTourism(req, res) {
    try {
      const spots = await TourismService.getAllTourism(req.query);
      res.json({ success: true, data: spots });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getTourismByHotel(req, res) {
    try {
      const spots = await TourismService.getTourismByHotel(req.params.hotelId, req.query);
      res.json({ success: true, data: spots });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getTourismDetail(req, res) {
    try {
      const spot = await TourismService.getTourismDetail(req.params.id);
      res.json({ success: true, data: spot });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
};
