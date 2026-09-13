import React from 'react';
import { MapPin, Star, Sparkles, BedDouble, ChevronRight, Phone, Mail, Compass } from 'lucide-react';
import { Hotel } from '../types/index.ts';

interface HotelListProps {
  hotels: Hotel[];
  onSelectHotelForBooking: (hotel: Hotel) => void;
  onLocateOnMap: (hotelId: string) => void;
  onSelectHotelForReviews: (hotelId: string) => void;
}

export const HotelList: React.FC<HotelListProps> = ({
  hotels,
  onSelectHotelForBooking,
  onLocateOnMap,
  onSelectHotelForReviews
}) => {
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="hotels">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100/80 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Bộ Sưu Tập Resort Đẳng Cấp
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Khám Phá 6 Chi Nhánh AuraResort
        </h2>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed font-light">
          Mỗi khu nghỉ dưỡng là một bản hòa ca giữa thiên nhiên tráng lệ, kiến trúc đỉnh cao và lòng hiếu khách nồng hậu thuần Việt.
        </p>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            id={`hotel-card-${hotel.id}`}
          >
            {/* Top Image Section */}
            <div>
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={hotel.coverImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80" />

                {/* City & Rating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-stone-900/80 backdrop-blur-md text-amber-400 font-semibold text-xs px-3 py-1 rounded-full border border-stone-700/80 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {hotel.city}
                  </span>
                  <button
                    onClick={() => onSelectHotelForReviews(hotel.id)}
                    className="bg-white/95 backdrop-blur-md text-stone-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-amber-50 cursor-pointer"
                    title="Xem đánh giá khách hàng"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{hotel.rating}</span>
                    <span className="text-stone-500 font-normal">({hotel.reviewCount})</span>
                  </button>
                </div>

                {/* Tagline on image bottom */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-stone-200 text-xs italic font-serif truncate">
                    "{hotel.tagline}"
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6">
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-1">
                  Mã chi nhánh: {hotel.branchCode}
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-800 transition-colors">
                  {hotel.name}
                </h3>
                
                <p className="text-xs text-stone-500 mt-2 line-clamp-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{hotel.address}</span>
                </p>

                <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                  {hotel.description}
                </p>

                {/* Amenities Pills */}
                <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-100 text-stone-700 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="text-[11px] text-stone-400 px-1 py-1">
                      +{hotel.amenities.length - 3} tiện ích
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer: Price & CTA */}
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider block">
                  Giá khởi điểm
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-lg sm:text-xl font-bold text-amber-800">
                    {hotel.priceStarting.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">VNĐ/đêm</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLocateOnMap(hotel.id)}
                  className="p-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-amber-700 hover:border-amber-400 hover:bg-amber-50/50 transition-colors cursor-pointer"
                  title="Định vị trên bản đồ chi tiết"
                >
                  <Compass className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectHotelForBooking(hotel)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer hover:shadow-lg"
                  id={`btn-book-${hotel.id}`}
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>Chọn phòng</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
