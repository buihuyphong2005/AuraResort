import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Tag, 
  Calendar, 
  Users, 
  Sparkles, 
  Download, 
  Printer, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Crown,
  Building2,
  Copy,
  Info
} from 'lucide-react';
import { Hotel, Room, Booking, LoyaltyUser } from '../types/index.ts';
import { api } from '../services/api.ts';

interface BookingPaymentModalProps {
  hotel: Hotel;
  room: Room;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
  currentUser?: LoyaltyUser | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({
  hotel,
  room,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  currentUser,
  onClose,
  onBookingSuccess
}) => {
  // Step: 1 = Details & Voucher, 2 = Bank Payment Gateway, 3 = Confirmation Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Nguyễn Hải Đăng');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'haidang.resort@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '0988 123 456');
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests || 2);
  const [specialRequests, setSpecialRequests] = useState('Phòng tầng cao, view thoáng đãng và giường đôi êm ái.');

  // Voucher State
  const [voucherCode, setVoucherCode] = useState('AURA15');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountPercent: number; title: string } | null>({
    code: 'AURA15',
    discountPercent: 15,
    title: 'Ưu đãi chào hè 15%'
  });
  const [voucherError, setVoucherError] = useState('');
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  // Payment Method: Strictly Bank Transfer or Bank Card (No momo, no vnpay)
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'bank_card'>('bank_transfer');
  
  // Bank Card Form
  const [cardNumber, setCardNumber] = useState('9704 2200 8899 6688');
  const [cardHolder, setCardHolder] = useState('NGUYEN HAI DANG');
  const [cardBankName, setCardBankName] = useState('Vietcombank');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Copy toast
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffTime) ? 1 : Math.max(1, diffTime);

  // Price calculations
  const subtotal = room.pricePerNight * nights;
  const discountAmount = appliedVoucher ? Math.min((subtotal * appliedVoucher.discountPercent) / 100, 2000000) : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);
  const pointsEarned = Math.floor(totalAmount / 20000);

  const bankAccountInfo = {
    bankName: 'MB Bank (Ngân hàng TMCP Quân Đội)',
    accountNumber: '0348888999',
    accountHolder: 'CONG TY CP NGHIDUONG AURA RESORT',
    branch: 'Chi nhánh Hà Nội / Đà Nẵng'
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle Voucher Check
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsValidatingVoucher(true);
    setVoucherError('');
    try {
      const voucher = await api.validateVoucher(voucherCode);
      setAppliedVoucher({
        code: voucher.code,
        discountPercent: voucher.discountPercent,
        title: voucher.title
      });
    } catch (err: any) {
      setVoucherError(err.message || 'Mã không hợp lệ');
      setAppliedVoucher(null);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  // Submit Booking & Bank Payment
  const handleConfirmAndPay = async () => {
    setIsProcessing(true);
    try {
      const bookingData = {
        customerName,
        customerEmail,
        customerPhone,
        hotelId: hotel.id,
        roomId: room.id,
        checkInDate,
        checkOutDate,
        guests,
        voucherCode: appliedVoucher?.code,
        paymentMethod,
        specialRequests
      };

      const res = await api.createBooking(bookingData);
      setCreatedBooking(res);
      onBookingSuccess(res);
      setStep(3);
    } catch (err: any) {
      alert('Đặt phòng thất bại: ' + (err.message || 'Vui lòng thử lại sau'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full text-stone-100 shadow-2xl overflow-hidden my-auto animate-fadeIn">
        
        {/* Modal Header Bar */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold">
              {step === 3 ? '✓' : step}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                {step === 1 && 'Thông Tin Đặt Phòng & Ưu Đãi'}
                {step === 2 && 'Cổng Thanh Toán Ngân Hàng'}
                {step === 3 && 'Xác Nhận Đặt Phòng Thành Công'}
              </h3>
              <p className="text-xs text-stone-400">
                {hotel.name} • {room.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Voucher Form */}
        {step === 1 && (
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Customer & Stay Info */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> 1. Thông tin khách lưu trú
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                    placeholder="0912 345 678"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-stone-300 font-semibold mb-1">Email nhận vé điện tử *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  placeholder="name@domain.com"
                />
              </div>

              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 pt-3 pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 2. Lịch trình lưu trú
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Ngày nhận phòng</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Ngày trả phòng</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-stone-400 mb-1">Yêu cầu đặc biệt (tùy chọn)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none resize-none"
                  placeholder="VD: Cần kê thêm nôi trẻ em, hỗ trợ xe đưa đón sân bay..."
                />
              </div>
            </div>

            {/* Right Col: Price Summary & Voucher */}
            <div className="lg:col-span-5 bg-stone-950 rounded-2xl p-5 border border-stone-800 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-100 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" /> Tóm tắt chi phí
                </h4>

                <div className="space-y-2 text-xs border-b border-stone-800/80 pb-3 mb-3">
                  <div className="flex justify-between text-stone-400">
                    <span>Giá niêm yết:</span>
                    <span className="font-mono text-stone-200">{room.pricePerNight.toLocaleString()} VNĐ/đêm</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Thời gian lưu trú:</span>
                    <span className="text-stone-200 font-semibold">{nights} đêm ({guests} khách)</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Tổng tiền phòng:</span>
                    <span className="font-mono text-stone-200">{subtotal.toLocaleString()} VNĐ</span>
                  </div>

                  {appliedVoucher && (
                    <div className="flex justify-between text-amber-400 font-semibold">
                      <span>Giảm ({appliedVoucher.code} -{appliedVoucher.discountPercent}%):</span>
                      <span className="font-mono">-{discountAmount.toLocaleString()} VNĐ</span>
                    </div>
                  )}
                </div>

                {/* Voucher code input */}
                <div className="space-y-1.5 mb-4">
                  <label className="text-[11px] text-stone-400 font-semibold">Mã ưu đãi hội viên</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã (VD: AURA15, VIPGOLD25)"
                      className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={isValidatingVoucher || !voucherCode.trim()}
                      className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {isValidatingVoucher ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                  {voucherError && <p className="text-[11px] text-red-400">{voucherError}</p>}
                  {appliedVoucher && (
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã áp dụng: {appliedVoucher.title}
                    </p>
                  )}
                </div>

                {/* Total amount highlight */}
                <div className="bg-stone-900 p-4 rounded-xl border border-stone-800">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Tổng thanh toán:</span>
                  <div className="font-serif text-2xl font-black text-amber-400 mt-0.5">
                    {totalAmount.toLocaleString()} <span className="text-xs font-sans font-normal text-stone-300">VNĐ</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Tích lũy: +{pointsEarned.toLocaleString()} điểm Aura Loyalty</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Proceed to Bank Payment */}
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Tiếp tục: Thanh toán Ngân Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        )}

        {/* STEP 2: Bank Payment Gateway (VietQR & Bank Cards ONLY) */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h4 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" /> Phương Thức Thanh Toán Ngân Hàng
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Thanh toán trực tiếp qua hệ thống ngân hàng an toàn, bảo mật và xác nhận tự động 24/7.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-500 block uppercase">Số tiền thanh toán</span>
                <span className="font-serif text-lg font-bold text-amber-400">
                  {totalAmount.toLocaleString()} VNĐ
                </span>
              </div>
            </div>

            {/* Bank Payment Method Selection Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: VietQR Bank Transfer 24/7 */}
              <div
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-1 ring-amber-500'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-900'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-200">Chuyển Khoản Ngân Hàng (VietQR 24/7)</span>
                    {paymentMethod === 'bank_transfer' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Quét mã QR liên ngân hàng chuẩn NAPAS qua MB Bank, Vietcombank, Techcombank, BIDV... Miễn phí & xác nhận tức thì.
                  </p>
                </div>
              </div>

              {/* Option 2: Bank Card (ATM Napas / Visa / Mastercard) */}
              <div
                onClick={() => setPaymentMethod('bank_card')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'bank_card'
                    ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-1 ring-amber-500'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-900'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-200">Thẻ Ngân Hàng (ATM / Visa / Mastercard)</span>
                    {paymentMethod === 'bank_card' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Thanh toán trực tiếp bằng Thẻ ghi nợ / Thẻ tín dụng do ngân hàng phát hành với mã bảo mật 3D-Secure.
                  </p>
                </div>
              </div>

            </div>

            {/* Render Payment Method Specific View */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* VietQR Dynamic Code */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-widest text-blue-900 uppercase">NAPAS 24/7</span>
                    <span className="text-[10px] text-stone-400">|</span>
                    <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">VietQR</span>
                  </div>
                  
                  <img
                    src={`https://img.vietqr.io/image/MB-0348888999-compact2.png?amount=${totalAmount}&addInfo=AURA%20RESORT&accountName=AURA%20RESORT%20VIETNAM`}
                    alt="VietQR Chuyển khoản ngân hàng"
                    className="w-48 h-48 object-contain rounded-lg border border-stone-200"
                  />

                  <p className="text-[10px] text-stone-600 mt-2 font-medium">
                    Mở ứng dụng Ngân hàng và quét mã để thanh toán
                  </p>
                </div>

                {/* Bank Account Details with 1-click Copy */}
                <div className="md:col-span-7 space-y-3 text-xs">
                  
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Ngân hàng thụ hưởng:</span>
                      <strong className="text-stone-100">{bankAccountInfo.bankName}</strong>
                    </div>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">24/7</span>
                  </div>

                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Số tài khoản ngân hàng:</span>
                      <strong className="font-mono text-sm text-amber-400 tracking-wider">
                        {bankAccountInfo.accountNumber}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankAccountInfo.accountNumber, 'acc')}
                      className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px]"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'acc' ? 'Đã sao chép' : 'Sao chép STK'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Tên chủ tài khoản:</span>
                      <strong className="text-stone-200 uppercase">{bankAccountInfo.accountHolder}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Số tiền chính xác:</span>
                      <strong className="font-mono text-sm text-amber-400 font-bold">
                        {totalAmount.toLocaleString()} VNĐ
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(totalAmount.toString(), 'amount')}
                      className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px]"
                    >
                      {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'amount' ? 'Đã sao chép' : 'Sao chép tiền'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Nội dung chuyển khoản:</span>
                      <strong className="font-mono text-xs text-amber-300">
                        AURA {customerPhone ? customerPhone.slice(-4) : 'VIP'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`AURA ${customerPhone ? customerPhone.slice(-4) : 'VIP'}`, 'content')}
                      className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-[11px]"
                    >
                      {copiedField === 'content' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'content' ? 'Đã sao chép' : 'Sao chép cú pháp'}</span>
                    </button>
                  </div>

                </div>

              </div>
            )}

            {paymentMethod === 'bank_card' && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2 text-xs text-stone-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cổng mã hóa ngân hàng SSL 256-bit chuẩn PCI-DSS Level 1</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Napas / Visa / MasterCard / JCB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Ngân hàng phát hành thẻ</label>
                    <select
                      value={cardBankName}
                      onChange={(e) => setCardBankName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                    >
                      <option value="Vietcombank">Vietcombank</option>
                      <option value="MB Bank">MB Bank (Ngân hàng Quân Đội)</option>
                      <option value="Techcombank">Techcombank</option>
                      <option value="BIDV">BIDV</option>
                      <option value="VietinBank">VietinBank</option>
                      <option value="VPBank">VPBank</option>
                      <option value="ACB">ACB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Số thẻ ngân hàng *</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="9704 xxxx xxxx xxxx"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Tên in trên thẻ (không dấu) *</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="NGUYEN VAN A"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-400 mb-1">Hạn thẻ (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Mã bảo mật (CVV)</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold cursor-pointer"
              >
                ← Quay lại bước trước
              </button>

              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kết nối Ngân Hàng...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Xác Nhận Đã Chuyển Khoản & Hoàn Tất</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Booking Success & Electronic Voucher */}
        {step === 3 && createdBooking && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Giao Dịch Ngân Hàng Hoàn Tất
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
                Kỳ Nghỉ Của Quý Khách Đã Được Xác Nhận!
              </h3>
              <p className="text-xs text-stone-400 mt-2 max-w-lg mx-auto">
                Vé điện tử và hướng dẫn nhận phòng đã được gửi tự động tới hòm thư <strong>{createdBooking.customerEmail}</strong>.
              </p>
            </div>

            {/* E-Voucher Card */}
            <div className="max-w-xl mx-auto bg-stone-950 border border-stone-800 rounded-3xl p-6 text-left shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Crown className="w-32 h-32" />
              </div>

              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest block">Mã Đặt Phòng Điện Tử</span>
                  <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
                    {createdBooking.bookingCode}
                  </span>
                </div>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] px-3 py-1 rounded-full font-bold">
                  ĐÃ XÁC NHẬN (NGÂN HÀNG)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-stone-300">
                <div>
                  <span className="text-stone-500 block text-[11px]">Khu nghỉ dưỡng:</span>
                  <strong className="text-stone-100">{createdBooking.hotelName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Hạng phòng:</span>
                  <strong className="text-stone-100">{createdBooking.roomName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Khách đại diện:</span>
                  <span className="text-stone-200">{createdBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Số điện thoại:</span>
                  <span className="text-stone-200">{createdBooking.customerPhone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Nhận phòng:</span>
                  <span className="text-stone-200 font-semibold">{createdBooking.checkInDate} (14:00)</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Trả phòng:</span>
                  <span className="text-stone-200 font-semibold">{createdBooking.checkOutDate} (12:00)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Tổng số tiền đã thanh toán:</span>
                  <span className="font-serif text-lg font-bold text-amber-400">
                    {createdBooking.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-amber-300 flex items-center gap-1 justify-end font-semibold">
                    <Crown className="w-3.5 h-3.5" /> +{createdBooking.loyaltyPointsEarned} điểm thưởng
                  </span>
                  <span className="text-[10px] text-stone-500">Aura Loyalty Club</span>
                </div>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>In vé điện tử</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer transition-colors shadow-md"
              >
                Hoàn tất & Đóng
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
