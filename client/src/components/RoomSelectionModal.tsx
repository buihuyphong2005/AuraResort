import React from 'react';
import { X, Users, Maximize2, Bed, Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Hotel, Room } from '../types/index.ts';

interface RoomSelectionModalProps {
  hotel: Hotel;
  rooms: Room[];
  onClose: () => void;
  onSelectRoom: (room: Room) => void;
}

export const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  hotel,
  rooms,
  onClose,
  onSelectRoom
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 my-auto">
        
        {/* Header with Hotel details */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-start justify-between bg-stone-950/60">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              {hotel.city} • Chi nhánh {hotel.branchCode}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
              Danh Sách Hạng Phòng — {hotel.name}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Giá hiển thị đã bao gồm bữa sáng tự chọn cao cấp, thuế & phí phục vụ.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rooms Listing Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-stone-800/80">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                className="pt-6 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                {/* Room Photo Gallery Preview */}
                <div className="md:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden group shadow-md border border-stone-800">
                  <img
                    src={room.images[0] || hotel.coverImage}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold text-amber-400 border border-stone-800">
                    {room.view}
                  </div>
                </div>

                {/* Room Details & Specifications */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                        {room.name}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${(room.availableRooms ?? (room.isAvailable ? room.totalRooms ?? 1 : 0)) > 0 ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60' : 'text-red-300 bg-red-950/60 border border-red-800/60'}`}>
                        {(room.availableRooms ?? (room.isAvailable ? room.totalRooms ?? 1 : 0)) > 0
                          ? `Còn ${room.availableRooms ?? room.totalRooms ?? 1} phòng`
                          : 'Hết phòng'}
                      </span>
                    </div>

                    {/* Room Meta Badges */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> {room.areaSqm} m²
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-amber-400" /> {room.bedType}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" /> Tối đa {room.capacity} người lớn
                      </span>
                    </div>

                    {/* Amenities Included */}
                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-stone-300">
                      {room.amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-stone-400 font-medium">Giá 1 đêm</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
                          {room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-400">VNĐ</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectRoom(room)}
                      disabled={(room.availableRooms ?? (room.isAvailable ? room.totalRooms ?? 1 : 0)) < 1}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      id={`select-room-${room.id}`}
                    >
                      <span>{(room.availableRooms ?? (room.isAvailable ? room.totalRooms ?? 1 : 0)) > 0 ? 'Chọn phòng & Đặt ngay' : 'Tạm hết phòng'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-400">
              Đang tải danh sách hạng phòng...
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Miễn phí huỷ phòng trước 48 giờ • Hỗ trợ 24/7 qua tổng đài và chatbot AI</span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">
            Tích lũy điểm thưởng hội viên Aura Loyalty Club cho mỗi đêm nghỉ!
          </span>
        </div>

      </div>
    </div>
  );
};
