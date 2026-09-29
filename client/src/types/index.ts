export interface Hotel {
  id: string;
  name: string;
  branchCode: string;
  city: string;
  address: string;
  tagline?: string;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  coverImage: string;
  galleryImages: string[];
  priceStarting: number;
  description: string;
  amenities: string[];
  phone?: string;
  email?: string;
  rooms?: Room[];
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  areaSqm: number;
  view: string;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  totalRooms?: number;
  availableRooms?: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  roomPrice: number;
  discountAmount: number;
  voucherApplied?: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'bank_card';
  specialRequests?: string;
  loyaltyPointsEarned: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  hotelId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  cleanRating: number;
  serviceRating: number;
  locationRating: number;
  comment: string;
  roomType?: string;
  verifiedBooking: boolean;
  likes: number;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  description: string;
  validUntil: string;
  minTier: string;
  category?: string;
  badge?: string;
  bannerImage?: string;
}

export interface TourismSpot {
  id: string;
  hotelId: string;
  name: string;
  category: string;
  distanceKm: number;
  description: string;
  highlight?: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  culturalSignificance?: string;
  bestTimeToVisit?: string;
  suggestedDuration?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: string;
}

export interface LoyaltyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  points: number;
  pointsToNextTier: number;
  nextTier: string;
  memberSince: string;
  totalBookings: number;
  role?: string;
  benefits: string[];
  notifications: NotificationItem[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  hotelId?: string;
  location?: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  excerpt: string;
  content: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  transferContent: string;
  amount: number;
}
