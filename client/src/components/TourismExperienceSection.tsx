import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, Compass, BookOpen, ChevronRight, MessageSquare } from 'lucide-react';
import { TourismSpot, Hotel } from '../types/index.ts';
import { api } from '../services/api.ts';

interface TourismExperienceSectionProps {
  hotels: Hotel[];
  onOpenChatWithTopic: (topic: string) => void;
  onLocateOnMap: (hotelId: string) => void;
}

export const TourismExperienceSection: React.FC<TourismExperienceSectionProps> = ({
  hotels,
  onOpenChatWithTopic,
  onLocateOnMap
}) => {
  const [spots, setSpots] = useState<TourismSpot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHotelFilter, setSelectedHotelFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSpots();
  }, [selectedHotelFilter, selectedCategory]);

  const loadSpots = async () => {
    setLoading(true);
    try {
      const data = await api.getTourism(selectedHotelFilter || undefined, selectedCategory);
      setSpots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả trải nghiệm' },
    { id: 'Di tích & Tâm linh', label: 'Di tích & Tâm linh' },
    { id: 'Văn hóa bản địa', label: 'Văn hóa bản địa' },
    { id: 'Văn hóa phố cổ', label: 'Văn hóa phố cổ' },
    { id: 'Thiên nhiên & Biển đảo', label: 'Biển đảo & Sinh thái' },
    { id: 'Di sản & Cảnh quan', label: 'Danh thắng Di sản' },
    { id: 'Thiên nhiên & Thể thao', label: 'Trải nghiệm thiên nhiên' },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="tourism-section">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Bản sắc địa phương & Danh thắng
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Gợi Ý Điểm Du Lịch & Trải Nghiệm Văn Hóa
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Chạm vào chiều sâu văn hoá dân tộc cùng các điểm đến đặc sắc liền kề chuỗi resort AuraResort.
          </p>
        </div>

        <button
          onClick={() => onOpenChatWithTopic('Gợi ý cho tôi lịch trình du lịch văn hóa 3 ngày 2 đêm')}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-800/20 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Hỏi AI Lịch Trình Chi Tiết</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-stone-100 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Hotel Branch Dropdown */}
        <select
          value={selectedHotelFilter}
          onChange={(e) => setSelectedHotelFilter(e.target.value)}
          className="bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả các vùng miền (6 Chi nhánh)</option>
          {hotels.map(h => (
            <option key={h.id} value={h.id}>{h.city} - {h.name}</option>
          ))}
        </select>
      </div>

      {/* Experience Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-400">Đang tải điểm đến văn hoá...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spots.map((spot) => (
            <div
              key={spot.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-900/80 backdrop-blur-md text-emerald-200 font-semibold text-[11px] px-2.5 py-1 rounded-full border border-emerald-700/60">
                      {spot.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-stone-200 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> Cách resort: <strong>{spot.distanceKm} km</strong>
                    </span>
                    {spot.suggestedDuration && (
                      <span className="flex items-center gap-1 text-stone-300">
                        <Clock className="w-3.5 h-3.5" /> {spot.suggestedDuration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-800 transition-colors">
                    {spot.name}
                  </h3>

                  {spot.highlight && (
                    <p className="mt-2 text-xs font-semibold text-amber-700 italic">
                      "{spot.highlight}"
                    </p>
                  )}

                  <p className="mt-2 text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {spot.description}
                  </p>

                  {/* Cultural Backstory Note */}
                  {spot.culturalSignificance && (
                    <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-2.5 text-xs text-stone-700">
                      <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{spot.culturalSignificance}</span>
                    </div>
                  )}

                  {spot.bestTimeToVisit && (
                    <p className="mt-3 text-[11px] text-stone-500">
                      Thời điểm lý tưởng: <strong className="text-stone-700">{spot.bestTimeToVisit}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onLocateOnMap(spot.hotelId)}
                  className="text-xs font-semibold text-stone-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" /> Xem vị trí
                </button>

                <button
                  onClick={() => onOpenChatWithTopic(`Tư vấn cho tôi cách đi và kinh nghiệm tham quan ${spot.name}`)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <span>Hỏi kinh nghiệm đi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
