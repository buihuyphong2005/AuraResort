import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Sparkles, ShieldCheck, CreditCard, Bot } from 'lucide-react';
import { Hotel } from '../types/index.ts';

interface HeroSectionProps {
  hotels: Hotel[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  checkInDate: string;
  onCheckInChange: (date: string) => void;
  checkOutDate: string;
  onCheckOutChange: (date: string) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
  onSearch: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  hotels,
  selectedCity,
  onCityChange,
  checkInDate,
  onCheckInChange,
  checkOutDate,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onSearch,
  onOpenChat
}) => {
  const cities = ['Tất cả', 'Đà Nẵng', 'Sa Pa', 'Hội An', 'Phú Quốc', 'Ninh Bình', 'Đà Lạt'];

  return (
    <div className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-stone-950 text-white" id="hero">
      {/* Picturesque Background Imagery with artistic overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920&auto=format&fit=crop"
          alt="AuraResort Panorama"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.65] contrast-[1.08] transition-transform duration-10000 hover:scale-100"
        />
        {/* Artistic watercolor & golden hour overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-amber-300 mb-6 shadow-lg shadow-black/40">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Trải nghiệm nghỉ dưỡng chuẩn mực 5 sao quốc tế</span>
        </div>

        {/* Poetic & Display Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 max-w-4xl mx-auto leading-tight sm:leading-tight">
          Nghỉ Dưỡng Thượng Lưu Giữa <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 italic">
            Miền Di Sản & Biển Ngọc
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
          Chuỗi 6 kiệt tác resort của AuraResort trải dài khắp Việt Nam. Đặt phòng trực tuyến linh hoạt, thanh toán tức thì với VNPay/MoMo và tận hưởng trợ lý ảo AI 24/7 đồng hành suốt chuyến đi.
        </p>

        {/* Quick Destination Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => onCityChange(c === 'Tất cả' ? '' : c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                (selectedCity === '' && c === 'Tất cả') || selectedCity === c
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30'
                  : 'bg-stone-900/60 backdrop-blur-sm text-stone-300 hover:bg-stone-800/80 border border-stone-700/60'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Floating Search & Booking Engine Container */}
        <div className="mt-8 bg-stone-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/80 max-w-4xl mx-auto" id="search-booking-bar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Field 1: Destination / Branch */}
            <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60 hover:border-amber-500/50 transition-colors">
              <label className="block text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Chi nhánh / Điểm đến
              </label>
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full bg-transparent text-stone-100 font-medium text-sm focus:outline-none cursor-pointer"
                id="search-city-select"
              >
                <option value="" className="bg-stone-900 text-stone-200">Tất cả chi nhánh (6 Resorts)</option>
                <option value="Đà Nẵng" className="bg-stone-900 text-stone-200">Đà Nẵng - Biển Mỹ Khê</option>
                <option value="Sa Pa" className="bg-stone-900 text-stone-200">Sa Pa - Thung lũng Mường Hoa</option>
                <option value="Hội An" className="bg-stone-900 text-stone-200">Hội An - Sông Hoài Di Sản</option>
                <option value="Phú Quốc" className="bg-stone-900 text-stone-200">Phú Quốc - Đảo Ngọc Bãi Dài</option>
                <option value="Ninh Bình" className="bg-stone-900 text-stone-200">Ninh Bình - Tràng An Tam Cốc</option>
                <option value="Đà Lạt" className="bg-stone-900 text-stone-200">Đà Lạt - Hồ Tuyền Lâm</option>
              </select>
            </div>

            {/* Field 2: Check-in Date */}
            <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60 hover:border-amber-500/50 transition-colors">
              <label className="block text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Ngày nhận phòng
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => onCheckInChange(e.target.value)}
                className="w-full bg-transparent text-stone-100 font-medium text-sm focus:outline-none [color-scheme:dark] cursor-pointer"
                id="search-checkin-date"
              />
            </div>

            {/* Field 3: Check-out Date */}
            <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60 hover:border-amber-500/50 transition-colors">
              <label className="block text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Ngày trả phòng
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="w-full bg-transparent text-stone-100 font-medium text-sm focus:outline-none [color-scheme:dark] cursor-pointer"
                id="search-checkout-date"
              />
            </div>

            {/* Field 4: Guests & Action */}
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60 hover:border-amber-500/50 transition-colors">
                <label className="block text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Số lượng khách
                </label>
                <select
                  value={guests}
                  onChange={(e) => onGuestsChange(Number(e.target.value))}
                  className="w-full bg-transparent text-stone-100 font-medium text-sm focus:outline-none cursor-pointer"
                  id="search-guests-select"
                >
                  <option value={1} className="bg-stone-900 text-stone-200">1 Khách (Đi một mình)</option>
                  <option value={2} className="bg-stone-900 text-stone-200">2 Khách (Cặp đôi / Bạn bè)</option>
                  <option value={3} className="bg-stone-900 text-stone-200">3 Khách (Gia đình nhỏ)</option>
                  <option value={4} className="bg-stone-900 text-stone-200">4+ Khách (Gia đình / Biệt thự)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button & Highlights bar */}
          <div className="mt-4 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cam kết giá tốt nhất
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-400" /> Thanh toán an toàn 100%
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenChat}
                type="button"
                className="hidden md:flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium px-4 py-3 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Nhờ AI gợi ý phòng</span>
              </button>

              <button
                onClick={onSearch}
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold px-8 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
                id="search-submit-btn"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Tìm Phòng Nghỉ Dưỡng</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
