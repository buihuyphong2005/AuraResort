import React, { useState, useEffect, useCallback } from 'react';
import { Hotel, Room, LoyaltyUser, Booking, Article, Promotion } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Building2, Users, CalendarDays, BookOpen, Tag, BedDouble,
  Edit2, Trash2, RefreshCw, ArrowLeft, ChevronRight,
  TrendingUp, Star, CheckCircle, XCircle, Clock, Eye, Save
} from 'lucide-react';

type AdminView = 'dashboard' | 'hotels' | 'rooms' | 'users' | 'bookings' | 'articles' | 'promotions';

interface AdminPageProps {
  currentUser: LoyaltyUser | null;
  onNavigate: (page: string) => void;
}

/* ─── helpers ─── */
function Spinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ActionBtn({ onClick, icon, color }: { onClick: () => void; icon: React.ReactNode; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${color}`}
    >
      {icon}
    </button>
  );
}

const statusColor: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};
const statusLabel: Record<string, string> = {
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

/* ─── sub-pages ─── */

function HotelsView({ hotels, loading, onRefresh, onViewRooms }: { hotels: Hotel[]; loading: boolean; onRefresh: () => void; onViewRooms: (hotel: Hotel) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-stone-500 text-sm">{hotels.length} chi nhánh khách sạn</p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hotels.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-36 bg-stone-100 relative">
                <img src={h.coverImage} alt={h.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-black/60 text-amber-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {h.rating}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-stone-800 text-sm leading-tight mb-1">{h.name}</h3>
                <p className="text-xs text-stone-500 mb-2">{h.city} · {h.reviewCount} đánh giá</p>
                <p className="text-xs text-stone-400 line-clamp-2">{h.address}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
                  <span className="text-xs bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg text-stone-600">
                    Từ {h.priceStarting.toLocaleString('vi-VN')}đ/đêm
                  </span>
                  <span className="text-xs bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-700">{h.branchCode}</span>
                </div>
              </div>
              <div className="flex border-t border-stone-100">
                <button className="flex-1 py-2.5 text-xs text-stone-500 hover:bg-stone-50 hover:text-amber-700 transition-colors flex items-center justify-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
                <button
                  onClick={() => onViewRooms(h)}
                  className="flex-1 py-2.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors flex items-center justify-center gap-1.5 border-l border-stone-100 cursor-pointer"
                >
                  <BedDouble className="w-3.5 h-3.5" /> Xem phòng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomsView({ rooms, loading, onRefresh, filterHotelId, filterHotelName, onClearFilter }: {
  rooms: Room[];
  loading: boolean;
  onRefresh: () => void;
  filterHotelId?: string | null;
  filterHotelName?: string;
  onClearFilter?: () => void;
}) {
  const displayRooms = filterHotelId ? rooms.filter(r => r.hotelId === filterHotelId) : rooms;
  const [stockValues, setStockValues] = useState<Record<string, string>>({});
  const [savingRoomId, setSavingRoomId] = useState<string | null>(null);
  const [stockFeedback, setStockFeedback] = useState<{ roomId: string; message: string; error: boolean } | null>(null);
  const available = displayRooms.reduce((sum, room) => sum + (room.availableRooms ?? (room.isAvailable ? room.totalRooms ?? 1 : 0)), 0);
  const booked = displayRooms.reduce((sum, room) => sum + Math.max(0, (room.totalRooms ?? 1) - (room.availableRooms ?? (room.isAvailable ? room.totalRooms ?? 1 : 0))), 0);

  const saveRoomStock = async (room: Room) => {
    const totalRooms = Number(stockValues[room.id] ?? room.totalRooms ?? 1);
    if (!Number.isInteger(totalRooms) || totalRooms < 0) {
      setStockFeedback({ roomId: room.id, message: 'Nhập số nguyên không âm', error: true });
      return;
    }
    setSavingRoomId(room.id);
    setStockFeedback(null);
    try {
      await api.updateRoomStock(room.id, totalRooms);
      setStockFeedback({ roomId: room.id, message: 'Đã lưu', error: false });
      await onRefresh();
    } catch (err) {
      setStockFeedback({ roomId: room.id, message: err instanceof Error ? err.message : 'Không thể lưu số lượng', error: true });
    } finally {
      setSavingRoomId(null);
    }
  };

  return (
    <div>
      {/* Hotel filter banner */}
      {filterHotelId && filterHotelName && (
        <div className="mb-4 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
          <BedDouble className="w-5 h-5 text-violet-600 shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-bold text-violet-800">{filterHotelName}</span>
            <span className="text-xs text-violet-500 ml-2">— đang lọc phòng của chi nhánh này</span>
          </div>
          <button
            onClick={onClearFilter}
            className="text-xs text-violet-600 hover:text-violet-900 font-medium border border-violet-300 rounded-lg px-3 py-1.5 hover:bg-violet-100 transition-colors"
          >
            Xem tất cả phòng
          </button>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4">
        <p className="text-stone-500 text-sm flex-1">
          <span className="font-semibold text-stone-800">{displayRooms.length}</span> hạng phòng
          {displayRooms.length > 0 && (
            <> · <span className="text-emerald-600 font-semibold">{available} còn trống</span> · <span className="text-red-500 font-semibold">{booked} đã đặt</span></>
          )}
        </p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Phòng</th>
                {!filterHotelId && <th className="px-5 py-3.5 font-semibold text-stone-600">Khách sạn</th>}
                <th className="px-5 py-3.5 font-semibold text-stone-600">Loại</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Giá/đêm</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Sức chứa</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Số lượng còn / tổng</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Trạng thái</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600 text-right">Cập nhật tồn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayRooms.map(r => (
                <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-stone-800">{r.name}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{r.bedType} · {r.areaSqm}m² · Góc nhìn: {r.view}</div>
                  </td>
                  {!filterHotelId && (
                    <td className="px-5 py-4 text-xs text-stone-500">{r.hotelId}</td>
                  )}
                  <td className="px-5 py-4 text-stone-600">{r.type}</td>
                  <td className="px-5 py-4 font-semibold text-amber-700">{r.pricePerNight.toLocaleString('vi-VN')}đ</td>
                  <td className="px-5 py-4 text-stone-600">{r.capacity} khách</td>
                  <td className="px-5 py-4 font-semibold text-stone-700">
                    {r.availableRooms ?? (r.isAvailable ? r.totalRooms ?? 1 : 0)} / {r.totalRooms ?? 1}
                  </td>
                  <td className="px-5 py-4">
                    {(r.availableRooms ?? (r.isAvailable ? r.totalRooms ?? 1 : 0)) > 0
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Còn trống</span>
                      : <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Đã đặt</span>
                    }
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        aria-label={`Tổng số phòng ${r.name}`}
                        value={stockValues[r.id] ?? String(r.totalRooms ?? 1)}
                        onChange={event => setStockValues(values => ({ ...values, [r.id]: event.target.value }))}
                        className="w-20 rounded-md border border-stone-300 px-2 py-1.5 text-sm text-right focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => saveRoomStock(r)}
                        disabled={savingRoomId === r.id}
                        aria-label={`Lưu số lượng ${r.name}`}
                        title="Lưu số lượng"
                        className="p-2 rounded-md text-stone-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                    {stockFeedback?.roomId === r.id && (
                      <p className={`mt-1 text-xs ${stockFeedback.error ? 'text-red-600' : 'text-emerald-600'}`}>
                        {stockFeedback.message}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayRooms.length === 0 && (
            <p className="text-center text-stone-500 py-12">
              {filterHotelId ? 'Chi nhánh này chưa có phòng nào.' : 'Chưa có dữ liệu phòng.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function UsersView({ users, loading, onRefresh }: { users: LoyaltyUser[]; loading: boolean; onRefresh: () => void }) {
  const tierColor: Record<string, string> = {
    Bronze: 'bg-orange-100 text-orange-700',
    Silver: 'bg-slate-100 text-slate-600',
    Gold: 'bg-yellow-100 text-yellow-700',
    Diamond: 'bg-cyan-100 text-cyan-700',
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-stone-500 text-sm">{users.length} tài khoản</p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Khách hàng</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Liên hệ</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Hạng hội viên</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Điểm</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Phân quyền</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 font-bold text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-stone-800">{u.name}</div>
                        <div className="text-xs text-stone-400">Từ {u.memberSince}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-stone-600">{u.email}</div>
                    <div className="text-xs text-stone-400">{u.phone || '—'}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tierColor[u.tier] || 'bg-stone-100 text-stone-600'}`}>
                      {u.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-stone-700">{u.points?.toLocaleString('vi-VN')} pts</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                      {u.role === 'admin' ? '⚙ Quản trị' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right flex justify-end gap-1">
                    <ActionBtn onClick={() => {}} icon={<Edit2 className="w-4 h-4" />} color="text-stone-400 hover:text-amber-600 hover:bg-amber-50" />
                    <ActionBtn onClick={() => {}} icon={<Trash2 className="w-4 h-4" />} color="text-stone-400 hover:text-red-600 hover:bg-red-50" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-stone-500 py-12">Chưa có dữ liệu khách hàng.</p>}
        </div>
      )}
    </div>
  );
}

