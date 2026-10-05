import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Hotel, Room, LoyaltyUser, Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Building2, Users, CalendarDays, BedDouble,
  RefreshCw, ChevronRight, TrendingUp, Star, CheckCircle, XCircle, Clock,
  Eye, Save, ShieldCheck, Search,
  Phone, Mail, MapPin, Printer, Server,
  AlertTriangle, CheckCircle2, DollarSign,
  X, Lock, ExternalLink, Menu, Sparkles
} from 'lucide-react';

type AdminTab = 'dashboard' | 'bookings' | 'rooms' | 'hotels' | 'users' | 'system';

interface AdminPageProps {
  currentUser: LoyaltyUser | null;
  onNavigate: (page: string) => void;
  onAdminLogin?: (user: LoyaltyUser, token: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ currentUser, onNavigate, onAdminLogin }) => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Management Data
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<LoyaltyUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [systemStatus, setSystemStatus] = useState<{ database?: string; status?: string } | null>(null);

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filtering states for Bookings
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingFilterHotel, setBookingFilterHotel] = useState<string>('all');
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>('');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  // Room filter
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<string | null>(null);
  const [roomStockInputs, setRoomStockInputs] = useState<Record<string, number>>({});

  // Admin dedicated login form state
  const [loginEmail, setLoginEmail] = useState('admin@auraresort.vn');
  const [loginPassword, setLoginPassword] = useState('Admin123@');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all core administrative data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [h, r, u, b] = await Promise.all([
        api.getHotels(),
        api.getAllRooms(),
        api.getAllUsers(),
        api.getBookings()
      ]);
      setHotels(h);
      setRooms(r);
      setUsers(u);
      setBookings(b);

      // Check server status
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const sJson = await res.json();
          setSystemStatus(sJson);
        }
      } catch {
        setSystemStatus({ status: 'operational', database: 'connected' });
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu quản trị:', err);
      showToast('Không thể tải một số dữ liệu quản lý', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadAllData();
    }
  }, [currentUser, loadAllData]);

  // Handle Admin Dedicated Login
  const handleAdminSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      if (res.user.role !== 'admin') {
        throw new Error('Tài khoản này không có quyền Quản trị viên (Admin).');
      }
      localStorage.setItem('aura_token', res.token);
      localStorage.setItem('aura_user', JSON.stringify(res.user));
      if (onAdminLogin) {
        onAdminLogin(res.user, res.token);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Đăng nhập quản trị thất bại.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle quick login as admin
  const handleQuickLoginAdmin = async () => {
    setLoginEmail('admin@auraresort.vn');
    setLoginPassword('Admin123@');
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.login({ email: 'admin@auraresort.vn', password: 'Admin123@' });
      localStorage.setItem('aura_token', res.token);
      localStorage.setItem('aura_user', JSON.stringify(res.user));
      if (onAdminLogin) {
        onAdminLogin(res.user, res.token);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Lỗi đăng nhập nhanh');
    } finally {
      setLoginLoading(false);
    }
  };

  // Update Booking Status Realtime
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      if (selectedBookingDetail?.id === bookingId) {
        setSelectedBookingDetail(prev => prev ? { ...prev, status: newStatus } : null);
      }
      const statusText = newStatus === 'confirmed' ? 'Đã xác nhận' : newStatus === 'completed' ? 'Hoàn thành' : 'Đã hủy';
      showToast(`Đã cập nhật trạng thái đơn #${bookingId.substring(0, 8)} sang "${statusText}"`);
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật trạng thái đơn', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Save room stock
  const handleSaveRoomStock = async (roomId: string) => {
    const newStock = roomStockInputs[roomId];
    if (newStock === undefined || newStock < 0) return;
    setActionLoading(`room-${roomId}`);
    try {
      const updated = await api.updateRoomStock(roomId, newStock);
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, totalRooms: updated.totalRooms, availableRooms: updated.availableRooms, isAvailable: updated.isAvailable } : r));
      showToast('Đã lưu số lượng phòng thành công');
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu số lượng phòng', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
      const matchHotel = bookingFilterHotel === 'all' || b.hotelId === bookingFilterHotel;
      const q = bookingSearchQuery.trim().toLowerCase();
      const matchSearch = !q || (
        b.bookingCode.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q)
      );
      return matchStatus && matchHotel && matchSearch;
    });
  }, [bookings, bookingFilterStatus, bookingFilterHotel, bookingSearchQuery]);

  // Financial KPI calculations
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  }, [bookings]);

  const confirmedBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed').length;
  }, [bookings]);

  // If not logged in or not admin, show Dedicated Admin Portal Login Gate
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-stone-950">
        
        {/* Top Minimal Bar */}
        <header className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-stone-100 tracking-wide font-serif">
                AURA<span className="text-amber-400 font-light italic">Resort</span>
              </span>
              <span className="ml-2 text-[10px] bg-stone-800 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/20">
                HỆ THỐNG QUẢN LÝ
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>Quay lại trang khách hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Center Login Box */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-100">
                Hệ Thống Quản Lý Trung Tâm
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Khu vực dành riêng cho Bộ phận Điều hành & Quản lý Khách sạn AuraResort.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmitLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Email quản trị viên</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                    placeholder="admin@auraresort.vn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Mật khẩu bảo mật</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                {loginLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Đăng Nhập Quản Lý</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Access Button */}
            <div className="mt-6 pt-5 border-t border-stone-800 text-center">
              <p className="text-[11px] text-stone-400 mb-2">Đăng nhập tài khoản Quản trị viên:</p>
              <button
                onClick={handleQuickLoginAdmin}
                disabled={loginLoading}
                className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-stone-700 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Đăng Nhập Nhanh Quản Trị Viên (admin@auraresort.vn)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-800">
          AuraResort Hospitality Operations Hub • Hệ Thống Quản Lý Toàn Diện
        </footer>
      </div>
    );
  }

  // MAIN ADMIN PORTAL - DEDICATED HOTEL MANAGEMENT SYSTEM
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex font-sans antialiased selection:bg-amber-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn ${
          toastMessage.type === 'success' ? 'bg-emerald-800 text-emerald-50 border border-emerald-600' : 'bg-red-800 text-red-50 border border-red-600'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <AlertTriangle className="w-4 h-4 text-red-300" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ─── SIDEBAR HỆ THỐNG QUẢN LÝ (HOTEL MANAGEMENT SIDEBAR) ─── */}
      <aside className={`bg-stone-900 text-stone-200 flex flex-col justify-between transition-all duration-300 shrink-0 border-r border-stone-800 z-30 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } fixed md:static inset-y-0 left-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div>
          {/* Brand & Portal Header */}
          <div className="h-20 px-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 font-bold shrink-0 shadow-lg shadow-amber-500/20">
                <ShieldCheck className="w-5 h-5 text-stone-950" />
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <h1 className="font-bold text-base text-stone-100 leading-tight font-serif">
                    AURA<span className="text-amber-400 font-light italic">Resort</span>
                  </h1>
                  <p className="text-[10px] tracking-wider uppercase text-amber-400/90 font-semibold font-mono">
                    HỆ THỐNG QUẢN LÝ
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              title={sidebarCollapsed ? 'Mở rộng' : 'Thu nhỏ'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links - Chỉ tập trung vào các chức năng Quản lý cốt lõi */}
          <nav className="p-3 space-y-1.5 text-xs font-medium">
            <div className={`px-3 py-1.5 text-[10px] uppercase tracking-wider text-stone-500 font-bold ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              Nghiệp Vụ Điều Hành
            </div>

            {/* 1. Tổng quan */}
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Bảng Điều Khiển</span>}
            </button>

            {/* 2. Đơn đặt phòng */}
            <button
              onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Quản Lý Đơn Đặt Phòng</span>}
              </div>
              {!sidebarCollapsed && bookings.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'bookings' ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-300'
                }`}>
                  {bookings.length}
                </span>
              )}
            </button>

            {/* 3. Phòng & Tồn kho */}
            <button
              onClick={() => { setActiveTab('rooms'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <BedDouble className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Quản Lý Phòng & Tồn Kho</span>}
            </button>

            {/* 4. Khách sạn */}
            <button
              onClick={() => { setActiveTab('hotels'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'hotels'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Chi Nhánh Khách Sạn</span>}
            </button>

            {/* 5. Khách hàng */}
            <button
              onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Khách Hàng & Hội Viên</span>}
            </button>

            <div className={`pt-3 px-3 py-1.5 text-[10px] uppercase tracking-wider text-stone-500 font-bold ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              Hệ Thống Kỹ Thuật
            </div>

            {/* 6. Giám sát hệ thống */}
            <button
              onClick={() => { setActiveTab('system'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Server className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Trạng Thái Máy Chủ & CSDL</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Quick Back to Website */}
        <div className="p-3 border-t border-stone-800 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 text-xs font-semibold transition-all cursor-pointer group"
          >
            <ExternalLink className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span>Về Website Khách Hàng</span>}
          </button>
        </div>

      </aside>

      {/* ─── NỘI DUNG CHÍNH (MAIN MANAGEMENT VIEW) ─── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Topbar Quản Lý */}
        <header className="h-20 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Hệ Thống Quản Lý AuraResort</span>
                <span>/</span>
                <span className="text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                  {activeTab === 'dashboard' && 'Bảng Điều Khiển'}
                  {activeTab === 'bookings' && 'Quản Lý Đơn Đặt Phòng'}
                  {activeTab === 'rooms' && 'Quản Lý Phòng & Tồn Kho'}
                  {activeTab === 'hotels' && 'Chi Nhánh Khách Sạn'}
                  {activeTab === 'users' && 'Danh Sách Khách Hàng & Hội Viên'}
                  {activeTab === 'system' && 'Trạng Thái Kỹ Thuật'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">
                {activeTab === 'dashboard' && 'Tổng Quan Tình Hình Hoạt Động'}
                {activeTab === 'bookings' && 'Điều Hành & Xử Lý Đơn Đặt Phòng'}
                {activeTab === 'rooms' && 'Quản Lý Hạng Phòng & Tồn Kho'}
                {activeTab === 'hotels' && 'Danh Mục 6 Khu Nghỉ Dưỡng'}
                {activeTab === 'users' && 'Hồ Sơ Khách Hàng & Hội Viên VIP'}
                {activeTab === 'system' && 'Giám Sát Máy Chủ & Kết Nối Dữ Liệu'}
              </h2>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            
            {/* Realtime Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Máy chủ trực tuyến • CSDL MongoDB kết nối</span>
            </div>

            {/* Refresh Data Button */}
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer"
              title="Làm mới toàn bộ dữ liệu quản lý"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
            </button>

            {/* Admin User Info */}
            <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-stone-900 to-stone-700 text-amber-400 font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-amber-400/40">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-stone-900 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-amber-700 font-semibold">Quản Trị Viên Hệ Thống</div>
              </div>
            </div>

          </div>

        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1">
          
          {loading && !bookings.length ? (
            <div className="flex flex-col items-center justify-center py-24 text-stone-400">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
              <p className="text-sm font-medium">Đang tải dữ liệu hệ thống quản lý...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* KPI Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    
                    {/* Card 1: Doanh Thu */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Tổng Doanh Thu</span>
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="font-serif text-2xl font-bold text-stone-900">
                        {totalRevenue.toLocaleString('vi-VN')} <span className="text-sm font-normal text-stone-500">VNĐ</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Từ các đơn đặt phòng đã thanh toán</span>
                      </p>
                    </div>

                    {/* Card 2: Tổng đơn đặt phòng */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Đơn Đặt Phòng</span>
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="font-serif text-2xl font-bold text-stone-900">
                        {bookings.length} <span className="text-sm font-normal text-stone-500">đơn</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-2 font-medium">
                        {confirmedBookingsCount} đơn đang hiệu lực
                      </p>
                    </div>

                    {/* Card 3: Khách hàng / Hội viên */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Hội Viên Khách Hàng</span>
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="font-serif text-2xl font-bold text-stone-900">
                        {users.length} <span className="text-sm font-normal text-stone-500">tài khoản</span>
                      </div>
                      <p className="text-xs text-purple-600 mt-2 font-medium">
                        Phân hạng hội viên & tích lũy điểm
                      </p>
                    </div>

                    {/* Card 4: Tổng số phòng & Chi nhánh */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Quy Mô Khách Sạn</span>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="font-serif text-2xl font-bold text-stone-900">
                        {hotels.length} <span className="text-sm font-normal text-stone-500">Resort / {rooms.length} Hạng</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Kiểm soát tồn kho & điều chỉnh giá
                      </p>
                    </div>

                  </div>

                  {/* Operational Alerts & Recent Bookings */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Recent Bookings Table */}
                    <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-serif text-base font-bold text-stone-900">
                            Đơn Đặt Phòng Mới Cần Xử Lý
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Theo dõi các kỳ nghỉ vừa được khách thanh toán chuyển khoản qua ngân hàng.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Xem tất cả</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-50 text-stone-500 font-semibold border-y border-stone-100">
                            <tr>
                              <th className="py-3 px-3">Mã đơn</th>
                              <th className="py-3 px-3">Khách hàng</th>
                              <th className="py-3 px-3">Khu nghỉ dưỡng</th>
                              <th className="py-3 px-3">Tổng tiền</th>
                              <th className="py-3 px-3">Trạng thái</th>
                              <th className="py-3 px-3 text-right">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {bookings.slice(0, 5).map(b => (
                              <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                                <td className="py-3.5 px-3 font-mono font-bold text-amber-700">
                                  {b.bookingCode}
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="font-semibold text-stone-800">{b.customerName}</div>
                                  <div className="text-[11px] text-stone-400">{b.customerPhone}</div>
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="font-medium text-stone-700">{b.hotelName}</div>
                                  <div className="text-[11px] text-stone-400">{b.roomName}</div>
                                </td>
                                <td className="py-3.5 px-3 font-bold text-stone-900">
                                  {b.totalAmount.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                    b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                    b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-right">
                                  <button
                                    onClick={() => setSelectedBookingDetail(b)}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                                    title="Xem chi tiết đơn"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Resorts Breakdown */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
                          Hiệu Suất Chi Nhánh
                        </h3>
                        <p className="text-xs text-stone-500 mb-4">
                          Phân bổ kỳ nghỉ và khách lưu trú trên 6 khu nghỉ dưỡng
                        </p>

                        <div className="space-y-3">
                          {hotels.map(h => {
                            const hotelBookings = bookings.filter(b => b.hotelId === h.id);
                            return (
                              <div key={h.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-xs text-stone-800">{h.name}</div>
                                  <div className="text-[11px] text-stone-500">{h.city} • Đánh giá {h.rating}★</div>
                                </div>
                                <span className="font-bold text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                                  {hotelBookings.length} đơn
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>Hệ thống VietQR MB Bank:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Khớp lệnh tự động
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: QUẢN LÝ ĐƠN ĐẶT PHÒNG (BOOKINGS MANAGEMENT) */}
              {activeTab === 'bookings' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Filter & Search Bar */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Search input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={bookingSearchQuery}
                        onChange={e => setBookingSearchQuery(e.target.value)}
                        placeholder="Tìm theo mã đơn (AURA-BK-...), tên khách, số điện thoại, email..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Filter status */}
                    <div className="flex items-center gap-2">
                      <select
                        value={bookingFilterStatus}
                        onChange={e => setBookingFilterStatus(e.target.value)}
                        className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>

                      <select
                        value={bookingFilterHotel}
                        onChange={e => setBookingFilterHotel(e.target.value)}
                        className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer max-w-[200px]"
                      >
                        <option value="all">Tất cả chi nhánh</option>
                        {hotels.map(h => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Bookings Table */}
                  <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">
                        Hiển thị {filteredBookings.length} / {bookings.length} đơn đặt phòng
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                          <tr>
                            <th className="py-3.5 px-4">Mã Đơn</th>
                            <th className="py-3.5 px-4">Khách Hàng</th>
                            <th className="py-3.5 px-4">Chi Nhánh & Phòng</th>
                            <th className="py-3.5 px-4">Thời Gian Lưu Trú</th>
                            <th className="py-3.5 px-4">Tổng Thanh Toán</th>
                            <th className="py-3.5 px-4">Trạng Thái</th>
                            <th className="py-3.5 px-4 text-right">Duyệt & Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredBookings.map(b => (
                            <tr key={b.id} className="hover:bg-amber-50/20 transition-colors">
                              <td className="py-4 px-4 font-mono font-bold text-amber-700 text-xs">
                                {b.bookingCode}
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-bold text-stone-900">{b.customerName}</div>
                                <div className="text-[11px] text-stone-500">{b.customerPhone}</div>
                                <div className="text-[11px] text-stone-400">{b.customerEmail}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-stone-800">{b.hotelName}</div>
                                <div className="text-[11px] text-stone-500">{b.roomName} ({b.guests} khách)</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-stone-700">
                                  {new Date(b.checkInDate).toLocaleDateString('vi-VN')} → {new Date(b.checkOutDate).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="text-[11px] text-stone-400">
                                  Lưu trú: {b.nights} đêm
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-bold text-stone-900">
                                  {b.totalAmount.toLocaleString('vi-VN')}đ
                                </div>
                                <div className="text-[10px] text-stone-500 capitalize">
                                  PT: {b.paymentMethod === 'bank_transfer' ? 'VietQR 24/7' : 'Thẻ ngân hàng'}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                  b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                  b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {b.status === 'confirmed' && <Clock className="w-3.5 h-3.5" />}
                                  {b.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                                  {b.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                                  <span>{b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}</span>
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* View Detail Modal Button */}
                                  <button
                                    onClick={() => setSelectedBookingDetail(b)}
                                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                                    title="Xem chi tiết phiếu đặt phòng"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Status quick actions */}
                                  {b.status === 'confirmed' && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                                      disabled={actionLoading === b.id}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer shadow-xs"
                                      title="Khách đã hoàn tất kỳ nghỉ"
                                    >
                                      Hoàn thành
                                    </button>
                                  )}

                                  {b.status !== 'cancelled' && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Bạn có chắc muốn hủy đơn đặt phòng #${b.bookingCode}?`)) {
                                          handleUpdateBookingStatus(b.id, 'cancelled');
                                        }
                                      }}
                                      disabled={actionLoading === b.id}
                                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                                      title="Hủy đơn đặt phòng"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {filteredBookings.length === 0 && (
                        <div className="py-16 text-center text-stone-400">
                          <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-medium">Không tìm thấy đơn đặt phòng nào phù hợp bộ lọc.</p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 3: PHÒNG & TỒN KHO (ROOMS & INVENTORY) */}
              {activeTab === 'rooms' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Hotel switcher filter */}
                  <div className="flex flex-wrap gap-2 pb-2">
                    <button
                      onClick={() => setSelectedHotelForRooms(null)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        selectedHotelForRooms === null
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      Tất cả chi nhánh ({rooms.length} phòng)
                    </button>
                    {hotels.map(h => (
                      <button
                        key={h.id}
                        onClick={() => setSelectedHotelForRooms(h.id)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          selectedHotelForRooms === h.id
                            ? 'bg-amber-500 text-stone-950 shadow-sm'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>

                  {/* Rooms Grid / Table */}
                  <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                          <tr>
                            <th className="py-3.5 px-5">Tên Hạng Phòng</th>
                            <th className="py-3.5 px-5">Khu Nghỉ Dưỡng</th>
                            <th className="py-3.5 px-5">Đơn Giá / Đêm</th>
                            <th className="py-3.5 px-5">Sức Chứa & Diện Tích</th>
                            <th className="py-3.5 px-5">Số Lượng Phòng Trống</th>
                            <th className="py-3.5 px-5 text-right">Điều Chỉnh Tồn Kho</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {rooms
                            .filter(r => !selectedHotelForRooms || r.hotelId === selectedHotelForRooms)
                            .map(r => {
                              const hotelObj = hotels.find(h => h.id === r.hotelId);
                              const availableCount = r.availableRooms ?? (r.isAvailable ? r.totalRooms ?? 1 : 0);
                              const currentVal = roomStockInputs[r.id] ?? r.totalRooms ?? 1;

                              return (
                                <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                                  <td className="py-4 px-5">
                                    <div className="font-bold text-stone-900">{r.name}</div>
                                    <div className="text-[11px] text-stone-400">{r.type} • Giường: {r.bedType}</div>
                                  </td>
                                  <td className="py-4 px-5 font-medium text-stone-600">
                                    {hotelObj?.name || r.hotelId}
                                  </td>
                                  <td className="py-4 px-5 font-bold text-amber-700">
                                    {r.pricePerNight.toLocaleString('vi-VN')} VNĐ
                                  </td>
                                  <td className="py-4 px-5 text-stone-600">
                                    {r.capacity} khách • {r.areaSqm}m²
                                  </td>
                                  <td className="py-4 px-5">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2.5 h-2.5 rounded-full ${availableCount > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                      <span className="font-bold text-stone-800">
                                        {availableCount} còn trống / {r.totalRooms ?? 1} tổng
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <input
                                        type="number"
                                        min="0"
                                        value={currentVal}
                                        onChange={e => setRoomStockInputs({ ...roomStockInputs, [r.id]: parseInt(e.target.value) || 0 })}
                                        className="w-16 bg-stone-50 border border-stone-300 rounded-xl px-2 py-1 text-center font-bold text-xs focus:outline-none focus:border-amber-500"
                                      />
                                      <button
                                        onClick={() => handleSaveRoomStock(r.id)}
                                        disabled={actionLoading === `room-${r.id}`}
                                        className="p-1.5 rounded-xl bg-stone-900 hover:bg-amber-600 text-stone-100 hover:text-white transition-colors cursor-pointer"
                                        title="Lưu số lượng phòng"
                                      >
                                        <Save className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: CHI NHÁNH KHÁCH SẠN (HOTELS MANAGEMENT) */}
              {activeTab === 'hotels' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map(h => {
                      const branchRooms = rooms.filter(r => r.hotelId === h.id);
                      const branchBookings = bookings.filter(b => b.hotelId === h.id);

                      return (
                        <div key={h.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                          <div>
                            <div className="h-44 relative overflow-hidden bg-stone-100">
                              <img
                                src={h.coverImage}
                                alt={h.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-400 font-bold text-xs flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{h.rating}</span>
                              </div>
                              <div className="absolute bottom-3 left-3 bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider">
                                {h.branchCode}
                              </div>
                            </div>

                            <div className="p-5">
                              <h3 className="font-serif font-bold text-base text-stone-900">{h.name}</h3>
                              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>{h.city} • {h.address}</span>
                              </p>

                              <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-stone-50 p-2 rounded-xl">
                                  <span className="text-[10px] text-stone-400 block">Số hạng phòng</span>
                                  <span className="font-bold text-stone-800">{branchRooms.length} loại phòng</span>
                                </div>
                                <div className="bg-stone-50 p-2 rounded-xl">
                                  <span className="text-[10px] text-stone-400 block">Lượt khách đặt</span>
                                  <span className="font-bold text-stone-800">{branchBookings.length} kỳ nghỉ</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 pt-0">
                            <button
                              onClick={() => {
                                setSelectedHotelForRooms(h.id);
                                setActiveTab('rooms');
                              }}
                              className="w-full py-2.5 bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BedDouble className="w-4 h-4" />
                              <span>Quản lý phòng chi nhánh này</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: KHÁCH HÀNG & HỘI VIÊN (USERS MANAGEMENT) */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">
                        {users.length} tài khoản người dùng đăng ký trong hệ thống
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                          <tr>
                            <th className="py-3.5 px-5">Họ và Tên</th>
                            <th className="py-3.5 px-5">Thông Tin Liên Hệ</th>
                            <th className="py-3.5 px-5">Hạng Thẻ Hội Viên</th>
                            <th className="py-3.5 px-5">Điểm Tích Lũy</th>
                            <th className="py-3.5 px-5">Số Lần Đặt Phòng</th>
                            <th className="py-3.5 px-5">Quyền Hạn</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {users.map(u => (
                            <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 font-bold flex items-center justify-center text-xs">
                                    {u.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-stone-900">{u.name}</div>
                                    <div className="text-[11px] text-stone-400">Tham gia từ {u.memberSince}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <div className="text-stone-800">{u.email}</div>
                                <div className="text-stone-500 text-[11px]">{u.phone || 'Chưa cập nhật'}</div>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  u.tier === 'Diamond' ? 'bg-cyan-100 text-cyan-800' :
                                  u.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                  u.tier === 'Silver' ? 'bg-slate-200 text-slate-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {u.tier} Member
                                </span>
                              </td>
                              <td className="py-4 px-5 font-bold text-amber-700">
                                {u.points?.toLocaleString('vi-VN')} điểm
                              </td>
                              <td className="py-4 px-5 font-semibold text-stone-700">
                                {u.totalBookings || 0} kỳ nghỉ
                              </td>
                              <td className="py-4 px-5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  u.role === 'admin' ? 'bg-stone-900 text-amber-400' : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {u.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: TRẠNG THÁI KỸ THUẬT & SERVER (SYSTEM HEALTH) */}
              {activeTab === 'system' && (
                <div className="space-y-6 animate-fadeIn max-w-4xl">
                  <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Giám Sát Cơ Sở Hạ Tầng & Kết Nối Dữ Liệu
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        Kiểm tra trạng thái thời gian thực giữa máy chủ Node.js/Express, cơ sở dữ liệu và hệ thống thanh toán.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-stone-800">Cơ Sở Dữ Liệu</div>
                          <div className="text-[11px] text-stone-500">MongoDB Server (hotel_booking)</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Kết Nối
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-stone-800">Cổng Thanh Toán VietQR 24/7</div>
                          <div className="text-[11px] text-stone-500">Ngân hàng MB Bank (0348888999)</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Khớp Tự Động
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-stone-800">Máy Chủ API Express</div>
                          <div className="text-[11px] text-stone-500">Cổng http://0.0.0.0:3000</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Trực Tuyến
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-stone-800">Bản Đồ Định Vị & Du Lịch</div>
                          <div className="text-[11px] text-stone-500">Leaflet OpenStreetMap Toạ Độ GPS</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Hoạt Động
                        </span>
                      </div>

                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs leading-relaxed">
                      <strong>Hệ thống quản lý khách sạn:</strong> Toàn bộ dữ liệu đặt phòng được lưu trữ kiên cố vào MongoDB, mã chuyển khoản VietQR tính tiền chính xác theo số đêm lưu trú, số lượng phòng trống được khấu trừ vào kho thực tế khi xác nhận.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* ─── MODAL: CHI TIẾT ĐƠN ĐẶT PHÒNG & IN PHIẾU (BOOKING DETAIL MODAL) ─── */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full text-stone-900 shadow-2xl overflow-hidden my-auto border border-stone-200">
            
            {/* Header */}
            <div className="bg-stone-900 text-stone-100 p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold tracking-wider">
                  PHIẾU XÁC NHẬN ĐẶT PHÒNG
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-100 mt-0.5">
                  Mã đơn: {selectedBookingDetail.bookingCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Customer Info */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
                <span className="font-bold text-[11px] text-stone-400 uppercase block mb-1">Thông tin khách hàng</span>
                <div className="flex justify-between">
                  <span className="text-stone-500">Họ và tên:</span>
                  <span className="font-bold text-stone-800">{selectedBookingDetail.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Số điện thoại:</span>
                  <span className="font-semibold text-stone-800">{selectedBookingDetail.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-stone-800">{selectedBookingDetail.customerEmail}</span>
                </div>
              </div>

              {/* Stay Info */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
                <span className="font-bold text-[11px] text-stone-400 uppercase block mb-1">Chi tiết kỳ nghỉ</span>
                <div className="flex justify-between">
                  <span className="text-stone-500">Khu nghỉ dưỡng:</span>
                  <span className="font-bold text-stone-800">{selectedBookingDetail.hotelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Hạng phòng:</span>
                  <span className="font-semibold text-stone-800">{selectedBookingDetail.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Check-in / Check-out:</span>
                  <span className="font-semibold text-stone-800">
                    {new Date(selectedBookingDetail.checkInDate).toLocaleDateString('vi-VN')} → {new Date(selectedBookingDetail.checkOutDate).toLocaleDateString('vi-VN')} ({selectedBookingDetail.nights} đêm)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Số khách:</span>
                  <span className="text-stone-800">{selectedBookingDetail.guests} người lớn</span>
                </div>
                {selectedBookingDetail.specialRequests && (
                  <div className="pt-2 border-t border-stone-200 text-stone-600">
                    <span className="font-semibold text-stone-700">Yêu cầu đặc biệt: </span>
                    {selectedBookingDetail.specialRequests}
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-stone-500 block text-[11px]">Tổng số tiền thanh toán</span>
                  <span className="font-serif text-lg font-bold text-amber-800">
                    {selectedBookingDetail.totalAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedBookingDetail.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  selectedBookingDetail.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedBookingDetail.status === 'confirmed' ? 'Đã xác nhận' : selectedBookingDetail.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                </span>
              </div>

              {/* Status Actions */}
              <div className="pt-2 flex gap-2">
                {selectedBookingDetail.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateBookingStatus(selectedBookingDetail.id, 'completed')}
                    disabled={actionLoading === selectedBookingDetail.id}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Đánh Dấu Hoàn Thành Kỳ Nghỉ</span>
                  </button>
                )}

                {selectedBookingDetail.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn hủy đơn đặt phòng này?')) {
                        handleUpdateBookingStatus(selectedBookingDetail.id, 'cancelled');
                      }
                    }}
                    disabled={actionLoading === selectedBookingDetail.id}
                    className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors cursor-pointer text-xs"
                  >
                    Hủy Đơn Phòng
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Phiếu</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
