import { BookingModel } from '../models/booking.model.js';
import { HotelModel } from '../models/hotel.model.js';
import { RoomModel } from '../models/room.model.js';
import { PromotionModel } from '../models/promotion.model.js';
import { UserModel } from '../models/user.model.js';

export const BookingService = {
  async createBooking(data) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      userId,
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      guests = 2,
      voucherCode,
      paymentMethod = 'vnpay',
      specialRequests = ''
    } = data;

    if (!customerName || !customerEmail || !customerPhone || !hotelId || !roomId || !checkInDate || !checkOutDate) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin đặt phòng bắt buộc');
    }

    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) throw new Error('Chi nhánh khách sạn không tồn tại');

    const room = await RoomModel.findById(roomId);
    if (!room) throw new Error('Hạng phòng không tồn tại');

    const reservedRoom = await RoomModel.decrementAvailable(roomId);
    if (!reservedRoom) throw new Error('Hạng phòng này đã hết, vui lòng chọn hạng phòng khác');

    // Calculate nights
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const baseAmount = room.pricePerNight * nights;
    let discountAmount = 0;
    let validVoucher = null;

    if (voucherCode) {
      const voucher = await PromotionModel.findByCode(voucherCode);
      if (voucher) {
        validVoucher = voucher.code;
        const discountCalc = (baseAmount * voucher.discountPercent) / 100;
        discountAmount = Math.min(discountCalc, voucher.maxDiscount || 2000000);
      }
    }

    const totalAmount = Math.max(0, baseAmount - discountAmount);

    // Calculate loyalty points earned (5% of total paid value converted to points: 10,000 VND = 1 point)
    const pointsEarned = Math.floor(totalAmount / 20000);

    const bookingCode = 'AURA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const bookingRecord = {
      id: 'book-' + Date.now(),
      bookingCode,
      customerName,
      customerEmail,
      customerPhone,
      hotelId,
      hotelName: hotel.name,
      roomId,
      roomName: room.name,
      checkInDate,
      checkOutDate,
      nights,
      guests: Number(guests),
      roomPrice: room.pricePerNight,
      discountAmount,
      voucherApplied: validVoucher,
      totalAmount,
      paymentStatus: 'paid',
      paymentMethod,
      specialRequests,
      loyaltyPointsEarned: pointsEarned,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const saved = await BookingModel.create(bookingRecord);

    // Reward loyalty points to member
    if (userId) await UserModel.addPoints(userId, pointsEarned);
    if (userId) await UserModel.addNotification(
      userId,
      'Đặt phòng thành công #' + bookingCode,
      `Kỳ nghỉ tại ${hotel.name} (${nights} đêm) đã được xác nhận. Bạn nhận được +${pointsEarned} điểm thưởng!`,
      'booking'
    );

    return saved;
  },

  async getBookingsByEmail(email) {
    return await BookingModel.find({ customerEmail: email });
  },

  async getAllBookings() {
    return await BookingModel.find({});
  },

  async getBookingByCode(code) {
    const booking = await BookingModel.findByCode(code);
    if (!booking) {
      throw new Error('Không tìm thấy đơn đặt phòng với mã: ' + code);
    }
    return booking;
  },

  async updateBookingStatus(id, status) {
    const allowed = ['confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      throw new Error('Trạng thái không hợp lệ: ' + status);
    }
    const updated = await BookingModel.updateStatus(id, status);
    if (!updated) {
      throw new Error('Không tìm thấy đơn đặt phòng cần cập nhật');
    }
    return updated;
  }
};
