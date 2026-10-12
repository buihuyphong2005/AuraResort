import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  Sparkles, 
  BedDouble, 
  ChevronRight, 
  Compass, 
  Users, 
  Maximize2, 
  Bed, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Hotel, Room } from '../types/index.ts';
import { api } from '../services/api.ts';

interface HotelListProps {
  hotels: Hotel[];
  onSelectHotelForBooking: (hotel: Hotel, room?: Room) => void;
  onLocateOnMap: (hotelId: string) => void;
  onSelectHotelForReviews: (hotelId: string) => void;
}

export const HotelList: React.FC<HotelListProps> = ({
  hotels,
  onSelectHotelForBooking,
  onLocateOnMap,
  onSelectHotelForReviews
}) => {
  // Local fallback rooms map if hotel.rooms is not populated initially
  const [roomsMap, setRoomsMap] = useState<Record<string, Room[]>>({});

  useEffect(() => {
    // For any hotel that doesn't have rooms attached in props, fetch rooms to guarantee at least 3 room types
    hotels.forEach(async (hotel) => {
      if (!hotel.rooms || hotel.rooms.length === 0) {
        try {
          const rooms = await api.getRoomsByHotel(hotel.id);
          if (rooms && rooms.length > 0) {
            setRoomsMap((prev) => ({ ...prev, [hotel.id]: rooms }));
          }
        } catch (err) {
          console.error(`Không thể tải hạng phòng cho ${hotel.name}:`, err);
        }
      }
    });
  }, [hotels]);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="hotels">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100/80 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Bộ Sưu Tập Resort Đẳng Cấp
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Hệ Thống {hotels.length} Chi Nhánh AuraResort
        </h2>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed font-light">
          Mỗi chi nhánh sở hữu tối thiểu 3 hạng phòng cao cấp từ Deluxe, Suite đến Villa hồ bơi riêng, đáp ứng trọn vẹn mọi nhu cầu nghỉ dưỡng.
        </p>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {hotels.map((hotel) => {
          // Resolve rooms for this branch: props or fetched map
          const availableRooms: Room[] = (hotel.rooms && hotel.rooms.length > 0)
            ? hotel.rooms
            : (roomsMap[hotel.id] || []);

          // Display at least 3 room types prominently
          const topRooms = availableRooms.slice(0, 3);

          return (
            <div
              key={hotel.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              id={`hotel-card-${hotel.id}`}
            >
              <div>
                {/* Top Image Section */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={hotel.coverImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-90" />

                  {/* City & Rating Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-stone-900/85 backdrop-blur-md text-amber-400 font-semibold text-xs px-3 py-1 rounded-full border border-stone-700/80 flex items-center gap-1.5 shadow-md">
                      <MapPin className="w-3.5 h-3.5" /> {hotel.city}
                    </span>
                    <button
                      onClick={() => onSelectHotelForReviews(hotel.id)}
                      className="bg-white/95 backdrop-blur-md text-stone-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-amber-50 cursor-pointer transition-colors"
                      title="Xem đánh giá khách hàng"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{hotel.rating}</span>
                      <span className="text-stone-500 font-normal">({hotel.reviewCount})</span>
                    </button>
                  </div>

                  {/* Tagline & Branch Code overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                    <p className="text-stone-100 text-xs sm:text-sm italic font-serif truncate drop-shadow-sm">
                      "{hotel.tagline}"
                    </p>
                    <span className="bg-amber-600/90 text-white font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      {hotel.branchCode}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-800 transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1.5 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{hotel.address}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>

                  {/* Amenities Highlights */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
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
                        +{hotel.amenities.length - 3} tiện ích khác
                      </span>
                    )}
                  </div>

                  {/* PROMINENT SECTION: 3 HẠNG PHÒNG TẠI CHI NHÁNH */}
                  <div className="mt-6 pt-5 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                          <BedDouble className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          Các Hạng Phòng Tại Chi Nhánh ({topRooms.length} hạng phòng)
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200/60">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        3 Lựa chọn tiêu biểu
                      </span>
                    </div>

                    {/* Room list items: minimum 3 room types */}
                    <div className="space-y-3">
                      {topRooms.length > 0 ? (
                        topRooms.map((room) => (
                          <div
                            key={room.id}
                            className="group/room p-3 rounded-2xl bg-stone-50/80 hover:bg-amber-50/60 border border-stone-200/90 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="flex items-center gap-3">
                              {/* Room photo */}
                              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-inner relative">
                                <img
                                  src={room.images?.[0] || hotel.coverImage}
                                  alt={room.name}
                                  className="w-full h-full object-cover group-hover/room:scale-110 transition-transform duration-500"
                                />
                                <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] text-amber-300 font-semibold px-1 rounded">
                                  {room.type}
                                </span>
                              </div>

                              {/* Room specs */}
                              <div>
                                <h4 className="font-serif text-sm font-bold text-stone-900 group-hover/room:text-amber-800 transition-colors line-clamp-1">
                                  {room.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 flex-wrap">
                                  <span className="flex items-center gap-0.5">
                                    <Maximize2 className="w-3 h-3 text-amber-600" /> {room.areaSqm}m²
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <Users className="w-3 h-3 text-amber-600" /> Tối đa {room.capacity} khách
                                  </span>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px] text-stone-600">
                                    {room.view}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Price & Direct Book Button */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60">
                              <div className="text-left sm:text-right">
                                <div className="font-serif text-sm sm:text-base font-bold text-amber-800">
                                  {room.pricePerNight.toLocaleString()}
                                </div>
                                <span className="text-[10px] text-stone-500 font-medium block -mt-0.5">VNĐ / đêm</span>
                              </div>

                              <button
                                onClick={() => onSelectHotelForBooking(hotel, room)}
                                className="flex items-center gap-1 bg-stone-900 hover:bg-amber-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
                                id={`book-room-${room.id}`}
                                title={`Đặt trực tiếp hạng phòng ${room.name}`}
                              >
                                <span>Đặt ngay</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>

                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-xs text-stone-400">
                          Đang tải các hạng phòng của chi nhánh...
                        </div>
                      )}
                    </div>

                    {/* View all room types button */}
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => onSelectHotelForBooking(hotel)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer py-1"
                      >
                        <span>Xem chi tiết tiện ích & toàn bộ {availableRooms.length || 3} hạng phòng</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Card Footer: Starting Price & Primary Actions */}
              <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider block">
                    Giá khởi điểm từ
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
                    title="Định vị chi nhánh trên bản đồ số"
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
          );
        })}
      </div>

    </section>
  );
};
