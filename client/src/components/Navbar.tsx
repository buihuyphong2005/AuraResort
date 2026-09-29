import React, { useState } from 'react';
import { 
  Crown, 
  Bell, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  CalendarCheck, 
  Check, 
  Menu, 
  X,
  Compass,
  Star,
  BookOpen,
  User,
  Users,
  LogOut,
  LogIn
} from 'lucide-react';
import { LoyaltyUser } from '../types/index.ts';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  currentUser: LoyaltyUser | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenChat: () => void;
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenChat,
  onMarkNotificationRead
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = currentUser?.notifications.filter(n => !n.read).length || 0;

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-brand-logo"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-wider text-stone-100 flex items-center gap-1.5">
              AURA<span className="text-amber-400 font-light italic">Resort</span>
            </span>
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-medium -mt-1">
              Sanctuary of Vietnam
            </p>
          </div>
        </div>

        {/* Desktop Navigation Pages */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-300">
          <button 
            onClick={() => handleNav('home')}
            className={`py-1 cursor-pointer transition-colors ${
              activePage === 'home' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
            }`}
          >
            Trang Chủ
          </button>

          <button 
            onClick={() => handleNav('hotels')}
            className={`py-1 cursor-pointer transition-colors ${
              activePage === 'hotels' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
            }`}
          >
            Chi Nhánh & Đặt Phòng
          </button>

          <button 
            onClick={() => handleNav('articles')}
            className={`py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activePage === 'articles' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Cẩm Nang Du Lịch</span>
          </button>

          <button 
            onClick={() => handleNav('map')}
            className={`py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activePage === 'map' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Bản Đồ Vị Trí</span>
          </button>

          <button 
            onClick={() => handleNav('reviews')}
            className={`py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activePage === 'reviews' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Đánh Giá Chi Nhánh</span>
          </button>

          <button 
            onClick={() => handleNav('loyalty')}
            className={`py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activePage === 'loyalty' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Ưu Đãi Hội Viên</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => handleNav('admin')}
              className={`py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activePage === 'admin' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-amber-400'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Quản Trị</span>
            </button>
          )}
        </nav>

        {/* Right Side: Notifications, Account, and AI Assistant */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-full text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Thông báo ưu đãi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-stone-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-4 z-50 text-stone-200 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif font-bold text-sm">Ưu Đãi & Thông Báo</h4>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => onMarkNotificationRead('all')}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Đánh dấu đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
                  {currentUser?.notifications && currentUser.notifications.length > 0 ? (
                    currentUser.notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-colors border ${
                          n.read
                            ? 'bg-stone-950/40 border-stone-800 text-stone-400'
                            : 'bg-stone-950 border-amber-500/30 text-stone-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className={`font-semibold text-xs ${!n.read ? 'text-amber-300' : ''}`}>
                            {n.title}
                          </h5>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] mt-1 line-clamp-2 text-stone-400 leading-relaxed">
                          {n.content}
                        </p>
                        <span className="text-[10px] text-stone-500 mt-1.5 block">{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-stone-500">Chưa có thông báo mới</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('account')}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                  activePage === 'account'
                    ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-amber-400/50'
                }`}
                title="Trang tài khoản cá nhân"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-bold text-xs block leading-tight truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {currentUser.tier} • {currentUser.points} pts
                  </span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer hidden sm:flex"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold text-stone-200 hover:text-amber-400 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer hidden sm:inline-block"
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* AI Concierge Chatbot Trigger */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 font-bold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            title="Trợ lý du lịch ảo 24/7"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">AI 24/7</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-400 hover:text-stone-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 py-6 space-y-3 text-sm font-semibold">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left py-2 px-3 rounded-xl ${activePage === 'home' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
          >
            Trang Chủ
          </button>
          <button
            onClick={() => handleNav('hotels')}
            className={`w-full text-left py-2 px-3 rounded-xl ${activePage === 'hotels' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
          >
            Chi Nhánh & Đặt Phòng
          </button>
          <button
            onClick={() => handleNav('articles')}
            className={`w-full text-left py-2 px-3 rounded-xl flex items-center gap-2 ${activePage === 'articles' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Cẩm Nang Du Lịch</span>
          </button>
          <button
            onClick={() => handleNav('map')}
            className={`w-full text-left py-2 px-3 rounded-xl flex items-center gap-2 ${activePage === 'map' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Bản Đồ Vị Trí</span>
          </button>
          <button
            onClick={() => handleNav('reviews')}
            className={`w-full text-left py-2 px-3 rounded-xl flex items-center gap-2 ${activePage === 'reviews' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Đánh Giá Chi Nhánh</span>
          </button>
          <button
            onClick={() => handleNav('loyalty')}
            className={`w-full text-left py-2 px-3 rounded-xl flex items-center gap-2 ${activePage === 'loyalty' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Ưu Đãi Hội Viên</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin')}
              className={`w-full text-left py-2 px-3 rounded-xl flex items-center gap-2 ${activePage === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Quản Trị (Admin)</span>
            </button>
          )}

          {currentUser ? (
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <button
                onClick={() => handleNav('account')}
                className={`w-full text-left py-2 px-3 rounded-xl flex items-center gap-2 ${activePage === 'account' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-300'}`}
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Tài Khoản & Lịch Sử Đơn ({currentUser.name})</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left py-2 px-3 rounded-xl text-red-400 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-stone-800 flex gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                className="flex-1 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-center text-xs"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-center text-xs"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      )}

    </header>
  );
};