function BookingsView({ bookings, loading, onRefresh }: { bookings: Booking[]; loading: boolean; onRefresh: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-stone-500 text-sm">{bookings.length} đơn đặt phòng</p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Mã đặt phòng</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Khách hàng</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Chi nhánh & Phòng</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Check-in / Check-out</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Tổng tiền</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600">Trạng thái</th>
                <th className="px-5 py-3.5 font-semibold text-stone-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-stone-800 text-xs">{b.bookingCode}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-stone-800">{b.customerName}</div>
                    <div className="text-xs text-stone-400">{b.customerEmail}</div>
                    <div className="text-xs text-stone-400">{b.customerPhone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-stone-700">{b.hotelName}</div>
                    <div className="text-xs text-stone-400">{b.roomName}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-stone-700">{new Date(b.checkInDate).toLocaleDateString('vi-VN')}</div>
                    <div className="text-xs text-stone-400">→ {new Date(b.checkOutDate).toLocaleDateString('vi-VN')} ({b.nights} đêm)</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-amber-700">
                    {b.totalAmount.toLocaleString('vi-VN')}đ
                    {b.discountAmount > 0 && <div className="text-xs text-emerald-600">-{b.discountAmount.toLocaleString('vi-VN')}đ giảm</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[b.status] || 'bg-stone-100 text-stone-600'}`}>
                      {b.status === 'confirmed' ? <Clock className="w-3 h-3" /> : b.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {statusLabel[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right flex justify-end gap-1">
                    <ActionBtn onClick={() => {}} icon={<Edit2 className="w-4 h-4" />} color="text-stone-400 hover:text-amber-600 hover:bg-amber-50" />
                    <ActionBtn onClick={() => {}} icon={<Trash2 className="w-4 h-4" />} color="text-stone-400 hover:text-red-600 hover:bg-red-50" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="text-center text-stone-500 py-12">Chưa có đơn đặt phòng.</p>}
        </div>
      )}
    </div>
  );
}

function ArticlesView({ articles, loading, onRefresh }: { articles: Article[]; loading: boolean; onRefresh: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-stone-500 text-sm">{articles.length} bài viết</p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {articles.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 bg-stone-100">
                <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">{a.category}</span>
                  <span className="text-xs text-stone-400">{a.readTime}</span>
                </div>
                <h3 className="font-bold text-stone-800 text-sm leading-snug mb-2 line-clamp-2">{a.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-2">{a.excerpt}</p>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>{a.author.name}</span>
                  <span>{new Date(a.publishedDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="flex border-t border-stone-100">
                <button className="flex-1 py-2.5 text-xs text-stone-500 hover:bg-stone-50 hover:text-amber-700 transition-colors flex items-center justify-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
                <button className="flex-1 py-2.5 text-xs text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5 border-l border-stone-100">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && articles.length === 0 && <p className="text-center text-stone-500 py-12">Chưa có bài viết.</p>}
    </div>
  );
}

function PromotionsView({ promotions, loading, onRefresh }: { promotions: Promotion[]; loading: boolean; onRefresh: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-stone-500 text-sm">{promotions.length} ưu đãi</p>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {promotions.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-400 p-5 text-stone-950">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">{p.badge || 'Ưu đãi'}</span>
                  <span className="text-2xl font-black">-{p.discountPercent}%</span>
                </div>
                <h3 className="font-bold text-base leading-snug">{p.title}</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <code className="bg-stone-100 border border-stone-200 text-stone-800 font-mono text-sm font-bold px-3 py-1 rounded-lg">{p.code}</code>
                  <span className="text-xs text-stone-500">Hạng tối thiểu: <strong>{p.minTier}</strong></span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2">{p.description}</p>
                <p className="text-xs text-stone-400 mt-2">Đến: {new Date(p.validUntil).toLocaleDateString('vi-VN')}</p>
                <p className="text-xs text-stone-400">Giảm tối đa: {p.maxDiscount.toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="flex border-t border-stone-100">
                <button className="flex-1 py-2.5 text-xs text-stone-500 hover:bg-stone-50 hover:text-amber-700 transition-colors flex items-center justify-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
                <button className="flex-1 py-2.5 text-xs text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5 border-l border-stone-100">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && promotions.length === 0 && <p className="text-center text-stone-500 py-12">Chưa có ưu đãi.</p>}
    </div>
  );
}

/* ─── Dashboard Overview ─── */
function DashboardOverview({
  stats,
  onGo,
}: {
  stats: { hotels: number; rooms: number; users: number; bookings: number; articles: number; promotions: number };
  onGo: (v: AdminView) => void;
}) {
  const cards = [
    { view: 'hotels' as AdminView, label: 'Chi nhánh khách sạn', count: stats.hotels, icon: Building2, gradient: 'from-blue-500 to-cyan-500', desc: 'Quản lý tên, địa chỉ, ảnh, tiện ích' },
    { view: 'rooms' as AdminView, label: 'Hạng phòng', count: stats.rooms, icon: BedDouble, gradient: 'from-violet-500 to-purple-500', desc: 'Trạng thái, giá, sức chứa từng phòng' },
    { view: 'users' as AdminView, label: 'Khách hàng', count: stats.users, icon: Users, gradient: 'from-emerald-500 to-teal-500', desc: 'Hồ sơ, hạng hội viên, điểm thưởng' },
    { view: 'bookings' as AdminView, label: 'Đơn đặt phòng', count: stats.bookings, icon: CalendarDays, gradient: 'from-amber-500 to-orange-500', desc: 'Lịch sử, trạng thái, doanh thu' },
    { view: 'articles' as AdminView, label: 'Bài viết du lịch', count: stats.articles, icon: BookOpen, gradient: 'from-rose-500 to-pink-500', desc: 'Cẩm nang, cảnh sắc, văn hóa' },
    { view: 'promotions' as AdminView, label: 'Ưu đãi & Mã giảm', count: stats.promotions, icon: Tag, gradient: 'from-yellow-500 to-amber-400', desc: 'Voucher, chương trình khuyến mãi' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.view}
              onClick={() => onGo(card.view)}
              className="group text-left bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-black text-stone-900">{card.count}</span>
                <TrendingUp className="w-4 h-4 text-emerald-500 mb-1.5" />
              </div>
              <h3 className="font-bold text-stone-700 mb-1">{card.label}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{card.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-amber-600 font-semibold group-hover:gap-2 transition-all">
                Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Admin Page ─── */
export function AdminPage({ currentUser, onNavigate }: AdminPageProps) {
  const [view, setView] = useState<AdminView>('dashboard');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<LoyaltyUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const handleViewRooms = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setView('rooms');
  };

  const handleClearRoomFilter = () => {
    setSelectedHotel(null);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      onNavigate('home');
    }
  }, [currentUser, onNavigate]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [h, r, u, b, a, p] = await Promise.all([
        api.getHotels(),
        api.getAllRooms(),
        api.getAllUsers(),
        api.getBookings(),
        api.getArticles(),
        api.getPromotions(),
      ]);
      setHotels(h); setRooms(r); setUsers(u); setBookings(b); setArticles(a); setPromotions(p);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const viewTitles: Record<AdminView, string> = {
    dashboard: 'Bảng Điều Khiển',
    hotels: 'Quản lý Khách Sạn',
    rooms: selectedHotel ? `Phòng — ${selectedHotel.name}` : 'Quản lý Phòng',
    users: 'Quản lý Khách Hàng',
    bookings: 'Lịch Sử Đặt Phòng',
    articles: 'Quản lý Bài Viết',
    promotions: 'Quản lý Ưu Đãi',
  };

  const viewIcons: Partial<Record<AdminView, React.ReactNode>> = {
    hotels: <Building2 className="w-5 h-5 text-blue-500" />,
    rooms: <BedDouble className="w-5 h-5 text-violet-500" />,
    users: <Users className="w-5 h-5 text-emerald-500" />,
    bookings: <CalendarDays className="w-5 h-5 text-amber-500" />,
    articles: <BookOpen className="w-5 h-5 text-rose-500" />,
    promotions: <Tag className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-6">
          {view !== 'dashboard' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setView('dashboard'); setSelectedHotel(null); }}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Về tổng quan
              </button>
              {view === 'rooms' && selectedHotel && (
                <>
                  <span className="text-stone-300">/</span>
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="text-sm text-stone-500 hover:text-violet-700 transition-colors"
                  >
                    Tất cả phòng
                  </button>
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            {view !== 'dashboard' && (
              <>
                <span className="text-stone-300 text-sm">/</span>
                {viewIcons[view]}
              </>
            )}
            <div>
              <h1 className="text-2xl font-black text-stone-900 font-serif">{viewTitles[view]}</h1>
              {view === 'dashboard' && (
                <p className="text-stone-500 text-sm mt-0.5">
                  Xin chào, <strong>{currentUser.name}</strong> · Quản trị hệ thống AuraResort
                </p>
              )}
            </div>
          </div>
          {loading && <RefreshCw className="w-4 h-4 text-amber-500 animate-spin ml-auto" />}
        </div>

        {/* Content */}
        {!initialized && loading ? (
          <Spinner />
        ) : (
          <>
            {view === 'dashboard' && (
              <DashboardOverview
                stats={{ hotels: hotels.length, rooms: rooms.length, users: users.length, bookings: bookings.length, articles: articles.length, promotions: promotions.length }}
                onGo={setView}
              />
            )}
            {view === 'hotels' && <HotelsView hotels={hotels} loading={loading} onRefresh={loadAll} onViewRooms={handleViewRooms} />}
            {view === 'rooms' && <RoomsView rooms={rooms} loading={loading} onRefresh={loadAll} filterHotelId={selectedHotel?.id} filterHotelName={selectedHotel?.name} onClearFilter={handleClearRoomFilter} />}
            {view === 'users' && <UsersView users={users} loading={loading} onRefresh={loadAll} />}
            {view === 'bookings' && <BookingsView bookings={bookings} loading={loading} onRefresh={loadAll} />}
            {view === 'articles' && <ArticlesView articles={articles} loading={loading} onRefresh={loadAll} />}
            {view === 'promotions' && <PromotionsView promotions={promotions} loading={loading} onRefresh={loadAll} />}
          </>
        )}
      </div>
    </div>
  );
}
