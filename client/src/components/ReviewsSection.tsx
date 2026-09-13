import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, CheckCircle, PlusCircle, X, Sparkles, Filter } from 'lucide-react';
import { Hotel, Review } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ReviewsSectionProps {
  hotels: Hotel[];
  selectedHotelId: string;
  onSelectHotelId: (id: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  hotels,
  selectedHotelId,
  onSelectHotelId
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form state
  const [formHotelId, setFormHotelId] = useState(selectedHotelId || hotels[0]?.id || 'hotel-danang');
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formCleanRating, setFormCleanRating] = useState(5);
  const [formServiceRating, setFormServiceRating] = useState(5);
  const [formLocationRating, setFormLocationRating] = useState(5);
  const [formRoomType, setFormRoomType] = useState('Ocean Panoramic Suite');
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const activeHotel = hotels.find(h => h.id === selectedHotelId) || hotels[0];

  useEffect(() => {
    if (selectedHotelId) {
      loadReviews(selectedHotelId);
      setFormHotelId(selectedHotelId);
    }
  }, [selectedHotelId]);

  const loadReviews = async (hotelId: string) => {
    setLoading(true);
    try {
      const data = await api.getReviews(hotelId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      const updated = await api.likeReview(reviewId);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.addReview({
        hotelId: formHotelId,
        customerName: formName,
        rating: formRating,
        cleanRating: formCleanRating,
        serviceRating: formServiceRating,
        locationRating: formLocationRating,
        roomType: formRoomType,
        comment: formComment
      });

      setReviews([created, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddModal(false);
        setFormComment('');
      }, 1500);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="reviews-section">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-700" /> Trải nghiệm thực tế của khách hàng
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Đánh Giá Trực Tuyến Từng Chi Nhánh
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-2xl">
            Lắng nghe cảm nhận chân thực từ những du khách đã từng nghỉ dưỡng tại chuỗi resort.
          </p>
        </div>

        {/* Action button: Write review */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          id="btn-write-review"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gửi Đánh Giá Của Bạn</span>
        </button>
      </div>

      {/* Hotel Branch Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {hotels.map(h => (
          <button
            key={h.id}
            onClick={() => onSelectHotelId(h.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedHotelId === h.id
                ? 'bg-amber-700 text-white shadow-md shadow-amber-700/20'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{h.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedHotelId === h.id ? 'bg-amber-800 text-amber-200' : 'bg-stone-100 text-stone-500'
            }`}>
              ⭐ {h.rating}
            </span>
          </button>
        ))}
      </div>

      {/* Branch Rating Scoreboard */}
      {activeHotel && (
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 mb-10 border border-stone-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-stone-800 pb-6 md:pb-0 md:pr-6">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
              Điểm tổng thể chi nhánh
            </span>
            <div className="font-serif text-5xl sm:text-6xl font-bold text-stone-100 mt-2 flex items-baseline justify-center md:justify-start gap-2">
              <span>{activeHotel.rating}</span>
              <span className="text-xl text-amber-400 font-sans">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Dựa trên {reviews.length} lượt đánh giá thực tế từ khách đã lưu trú
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              <span className="text-stone-400 block mb-1">Độ sạch sẽ & Vệ sinh</span>
              <span className="font-serif text-2xl font-bold text-amber-400">4.9 / 5</span>
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[98%]" />
              </div>
            </div>

            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              <span className="text-stone-400 block mb-1">Dịch vụ & Thái độ</span>
              <span className="font-serif text-2xl font-bold text-amber-400">5.0 / 5</span>
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[100%]" />
              </div>
            </div>

            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              <span className="text-stone-400 block mb-1">Vị trí & Cảnh quan</span>
              <span className="font-serif text-2xl font-bold text-amber-400">4.9 / 5</span>
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[98%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-400">Đang tải danh sách đánh giá...</div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.customerAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${review.customerName}`}
                      alt={review.customerName}
                      className="w-11 h-11 rounded-full bg-stone-100 object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <span>{review.customerName}</span>
                        {review.verifiedBooking && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium" title="Khách hàng đã đặt phòng và lưu trú thực tế">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Đã lưu trú
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-stone-400">Hạng phòng: {review.roomType} • {review.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{review.rating}.0</span>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  "{review.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="text-[11px]">Đánh giá hữu ích?</span>
                <button
                  onClick={() => handleLike(review.id)}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-amber-700 px-2 py-1 rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{review.likes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 text-stone-500">
          Chưa có đánh giá nào cho chi nhánh này. Hãy là người đầu tiên chia sẻ cảm nhận!
        </div>
      )}

      {/* Modal: Write New Review */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold">Viết Đánh Giá Trực Tuyến</h3>
                <p className="text-xs text-stone-400">Chia sẻ trải nghiệm nghỉ dưỡng của bạn với cộng đồng</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-100">Gửi đánh giá thành công!</h4>
                <p className="text-xs text-stone-400">Cảm ơn quý khách đã đóng góp ý kiến quý báu.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Chi nhánh khách sạn *</label>
                  <select
                    value={formHotelId}
                    onChange={(e) => setFormHotelId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                  >
                    {hotels.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Trần Minh Quân"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Số sao đánh giá tổng quan (1 - 5 sao) *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setFormRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${s <= formRating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'}`} />
                      </button>
                    ))}
                    <span className="font-bold text-amber-400 ml-2">{formRating} / 5 sao</span>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Hạng phòng đã ở</label>
                  <input
                    type="text"
                    value={formRoomType}
                    onChange={(e) => setFormRoomType(e.target.value)}
                    placeholder="VD: Ocean Suite, Mountain Villa..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Nội dung cảm nhận chi tiết *</label>
                  <textarea
                    rows={4}
                    required
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Chia sẻ về phòng ốc, phong cảnh, chất lượng ẩm thực, phong cách phục vụ..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá ngay'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
