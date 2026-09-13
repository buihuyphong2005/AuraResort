import { Hotel, Room, Booking, Review, Promotion, TourismSpot, LoyaltyUser, Article } from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Authentication
  async register(payload: { name: string; email: string; password: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || json.message);
    return json.data;
  },

  async login(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || json.message);
    return json.data;
  },

  async getMe(userId?: string) {
    const url = userId ? `${API_BASE}/auth/me?userId=${userId}` : `${API_BASE}/auth/me`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Articles & Travel Guides
  async getArticles(hotelId?: string, category?: string): Promise<Article[]> {
    let url = `${API_BASE}/articles`;
    const params = new URLSearchParams();
    if (hotelId) params.append('hotelId', hotelId);
    if (category && category !== 'all') params.append('category', category);
    if (params.toString()) url += `?${params.toString()}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  async getArticleById(id: string): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Hotels
  async getHotels(city?: string): Promise<Hotel[]> {
    const url = city ? `${API_BASE}/hotels?city=${encodeURIComponent(city)}` : `${API_BASE}/hotels`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  async getHotelById(id: string): Promise<Hotel> {
    const res = await fetch(`${API_BASE}/hotels/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getRoomsByHotel(hotelId: string, capacity?: number): Promise<Room[]> {
    const url = capacity
      ? `${API_BASE}/hotels/${hotelId}/rooms?capacity=${capacity}`
      : `${API_BASE}/hotels/${hotelId}/rooms`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  // Bookings
  async createBooking(bookingData: any): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getBookings(email?: string): Promise<Booking[]> {
    const url = email ? `${API_BASE}/bookings?email=${encodeURIComponent(email)}` : `${API_BASE}/bookings`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  async getBookingByCode(code: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/code/${encodeURIComponent(code)}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  // Payments (Bank only: VietQR & Bank Card)
  async createPaymentIntent(payload: { amount: number; method: string; bookingCode: string; hotelName: string }) {
    const res = await fetch(`${API_BASE}/payments/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async verifyPayment(transactionId: string, method: string) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, method })
    });
    const json = await res.json();
    return json.data;
  },

  // Reviews
  async getReviews(hotelId: string): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews/hotel/${hotelId}`);
    const json = await res.json();
    return json.data || [];
  },

  async addReview(reviewData: any): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async likeReview(reviewId: string): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}/like`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  // Loyalty & Promotions
  async getLoyaltyProfile(userId?: string): Promise<LoyaltyUser> {
    const url = userId ? `${API_BASE}/loyalty/profile?userId=${userId}` : `${API_BASE}/loyalty/profile`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async getPromotions(): Promise<Promotion[]> {
    const res = await fetch(`${API_BASE}/loyalty/promotions`);
    const json = await res.json();
    return json.data || [];
  },

  async validateVoucher(code: string): Promise<Promotion> {
    const res = await fetch(`${API_BASE}/loyalty/voucher/${encodeURIComponent(code)}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async markNotificationRead(notifId: string): Promise<LoyaltyUser> {
    const res = await fetch(`${API_BASE}/loyalty/notifications/${notifId}/read`, { method: 'PATCH' });
    const json = await res.json();
    return json.data;
  },

  // Tourism
  async getTourism(hotelId?: string, category?: string): Promise<TourismSpot[]> {
    let url = `${API_BASE}/tourism`;
    if (hotelId) url += `/hotel/${hotelId}`;
    if (category && category !== 'all') {
      url += (url.includes('?') ? '&' : '?') + `category=${encodeURIComponent(category)}`;
    }
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  // Chatbot
  async sendChatMessage(message: string, history: Array<{ sender: string; text: string }>) {
    const res = await fetch(`${API_BASE}/chatbot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getChatbotRecommend(payload: { city?: string; maxPrice?: number; guests?: number; features?: string[] }) {
    const res = await fetch(`${API_BASE}/chatbot/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getChatbotSuggestions() {
    const res = await fetch(`${API_BASE}/chatbot/suggest`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getChatbotConfig() {
    const res = await fetch(`${API_BASE}/chatbot/config`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async updateChatbotConfig(apiKey: string) {
    const res = await fetch(`${API_BASE}/chatbot/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  }
};

