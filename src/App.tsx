import React, { useState, useEffect } from 'react';
import { Navbar } from '../client/src/components/Navbar.tsx';
import { HeroSection } from '../client/src/components/HeroSection.tsx';
import { HotelList } from '../client/src/components/HotelList.tsx';
import { HotelMap } from '../client/src/components/HotelMap.tsx';
import { TourismExperienceSection } from '../client/src/components/TourismExperienceSection.tsx';
import { ReviewsSection } from '../client/src/components/ReviewsSection.tsx';
import { LoyaltySection } from '../client/src/components/LoyaltySection.tsx';
import { RoomSelectionModal } from '../client/src/components/RoomSelectionModal.tsx';
import { BookingPaymentModal } from '../client/src/components/BookingPaymentModal.tsx';
import { ChatbotDrawer } from '../client/src/components/ChatbotDrawer.tsx';
import { AuthModal } from '../client/src/components/AuthModal.tsx';
import { HomePage } from '../client/src/pages/HomePage.tsx';
import { ArticlesPage } from '../client/src/pages/ArticlesPage.tsx';
import { AccountPage } from '../client/src/pages/AccountPage.tsx';
import { AdminPage } from '../client/src/pages/AdminPage.tsx';
import { Footer } from '../client/src/components/Footer.tsx';
import { Hotel, Room, Booking, Promotion, TourismSpot, LoyaltyUser, Article } from '../client/src/types/index.ts';
import { api } from '../client/src/services/api.ts';
import { MessageSquare, ArrowUp } from 'lucide-react';

