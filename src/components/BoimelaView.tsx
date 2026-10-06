import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Star, 
  Award, 
  Sparkles, 
  ShoppingCart, 
  Eye, 
  Flame, 
  Crown, 
  CheckCircle2, 
  Coins, 
  Truck, 
  Users, 
  Building2, 
  Layers, 
  X,
  TrendingUp,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Product, BoimelaConfig } from '../types';
import { DEFAULT_BOIMELA_CONFIG } from '../data/defaultBoimelaConfig';

interface BoimelaViewProps {
  products: Product[];
  boimelaConfig?: BoimelaConfig;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onPreviewBook?: (product: Product) => void;
  onSelectCategory?: (category: string) => void;
  onSelectAuthor?: (author: string) => void;
  onSelectPublisher?: (publisher: string) => void;
}

// 1. Popular Book Categories
export const POPULAR_BOOK_CATEGORIES = [
  {
    id: 'cat-1',
    title: 'উপন্যাস ও গল্পবই',
    count: '১২,৪৫০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
    query: 'উপন্যাস'
  },
  {
    id: 'cat-2',
    title: 'ভাষা শিক্ষা ও ব্যাকরণ',
    count: '৪,২০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=200&q=80',
    query: 'ভাষা শিক্ষা ও ব্যাকরণ'
  },
  {
    id: 'cat-3',
    title: 'মোটিভেশন ও ইন্সপিরেশন',
    count: '৩,৬০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
    query: 'আত্মউন্নয়ন'
  },
  {
    id: 'cat-4',
    title: 'অনুবাদ: আত্ম-উন্নয়ন ও মেডিটেশন',
    count: '৫,১০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
    query: 'অনুবাদ'
  },
  {
    id: 'cat-5',
    title: 'ব্যবসা উদ্যোগ ও ক্যারিয়ার',
    count: '২,৮০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
    query: 'ব্যবসা ও অর্থনীতি'
  },
  {
    id: 'cat-6',
    title: 'শিশুতোষ শিক্ষামূলক গল্পবই',
    count: '৬,৩০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
    query: 'শিশু-কিশোর'
  },
  {
    id: 'cat-7',
    title: 'মুক্তিযুদ্ধ, রাজনীতি ও সমকালীন',
    count: '৪,৮০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=200&q=80',
    query: 'ইতিহাস ও ঐতিহ্য'
  },
  {
    id: 'cat-8',
    title: 'আত্মউন্নয়ন ও সুন্নাহ বই',
    count: '৮,৯০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=200&q=80',
    query: 'ইসলামি বই'
  },
  {
    id: 'cat-9',
    title: 'ব্যবস্থাপনা ও নেতৃত্ব',
    count: '১,৭৫০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80',
    query: 'ব্যবস্থাপনা'
  },
  {
    id: 'cat-10',
    title: 'শিশু-কিশোর রম্য ও কল্পবিজ্ঞান',
    count: '৩,৪০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=200&q=80',
    query: 'সায়েন্স ফিকশন'
  },
  {
    id: 'cat-11',
    title: 'ইসলামি ব্যক্তিত্ব ও সিরাত',
    count: '৭,৩০০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=200&q=80',
    query: 'ইসলামি বই'
  },
  {
    id: 'cat-12',
    title: 'গণিত অলিম্পিয়াড ও বিজ্ঞান',
    count: '২,১৫০+ বই',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=200&q=80',
    query: 'বিজ্ঞান ও প্রযুক্তি'
  }
];

