import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Star, Sparkles, Compass, Eye, BedDouble } from 'lucide-react';
import { Hotel, TourismSpot } from '../types/index.ts';

interface HotelMapProps {
  hotels: Hotel[];
  tourismSpots: TourismSpot[];
  selectedHotelId: string | null;
  onSelectHotel: (hotelId: string) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const HotelMap: React.FC<HotelMapProps> = ({
  hotels,
  tourismSpots,
  selectedHotelId,
  onSelectHotel,
  onBookHotel
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [showTourismLayers, setShowTourismLayers] = useState(true);
  const [activeBranchId, setActiveBranchId] = useState<string>(hotels[0]?.id || 'hotel-danang');

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      // Dynamically import Leaflet in browser
      const L = (await import('leaflet')).default;

      // Fix marker icon default assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && isMounted) {
        // Center of Vietnam overview
        const map = L.map(mapContainerRef.current, {
          center: [16.0544, 108.2439],
          zoom: 6,
          scrollWheelZoom: false
        });

        // Use public OpenStreetMap tiles that do not require an API key.
        L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      renderMarkers(L);
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [hotels, showTourismLayers]);

  // Handle selected hotel pan / flyTo
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedHotelId) return;
    const target = hotels.find(h => h.id === selectedHotelId);
    if (target) {
      setActiveBranchId(target.id);
      mapInstanceRef.current.flyTo([target.coordinates.lat, target.coordinates.lng], 13, {
        duration: 1.5
      });
    }
  }, [selectedHotelId, hotels]);

  const renderMarkers = async (L: any) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom Hotel Branch Icon (Gold Luxury Crown Badge)
    const hotelIcon = L.divIcon({
      className: 'custom-hotel-pin',
      html: `
        <div style="background: linear-gradient(135deg, #d97706, #f59e0b); color: #1c1917; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4); border: 2.5px solid #ffffff; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -20]
    });

    // Custom Tourism & Cultural Experience Icon (Emerald Gem Badge)
    const cultureIcon = L.divIcon({
      className: 'custom-culture-pin',
      html: `
        <div style="background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35); border: 2px solid #ffffff; cursor: pointer;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -15]
    });

    // Add Hotel Markers
    hotels.forEach(h => {
      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 240px; padding: 2px;">
          <div style="height: 110px; border-radius: 10px; overflow: hidden; margin-bottom: 8px;">
            <img src="${h.coverImage}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 600;">⭐ ${h.rating} (${h.reviewCount} đánh giá)</span>
            <span style="font-size: 11px; color: #78716c;">${h.city}</span>
          </div>
          <h3 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 4px 0;">${h.name}</h3>
          <p style="font-size: 11px; color: #57534e; margin-bottom: 8px; line-height: 1.4;">${h.address}</p>
          <div style="font-size: 12px; font-weight: 700; color: #b45309; margin-bottom: 8px;">
            Từ ${h.priceStarting.toLocaleString()} VNĐ/đêm
          </div>
          <button id="popup-book-${h.id}" style="width: 100%; background: #d97706; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 12px; cursor: pointer;">
            Xem phòng & Đặt ngay
          </button>
        </div>
      `;

      const marker = L.marker([h.coordinates.lat, h.coordinates.lng], { icon: hotelIcon })
        .addTo(map)
        .bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-book-${h.id}`);
        if (btn) {
          btn.onclick = () => {
            onBookHotel(h);
          };
        }
      });

      marker.on('click', () => {
        onSelectHotel(h.id);
        setActiveBranchId(h.id);
      });

      markersRef.current.push(marker);
    });

    // Add Tourism & Culture Spot Markers if layer active
    if (showTourismLayers && tourismSpots) {
      tourismSpots.forEach(spot => {
        const spotPopup = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
            <div style="height: 90px; border-radius: 8px; overflow: hidden; margin-bottom: 6px;">
              <img src="${spot.image}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <span style="font-size: 10px; background: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">🌿 ${spot.category}</span>
            <h4 style="font-size: 13px; font-weight: 700; color: #1c1917; margin: 4px 0;">${spot.name}</h4>
            <p style="font-size: 11px; color: #57534e; margin-bottom: 4px;">Cách resort: <strong>${spot.distanceKm} km</strong></p>
            <p style="font-size: 11px; color: #78716c; font-style: italic; line-height: 1.3;">"${spot.highlight || spot.description}"</p>
          </div>
        `;

        const cultureMarker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon: cultureIcon })
          .addTo(map)
          .bindPopup(spotPopup);

        markersRef.current.push(cultureMarker);
      });
    }
  };

  const handleFlyToBranch = (hotel: Hotel) => {
    setActiveBranchId(hotel.id);
    onSelectHotel(hotel.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hotel.coordinates.lat, hotel.coordinates.lng], 13, {
        duration: 1.2
      });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-100/70 border-y border-stone-200" id="map-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" /> Bản đồ vị trí chi tiết & Điểm đến văn hoá
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Toạ Độ Vàng Của Chuỗi AuraResort
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl">
              Khám phá vị trí đắc địa của từng chi nhánh resort và các di sản văn hóa, danh thắng đặc sắc liền kề.
            </p>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTourismLayers(!showTourismLayers)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showTourismLayers
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-700/20'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showTourismLayers ? 'Đang hiện điểm văn hóa' : 'Hiện điểm văn hoá'}</span>
            </button>
          </div>
        </div>

        {/* Map & Branch Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-stone-300/40 border border-stone-200">
          
          {/* Left / Top: Interactive Branch Switcher */}
          <div className="lg:col-span-4 flex flex-col h-[320px] lg:h-[580px] overflow-hidden">
            <div className="p-3 border-b border-stone-100 bg-stone-50/70 rounded-t-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 tracking-wide uppercase">
                6 Chi nhánh khách sạn
              </span>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                Click để định vị
              </span>
            </div>

            <div className="overflow-y-auto divide-y divide-stone-100 flex-1 pr-1 space-y-1 py-1">
              {hotels.map(h => {
                const isActive = activeBranchId === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => handleFlyToBranch(h)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 items-center ${
                      isActive
                        ? 'bg-amber-50/90 border border-amber-300 shadow-sm'
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <img
                      src={h.coverImage}
                      alt={h.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                          {h.city}
                        </span>
                        <span className="text-[11px] font-bold text-stone-800 flex items-center gap-0.5">
                          ⭐ {h.rating}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">
                        {h.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        {h.address}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700">
                          {h.priceStarting.toLocaleString()}đ<span className="text-[10px] font-normal text-stone-500">/đêm</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookHotel(h);
                          }}
                          className="text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded-md transition-colors"
                        >
                          Đặt ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right / Main: Detailed Interactive Map Canvas */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[480px] lg:h-[580px] rounded-2xl overflow-hidden border border-stone-200">
            <div ref={mapContainerRef} className="w-full h-full z-0" id="leaflet-map-canvas" />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/80 shadow-lg text-[11px] space-y-1.5 hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-sm inline-block"></span>
                <span className="font-semibold text-stone-800">Chi nhánh AuraResort</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-sm inline-block"></span>
                <span className="text-stone-600">Điểm di sản & văn hoá địa phương</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
