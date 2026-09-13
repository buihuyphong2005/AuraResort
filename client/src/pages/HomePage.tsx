import React from 'react';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Clock, 
  BookOpen, 
  ChevronRight,
  Heart,
  Crown
} from 'lucide-react';
import { Hotel, Article, TourismSpot } from '../types/index.ts';

interface HomePageProps {
  hotels: Hotel[];
  articles: Article[];
  tourismSpots: TourismSpot[];
  onNavigate: (page: string) => void;
  onSelectHotelForBooking: (hotel: Hotel) => void;
  onOpenChatWithTopic: (topic: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  hotels,
  articles,
  tourismSpots,
  onNavigate,
  onSelectHotelForBooking,
  onOpenChatWithTopic
}) => {
  return (
    <div className="space-y-20 pb-20 animate-fadeIn">
      
      {/* 1. Picturesque Hero Banner */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with warm overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920&auto=format&fit=crop"
            alt="AuraResort Vietnam Luxury Landscape"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-stone-100 py-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-300 mb-6">
            <Crown className="w-4 h-4 text-amber-400" /> Hệ Thống 6 Khu Nghỉ Dưỡng Thượng Lưu Việt Nam
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-100 leading-[1.1] mb-6">
            Tuyệt Tác Nghỉ Dưỡng <br />
            <span className="italic font-light text-amber-300">Giao Hòa Non Nước & Văn Hóa</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-lg leading-relaxed font-light mb-10">
            Từ biển mây Sa Pa huyền ảo, bến hoa đăng sông Hoài cổ kính đến bờ cát trắng ngọc bích Phú Quốc. Tận hưởng kỳ nghỉ trong mơ cùng hệ sinh thái dịch vụ 5 sao chuẩn mực.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('hotels')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold px-8 py-4 rounded-2xl text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
            >
              <span>Khám Phá & Đặt Phòng Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('articles')}
              className="flex items-center gap-2 bg-stone-900/80 hover:bg-stone-900 backdrop-blur-md text-stone-100 font-semibold px-6 py-4 rounded-2xl text-sm sm:text-base border border-stone-700/80 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Đọc Cẩm Nang Du Lịch</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Brand Heritage & Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Triết Lý Nghỉ Dưỡng Aura
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
              Tôn Vinh Vẻ Đẹp Bản Địa & Chuẩn Mực Hiếu Khách
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
              Mỗi chi nhánh trong chuỗi AuraResort là một tác phẩm kiến trúc độc bản, chắt lọc tinh hoa văn hóa truyền thống của từng vùng miền kết hợp cùng tiện nghi đương đại 5 sao. Chúng tôi tin rằng một chuyến đi trọn vẹn không chỉ là nơi ngả lưng, mà là một hành trình kết nối sâu sắc với đất trời và tâm hồn bản xứ.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="font-serif text-2xl font-bold text-amber-800 block">6 Vùng Miền</span>
                <span className="text-xs text-stone-500 mt-1 block">Tọa lạc tại các danh thắng đẹp nhất Việt Nam</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="font-serif text-2xl font-bold text-amber-800 block">4.92 / 5.0</span>
                <span className="text-xs text-stone-500 mt-1 block">Điểm hài lòng từ hơn 2,500 lượt khách quốc tế</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
              alt="Aura Luxury Villa"
              className="rounded-3xl object-cover h-64 w-full shadow-md hover:scale-102 transition-transform duration-500"
            />
            <img
              src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600&auto=format&fit=crop"
              alt="Hoi An Heritage"
              className="rounded-3xl object-cover h-64 w-full shadow-md mt-6 hover:scale-102 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      {/* 3. Featured 6 Hotel Branches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-800 bg-amber-100/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-700" /> Hệ Thống Chi Nhánh
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Bộ Sưu Tập 6 Khu Nghỉ Dưỡng Danh Giá
            </h2>
            <p className="mt-2 text-stone-600 text-xs sm:text-sm">
              Trải dài từ núi cao Tây Bắc đến các vịnh biển ngọc bích phương Nam.
            </p>
          </div>

          <button
            onClick={() => onNavigate('hotels')}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-2xl transition-colors cursor-pointer w-fit"
          >
            <span>Xem tất cả chi nhánh & đặt phòng</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.slice(0, 6).map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={hotel.coverImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 font-semibold text-[11px] px-3 py-1 rounded-full border border-stone-700/60">
                      {hotel.city}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-stone-200 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{hotel.rating}</span>
                      <span className="text-stone-300 text-[11px]">({hotel.reviewCount} đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-800 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-medium mt-1 italic">
                    "{hotel.tagline}"
                  </p>
                  <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Giá từ</span>
                  <span className="font-mono text-base font-bold text-amber-800">
                    {hotel.priceStarting.toLocaleString()} VNĐ
                  </span>
                </div>

                <button
                  onClick={() => onSelectHotelForBooking(hotel)}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Đặt Phòng
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED TRAVEL ARTICLES (Bài viết du lịch & văn hoá) */}
      <section className="bg-stone-950 text-stone-100 py-16 sm:py-20 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Bài Viết & Cẩm Nang Du Lịch
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight">
                Cảm Hứng Khám Phá Địa Phương
              </h2>
              <p className="mt-3 text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Những câu chuyện văn hóa, bí quyết săn mây, ngắm san hô và trải nghiệm ẩm thực được đúc kết từ các chuyên gia bản xứ.
              </p>
            </div>

            <button
              onClick={() => onNavigate('articles')}
              className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-stone-900 hover:bg-stone-800 border border-stone-800 px-5 py-3 rounded-2xl transition-all cursor-pointer w-fit"
            >
              <span>Xem Tất Cả Bài Viết</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('articles')}
                className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase bg-amber-500 text-stone-950 px-2 py-0.5 rounded-md">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-2">
                      <Clock className="w-3 h-3" /> {art.readTime}
                      <span>•</span>
                      <span>{art.publishedDate}</span>
                    </div>

                    <h3 className="font-serif font-bold text-stone-100 text-sm group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-stone-400 mt-2 line-clamp-3 leading-relaxed font-light">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span>{art.author.name}</span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Đọc tiếp →
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Cultural Experiences Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700" /> Trải Nghiệm Văn Hóa Địa Phương
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Chạm Vào Chiều Sâu Di Sản
          </h2>
          <p className="mt-2 text-stone-600 text-xs sm:text-sm">
            Mỗi điểm dừng chân mang đến một bản sắc văn hoá phong phú đang chờ quý khách thưởng ngoạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourismSpots.slice(0, 6).map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <img
                src={spot.image}
                alt={spot.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-100"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
                  {spot.category}
                </span>
                <h4 className="font-serif font-bold text-sm text-stone-900 truncate mt-0.5">
                  {spot.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {spot.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-2">
                  <span>Cách resort {spot.distanceKm} km</span>
                  <button
                    onClick={() => onOpenChatWithTopic(`Tư vấn cho tôi đi ${spot.name}`)}
                    className="text-amber-700 hover:underline font-semibold cursor-pointer"
                  >
                    Hỏi AI đi lại →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bank Payment & Assurance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              An Tâm Tuyệt Đối
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Hệ Thống Thanh Toán Ngân Hàng Tự Động 24/7
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
              Hỗ trợ quét mã VietQR chuyển khoản liên ngân hàng miễn phí hoặc quẹt thẻ ATM / Visa / Mastercard bảo mật SSL 256-bit. Xác nhận tức thì và xuất vé điện tử ngay khi hoàn tất.
            </p>
          </div>

          <button
            onClick={() => onNavigate('hotels')}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-4 rounded-2xl text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            Bắt Đầu Kỳ Nghỉ Của Bạn
          </button>
        </div>
      </section>

    </div>
  );
};
