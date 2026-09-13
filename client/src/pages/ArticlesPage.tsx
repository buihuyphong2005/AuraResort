import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  ArrowRight, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  X,
  Compass,
  MessageSquare
} from 'lucide-react';
import { Article, Hotel } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ArticlesPageProps {
  hotels: Hotel[];
  onBookHotelBranch: (hotel: Hotel) => void;
  onOpenChatWithTopic: (topic: string) => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({
  hotels,
  onBookHotelBranch,
  onOpenChatWithTopic
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, selectedHotelId]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await api.getArticles(selectedHotelId || undefined, selectedCategory);
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Tất Cả Bài Viết' },
    { id: 'Cẩm Nang Nghỉ Dưỡng', label: 'Cẩm Nang Nghỉ Dưỡng' },
    { id: 'Văn Hóa Bản Địa', label: 'Văn Hóa Bản Địa' },
    { id: 'Kỳ Nghỉ Biển Đảo', label: 'Kỳ Nghỉ Biển Đảo' },
    { id: 'Danh Thắng Di Sản', label: 'Danh Thắng Di Sản' }
  ];

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      
      {/* Page Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-amber-800 bg-amber-100/90 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-4 h-4 text-amber-700" /> Tạp Chí & Cẩm Nang Du Lịch Aura
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Hành Trình Chạm Vào Bản Sắc Việt
        </h1>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          Khám phá những câu chuyện văn hóa trầm tích, vẻ đẹp non nước mây trời và bí quyết tận hưởng trọn vẹn từng kỳ nghỉ thượng lưu.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-700 text-white shadow-md shadow-amber-700/20'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Destination Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 whitespace-nowrap">Điểm đến:</span>
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="">Tất cả vùng miền (6 Chi nhánh)</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.city} - {h.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Featured / Grid of Articles */}
      {loading ? (
        <div className="text-center py-20 text-stone-400">Đang tải bài viết...</div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image Container */}
                <div 
                  onClick={() => setActiveArticle(art)}
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                >
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600/90 backdrop-blur-md text-white font-semibold text-[11px] px-3 py-1 rounded-full shadow">
                      {art.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-stone-200 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {art.location}
                    </span>
                    <span className="flex items-center gap-1 text-stone-300">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" /> {art.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="text-amber-700 font-semibold">{art.author.role}</span>
                  </div>

                  <h2 
                    onClick={() => setActiveArticle(art)}
                    className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug tracking-tight group-hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    {art.title}
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={art.author.avatar}
                    alt={art.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                  <span className="text-xs font-semibold text-stone-800">{art.author.name}</span>
                </div>

                <button
                  onClick={() => setActiveArticle(art)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Đọc bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 text-stone-500">
          Chưa tìm thấy bài viết nào cho danh mục này.
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full text-stone-900 shadow-2xl overflow-hidden my-auto animate-fadeIn max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold">{activeArticle.category}</span>
                <span className="text-stone-500">•</span>
                <span className="text-stone-300">{activeArticle.location}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
                {activeArticle.title}
              </h1>

              {/* Author byline */}
              <div className="flex items-center justify-between border-y border-stone-100 py-3.5">
                <div className="flex items-center gap-3">
                  <img
                    src={activeArticle.author.avatar}
                    alt={activeArticle.author.name}
                    className="w-11 h-11 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{activeArticle.author.name}</h4>
                    <p className="text-[11px] text-stone-500">{activeArticle.author.role}</p>
                  </div>
                </div>

                <div className="text-right text-xs text-stone-500">
                  <span>{activeArticle.publishedDate}</span>
                  <span className="block text-[11px] text-stone-400">{activeArticle.readTime}</span>
                </div>
              </div>

              {/* Feature Hero Image */}
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>

              {/* Lead Excerpt */}
              <blockquote className="p-4 bg-amber-50/70 border-l-4 border-amber-600 rounded-r-xl text-stone-700 italic text-sm sm:text-base leading-relaxed">
                "{activeArticle.excerpt}"
              </blockquote>

              {/* Body Content */}
              <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line font-light">
                {activeArticle.content}
              </div>

              {/* Bottom Hotel Booking CTA for this branch */}
              {activeArticle.hotelId && (
                <div className="mt-8 p-6 bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-amber-400 uppercase font-bold tracking-widest block">
                      Trải nghiệm thực tế
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-100 mt-0.5">
                      Nghỉ dưỡng ngay tại chi nhánh này
                    </h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Đặt phòng trực tuyến nhận ngay ưu đãi 15% - 25% cùng trà chiều đặc sản.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const target = hotels.find(h => h.id === activeArticle.hotelId);
                        if (target) {
                          setActiveArticle(null);
                          onBookHotelBranch(target);
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-colors"
                    >
                      Đặt Phòng Ngay
                    </button>

                    <button
                      onClick={() => {
                        setActiveArticle(null);
                        onOpenChatWithTopic(`Tư vấn cho tôi lịch trình dựa trên bài viết "${activeArticle.title}"`);
                      }}
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                      title="Hỏi trợ lý AI"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
