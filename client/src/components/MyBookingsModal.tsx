import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, Search, CheckCircle2, BedDouble, MapPin, Printer } from 'lucide-react';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('haidang.resort@gmail.com');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleSearch();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const list = await api.getBookings(email);
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl my-auto">
        
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold">Lịch Sử Đặt Phòng Của Tôi</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="flex gap-2 mb-6 text-xs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email đặt phòng của bạn..."
            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleSearch}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Tra cứu
          </button>
        </div>

        {/* Bookings list */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-10 text-stone-400 text-xs">Đang tải lịch sử đơn...</div>
          ) : bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400 text-sm">{b.bookingCode}</span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Đã thanh toán ({b.paymentMethod.toUpperCase()})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <div>
                    <span className="text-stone-500 block">Khu nghỉ dưỡng</span>
                    <strong className="text-stone-100">{b.hotelName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Hạng phòng</span>
                    <strong className="text-stone-100">{b.roomName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Thời gian lưu trú</span>
                    <span>{b.checkInDate} → {b.checkOutDate} ({b.nights} đêm)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Tổng tiền</span>
                    <span className="font-bold text-amber-400">{b.totalAmount.toLocaleString()} VNĐ</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Điểm thưởng nhận được: +{b.loyaltyPointsEarned} pts</span>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-amber-400 hover:underline cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> In vé điện tử
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-500 text-xs">
              Chưa có đơn đặt phòng nào với email này.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
