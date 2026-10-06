export type ProductType = 'book' | 'electronic' | 'superstore' | 'fashion' | 'kids';

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  originalTitle?: string;
  authorOrBrand: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  rating: number;
  totalRatings: number;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  inStock: boolean;
  category: string;
  childCategory?: string;
  publisherCompany?: string;
  badgeText?: string;
  previewChapters?: { title: string; content: string }[];
  isFlashSale?: boolean;
  isQuickDeal?: boolean;
  quickDealTab?: string;
  availableSizes?: string[];
  availableColors?: string[];
  sizeChartDetails?: string;
  productDescription?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  actionUrl?: string;
  bgColor?: string;
  badge?: string;
}

export interface ReviewTestimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  avatarUrl: string;
}

export interface SearchFilters {
  category: string;
  sortBy: string;
  brandOrAuthor: string[];
  inStockOnly: boolean;
  priceRange: [number, number];
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  discountPercent: number;
  productIds: string[];
  isActive: boolean;
  endDate: string;
  giftDetails?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userUid: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  title?: string;
  createdAt: string;
  isVerified: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulUsers: string[];
  notHelpfulUsers: string[];
}

export interface PromoPopupConfig {
  isEnabled: boolean;
  title: string;
  subtitle: string;
  highlightText: string;
  couponCode: string;
  couponDetails: string;
  imageUrl?: string;
  buttonText: string;
  buttonActionUrl: string;
  termsText: string;
  delaySeconds: number;
  showFrequency: 'always' | 'once_per_session';
}

export interface SiteSettings {
  hotline: string;
  operatingHours: string;
  announcementText: string;
  logoTitle: string;
  logoImageUrl?: string;
  favicon?: string;
}

export interface BoimelaTrustCard {
  id: string;
  title: string;
  subtitle: string;
  iconText: string;
  categoryQuery: string;
}

export interface BoimelaCategoryItem {
  id: string;
  title: string;
  count: string;
  imageUrl: string;
  query: string;
}

export interface BoimelaReelItem {
  id: string;
  title: string;
  subtitle?: string;
  speaker: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  views?: string;
}

export interface BoimelaPriceDealItem {
  id: string;
  title: string;
  badge?: string;
  priceLimit: number;
  query: string;
  color: string;
}

export interface BoimelaAuthorItem {
  id?: string;
  name: string;
  photo: string;
}

export interface BoimelaPublisherItem {
  id?: string;
  name: string;
  logo: string;
}

export interface BoimelaLeaderboardItem {
  id: string;
  rank: number;
  title: string;
  author: string;
  publisher?: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  price: number;
  discountPrice: number;
  isHot?: boolean;
}

export interface BoimelaLeaderboardAuthor {
  id: string;
  rank: number;
  name: string;
  booksCount: number;
  totalSold: string;
  photoUrl: string;
  badge: string;
}

export interface BoimelaConfig {
  hero: {
    bannerTitle: string;
    bannerSubtitle: string;
    announcementBadge: string;
    bannerImageUrl?: string;
    discountText: string;
    trustCards: BoimelaTrustCard[];
  };
  categories: BoimelaCategoryItem[];
  reels: BoimelaReelItem[];
  authors: BoimelaAuthorItem[];
  publishers: BoimelaPublisherItem[];
  priceDeals: BoimelaPriceDealItem[];
  leaderboard: {
    fiction: BoimelaLeaderboardItem[];
    nonFiction: BoimelaLeaderboardItem[];
    career: BoimelaLeaderboardItem[];
    contemporary: BoimelaLeaderboardItem[];
    topAuthors: BoimelaLeaderboardAuthor[];
  };
  sectionToggles: {
    showTrustBanners: boolean;
    showCategories: boolean;
    showReels: boolean;
    showAuthorPublisher: boolean;
    showPriceDeals: boolean;
    showLeaderboard: boolean;
  };
}

export interface AffiliateUser {
  id: string;
  name: string;
  phoneOrEmail: string;
  password?: string;
  referralCode: string;
  channelUrl?: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  paymentNumber: string;
  status: 'active' | 'pending' | 'suspended';
  commissionRate: number; // e.g. 10
  totalClicks: number;
  totalOrders: number;
  totalSalesAmount: number;
  totalEarnings: number;
  currentBalance: number;
  totalWithdrawn: number;
  createdAt: string;
}

export interface AffiliateWithdrawal {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliatePhone: string;
  amount: number;
  paymentMethod: string;
  paymentNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
  transactionId?: string;
  adminNote?: string;
}

export interface AffiliateProgramConfig {
  isEnabled: boolean;
  defaultCommissionPercent: number;
  minimumWithdrawalAmount: number;
  cookieDurationDays: number;
  bannerTitle: string;
  bannerSubtitle: string;
  tutorialVideoUrl: string;
}

export interface SingleProductLandingPage {
  id: string;
  slug: string;
  productId: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  bannerImageUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  offerPrice: number;
  originalPrice: number;
  discountPercent: number;
  deliveryFee: number;
  deliveryText?: string;
  features: string[];
  urgencyText?: string;
  countdownHours?: number;
  status: 'active' | 'inactive';
  orderCount?: number;
  viewsCount?: number;
  createdAt: string;
}

