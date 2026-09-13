import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Crown, 
  Calendar, 
  Sparkles, 
  LogOut, 
  Printer, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Tag, 
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { LoyaltyUser, Booking } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AccountPageProps {
  currentUser: LoyaltyUser | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onNavigateToHotels: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigateToHotels
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBookingForVoucher, setSelectedBookingForVoucher] = useState<Booking | null>(null);

  useEffect(() => {
    if (currentUser?.email) {
      loadBookings(currentUser.email);
    }
  }, [currentUser]);

  const loadBookings = async (email: string) => {
    setLoadingBookings(true);
    try {
      const list = await api.getBookings(email);
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // If not logged in
  if (!currentUser) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">
          Tài Khoản & Lịch Sử Đặt Phòng
        </h2>
        <p className="text-stone-600 text-sm mt-2 mb-6">
          Vui lòng đăng nhập hoặc đăng ký tài khoản hội viên để tra cứu các đơn đặt phòng, theo dõi điểm thưởng tích lũy và sử dụng các voucher ưu đãi độc quyền.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            Đăng Nhập Tài Khoản
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            Đăng Ký Hội Viên Mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      
      {/* Account Overview Card */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-serif font-black text-2xl shadow-lg border-2 border-amber-300">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {currentUser.name}
                </h1>
                <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                  {currentUser.tier} MEMBER
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-stone-500" /> {currentUser.email}</span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-500" /> {currentUser.phone}</span>
                )}
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-stone-500" /> Hội viên từ: {currentUser.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Action: Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-red-400 bg-stone-950 px-4 py-2.5 rounded-xl border border-stone-800 transition-colors w-fit cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>

        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-800">
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block">Điểm thưởng khả dụng</span>
            <span className="font-mono text-2xl font-bold text-amber-400 mt-0.5 block">
              {currentUser.points.toLocaleString()} pts
            </span>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block">Hạng thẻ hiện tại</span>
            <span className="font-serif text-2xl font-bold text-stone-100 mt-0.5 block">
              {currentUser.tier}
            </span>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block">Tiến độ lên hạng</span>
            <span className="text-xs text-stone-300 mt-1 block">
              Cần thêm <strong className="text-amber-400">{currentUser.pointsToNextTier} pts</strong> để lên {currentUser.nextTier}
            </span>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80">
            <span className="text-[11px] text-stone-400 block">Tổng số kỳ nghỉ</span>
            <span className="font-mono text-2xl font-bold text-stone-100 mt-0.5 block">
              {bookings.length} đơn
            </span>
          </div>
        </div>

      </div>

      {/* Bookings Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Lịch Sử Đơn Đặt Phòng Của Bạn
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Tra cứu mã đặt phòng, thông tin chi nhánh, xuất hóa đơn & vé điện tử.
            </p>
          </div>

          <button
            onClick={onNavigateToHotels}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <span>Đặt phòng mới</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingBookings ? (
          <div className="text-center py-16 text-stone-400">Đang tải danh sách đơn phòng...</div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                      {b.bookingCode}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Đã Thanh Toán (Ngân Hàng)
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {b.hotelName} — <span className="font-sans text-sm font-normal text-stone-600">{b.roomName}</span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span>Thời gian: <strong>{b.checkInDate} → {b.checkOutDate}</strong> ({b.nights} đêm)</span>
                    <span>•</span>
                    <span>Khách: <strong>{b.guests} người</strong></span>
                    <span>•</span>
                    <span>Tổng thanh toán: <strong className="text-amber-800">{b.totalAmount.toLocaleString()} VNĐ</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBookingForVoucher(b)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Xem Vé Điện Tử</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 text-stone-500">
            <p className="text-sm">Bạn chưa có đơn đặt phòng nào.</p>
            <button
              onClick={onNavigateToHotels}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              <span>Khám phá 6 chi nhánh resort và đặt ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* MODAL: View E-Voucher */}
      {selectedBookingForVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl my-auto animate-fadeIn relative">
            <button
              onClick={() => setSelectedBookingForVoucher(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-100"
            >
              ✕
            </button>

            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">Vé Điện Tử AuraResort</span>
                <span className="font-mono text-xl font-bold text-amber-400">
                  {selectedBookingForVoucher.bookingCode}
                </span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                XÁC NHẬN NGÂN HÀNG
              </span>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div>
                <span className="text-stone-500 block text-[11px]">Khu nghỉ dưỡng:</span>
                <strong className="text-stone-100">{selectedBookingForVoucher.hotelName}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Hạng phòng:</span>
                <strong className="text-stone-100">{selectedBookingForVoucher.roomName}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-500 block text-[11px]">Khách đại diện:</span>
                  <span>{selectedBookingForVoucher.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Số điện thoại:</span>
                  <span>{selectedBookingForVoucher.customerPhone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-500 block text-[11px]">Nhận phòng (14:00):</span>
                  <span>{selectedBookingForVoucher.checkInDate}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Trả phòng (12:00):</span>
                  <span>{selectedBookingForVoucher.checkOutDate}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-stone-500 block text-[11px]">Tổng tiền:</span>
                  <span className="font-serif text-lg font-bold text-amber-400">
                    {selectedBookingForVoucher.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-amber-300 font-semibold block">
                    +{selectedBookingForVoucher.loyaltyPointsEarned} điểm thưởng
                  </span>
                  <span className="text-[10px] text-stone-500">Aura Loyalty</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> In phiếu
              </button>
              <button
                onClick={() => setSelectedBookingForVoucher(null)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
