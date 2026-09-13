import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bookingCode: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  hotelId: { type: String, required: true },
  hotelName: { type: String, required: true },
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  nights: { type: Number, default: 1 },
  guests: { type: Number, default: 2 },
  roomPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  voucherApplied: { type: String },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'cancelled'],
    default: 'paid'
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'momo', 'card', 'vietqr', 'at_hotel'],
    default: 'vnpay'
  },
  specialRequests: { type: String },
  loyaltyPointsEarned: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const MongooseBooking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

let memoryBookings = [
  {
    id: 'book-init-1',
    bookingCode: 'AURA-BK-8892',
    customerName: 'Nguyễn Hải Đăng',
    customerEmail: 'haidang.resort@gmail.com',
    customerPhone: '0988 123 456',
    hotelId: 'hotel-danang',
    hotelName: 'Aura Danang Ocean Sanctuary',
    roomId: 'room-dad-2',
    roomName: 'Sanctuary Suite Biển Ngọc',
    checkInDate: '2026-09-18',
    checkOutDate: '2026-09-20',
    nights: 2,
    guests: 2,
    roomPrice: 4200000,
    discountAmount: 1260000,
    voucherApplied: 'VIPGOLD25',
    totalAmount: 7140000,
    paymentStatus: 'paid',
    paymentMethod: 'vnpay',
    specialRequests: 'Trang trí phòng trăng mật và hoa tươi chào đón.',
    loyaltyPointsEarned: 357,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

export const BookingModel = {
  async create(bookingData) {
    if (mongoose.connection.readyState === 1) {
      try {
        const created = await MongooseBooking.create(bookingData);
        memoryBookings.unshift(bookingData);
        return created;
      } catch (e) {
        console.warn('Fallback to memory booking create:', e.message);
      }
    }
    memoryBookings.unshift(bookingData);
    return bookingData;
  },

  async find(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await MongooseBooking.find(filter).sort({ createdAt: -1 });
        if (results && results.length > 0) return results;
      } catch (e) {
        console.warn('Fallback to memory bookings find:', e.message);
      }
    }
    let res = [...memoryBookings];
    if (filter.customerEmail) {
      res = res.filter(b => b.customerEmail.toLowerCase() === filter.customerEmail.toLowerCase());
    }
    if (filter.hotelId) {
      res = res.filter(b => b.hotelId === filter.hotelId);
    }
    return res;
  },

  async findByCode(bookingCode) {
    if (mongoose.connection.readyState === 1) {
      try {
        const found = await MongooseBooking.findOne({ bookingCode });
        if (found) return found;
      } catch (e) {
        console.warn('Fallback to memory booking by code:', e.message);
      }
    }
    return memoryBookings.find(b => b.bookingCode.toUpperCase() === bookingCode.toUpperCase()) || null;
  }
};
