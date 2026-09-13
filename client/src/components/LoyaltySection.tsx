import React, { useState } from 'react';
import { 
  Crown, 
  Gift, 
  Percent, 
  Bell, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Award, 
  Clock, 
  Tag 
} from 'lucide-react';
import { LoyaltyUser, Promotion } from '../types/index.ts';

interface LoyaltySectionProps {
  loyaltyUser: LoyaltyUser | null;
  promotions: Promotion[];
  onMarkNotificationRead: (id: string) => void;
  onApplyVoucherToBooking: (voucherCode: string) => void;
}

export const LoyaltySection: React.FC<LoyaltySectionProps> = ({
  loyaltyUser,
  promotions,
  onMarkNotificationRead,
  onApplyVoucherToBooking
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-950 text-stone-100 border-t border-stone-800" id="loyalty-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Crown className="w-4 h-4 text-amber-400" /> Aura Loyalty Club • Đặc quyền Thượng Lưu
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight">
            Ưu Đãi & Điểm Thưởng Khách Hàng Thân Thiết
          </h2>
          <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed font-light">
            Nhận chiết khấu lên đến 30%, tích lũy điểm thưởng sau mỗi đêm nghỉ và tận hưởng vô vàn đặc quyền dành riêng cho từng hạng thẻ.
          </p>
        </div>

        {/* Member Card & Tier Progression Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Virtual Member Card */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[1.6/1] rounded-3xl p-6 sm:p-7 overflow-hidden shadow-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-600 text-stone-950 flex flex-col justify-between border border-amber-300/40">
              {/* Card Holographic Watermark */}
              <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-yellow-400/20 blur-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 p-8 opacity-15">
                <Crown className="w-40 h-40" />
              </div>

              {/* Card Top */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-900/80">
                    AURA LOYALTY CLUB
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-950 tracking-wider">
                    {loyaltyUser?.tier.toUpperCase()} MEMBER
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-950/15 backdrop-blur-md flex items-center justify-center border border-stone-950/20">
                  <Crown className="w-5 h-5 text-stone-950" />
                </div>
              </div>

              {/* Card Mid: Points */}
              <div className="relative z-10 my-2">
                <span className="text-[11px] font-semibold text-stone-900/80 block">Điểm thưởng khả dụng</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-stone-950">
                    {loyaltyUser?.points.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-900">Points</span>
                </div>
              </div>

              {/* Card Bottom */}
              <div className="relative z-10 flex items-end justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-900/70 uppercase block">Chủ thẻ</span>
                  <span className="font-bold tracking-wide uppercase text-stone-950">
                    {loyaltyUser?.name || 'Nguyễn Hải Đăng'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-900/70 uppercase block">Hội viên từ</span>
                  <span className="font-mono font-bold text-stone-950">
                    {loyaltyUser?.memberSince || '2023'}
                  </span>
                </div>
              </div>

            </div>

            {/* Progression to Next Tier */}
            <div className="mt-4 bg-stone-900 p-4 rounded-2xl border border-stone-800 text-xs">
              <div className="flex items-center justify-between text-stone-300 mb-1.5">
                <span>Tiến độ lên hạng <strong>{loyaltyUser?.nextTier || 'Diamond'}</strong>:</span>
                <span className="text-amber-400 font-mono font-bold">
                  Còn {loyaltyUser?.pointsToNextTier.toLocaleString()} điểm
                </span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((loyaltyUser?.points || 4250) / 6000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Member Benefits & Privilege List */}
          <div className="lg:col-span-7 bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
                <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Đặc Quyền Hạng Thẻ Của Bạn
                </h3>
                <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full font-semibold border border-amber-500/30">
                  {loyaltyUser?.totalBookings} Chuyến đi đã tích lũy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {loyaltyUser?.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-stone-300 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Promo Notification Banner */}
            <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Ưu đãi sinh nhật hội viên tháng này</h4>
                  <p className="text-[11px] text-stone-400">Tặng thêm 01 liệu trình Spa đá muối 60 phút và bánh chúc mừng tại phòng.</p>
                </div>
              </div>
              <button
                onClick={() => onApplyVoucherToBooking('VIPGOLD25')}
                className="w-full sm:w-auto text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl whitespace-nowrap cursor-pointer transition-colors"
              >
                Dùng mã VIPGOLD25
              </button>
            </div>

          </div>

        </div>

        {/* Promotions & Vouchers Wallet */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">
                Kho Voucher & Khuyến Mãi Đang Kích Hoạt
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Nhấp sao chép mã và dán vào bước đặt phòng để được áp dụng giảm giá trực tiếp.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-stone-900 rounded-3xl p-5 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                      {promo.badge || 'Khuyến Mãi'}
                    </span>
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Đến {promo.validUntil}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 my-2">
                    <span className="font-serif text-3xl font-black text-amber-400">
                      -{promo.discountPercent}%
                    </span>
                    <span className="text-xs text-stone-400">tối đa {(promo.maxDiscount / 1000000).toFixed(1)} triệu</span>
                  </div>

                  <h4 className="font-bold text-stone-100 text-sm mb-1">{promo.title}</h4>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                    {promo.description}
                  </p>
                </div>

                {/* Promo Code Copy Bar */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                  <div className="bg-stone-950 px-3 py-2 rounded-xl font-mono text-xs font-bold text-amber-300 border border-stone-800/80 tracking-wider">
                    {promo.code}
                  </div>

                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-amber-400 bg-stone-800 hover:bg-stone-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