export function App() {
  // Navigation & Page State ('home' | 'hotels' | 'articles' | 'map' | 'reviews' | 'loyalty' | 'account' | 'admin')
  const [activePage, setActivePage] = useState<string>('home');

  // Core Data state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tourismSpots, setTourismSpots] = useState<TourismSpot[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentUser, setCurrentUser] = useState<LoyaltyUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [selectedCity, setSelectedCity] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);

  // Map & Reviews focus states
  const [selectedHotelForMap, setSelectedHotelForMap] = useState<string | null>(null);
  const [selectedHotelForReviews, setSelectedHotelForReviews] = useState<string>('hotel-danang');

  // Modals
  const [hotelForRoomsModal, setHotelForRoomsModal] = useState<Hotel | null>(null);
  const [roomsForModal, setRoomsForModal] = useState<Room[]>([]);
  const [bookingRoom, setBookingRoom] = useState<{ hotel: Hotel; room: Room } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialTopic, setChatInitialTopic] = useState<string | undefined>(undefined);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initial load from backend API & restored session
  useEffect(() => {
    async function initData() {
      try {
        const [fetchedHotels, fetchedArticles, fetchedTourism, fetchedPromos] = await Promise.all([
          api.getHotels(),
          api.getArticles(),
          api.getTourism(),
          api.getPromotions()
        ]);
        setHotels(fetchedHotels);
        setArticles(fetchedArticles);
        setTourismSpots(fetchedTourism);
        setPromotions(fetchedPromos);
        if (fetchedHotels.length > 0) {
          setSelectedHotelForMap(fetchedHotels[0].id);
          setSelectedHotelForReviews(fetchedHotels[0].id);
        }

        // Check local storage for user session
        const savedToken = localStorage.getItem('aura_token');
        const savedUserStr = localStorage.getItem('aura_user');
        if (savedToken && savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setCurrentUser(parsed);
          } catch {
            // fallback
          }
        } else {
          // Default demo profile
          try {
            const fetchedUser = await api.getLoyaltyProfile();
            setCurrentUser(fetchedUser);
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Back to top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth actions
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: LoyaltyUser, token: string) => {
    setCurrentUser(user);
    localStorage.setItem('aura_token', token);
    localStorage.setItem('aura_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
  };

  // Open Room Selector modal for a hotel
  const handleOpenRooms = async (hotel: Hotel) => {
    setHotelForRoomsModal(hotel);
    try {
      const rooms = await api.getRoomsByHotel(hotel.id, guests);
      setRoomsForModal(rooms);
    } catch (err) {
      console.error(err);
    }
  };

  // User clicked "Chọn phòng" inside RoomSelectionModal -> Proceed to Bank Payment
  const handleSelectRoomForPayment = (room: Room) => {
    if (hotelForRoomsModal) {
      setBookingRoom({
        hotel: hotelForRoomsModal,
        room
      });
      setHotelForRoomsModal(null);
    }
  };

  // Locate specific hotel on Map and switch to Map page
  const handleLocateOnMap = (hotelId: string) => {
    setSelectedHotelForMap(hotelId);
    handleNavigate('map');
  };

  // Select hotel for reviews and switch to Reviews page
  const handleSelectHotelForReviews = (hotelId: string) => {
    setSelectedHotelForReviews(hotelId);
    handleNavigate('reviews');
  };

  // Open Chat with specific custom prompt
  const handleOpenChatWithTopic = (topic: string) => {
    setChatInitialTopic(topic);
    setIsChatOpen(true);
  };

  // Mark notification read in user state
  const handleMarkNotificationRead = async (notifId: string) => {
    if (!currentUser?.id) return;
    try {
      const updatedUser = await api.markNotificationRead(notifId, currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('aura_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle successful booking
  const handleBookingSuccess = async (booking: Booking) => {
    if (!currentUser?.id) return;
    // Refresh loyalty points and user notifications
    try {
      const updatedUser = await api.getLoyaltyProfile(currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('aura_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered hotels based on city selection
  const filteredHotels = selectedCity
    ? hotels.filter(h => h.city.toLowerCase() === selectedCity.toLowerCase())
    : hotels;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900 flex flex-col justify-between">
      
      <div>
        {/* 1. Global Navigation Bar with Multi-Page Tabs & Auth */}
        <Navbar
          activePage={activePage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenChat={() => {
            setChatInitialTopic(undefined);
            setIsChatOpen(true);
          }}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        {/* 2. PAGE CONTENT BASED ON ACTIVE TAB */}
        
        {/* PAGE 1: TRANG CHỦ (Giới thiệu chuỗi khách sạn, bài viết du lịch nổi bật, trải nghiệm văn hóa) */}
        {activePage === 'home' && (
          <HomePage
            hotels={hotels}
            articles={articles}
            tourismSpots={tourismSpots}
            onNavigate={handleNavigate}
            onSelectHotelForBooking={handleOpenRooms}
            onOpenChatWithTopic={handleOpenChatWithTopic}
          />
        )}

        {/* PAGE 2: CHI NHÁNH & ĐẶT PHÒNG (Bộ lọc tìm kiếm, 6 khu nghỉ dưỡng & xem hạng phòng) */}
        {activePage === 'hotels' && (
          <div className="animate-fadeIn">
            <HeroSection
              hotels={hotels}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              checkInDate={checkInDate}
              onCheckInChange={setCheckInDate}
              checkOutDate={checkOutDate}
              onCheckOutChange={setCheckOutDate}
              guests={guests}
              onGuestsChange={setGuests}
              onSearch={() => {}}
              onOpenChat={() => handleOpenChatWithTopic('Gợi ý cho tôi phòng nghỉ phù hợp cho gia đình/cặp đôi')}
            />

            <HotelList
              hotels={filteredHotels}
              onSelectHotelForBooking={handleOpenRooms}
              onLocateOnMap={handleLocateOnMap}
              onSelectHotelForReviews={handleSelectHotelForReviews}
            />
          </div>
        )}

        {/* PAGE 3: CẨM NANG & BÀI VIẾT DU LỊCH (Chuyên mục bài viết du lịch văn hóa & danh lam thắng cảnh) */}
        {activePage === 'articles' && (
          <ArticlesPage
            hotels={hotels}
            onBookHotelBranch={handleOpenRooms}
            onOpenChatWithTopic={handleOpenChatWithTopic}
          />
        )}

        {/* PAGE 4: BẢN ĐỒ VỊ TRÍ & ĐIỂM ĐẾN VĂN HÓA */}
        {activePage === 'map' && (
          <div className="animate-fadeIn py-8">
            <HotelMap
              hotels={hotels}
              tourismSpots={tourismSpots}
              selectedHotelId={selectedHotelForMap}
              onSelectHotel={(id) => setSelectedHotelForMap(id)}
              onBookHotel={handleOpenRooms}
            />

            <TourismExperienceSection
              hotels={hotels}
              onOpenChatWithTopic={handleOpenChatWithTopic}
              onLocateOnMap={(id) => setSelectedHotelForMap(id)}
            />
          </div>
        )}

        {/* PAGE 5: ĐÁNH GIÁ TRỰC TUYẾN TỪNG CHI NHÁNH */}
        {activePage === 'reviews' && (
          <div className="animate-fadeIn py-8">
            <ReviewsSection
              hotels={hotels}
              selectedHotelId={selectedHotelForReviews}
              onSelectHotelId={(id) => setSelectedHotelForReviews(id)}
            />
          </div>
        )}

        {/* PAGE 6: ƯU ĐÃI HỘI VIÊN & ĐIỂM THƯỞNG */}
        {activePage === 'loyalty' && (
          <div className="animate-fadeIn py-8">
            <LoyaltySection
              loyaltyUser={currentUser}
              promotions={promotions}
              onMarkNotificationRead={handleMarkNotificationRead}
              onApplyVoucherToBooking={() => {
                if (hotels.length > 0) {
                  handleOpenRooms(hotels[0]);
                }
              }}
            />
          </div>
        )}

        {/* PAGE 7: TÀI KHOẢN & LỊCH SỬ ĐƠN ĐẶT PHÒNG */}
        {activePage === 'account' && (
          <AccountPage
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onNavigateToHotels={() => handleNavigate('hotels')}
          />
        )}

        {/* PAGE 8: ADMIN DASHBOARD */}
        {activePage === 'admin' && (
          <AdminPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

      </div>

      {/* 3. Global Footer */}
      <Footer />

      {/* MODAL: Auth Modal (Đăng nhập / Đăng ký) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* MODAL: Room Selection Modal */}
      {hotelForRoomsModal && (
        <RoomSelectionModal
          hotel={hotelForRoomsModal}
          rooms={roomsForModal}
          onClose={() => setHotelForRoomsModal(null)}
          onSelectRoom={handleSelectRoomForPayment}
        />
      )}

      {/* MODAL: Booking & Bank Payment Modal (Strictly VietQR & Bank Cards) */}
      {bookingRoom && (
        <BookingPaymentModal
          hotel={bookingRoom.hotel}
          room={bookingRoom.room}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialGuests={guests}
          currentUser={currentUser}
          onClose={() => setBookingRoom(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 24/7 AI Concierge Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialTopic={chatInitialTopic}
      />

      {/* Floating Bottom-Right Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Back to top */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 shadow-xl border border-stone-700 transition-all cursor-pointer"
            aria-label="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Floating Chatbot Button */}
        <button
          onClick={() => {
            setChatInitialTopic(undefined);
            setIsChatOpen(true);
          }}
          className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold px-4 py-3 rounded-full shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-105 cursor-pointer border border-amber-300/50"
          id="floating-ai-concierge-btn"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-stone-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-950 animate-pulse" />
          </div>
          <span className="text-xs hidden sm:inline">Hỗ trợ AI 24/7</span>
        </button>
      </div>

    </div>
  );
}

export default App;