// 2. Video Reels / Stories
export const BOIMELA_REELS = [
  {
    id: 'reel-1',
    title: 'বইমেলা উদ্বোধনী বিশেষ বয়ান ও ইসলামিক বই সম্ভার',
    subtitle: 'বই পড়ার ফজিলত ও আত্মশুদ্ধি',
    speaker: 'মাওলানা মিজানুর রহমান আজহারী',
    thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'reel-2',
    title: '‘যার কাছে তোমাদের যে কোনো কষ্ট শেয়ার করতে পারো’',
    subtitle: 'তরুণ প্রজন্মের মানসিক প্রশান্তি ও বই',
    speaker: 'শায়খ আহমাদুল্লাহ',
    thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'reel-3',
    title: 'বইমেলা ২০২৬-এর সেরা বুক র্যাক ও উপহার আনবক্সিং',
    subtitle: 'টপসেল গিফট ও কম্বো স্পেশাল',
    speaker: 'টপসেল রিভিউ টিম',
    thumbnail: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'reel-4',
    title: 'রেজিস্ট্রেশন ক্যাম্পেইনে জিতে নিন আকর্ষণীয় স্মার্ট গ্যাজেট',
    subtitle: 'মোবাইল অ্যাপে সহজেই মেলা অফার',
    speaker: 'ক্যাম্পেইন হোস্ট',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'reel-5',
    title: 'প্রিয়জনদের রেফার করে জিতে নিন আরো ৫০ টাকা বোনাস',
    subtitle: 'টপসেল ফ্রেন্ডস রেফারেল প্রোগ্রাম',
    speaker: 'রেফারেল অফার',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'reel-6',
    title: 'ঘরে বসে আয় করুন বইমেলা ক্যারিয়ার প্রোগ্রামের সাথে',
    subtitle: 'স্টুডেন্ট অ্যাফিলিয়েট আর্নিং',
    speaker: 'ক্যারিয়ার মেন্টর',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

// 3. Featured Authors & Publishers Datasets
export const FEATURED_AUTHORS_STACK = [
  { name: 'হুমায়ূন আহমেদ', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80' },
  { name: 'আরিফ আজাদ', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
  { name: 'জাফর ইকবাল', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { name: 'শামসুর রাহমান', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80' }
];

export const FEATURED_PUBLISHERS_STACK = [
  { name: 'প্রথমা প্রকাশন', logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80' },
  { name: 'তাম্রলিপি', logo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80' },
  { name: 'অনন্যা প্রকাশনী', logo: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=120&q=80' },
  { name: 'ঐতিহ্য', logo: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=120&q=80' }
];

// 4. Bestseller Awards Leaderboard Data for 4 columns
export interface LeaderboardItem {
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

export interface LeaderboardAuthorItem {
  id: string;
  rank: number;
  name: string;
  booksCount: number;
  totalSold: string;
  photoUrl: string;
  badge: string;
}

export const FICTION_TOP_BOOKS: LeaderboardItem[] = [
  {
    id: 'f-1',
    rank: 1,
    title: 'প্যারাডক্সিক্যাল সাজিদ',
    author: 'আরিফ আজাদ',
    publisher: 'সমকালীন প্রকাশন',
    rating: 4.9,
    reviewsCount: 78,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
    price: 380,
    discountPrice: 285,
    isHot: true
  },
  {
    id: 'f-2',
    rank: 2,
    title: 'দেয়াল (উপন্যাস)',
    author: 'হুমায়ূন আহমেদ',
    publisher: 'অন্যপ্রকাশ',
    rating: 5.0,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
    price: 450,
    discountPrice: 337
  },
  {
    id: 'f-3',
    rank: 3,
    title: 'কিশোর ক্লাসিক্স সংকলন',
    author: 'রাকিব হাসান',
    publisher: 'সেবা প্রকাশনী',
    rating: 4.8,
    reviewsCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=200&q=80',
    price: 320,
    discountPrice: 240
  },
  {
    id: 'f-4',
    rank: 4,
    title: 'বেলা ফুরাবার আগে',
    author: 'আরিফ আজাদ',
    publisher: 'সমকালীন প্রকাশন',
    rating: 4.9,
    reviewsCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=200&q=80',
    price: 340,
    discountPrice: 255
  }
];

export const NON_FICTION_TOP_BOOKS: LeaderboardItem[] = [
  {
    id: 'nf-1',
    rank: 1,
    title: 'অ্যাটমিক হ্যাবিটস (বাংলা অনুবাদ)',
    author: 'জেমস ক্লিয়ার',
    publisher: 'আদর্শ',
    rating: 5.0,
    reviewsCount: 92,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=200&q=80',
    price: 400,
    discountPrice: 300,
    isHot: true
  },
  {
    id: 'nf-2',
    rank: 2,
    title: 'Plants of Bangladesh',
    author: 'ইউনুস উল্লাহ',
    publisher: 'দি রয়েল পাবলিশার্স',
    rating: 4.7,
    reviewsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
    price: 650,
    discountPrice: 490
  },
  {
    id: 'nf-3',
    rank: 3,
    title: 'ব্যবসার হাতেখড়ি ও ডিজিটাল মার্কেটিং',
    author: 'মুহাম্মদ রেজাউল করিম',
    publisher: 'তাম্রলিপি',
    rating: 4.8,
    reviewsCount: 39,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
    price: 350,
    discountPrice: 260
  },
  {
    id: 'nf-4',
    rank: 4,
    title: 'রিচ ড্যাড পুওর ড্যাড',
    author: 'রবার্ট টি. কিয়োসাকি',
    publisher: 'অনন্যা',
    rating: 4.9,
    reviewsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=200&q=80',
    price: 380,
    discountPrice: 285
  }
];

export const CAREER_ACADEMIC_TOP_BOOKS: LeaderboardItem[] = [
  {
    id: 'ca-1',
    rank: 1,
    title: 'বিসিএস প্রিলিমিনারি ডাইজেস্ট ২০২৬',
    author: 'প্রফেসর’স পাবলিকেশন',
    publisher: 'প্রফেসর’স প্রকাশনী',
    rating: 5.0,
    reviewsCount: 112,
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
    price: 750,
    discountPrice: 525,
    isHot: true
  },
  {
    id: 'ca-2',
    rank: 2,
    title: 'ব্যাংক নিয়োগ স্পেশাল গাইড',
    author: 'কাজী ইনামুল হক',
    publisher: 'আশফাক বুকস',
    rating: 4.8,
    reviewsCount: 74,
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=200&q=80',
    price: 600,
    discountPrice: 420
  },
  {
    id: 'ca-3',
    rank: 3,
    title: 'আইবিএ ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি',
    author: 'মেনটর্স এডুকেশন',
    publisher: 'মেনটর্স গাইড',
    rating: 4.9,
    reviewsCount: 56,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
    price: 550,
    discountPrice: 385
  },
  {
    id: 'ca-4',
    rank: 4,
    title: 'এইচএসসি শর্ট সিলেবাস টেস্ট পেপার্স',
    author: 'লেকচার পাবলিকেশন্স',
    publisher: 'লেকচার',
    rating: 4.7,
    reviewsCount: 41,
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=200&q=80',
    price: 480,
    discountPrice: 336
  }
];

export const CONTEMPORARY_TOP_BOOKS: LeaderboardItem[] = [
  {
    id: 'co-1',
    rank: 1,
    title: 'অপেক্ষা',
    author: 'হুমায়ূন আহমেদ',
    publisher: 'কাকলী প্রকাশনী',
    rating: 5.0,
    reviewsCount: 65,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
    price: 300,
    discountPrice: 225,
    isHot: true
  },
  {
    id: 'co-2',
    rank: 2,
    title: 'সবার জন্য প্রোগ্রামিং',
    author: 'তামিম শাহরিয়ার সুবিন',
    publisher: 'দ্বিমিক প্রকাশনী',
    rating: 4.9,
    reviewsCount: 94,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=200&q=80',
    price: 350,
    discountPrice: 260
  },
  {
    id: 'co-3',
    rank: 3,
    title: 'গ্রাফিতি ও সমকালীন ইতিহাস',
    author: 'ড. সলিমুল্লাহ খান',
    publisher: 'আগামী প্রকাশনী',
    rating: 4.8,
    reviewsCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=200&q=80',
    price: 420,
    discountPrice: 315
  },
  {
    id: 'co-4',
    rank: 4,
    title: 'ছোটদের একুশের গল্প',
    author: 'সেলিনা হোসেন',
    publisher: 'অনিন্দ্য প্রকাশ',
    rating: 4.9,
    reviewsCount: 47,
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=200&q=80',
    price: 250,
    discountPrice: 190
  }
];

// Author rankings
export const TOP_AUTHORS_LIST: LeaderboardAuthorItem[] = [
  { id: 'a-1', rank: 1, name: 'হুমায়ূন আহমেদ', booksCount: 220, totalSold: '১,৫০,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', badge: 'কিংবদন্তি লেখক' },
  { id: 'a-2', rank: 2, name: 'আরিফ আজাদ', booksCount: 14, totalSold: '১,২০,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', badge: 'বেস্টসেলার' },
  { id: 'a-3', rank: 3, name: 'মুহম্মদ জাফর ইকবাল', booksCount: 95, totalSold: '৮৫,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', badge: 'জনপ্রিয়' },
  { id: 'a-4', rank: 4, name: 'ড. খোন্দকার আব্দুল্লাহ জাহাঙ্গীর', booksCount: 32, totalSold: '৭০,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', badge: 'ইসলামিক স্কলার' }
];

export default function BoimelaView({
  products,
  boimelaConfig,
  onSelectProduct,
  onAddToCart,
  onPreviewBook,
  onSelectCategory,
  onSelectAuthor,
  onSelectPublisher
}: BoimelaViewProps) {
  const config = boimelaConfig || DEFAULT_BOIMELA_CONFIG;

  const [activeTabType, setActiveTabType] = useState<Record<string, 'book' | 'author'>>({
    fiction: 'book',
    nonFiction: 'book',
    career: 'book',
    contemporary: 'book'
  });

  const [activeReelModal, setActiveReelModal] = useState<any | null>(null);

  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const reelsScrollRef = useRef<HTMLDivElement>(null);
  const leaderboardScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleTab = (colKey: string, type: 'book' | 'author') => {
    setActiveTabType(prev => ({ ...prev, [colKey]: type }));
  };

  const categories = config.categories?.length ? config.categories : POPULAR_BOOK_CATEGORIES;
  const reels = config.reels?.length ? config.reels : BOIMELA_REELS;
  const authors = config.authors?.length ? config.authors : FEATURED_AUTHORS_STACK;
  const publishers = config.publishers?.length ? config.publishers : FEATURED_PUBLISHERS_STACK;
  const priceDeals = config.priceDeals?.length ? config.priceDeals : DEFAULT_BOIMELA_CONFIG.priceDeals;
  const trustCards = config.hero?.trustCards?.length ? config.hero.trustCards : DEFAULT_BOIMELA_CONFIG.hero.trustCards;
  const sectionToggles = config.sectionToggles || DEFAULT_BOIMELA_CONFIG.sectionToggles;

  return (
    <div className="space-y-6 font-sans select-none animate-fade-in text-slate-800 pb-10">

      {/* SECTION 0: HERO FESTIVAL BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white p-5 sm:p-7 shadow-md border border-rose-700/40">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[11px] sm:text-xs font-black px-3 py-1 rounded-full border border-white/30">
            {config.hero?.announcementBadge || '🎪 অমর একুশে বইমেলা ২০২৬ লাইভ'}
          </span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {config.hero?.bannerTitle || 'বইমেলা ২০২৬ স্পেশাল উৎসব ও বই সম্ভার'}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
            {config.hero?.bannerSubtitle || 'অমর একুশে বইমেলার সকল নতুন বই, বেস্টসেলার এবং বিশেষ ছাড়ে কিনুন টপসেলে'}
          </p>
          <div className="pt-1 flex items-center space-x-3">
            <span className="bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-1 rounded-md shadow-xs">
              {config.hero?.discountText || '২৫% পর্যন্ত বিশেষ মেলা ছাড়'}
            </span>
          </div>
        </div>
        {config.hero?.bannerImageUrl && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 lg:opacity-35 pointer-events-none hidden sm:block">
            <img src={config.hero.bannerImageUrl} alt="Boimela" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* SECTION 1: TOP 3 TRUST BANNERS */}
      {sectionToggles.showTrustBanners !== false && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trustCards.map((card, idx) => (
            <div 
              key={card.id || idx}
              onClick={() => {
                if (idx === 1) {
                  const firstBook = products.find(p => p.type === 'book') || products[0];
                  if (firstBook && onPreviewBook) onPreviewBook(firstBook);
                } else {
                  onSelectCategory?.(card.categoryQuery);
                }
              }}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-sky-400 transition-all cursor-pointer group"
            >
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-black text-slate-600 block">{card.title}</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 block tracking-tight group-hover:text-sky-600 transition-colors">
                  {card.subtitle}
                </span>
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0284c7] flex items-center justify-center text-white font-black text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {card.iconText || (idx === 0 ? '৳' : idx === 1 ? '📖' : '🪙')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: জনপ্রিয় বইয়ের ক্যাটাগরি (Popular Book Categories) */}
      {sectionToggles.showCategories !== false && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-sans">
              জনপ্রিয় বইয়ের ক্যাটাগরি
            </h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => scroll(categoriesScrollRef, 'left')}
                className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(categoriesScrollRef, 'right')}
                className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2-Row Horizontal Scrollable Grid matching the screenshot */}
          <div 
            ref={categoriesScrollRef}
            className="overflow-x-auto scrollbar-none scroll-smooth py-1"
          >
            <div className="grid grid-rows-2 grid-flow-col auto-cols-[240px] sm:auto-cols-[260px] gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory?.(cat.query)}
                  className="flex items-center space-x-3 p-2.5 bg-white hover:bg-sky-50/50 border border-slate-200/90 rounded-lg shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-12 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h4 className="text-xs font-black text-slate-850 truncate group-hover:text-sky-600 transition-colors">
                      {cat.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {cat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: VIDEO REELS / STORIES STRIP WITH PLAY BUTTON */}
      {sectionToggles.showReels !== false && (
        <div className="relative">
          <div 
            ref={reelsScrollRef}
            className="flex space-x-3 overflow-x-auto scrollbar-none scroll-smooth py-1"
          >
            {reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveReelModal(reel)}
                className="relative w-[150px] sm:w-[175px] md:w-[195px] h-[210px] sm:h-[240px] md:h-[270px] rounded-xl overflow-hidden shadow-xs shrink-0 cursor-pointer group border border-slate-200 bg-slate-900"
              >
                {/* Background Thumbnail Image */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20"></div>

                {/* Center Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/80 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-sky-600 transition-all">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 text-left">
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-snug line-clamp-2 drop-shadow-sm">
                    {reel.title}
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-sky-300 font-semibold block mt-1 truncate">
                    {reel.speaker}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Arrows */}
          <button
            onClick={() => scroll(reelsScrollRef, 'left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white text-slate-800 p-2 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:flex items-center justify-center hover:bg-slate-50 transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(reelsScrollRef, 'right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white text-slate-800 p-2 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:flex items-center justify-center hover:bg-slate-50 transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 4: DUAL EXPLORATION STRIP (প্রিয় লেখক ও প্রকাশনী) */}
      {sectionToggles.showAuthorPublisher !== false && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Left: প্রিয় লেখকের বই খুঁজুন */}
          <div 
            onClick={() => onSelectAuthor?.(authors[0]?.name || 'হুমায়ূন আহমেদ')}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
          >
            <div className="text-left">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                প্রিয় লেখকের বই খুঁজুন
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                ১,৭২,৪৮৭ জন লেখক
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Avatar Stack */}
              <div className="flex -space-x-2 overflow-hidden items-center">
                {authors.slice(0, 4).map((author, idx) => (
                  <img
                    key={idx}
                    src={author.photo}
                    alt={author.name}
                    className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover shadow-xs"
                  />
                ))}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Right: প্রকাশনী অনুযায়ী বই খুঁজুন */}
          <div 
            onClick={() => onSelectPublisher?.(publishers[0]?.name || 'প্রথমা প্রকাশন')}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
          >
            <div className="text-left">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                প্রকাশনী অনুযায়ী বই খুঁজুন
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                ১৬,৮৬৫ প্রকাশনী
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Publisher Stack */}
              <div className="flex -space-x-2 overflow-hidden items-center">
                {publishers.slice(0, 4).map((pub, idx) => (
                  <div 
                    key={idx}
                    className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-700 shadow-xs uppercase overflow-hidden"
                  >
                    <img src={pub.logo} alt={pub.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ৪টি আকর্ষণীয় প্রাইস টায়ার ও অফার কার্ড (Price Deals & Free Delivery) */}
      {sectionToggles.showPriceDeals !== false && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {priceDeals.map((deal, idx) => (
            <div 
              key={deal.id || idx}
              onClick={() => onSelectCategory?.(deal.query)}
              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="text-left space-y-0.5 min-w-0">
                <h5 className="text-[11px] sm:text-xs font-black text-slate-800 truncate">{deal.title}</h5>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-0.5 group-hover:underline">
                  <span>এখনই কিনুন</span>
                  <ChevronRight className="w-3 h-3 inline" />
                </span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-black text-xs">
                ৳{deal.priceLimit}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 6: BOIMELA GRAND HORIZONTAL PROMO BANNER */}
      <div 
        onClick={() => onSelectCategory?.('একাডেমিক বই')}
        className="rounded-2xl overflow-hidden bg-[#0f5132] text-white shadow-md flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 cursor-pointer group relative"
      >
        {/* Background Subtle Wave Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Left Side: Boimela 2026 Creative Branding Logo */}
        <div className="flex items-center space-x-3 z-10 py-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center p-1.5 shadow-lg border-2 border-amber-300 transform group-hover:rotate-3 transition-transform">
            <BookOpen className="w-6 h-6 text-sky-600" />
            <span className="text-[9px] font-black text-rose-600 tracking-tighter uppercase leading-none mt-1">বইমেলা</span>
            <span className="text-[8px] font-extrabold text-slate-900 leading-none">২০২৬</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-black block">টপসেল অনলাইন</span>
            <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white leading-tight">
              অমর একুশে বইমেলা ২০২৬
            </h2>
          </div>
        </div>

        {/* Right Side: Big Discount Promo Callout */}
        <div className="flex items-center space-x-4 z-10 mt-3 md:mt-0">
          <div className="text-center md:text-right">
            <span className="text-sm sm:text-base font-black text-amber-200 block">একাডেমিক ও সব বইয়ে</span>
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-end space-x-1.5">
              <span>৫০%</span>
              <span className="text-xs sm:text-base font-bold text-amber-300">পর্যন্ত ছাড়</span>
            </div>
          </div>
          <div className="bg-amber-400 group-hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm py-2 sm:py-2.5 px-4 rounded-xl shadow-md transition-colors hidden sm:block">
            বইসমূহ দেখুন
          </div>
        </div>
      </div>

      {/* SECTION 7: বইমেলা বেস্টসেলার অ্যাওয়ার্ড ২০২৬ (Leaderboard Multi-column) */}
      {sectionToggles.showLeaderboard !== false && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs">
        
        {/* Header with Award Trophy & Official Description */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
              <Award className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
                টপসেল বইমেলা বেস্টসেলার অ্যাওয়ার্ড ২০২৬
              </h3>
              <span className="text-xs font-bold text-amber-600">
                পাঠক ও বিচারকমণ্ডলীর মূল্যায়নে সেরা তালিকা
              </span>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-2xl text-left bg-slate-50 p-3 rounded-xl border border-slate-150">
            জ্ঞানপিপাসু পাঠকদের ২৩তম বারের মতো উদযাপিত হয়েছে রকমারি অনলাইন বইমেলা বেস্টসেলার অ্যাওয়ার্ড-২০২৬ জাঁকজমক। ১ এপ্রিল ২০২৫ থেকে ৩১ মার্চ ২০২৬ পর্যন্ত প্রকাশিত নবীন-প্রবীণ নির্বাচিত নতুন বইসমূহ এই বিচারকমণ্ডলীর আওতাধীন। সর্বমোট চারটি প্রধান ক্যাটাগরি যথা: ফিকশন, নন-ফিকশন, সমকালীন ও ক্যারিয়ার একাডেমিক—এই চারটি বিভাগে সেরা তালিকা নিচে উপস্থাপিত।
          </p>
        </div>

        {/* 4 Multi-Column Ranking Tables with Toggle Switches */}
        <div className="relative">
          <div 
            ref={leaderboardScrollRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-2"
          >
            {/* COLUMN 1: ফিকশন বই (Fiction Books) */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-850 text-center mb-2.5">
                  ফিকশন বই
                </h4>

                {/* Pill Tab Switcher (বই | লেখক) */}
                <div className="grid grid-cols-2 bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold mb-3">
                  <button
                    onClick={() => handleToggleTab('fiction', 'book')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.fiction === 'book' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    বই
                  </button>
                  <button
                    onClick={() => handleToggleTab('fiction', 'author')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.fiction === 'author' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    লেখক
                  </button>
                </div>

                {/* Sub-dropdown label */}
                <div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-md py-1 px-2.5 flex items-center justify-between mb-3 shadow-2xs">
                  <span>All In Fiction Books</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
                </div>

                {/* Items List */}
                {activeTabType.fiction === 'book' ? (
                  <div className="space-y-2">
                    {(config.leaderboard?.fiction?.length ? config.leaderboard.fiction : FICTION_TOP_BOOKS).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          const p = products.find(prod => prod.title.includes(item.title) || prod.id === item.id);
                          if (p && onSelectProduct) onSelectProduct(p);
                        }}
                        className="bg-white border border-slate-200/90 rounded-lg p-2 flex items-center space-x-2.5 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
                      >
                        {/* Rank Badge */}
                        <div className="w-5 flex flex-col items-center justify-center shrink-0">
                          {item.rank === 1 ? (
                            <span className="text-amber-500 font-black text-xs flex flex-col items-center leading-none">
                              <Crown className="w-3.5 h-3.5 fill-amber-400 mb-0.5" />
                              1
                            </span>
                          ) : (
                            <span className="text-slate-500 font-black text-xs">{item.rank}</span>
                          )}
                        </div>

                        {/* Thumbnail */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-9 h-11 object-cover rounded shadow-2xs shrink-0 border border-slate-150"
                        />

                        {/* Info */}
                        <div className="min-w-0 flex-1 text-left">
                          <h5 className="text-[11.5px] font-black text-slate-900 truncate group-hover:text-sky-600">
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {item.author}
                          </span>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-2 h-2 fill-amber-400" />
                              ))}
                            </div>
                            <span className="text-[8.5px] text-slate-400">({item.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Price & Quick Cart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onAddToCart) {
                              const dummyProd: Product = {
                                id: item.id,
                                title: item.title,
                                authorOrBrand: item.author,
                                originalPrice: item.price,
                                discountedPrice: item.discountPrice,
                                discountPercent: Math.round(((item.price - item.discountPrice) / item.price) * 100),
                                category: 'উপন্যাস',
                                type: 'book',
                                inStock: true,
                                rating: item.rating,
                                totalRatings: item.reviewsCount,
                                imageUrl: item.imageUrl
                              };
                              onAddToCart(dummyProd);
                            }
                          }}
                          className="p-1.5 rounded bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 transition-colors cursor-pointer shrink-0"
                          title="কার্টে যোগ করুন"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(config.leaderboard?.topAuthors?.length ? config.leaderboard.topAuthors : TOP_AUTHORS_LIST).map((author) => (
                      <div
                        key={author.id}
                        onClick={() => onSelectAuthor?.(author.name)}
                        className="bg-white border border-slate-200/90 rounded-lg p-2 flex items-center space-x-2.5 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
                      >
                        <span className="text-slate-500 font-black text-xs w-4 text-center">{author.rank}</span>
                        <img src={author.photoUrl} alt={author.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div className="min-w-0 flex-1 text-left">
                          <h5 className="text-[11.5px] font-black text-slate-900 truncate group-hover:text-sky-600">{author.name}</h5>
                          <span className="text-[9.5px] text-slate-500">{author.totalSold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: নন-ফিকশন বই (Non-Fiction Books) */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-850 text-center mb-2.5">
                  নন ফিকশন বই
                </h4>

                {/* Pill Tab Switcher */}
                <div className="grid grid-cols-2 bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold mb-3">
                  <button
                    onClick={() => handleToggleTab('nonFiction', 'book')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.nonFiction === 'book' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    বই
                  </button>
                  <button
                    onClick={() => handleToggleTab('nonFiction', 'author')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.nonFiction === 'author' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    লেখক
                  </button>
                </div>

                <div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-md py-1 px-2.5 flex items-center justify-between mb-3 shadow-2xs">
                  <span>All In Non-Fiction Books</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {(config.leaderboard?.nonFiction?.length ? config.leaderboard.nonFiction : NON_FICTION_TOP_BOOKS).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const p = products.find(prod => prod.title.includes(item.title) || prod.id === item.id);
                        if (p && onSelectProduct) onSelectProduct(p);
                      }}
                      className="bg-white border border-slate-200/90 rounded-lg p-2 flex items-center space-x-2.5 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
                    >
                      <div className="w-5 flex flex-col items-center justify-center shrink-0">
                        {item.rank === 1 ? (
                          <span className="text-amber-500 font-black text-xs flex flex-col items-center leading-none">
                            <Crown className="w-3.5 h-3.5 fill-amber-400 mb-0.5" />
                            1
                          </span>
                        ) : (
                          <span className="text-slate-500 font-black text-xs">{item.rank}</span>
                        )}
                      </div>

                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-9 h-11 object-cover rounded shadow-2xs shrink-0 border border-slate-150"
                      />

                      <div className="min-w-0 flex-1 text-left">
                        <h5 className="text-[11.5px] font-black text-slate-900 truncate group-hover:text-sky-600">
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {item.author}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2 h-2 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[8.5px] text-slate-400">({item.reviewsCount})</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) {
                            const dummyProd: Product = {
                              id: item.id,
                              title: item.title,
                              authorOrBrand: item.author,
                              originalPrice: item.price,
                              discountedPrice: item.discountPrice,
                              discountPercent: Math.round(((item.price - item.discountPrice) / item.price) * 100),
                              category: 'নন-ফিকশন',
                              type: 'book',
                              inStock: true,
                              rating: item.rating,
                              totalRatings: item.reviewsCount,
                              imageUrl: item.imageUrl
                            };
                            onAddToCart(dummyProd);
                          }
                        }}
                        className="p-1.5 rounded bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 transition-colors cursor-pointer shrink-0"
                        title="কার্টে যোগ করুন"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 3: ক্যারিয়ার ও একাডেমিক বই (Career & Academic Books) */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-850 text-center mb-2.5">
                  ক্যারিয়ার ও একাডেমিক বই
                </h4>

                <div className="grid grid-cols-2 bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold mb-3">
                  <button
                    onClick={() => handleToggleTab('career', 'book')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.career === 'book' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    বই
                  </button>
                  <button
                    onClick={() => handleToggleTab('career', 'author')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.career === 'author' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    লেখক
                  </button>
                </div>

                <div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-md py-1 px-2.5 flex items-center justify-between mb-3 shadow-2xs">
                  <span>All In Career & Academic</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {(config.leaderboard?.career?.length ? config.leaderboard.career : CAREER_ACADEMIC_TOP_BOOKS).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const p = products.find(prod => prod.title.includes(item.title) || prod.id === item.id);
                        if (p && onSelectProduct) onSelectProduct(p);
                      }}
                      className="bg-white border border-slate-200/90 rounded-lg p-2 flex items-center space-x-2.5 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
                    >
                      <div className="w-5 flex flex-col items-center justify-center shrink-0">
                        {item.rank === 1 ? (
                          <span className="text-amber-500 font-black text-xs flex flex-col items-center leading-none">
                            <Crown className="w-3.5 h-3.5 fill-amber-400 mb-0.5" />
                            1
                          </span>
                        ) : (
                          <span className="text-slate-500 font-black text-xs">{item.rank}</span>
                        )}
                      </div>

                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-9 h-11 object-cover rounded shadow-2xs shrink-0 border border-slate-150"
                      />

                      <div className="min-w-0 flex-1 text-left">
                        <h5 className="text-[11.5px] font-black text-slate-900 truncate group-hover:text-sky-600">
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {item.author}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2 h-2 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[8.5px] text-slate-400">({item.reviewsCount})</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) {
                            const dummyProd: Product = {
                              id: item.id,
                              title: item.title,
                              authorOrBrand: item.author,
                              originalPrice: item.price,
                              discountedPrice: item.discountPrice,
                              discountPercent: Math.round(((item.price - item.discountPrice) / item.price) * 100),
                              category: 'একাডেমিক বই',
                              type: 'book',
                              inStock: true,
                              rating: item.rating,
                              totalRatings: item.reviewsCount,
                              imageUrl: item.imageUrl
                            };
                            onAddToCart(dummyProd);
                          }
                        }}
                        className="p-1.5 rounded bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 transition-colors cursor-pointer shrink-0"
                        title="কার্টে যোগ করুন"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 4: সমকালীন ও শিশু-কিশোর বই (Contemporary & Kids Books) */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-850 text-center mb-2.5">
                  সমকালীন ও শিশু-কিশোর
                </h4>

                <div className="grid grid-cols-2 bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold mb-3">
                  <button
                    onClick={() => handleToggleTab('contemporary', 'book')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.contemporary === 'book' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    বই
                  </button>
                  <button
                    onClick={() => handleToggleTab('contemporary', 'author')}
                    className={`py-1 rounded-md transition-all cursor-pointer ${
                      activeTabType.contemporary === 'author' ? 'bg-white text-sky-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    লেখক
                  </button>
                </div>

                <div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-md py-1 px-2.5 flex items-center justify-between mb-3 shadow-2xs">
                  <span>All In Kids & Contemporary</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {(config.leaderboard?.contemporary?.length ? config.leaderboard.contemporary : CONTEMPORARY_TOP_BOOKS).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const p = products.find(prod => prod.title.includes(item.title) || prod.id === item.id);
                        if (p && onSelectProduct) onSelectProduct(p);
                      }}
                      className="bg-white border border-slate-200/90 rounded-lg p-2 flex items-center space-x-2.5 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
                    >
                      <div className="w-5 flex flex-col items-center justify-center shrink-0">
                        {item.rank === 1 ? (
                          <span className="text-amber-500 font-black text-xs flex flex-col items-center leading-none">
                            <Crown className="w-3.5 h-3.5 fill-amber-400 mb-0.5" />
                            1
                          </span>
                        ) : (
                          <span className="text-slate-500 font-black text-xs">{item.rank}</span>
                        )}
                      </div>

                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-9 h-11 object-cover rounded shadow-2xs shrink-0 border border-slate-150"
                      />

                      <div className="min-w-0 flex-1 text-left">
                        <h5 className="text-[11.5px] font-black text-slate-900 truncate group-hover:text-sky-600">
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {item.author}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2 h-2 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[8.5px] text-slate-400">({item.reviewsCount})</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) {
                            const dummyProd: Product = {
                              id: item.id,
                              title: item.title,
                              authorOrBrand: item.author,
                              originalPrice: item.price,
                              discountedPrice: item.discountPrice,
                              discountPercent: Math.round(((item.price - item.discountPrice) / item.price) * 100),
                              category: 'শিশু-কিশোর',
                              type: 'book',
                              inStock: true,
                              rating: item.rating,
                              totalRatings: item.reviewsCount,
                              imageUrl: item.imageUrl
                            };
                            onAddToCart(dummyProd);
                          }
                        }}
                        className="p-1.5 rounded bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 transition-colors cursor-pointer shrink-0"
                        title="কার্টে যোগ করুন"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      )}

      {/* REEL VIDEO MODAL */}
      {activeReelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div>
                <h4 className="text-sm font-black text-white">{activeReelModal.title}</h4>
                <span className="text-xs text-sky-400">{activeReelModal.speaker}</span>
              </div>
              <button
                onClick={() => setActiveReelModal(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative aspect-[16/9] w-full bg-black">
              <img
                src={activeReelModal.thumbnail}
                alt={activeReelModal.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-4 text-center">
                <div className="w-14 h-14 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <p className="text-xs text-slate-200 max-w-xs">
                  {activeReelModal.subtitle}
                </p>
                <button
                  onClick={() => {
                    alert(`বইমেলা ২০২৬ বিশেষ ভিডিও প্লেয়ার চালু হচ্ছে: ${activeReelModal.title}`);
                    setActiveReelModal(null);
                  }}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-black text-xs py-2 px-5 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  ভিডিও দেখুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
