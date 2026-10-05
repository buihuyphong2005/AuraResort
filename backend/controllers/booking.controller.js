import { BookingService } from '../services/booking.service.js';

export const BookingController = {
  async createBooking(req, res) {
    try {
      const booking = await BookingService.createBooking(req.body);
      res.status(201).json({
        success: true,
        message: 'Đặt phòng thành công! Đã gửi thông tin vé điện tử.',
        data: booking
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getBookings(req, res) {
    try {
      const email = req.query.email;
      let bookings;
      if (email) {
        bookings = await BookingService.getBookingsByEmail(email);
      } else {
        bookings = await BookingService.getAllBookings();
      }
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getBookingByCode(req, res) {
    try {
      const booking = await BookingService.getBookingByCode(req.params.code);
      res.json({ success: true, data: booking });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await BookingService.updateBookingStatus(id, status);
      res.json({ success: true, message: 'Cập nhật trạng thái đơn thành công', data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
