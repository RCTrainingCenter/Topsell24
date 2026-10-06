import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Grid, 
  Smartphone, 
  Heart, 
  Scissors, 
  Cpu, 
  Apple, 
  Gift, 
  FileText, 
  Smile, 
  Info, 
  Star, 
  ShoppingCart, 
  Eye, 
  BadgePercent,
  Atom,
  PenTool,
  Award,
  BookMarked,
  Headphones,
  GraduationCap
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { DEFAULT_HOMEPAGE_CATEGORIES } from '../data';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import RokomariFeaturesShowcase from './RokomariFeaturesShowcase';
import { getProductImageUrl } from '../lib/bookUtils';

export const DEFAULT_HOME_GRIDS = {
  books: {
    title: 'বই',
    link: 'books',
    icon: '📚',
    items: [
      { title: 'প্যারাডক্সিক্যাল সাজিদ', author: 'আরিফ আজাদ', price: 260, bg: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
      { title: 'বেলা ফুরাবার আগে', author: 'আরিফ আজাদ', price: 280, bg: 'bg-gradient-to-br from-rose-500 to-amber-600' },
      { title: 'স্মার্ট থিংকিং', author: 'ম্যাথিউ সাঈদ', price: 350, bg: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
      { title: 'রিচার্জ আপনার ডাউন ব্যাটারি', author: 'ঝংকার মাহবুব', price: 290, bg: 'bg-gradient-to-br from-cyan-500 to-blue-600' }
    ]
  },
  electronics: {
    title: 'ইলেক্ট্রনিক্স',
    link: 'electronics',
    icon: '⚡',
    items: [
      { title: 'GEEOO X12 Super Bass Wired Earphone', author: 'GEEOO', price: 240, bg: 'bg-gradient-to-br from-sky-500 to-blue-600' },
      { title: 'M10 TWS Wireless Earbuds Bluetooth 5.1', author: 'TWS Audio', price: 420, bg: 'bg-gradient-to-br from-violet-500 to-purple-600' },
      { title: 'Megastar M8 High Fidelity Headphone', author: 'Megastar', price: 850, bg: 'bg-gradient-to-br from-amber-500 to-orange-600' },
      { title: 'Smart Fitness Tracker Smartwatch', author: 'FitPro', price: 1250, bg: 'bg-gradient-to-br from-emerald-500 to-teal-600' }
    ]
  },
  superstore: {
    title: 'সুপার স্টোর',
    link: 'superstore',
    icon: '🛒',
    items: [
      { title: 'প্রিমিয়াম কোয়ালিটি কালোজিরা স্পেশাল মধু', author: 'সুপার স্টোর', price: 490, bg: 'bg-gradient-to-br from-amber-500 to-yellow-600' },
      { title: 'খাঁটি সরিষার তেল ঘানি ভাঙা ১ লিটার', author: 'ন্যাচারাল ফ্রেশ', price: 310, bg: 'bg-gradient-to-br from-orange-500 to-red-600' },
      { title: 'প্রিমিয়াম কাজুবাদাম ও পেস্তা বাদাম কম্বো', author: 'অর্গানিক ফুড', price: 650, bg: 'bg-gradient-to-br from-emerald-600 to-green-700' },
      { title: 'এক্সট্রা ভার্জিন অলিভ অয়েল ৫০০ মিলি', author: 'স্প্যানিশ গোল্ড', price: 780, bg: 'bg-gradient-to-br from-teal-500 to-cyan-600' }
    ]
  },
  fashion: {
    title: 'ফ্যাশন',
    link: 'fashion',
    icon: '👕',
    items: [
      { title: 'Stylish New Polo Shirt - PK Cotton', author: 'Topsell Fashion', price: 390, bg: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
      { title: 'Slim Fit Stretchable Denim Jeans Pant', author: 'Denim Republic', price: 790, bg: 'bg-gradient-to-br from-blue-600 to-indigo-700' },
      { title: 'Men Ultra-Light Running Sneakers Shoe', author: 'StepUp Footwear', price: 1190, bg: 'bg-gradient-to-br from-amber-500 to-orange-600' },
      { title: 'Royal Embroidered Cotton Panjabi', author: 'Aarong Style', price: 990, bg: 'bg-gradient-to-br from-purple-500 to-rose-600' }
    ]
  },
  kids: {
    title: 'কিডস জোন',
    link: 'kids',
    icon: '🧸',
    items: [
      { title: 'ম্যাগনেটিক ড্রয়িং ও লার্নিং বোর্ড', author: 'কিডস জোন', price: 380, bg: 'bg-gradient-to-br from-pink-500 to-rose-600' },
      { title: 'টকিং ক্যাকটাস মিউজিক্যাল টয়', author: 'স্মার্ট কিডস', price: 550, bg: 'bg-gradient-to-br from-lime-500 to-emerald-600' },
      { title: 'বিল্ডিং ব্লকস ১২০ পিস সেট', author: 'টয় ক্রাফট', price: 490, bg: 'bg-gradient-to-br from-indigo-500 to-cyan-600' },
      { title: 'বাচ্চাদের বর্ণমালা ও সংখ্যা শেখার বই', author: 'শিশুমেলা', price: 180, bg: 'bg-gradient-to-br from-amber-400 to-rose-500' }
    ]
  }
};

export const AUTHOR_PHOTO_MAP: Record<string, string> = {
  'হুমায়ূন আহমেদ': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
  'মুহম্মদ জাফর ইকবাল': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  'সাদাত হোসাইন': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'সাদমান সাদিক': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'আরিফ আজাদ': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'রকিব হাসান': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'আনিসুল হক': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'কাজী আনোয়ার হোসেন': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'সুনীল গঙ্গোপাধ্যায়': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'তসলিমা নাসরিন': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'মুনজেরীন শহীদ': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'শরিফ হাবিব': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'মাফরুল ইসলাম': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
};

const getSectionTheme = (tabGroup: string) => {
  switch (tabGroup) {
    case "Today's Deal":
      return {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "⚡",
        badgeBg: "bg-amber-100 text-amber-800 border border-amber-200",
        titleBn: "আজকের সেরা ডিল",
        titleColor: "text-sky-600",
        accentColor: "text-sky-600",
        btnColor: "bg-sky-500 hover:bg-sky-600",
      };
    case "Buy 1 Get 1":
      return {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "🎁",
        badgeBg: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        titleBn: "১টি কিনলে ১টি ফ্রি",
        titleColor: "text-emerald-700",
        accentColor: "text-emerald-600",
        btnColor: "bg-emerald-500 hover:bg-emerald-600",
      };
    case "Free Shipping":
      return {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "🚚",
        badgeBg: "bg-rose-100 text-rose-800 border border-rose-200",
        titleBn: "ফ্রি ডেলিভারি অফার",
        titleColor: "text-rose-600",
        accentColor: "text-rose-600",
        btnColor: "bg-rose-500 hover:bg-rose-600",
      };
    case "Super Saving Bundle":
      return {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "🔥",
        badgeBg: "bg-violet-100 text-violet-800 border border-violet-200",
        titleBn: "সুপার সেভিং বান্ডেল",
        titleColor: "text-violet-700",
        accentColor: "text-violet-600",
        btnColor: "bg-violet-600 hover:bg-violet-700",
      };
    default:
      return {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "⚡",
        badgeBg: "bg-slate-100 text-slate-800 border border-slate-200",
        titleBn: tabGroup,
        titleColor: "text-slate-800",
        accentColor: "text-slate-600",
        btnColor: "bg-slate-500 hover:bg-slate-600",
      };
  }
};

const QuickDealSectionRow = ({
  tabGroup,
  products,
  config,
  isLoadingProducts,
  triggerQuickDealAddToCart,
  getProductImageUrl,
  scrollContainer,
  onSelectProduct,
}: any) => {
  const localScrollRef = useRef<HTMLDivElement>(null);
  
  // Get all matching deals
  const mappedQuickDeals = products
    .filter(p => p.isQuickDeal)
    .map(p => ({
      id: p.id,
      title: p.title,
      tabGroup: p.quickDealTab || "Today's Deal",
      originalPrice: p.originalPrice,
      discountedPrice: p.discountedPrice,
      discountPercent: p.discountPercent,
      imageUrl: p.imageUrl,
      badge: p.badgeText || p.authorOrBrand,
      inStockCount: 15,
    }));
  
  const allQuickDeals = [
    ...mappedQuickDeals,
    ...(config.quickDeals || [])
  ];
  
  const filteredDeals = allQuickDeals.filter((qd: any) => qd.tabGroup === tabGroup);

  // If there are no items to show, don't render this section to keep UI clean
  if (!isLoadingProducts && filteredDeals.length === 0) {
    return null;
  }

  const theme = getSectionTheme(tabGroup);

  const handleProductClick = (qd: any) => {
    const existingProduct = products.find((p: any) => p.id === qd.id);
    if (existingProduct) {
      onSelectProduct?.(existingProduct);
    } else {
      const fallbackProduct: Product = {
        id: qd.id || `qd-${Date.now()}`,
        type: 'book',
        title: qd.title,
        authorOrBrand: qd.badge || 'গ্যাজেট অ্যান্ড বুকস',
        category: 'সাধারণ',
        originalPrice: qd.originalPrice || 0,
        discountedPrice: qd.discountedPrice || 0,
        discountPercent: qd.discountPercent || 0,
        rating: 4.8,
        totalRatings: 24,
        imageUrl: qd.imageUrl,
        inStock: true,
        isQuickDeal: true,
        quickDealTab: tabGroup
      };
      onSelectProduct?.(fallbackProduct);
    }
  };

  return (
    <div className="bg-white rounded-xl p-3.5 sm:p-5 space-y-3 shadow-xs border border-slate-200">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <div className="flex items-center space-x-2">
          <span className={`${theme.titleColor} text-sm sm:text-base font-black tracking-tight flex items-center font-sans`}>
            <span className="mr-1.5 text-lg sm:text-xl animate-bounce inline-block">{theme.icon}</span>
            {theme.titleBn}
          </span>
        </div>
      </div>

      {/* Product Cards Row (Scrollable horizontally) */}
      <div className="relative group">
        <div 
          ref={localScrollRef}
          className="flex overflow-x-auto gap-3 py-1.5 scrollbar-none scroll-smooth snap-x"
        >
          {isLoadingProducts ? (
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="w-[155px] sm:w-[172px] shrink-0 snap-start animate-pulse bg-slate-100 rounded-lg h-56" />
            ))
          ) : (
            filteredDeals.map((qd: any) => (
              <div 
                key={qd.id} 
                onClick={() => handleProductClick(qd)}
                className="w-[155px] sm:w-[172px] shrink-0 bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between shadow-2xs snap-start hover:shadow-md hover:border-sky-400 transition-all relative text-left cursor-pointer group/card"
              >
                
                {/* Discount percentage highlight badge upper left */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-rose-500 text-white font-sans font-black text-[8px] sm:text-[9.5px] px-1.5 py-0.5 rounded shadow-2xs">
                    -{qd.discountPercent}%
                  </span>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <span className={`${theme.badgeBg} font-sans font-black text-[6.5px] sm:text-[7px] uppercase px-1 py-0.5 rounded-sm`}>
                    {qd.badge}
                  </span>
                </div>

                {/* Graphic Product Visual Thumb Container */}
                <div className="w-full h-24 sm:h-28 rounded-md bg-slate-50 flex items-center justify-center p-2 relative select-none overflow-hidden">
                  <img 
                    src={getProductImageUrl(qd)} 
                    alt={qd.title} 
                    className="w-full h-full object-contain mix-blend-multiply rounded group-hover/card:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info Meta layout matches custom layout */}
                <div className="pt-2 space-y-1">
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-800 line-clamp-2 h-7 sm:h-8 leading-tight font-sans group-hover/card:text-sky-600 transition-colors">
                    {qd.title}
                  </h4>

                  {/* Highly stylized BDT Currency tags */}
                  <div className="space-y-0.5 font-sans leading-none pt-1">
                    <div className="flex items-center space-x-1 text-slate-400 text-[9px] sm:text-[10px] line-through">
                      <span>Tk {qd.originalPrice.toLocaleString('bn-BD')}</span>
                    </div>
                    <div className="flex items-baseline text-sky-600 font-sans">
                      <span className="text-xs sm:text-sm font-black tracking-tight">
                        Tk {qd.discountedPrice.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Stock tracker strip indicator bar */}
                  <div className="pt-1.5 flex justify-between items-center">
                    <span className={`text-[8px] font-black ${qd.inStockCount <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                      🔥 {qd.inStockCount} in Stock
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerQuickDealAddToCart(qd);
                      }}
                      className="bg-sky-500 hover:bg-sky-600 text-white p-1 rounded-md shadow-2xs transition-all cursor-pointer"
                      title="কার্টে যোগ করুন"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Deal Slide Left Trigger */}
        <button 
          onClick={() => scrollContainer(localScrollRef, 'left')}
          className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-slate-200 cursor-pointer hidden sm:block hover:bg-sky-50"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Quick Deal Slide Right Trigger */}
        <button 
          onClick={() => scrollContainer(localScrollRef, 'right')}
          className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-slate-200 cursor-pointer hidden sm:block hover:bg-sky-50"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface HomeViewProps {
  onAddToCart: (product: Product) => void;
  onPreview: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateToTab: (tabId: string, category?: string) => void;
  onNavigateUrl?: (url: string) => void;
  onSearchAuthorOrPublisher?: (name: string) => void;
  onViewAuthor?: (authorName: string) => void;
  products: Product[];
  homeConfig?: any;
  isLoadingHomeConfig?: boolean;
  categoriesConfig?: Record<string, Record<string, string[]>>;
  onAddToCompare?: (p: Product) => void;
  compareItems?: Product[];
  isLoadingProducts?: boolean;
  favoriteProductIds?: string[];
  onToggleFavorite?: (product: Product) => void;
}

export default function HomeView({
  onAddToCart,
  onPreview,
  onSelectProduct,
  onNavigateToTab,
  onNavigateUrl,
  onSearchAuthorOrPublisher,
  onViewAuthor,
  products = [],
  homeConfig,
  isLoadingHomeConfig = false,
  categoriesConfig = {},
  onAddToCompare,
  compareItems = [],
  isLoadingProducts = false,
  favoriteProductIds = [],
  onToggleFavorite
 }: HomeViewProps) {
  // Real-time Countdown Timer state for Flash Sale Live Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Countdown to midnight of today
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      
      const difference = target.getTime() - now.getTime();
      if (difference <= 0) {
        return { hours: 3, minutes: 59, seconds: 59 };
      }
      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Local states for the Homepage Footer Category Preview Section
  const [selectedPreviewSubcat, setSelectedPreviewSubcat] = useState<string>('');
  const [selectedPreviewChildCat, setSelectedPreviewChildCat] = useState<string>('');

  const defaultCategories: Record<string, Record<string, string[]>> = {
    books: {
      'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন': ['ব্যবাসা', 'বিনিয়োগ', 'আত্মউন্নয়ন'],
      'ইসলামি বই': ['কুরআন ও তাফসীর', 'হাদিস', 'ইসলামী ইতিহাস'],
      'উপন্যাস': ['রোমান্টিক উপন্যাস', 'থ্রিলার', 'ঐতিহাসিক উপন্যাস'],
      'कृषि ও কৃষক': ['কৃষি তত্ত্ব', 'ফল ও সবজি চাষ'],
      'অনুবাদ': ['অনূদিত আত্মউন্নয়ন', 'অনূদিত সাহিত্য'],
      'ভাষা শিক্ষা ও ব্যাকরণ': ['ইংরেজি শিক্ষা', 'আরবি ভাষা', 'বাংলা ব্যাকরণ'],
      'বিজ্ঞান ও প্রযুক্তি': ['জনপ্রিয় বিজ্ঞান', 'প্রোগ্রামিং ও আইটি']
    },
    electronics: {
      'Computer & Accessories': ['RAM', 'SSD', 'Keyboard', 'Mouse'],
      'Mobile & Accessories': ['Power Bank', 'Charger', 'Cable'],
      'Sound System': ['Bluetooth Speaker', 'Earbuds', 'Headphones'],
      'Appliances': ['Rechargeable Fan', 'Blender', 'Kettle']
    },
    superstore: {
      'Beauty & Personal Care': ['Face Wash', 'Shampoo', 'Lotion'],
      'Stationery': ['Notebook', 'Pen', 'Diary']
    },
    fashion: {
      'শার্ট ও পোলো টি-শার্ট (Shirts & Polo)': ['পোলো শার্ট (Polo Shirt)', 'ক্যাজুয়াল শার্ট (Casual Shirt)', 'হাফ স্লিভ টি-শার্ট (T-Shirt)'],
      'প্যান্ট ও ট্রাউজার (Pants & Jeans)': ['ডেনিম জিন্স (Denim Jeans)', 'গ্যাবার্ডিন প্যান্ট (Gabardine)', 'জগার্স ও ট্রাউজার (Joggers)'],
      'জুতা ও স্নিকার্স (Shoes & Footwear)': ['ক্যাজুয়াল স্নিকার্স (Sneakers)', 'ফরমাল লোফার (Loafers)', 'স্যান্ডেল ও স্লাইড (Sandals)'],
      'পাঞ্জাবি ও কুর্তি (Panjabi & Ethnic)': ['প্রিমিয়াম পাঞ্জাবি (Panjabi)', 'থ্রি-পিস ও কুর্তি (Three-Piece)'],
      'ফ্যাশন এক্সেসরিজ (Watches & Bags)': ['হাতঘড়ি ও সানগ্লাস (Watches)', 'মানিব্যাগ ও বেল্ট (Wallets & Belts)']
    },
    kids: {
      'Feeding': ['Baby Feeder', 'Milk Powder'],
      'Kids Toys': ['Soft Toys', 'Educational Toys', 'Lego']
    }
  };

  const effectiveCategoriesConfig = categoriesConfig && Object.keys(categoriesConfig).length > 0 
    ? categoriesConfig 
    : defaultCategories;

  const previewSubcategories = Object.entries(effectiveCategoriesConfig).reduce((acc, [deptId, subcats]) => {
    Object.keys(subcats).forEach((subcat) => {
      acc.push({ deptId, subcat, children: subcats[subcat] });
    });
    return acc;
  }, [] as Array<{ deptId: string; subcat: string; children: string[] }>);

  useEffect(() => {
    if (previewSubcategories.length > 0 && !selectedPreviewSubcat) {
      setSelectedPreviewSubcat(previewSubcategories[0].subcat);
    }
  }, [categoriesConfig, previewSubcategories]);

  const handleSelectPreviewSubcat = (subcat: string) => {
    setSelectedPreviewSubcat(subcat);
    setSelectedPreviewChildCat('');
  };

  const previewProducts = products.filter((p) => {
    if (!selectedPreviewSubcat) return false;
    const matchesSubcat = p.category === selectedPreviewSubcat;
    
    // Strict type check to prevent product overlap between different departments
    const activeSubcatObj = previewSubcategories.find(s => s.subcat === selectedPreviewSubcat);
    if (activeSubcatObj) {
      const expectedType = activeSubcatObj.deptId === 'books' ? 'book' :
                           activeSubcatObj.deptId === 'electronics' ? 'electronic' :
                           activeSubcatObj.deptId;
      if (p.type !== expectedType) return false;
    }

    if (selectedPreviewChildCat) {
      return matchesSubcat && p.childCategory === selectedPreviewChildCat;
    }
    return matchesSubcat;
  });

  // Setup Home configuration without flashing demo images while Firestore is still loading
  const config = homeConfig || (isLoadingHomeConfig ? {
    banners: [],
    categories: [],
    quickDealTabs: ['Today\'s Deal', 'Buy 1 Get 1', 'Free Shipping', 'Super Saving Bundle'],
    quickDeals: [],
    ebooks: [],
    authors: [],
    publishers: [],
    brandTabs: ['Just For You', 'Electronics', 'Superstore'],
    brands: { 'Just For You': [], 'Electronics': [], 'Superstore': [] },
    grids: {}
  } : {
    banners: [
      {
        id: 'slide-chuti',
        type: 'chuti_banner',
        title: 'টপসেল ছুটির ঘণ্টা অফার',
        subtitle: '২৮ আগস্ট রাত ১১:৫৯ পর্যন্ত ৯৯৯+৳ অর্ডারে ফ্রি শিপিং | CHUTI কোড ব্যবহারে',
        badge: 'মেগা অফার ⚡',
        bgColor: 'from-sky-50 via-white to-amber-50',
        imageUrl: ''
      },
      {
        id: 'slide-1',
        title: 'বইমেলা ২০২৬ বিশেষ ধামাকা ছাড়!',
        subtitle: 'প্রিয় বইয়ের সমাহারে ৫০% পর্যন্ত সরাসরি ক্যাশব্যাক ডিসকাউন্ট!',
        badge: 'বইমেলা ২০২৬',
        bgColor: 'from-blue-900 via-indigo-950 to-purple-950',
        imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1920&q=95'
      },
      {
        id: 'slide-2',
        title: 'তীব্র গরমে রিচার্জেবল ফ্যান ও কুলিং গ্যাজেটস',
        subtitle: 'স্মার্ট লাইফস্টাইল ও ইলেকট্রনিক্স অ্যাক্সেসরিজে পান ৪৫% পর্যন্ত ছাড়!',
        badge: 'সমার গ্যাজেটস',
        bgColor: 'from-emerald-950 via-teal-900 to-slate-900',
        imageUrl: 'https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&w=1920&q=95'
      },
      {
        id: 'slide-3',
        title: 'টপসেল সুপার স্টোর ও ডেইলি এসেনশিয়ালস',
        subtitle: 'স্কিনকেয়ার, গ্রোসারি ও অর্গানিক পণ্যে নিশ্চিত মেগা ক্যাশব্যাক!',
        badge: 'সুপার স্টোর',
        bgColor: 'from-amber-900 via-orange-950 to-slate-950',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=95'
      }
    ],
    categories: DEFAULT_HOMEPAGE_CATEGORIES,
    quickDealTabs: ['Today\'s Deal', 'Buy 1 Get 1', 'Free Shipping', 'Super Saving Bundle'],
    quickDeals: [
      {
        id: 'qd-1',
        title: 'Custom Stainless Steel Minimalist Men Watch Premium Box',
        tabGroup: 'Today\'s Deal',
        originalPrice: 6299,
        discountedPrice: 579,
        discountPercent: 91,
        inStockCount: 22,
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80',
        badge: '⚡ HOT'
      },
      {
        id: 'qd-2',
        title: 'Special Telephone Number Keychain Elastic Wire Lanyard Red',
        tabGroup: 'Today\'s Deal',
        originalPrice: 300,
        discountedPrice: 109,
        discountPercent: 64,
        inStockCount: 12,
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80',
        badge: 'POPULAR'
      },
      {
        id: 'qd-3',
        title: 'Rhode Peptide Lip Tint - Toast Shade Glossy Treatment',
        tabGroup: 'Today\'s Deal',
        originalPrice: 650,
        discountedPrice: 209,
        discountPercent: 68,
        inStockCount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80',
        badge: 'BESTSELLER'
      },
      {
        id: 'qd-4',
        title: 'HTC AT-1210 Rechargeable Hair Clipper and Beard Trimmer Gold',
        tabGroup: 'Today\'s Deal',
        originalPrice: 1200,
        discountedPrice: 514,
        discountPercent: 57,
        inStockCount: 3,
        imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=300&q=80',
        badge: 'LEFT 3'
      },
      {
        id: 'qd-5',
        title: 'YC Baby Shampoo 500ml Gentle Care Honey Lavender Extract',
        tabGroup: 'Today\'s Deal',
        originalPrice: 300,
        discountedPrice: 109,
        discountPercent: 64,
        inStockCount: 22,
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=300&q=80',
        badge: 'SWEET'
      },
      {
        id: 'qd-6',
        title: '5D Care Wrist Brace Support Guard Adjustable Neoprene Splint',
        tabGroup: 'Today\'s Deal',
        originalPrice: 250,
        discountedPrice: 79,
        discountPercent: 68,
        inStockCount: 41,
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80',
        badge: 'ORTHO'
      },
      {
        id: 'qd-7',
        title: 'Overhead Video Stand Mount Arm Kit with Phone Holder Clamp',
        tabGroup: 'Today\'s Deal',
        originalPrice: 1650,
        discountedPrice: 679,
        discountPercent: 59,
        inStockCount: 11,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
        badge: 'CREATIVE'
      },

      // Buy 1 Get 1
      {
        id: 'qd-b1',
        title: 'W7 London Shimmer Metallic Eye Shadow Twin Pack',
        tabGroup: 'Buy 1 Get 1',
        originalPrice: 1200,
        discountedPrice: 599,
        discountPercent: 50,
        inStockCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80',
        badge: 'BOGO'
      },
      {
        id: 'qd-b2',
        title: 'Aroma Orange Body Scrub Wash 300ml Combo B1G1',
        tabGroup: 'Buy 1 Get 1',
        originalPrice: 800,
        discountedPrice: 399,
        discountPercent: 50,
        inStockCount: 14,
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=300&q=80',
        badge: 'BOGO'
      },

      // Free Shipping
      {
        id: 'qd-f1',
        title: 'Realme Buds Air Pro 3 Active Noise Cancelling Earphones',
        tabGroup: 'Free Shipping',
        originalPrice: 3500,
        discountedPrice: 2199,
        discountPercent: 37,
        inStockCount: 19,
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80',
        badge: 'FREE SHIP'
      },

      // Super Saving Bundle
      {
        id: 'qd-s1',
        title: 'Complete Islamic Self-Improvement Book Bundle (6 Books Pack)',
        tabGroup: 'Super Saving Bundle',
        originalPrice: 1800,
        discountedPrice: 950,
        discountPercent: 47,
        inStockCount: 5,
        imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80',
        badge: 'MEGA PACK'
      }
    ],
    ebooks: [
      { id: 'eb-1', title: 'দ্যা আলটিমেট সেলস ম্যান', author: 'ড্যান কার্নেগি', price: 20, rating: 4.8, badge: 'BEST', originalPrice: 120 },
      { id: 'eb-2', title: 'এইচ এস সি-সিলেবাস গাইড', author: 'অধ্যাপক মোজাম্মেল', price: 65, rating: 4.5, badge: 'ACADEMIC', originalPrice: 150 },
      { id: 'eb-3', title: 'আউটলাইনার্স (সফলতার গল্প)', author: 'ম্যালকম গ্ল্যাডওয়েল', price: 125, rating: 4.9, badge: 'HOT', originalPrice: 200 },
      { id: 'eb-4', title: 'প্রোকাস্টিনেশন (অলসতা দূরীকরণ)', author: 'ড. ব্রায়ান ট্রেসি', price: 20, rating: 4.6, badge: 'NEW', originalPrice: 99 },
      { id: 'eb-5', title: 'সেলফ এডুকেশন গাইডলাইন', author: 'সাদমান সাদিক', price: 130, rating: 4.7, badge: 'POPULAR', originalPrice: 180 },
      { id: 'eb-6', title: 'বিজ্ঞান জনপ্রিয় পাঠমালা', author: 'ড. মুহম্মদ জাফর ইকবাল', price: 117, rating: 4.8, badge: 'SCIENCE', originalPrice: 160 },
      { id: 'eb-7', title: 'ম্যানারস শিখুন ও ব্যক্তিত্ব তৈরি করুন', author: 'শরিফ হাবিব', price: 65, rating: 4.9, badge: 'LIFE', originalPrice: 110 }
    ],
    authors: [
      { id: 'aut-1', name: 'হুমায়ূন আহমেদ', role: 'জনপ্রিয় ঔপন্যাসিক ও কথাসাহিত্যিক', avatarBg: 'bg-amber-100 text-amber-800' },
      { id: 'aut-2', name: 'মুহম্মদ জাফর ইকবাল', role: 'বিজ্ঞান কল্পকাহিনী ও শিশুতোষ লেখক', avatarBg: 'bg-blue-100 text-blue-800' },
      { id: 'aut-3', name: 'সাদাত হোসাইন', role: 'জনপ্রিয় সমকালীন ঔপন্যাসিক', avatarBg: 'bg-emerald-100 text-emerald-800' },
      { id: 'aut-4', name: 'সাদমান সাদিক', role: 'আত্মউন্নয়ন ও ক্যারিয়ার মেন্টর', avatarBg: 'bg-rose-100 text-rose-800' },
      { id: 'aut-5', name: 'আরিফ আজাদ', role: 'জনপ্রিয় ইসলামিক লেখক', avatarBg: 'bg-teal-100 text-teal-800' },
      { id: 'aut-6', name: 'রকিব হাসান', role: 'গোয়েন্দা কাহিনী ও অনুবাদক', avatarBg: 'bg-indigo-100 text-indigo-800' },
      { id: 'aut-7', name: 'আনিসুল হক', role: 'ঔপন্যাসিক ও সাংবাদিক', avatarBg: 'bg-orange-100 text-orange-800' },
      { id: 'aut-8', name: 'কাজী আনোয়ার হোসেন', role: 'মাসুদ রানা ও রহস্য সিরিজ স্রষ্টা', avatarBg: 'bg-purple-100 text-purple-800' },
      { id: 'aut-9', name: 'সুনীল গঙ্গোপাধ্যায়', role: 'ঐতিহাসিক ও ক্লাসিক সাহিত্যিক', avatarBg: 'bg-sky-100 text-sky-800' },
      { id: 'aut-10', name: 'তসলিমা নাসরিন', role: 'নারীবাদী লেখিকা ও প্রাবন্ধিক', avatarBg: 'bg-pink-100 text-pink-800' }
    ],
    publishers: [
      { id: 'pub-1', name: 'প্রথমা প্রকাশন', role: 'মানসম্মত বইয়ের নির্ভরযোগ্য নাম', avatarBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
      { id: 'pub-2', name: 'অন্যপ্রকাশ', role: 'কথাসাহিত্য ও সৃজনশীল প্রকাশনী', avatarBg: 'bg-rose-50 text-rose-700 border border-rose-200' },
      { id: 'pub-3', name: 'বাতিঘর', role: 'সেরা অনুবাদ ও মননশীল বই', avatarBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
      { id: 'pub-4', name: 'ঐতিহ্য', role: 'ঐতিহাসিক ও গবেষণা সাহিত্য', avatarBg: 'bg-amber-50 text-amber-700 border border-amber-200' },
      { id: 'pub-5', name: 'তাম্রলিপি', role: 'সায়েন্স ফিকশন ও সায়েন্স কিট', avatarBg: 'bg-cyan-50 text-cyan-700 border border-cyan-200' },
      { id: 'pub-6', name: 'অবসর প্রকাশনা সংস্থা', role: 'ধ্রুপদী ও শিক্ষামূলক প্রকাশনী', avatarBg: 'bg-slate-50 text-slate-700 border border-slate-200' },
      { id: 'pub-7', name: 'কাকলী প্রকাশনী', role: 'উপন্যাস ও রহস্য গল্প', avatarBg: 'bg-purple-50 text-purple-700 border border-purple-200' },
      { id: 'pub-8', name: 'সময় প্রকাশন', role: 'গবেষণা ও মুক্তিযুদ্ধ বিষয়ক গ্রন্থ', avatarBg: 'bg-teal-50 text-teal-700 border border-teal-200' },
      { id: 'pub-9', name: 'আদিল পাবলিকেশন্স', role: 'একাডেমিক ও রেফারেন্স বই', avatarBg: 'bg-sky-50 text-sky-700 border border-sky-200' }
    ],
    brandTabs: ['Just For You', 'Electronics', 'Superstore'],
    brands: {
      'Just For You': [
        { name: 'CASIO', logoBg: 'bg-blue-50 text-blue-800 border-blue-200' },
        { name: 'Kanoon-e-Kolkata', logoBg: 'bg-orange-50 text-orange-800 border-orange-200' },
        { name: 'Kurkure', logoBg: 'bg-red-50 text-red-800 border-red-200' },
        { name: 'PILOT', logoBg: 'bg-neutral-50 text-neutral-800 border-neutral-300' },
        { name: 'Cetaphil', logoBg: 'bg-teal-50 text-teal-800 border-teal-200' },
        { name: 'CeraVe', logoBg: 'bg-sky-50 text-sky-850 border-sky-200' },
        { name: 'Xiaomi MI', logoBg: 'bg-orange-100 text-orange-900 border-orange-300' },
        { name: 'Non-Brand Combo', logoBg: 'bg-slate-50 text-slate-700 border-slate-300' }
      ],
      'Electronics': [
        { name: 'CASIO', logoBg: 'bg-blue-50 text-blue-800 border-blue-200' },
        { name: 'Xiaomi MI', logoBg: 'bg-orange-100 text-orange-900 border-orange-300' },
        { name: 'PILOT', logoBg: 'bg-neutral-50 text-neutral-800 border-neutral-300' }
      ],
      'Superstore': [
        { name: 'Cetaphil', logoBg: 'bg-teal-50 text-teal-800 border-teal-200' },
        { name: 'CeraVe', logoBg: 'bg-sky-50 text-sky-850 border-sky-200' },
        { name: 'Kurkure', logoBg: 'bg-red-50 text-red-800 border-red-200' }
      ]
    },
    grids: DEFAULT_HOME_GRIDS
  });

  // State Management
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeQuickDealTab, setActiveQuickDealTab] = useState('Today\'s Deal');
  const [activeBrandTab, setActiveBrandTab] = useState('Just For You');
  const [activeAuthorPublisherTab, setActiveAuthorPublisherTab] = useState<'authors' | 'publishers'>('authors');

  // Multi-refs for horizontal scrolling
  const quickDealsScrollRef = useRef<HTMLDivElement>(null);
  const flashSaleScrollRef = useRef<HTMLDivElement>(null);
  const ebooksScrollRef = useRef<HTMLDivElement>(null);
  const authorsScrollRef = useRef<HTMLDivElement>(null);
  const publishersScrollRef = useRef<HTMLDivElement>(null);
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  // Map to store running physics animation configurations for each element
  const scrollPhysicsStates = useRef<Map<HTMLDivElement, {
    current: number;
    target: number;
    velocity: number;
    rafId: number;
  }>>(new Map());

  // Clean up any active requestAnimationFrame instances on unmount
  useEffect(() => {
    return () => {
      scrollPhysicsStates.current.forEach((state) => {
        if (state.rafId) {
          cancelAnimationFrame(state.rafId);
        }
      });
    };
  }, []);

  // Interval hook for automatic slider banner transitions
  useEffect(() => {
    if (!config.banners || config.banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % config.banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [config.banners.length]);

  const handleNextSlide = () => {
    if (!config.banners || config.banners.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % config.banners.length);
  };

  const handlePrevSlide = () => {
    if (!config.banners || config.banners.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + config.banners.length) % config.banners.length);
  };

  // Shop By Category Horizontal Scroll state & handlers
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
  const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(true);

  const checkCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollCategoryLeft(scrollLeft > 10);
    setCanScrollCategoryRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleCategoryScroll = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkCategoryScroll, 350);
  };

  // Generic slide runner using smooth physics-based scrolling
  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    const element = ref.current;
    if (!element) return;

    // Initialize state if not present
    if (!scrollPhysicsStates.current.has(element)) {
      scrollPhysicsStates.current.set(element, {
        current: element.scrollLeft,
        target: element.scrollLeft,
        velocity: 0,
        rafId: 0,
      });
    }

    const state = scrollPhysicsStates.current.get(element)!;

    // Sync state if manually scrolled outside our physics loop
    if (Math.abs(state.current - element.scrollLeft) > 10) {
      state.current = element.scrollLeft;
      state.target = element.scrollLeft;
      state.velocity = 0;
    }

    // Physics parameters & scroll calculations
    const scrollDelta = direction === 'left' ? -340 : 340;
    const maxScroll = element.scrollWidth - element.clientWidth;
    state.target = Math.max(0, Math.min(maxScroll, state.target + scrollDelta));

    // Start physical iteration loop if not already running
    if (!state.rafId) {
      const step = () => {
        const curState = scrollPhysicsStates.current.get(element);
        if (!curState) return;

        const delta = curState.target - curState.current;
        
        // Physics constants: mass, stiffness (k), and friction/damping (c)
        const k = 0.13; // Spring stiffness constant
        const damping = 0.23; // Viscous damping ratio/friction
        const springForce = delta * k;

        curState.velocity = (curState.velocity + springForce) * (1 - damping);
        curState.current += curState.velocity;

        // Snapping thresholds
        if (Math.abs(curState.target - curState.current) < 0.25 && Math.abs(curState.velocity) < 0.05) {
          curState.current = curState.target;
          curState.velocity = 0;
          element.scrollLeft = curState.target;
          curState.rafId = 0;
        } else {
          element.scrollLeft = curState.current;
          curState.rafId = requestAnimationFrame(step);
        }
      };
      state.rafId = requestAnimationFrame(step);
    }
  };

  // Render Category Icon dynamically
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      case 'PenTool': return <PenTool className="w-5 h-5" />;
      case 'Atom': return <Atom className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'BookMarked': return <BookMarked className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      default: return <Grid className="w-5 h-5" />;
    }
  };

  // Convert quick deal dynamic schema into standard Product type for checkout safety
  const triggerQuickDealAddToCart = (item: any) => {
    const p: Product = {
      id: item.id,
      title: item.title,
      type: item.tabGroup === 'Today\'s Deal' ? 'electronic' : 'superstore',
      authorOrBrand: item.badge || 'রকমারি ডিল',
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      discountPercent: item.discountPercent,
      rating: 4.8,
      totalRatings: 120,
      imageUrl: item.imageUrl,
      inStock: true,
      category: item.tabGroup
    };
    onAddToCart(p);
  };

  // Dynamic eBook listing combining real products of type 'book' and category/badge containing 'Ebook'
  const getEbooksList = () => {
    const realEbooks = products.filter(p => 
      p.type === 'book' && 
      (
        (p.category || '').toLowerCase().includes('ebook') || 
        (p.category || '').toLowerCase().includes('ই-বুক') || 
        (p.badgeText || '').toLowerCase().includes('ebook')
      )
    ).map(p => ({
      id: p.id,
      title: p.title,
      author: p.authorOrBrand || 'অজানা লেখক',
      price: p.discountedPrice,
      originalPrice: p.originalPrice,
      rating: p.rating || 4.5,
      badge: p.badgeText || 'EBOOK',
      imageUrl: p.imageUrl,
      isReal: true,
      realProduct: p
    }));

    const configEbooks = (config.ebooks || []).map((eb: any) => ({
      id: eb.id,
      title: eb.title,
      author: eb.author,
      price: eb.price,
      originalPrice: eb.originalPrice,
      rating: eb.rating,
      badge: eb.badge || 'EBOOK',
      imageUrl: eb.imageUrl,
      isReal: false
    }));

    const combined = [...realEbooks, ...configEbooks];
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
      if (!seen.has(item.title)) {
        seen.add(item.title);
        unique.push(item);
      }
    }
    return unique;
  };

  const getGridItems = (key: string, configItems: any[] = []) => {
    const realMatches = products.filter(p => {
      if (key === 'books' || key === 'academic' || key === 'islamic' || key === 'dictionary' || key === 'novel') {
        return p.type === 'book';
      }
      if (key === 'electronics' || key === 'electronic') {
        return p.type === 'electronic';
      }
      if (key === 'superstore') {
        return p.type === 'superstore';
      }
      if (key === 'fashion') {
        return p.type === 'fashion';
      }
      if (key === 'kids') {
        return p.type === 'kids';
      }
      return false;
    });

    const mappedReal = realMatches.map(p => ({
      id: p.id,
      title: p.title,
      author: p.authorOrBrand || (key === 'books' ? 'লেখক' : 'ব্র্যান্ড'),
      price: p.discountedPrice,
      originalPrice: p.originalPrice,
      imageUrl: p.imageUrl,
      rating: p.rating,
      badge: p.badgeText || (key === 'books' ? 'বই' : key === 'electronics' ? 'টেক' : key === 'superstore' ? 'সুপার' : 'কিডস'),
      bg: key === 'books' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' :
          key === 'electronics' ? 'bg-gradient-to-br from-sky-500 to-blue-600' :
          key === 'superstore' ? 'bg-gradient-to-br from-amber-500 to-yellow-600' :
          'bg-gradient-to-br from-pink-500 to-rose-600',
      isReal: true,
      realProduct: p
    }));

    const combined = [...mappedReal, ...(configItems || []).map((item: any) => ({ ...item, id: `config-${item.title}` }))];
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
      if (!seen.has(item.title)) {
        seen.add(item.title);
        unique.push(item);
      }
    }
    return unique.slice(0, 4);
  };

  // Convert eBook dummy card to Product
  const triggerEbookAddToCart = (item: any) => {
    if (item.isReal && item.realProduct) {
      onAddToCart(item.realProduct);
      return;
    }
    const foundReal = products.find(p => p.id === item.id || p.title === item.title);
    if (foundReal) {
      onAddToCart(foundReal);
      return;
    }
    const p: Product = {
      id: item.id,
      title: item.title,
      type: 'book',
      authorOrBrand: item.author,
      originalPrice: item.originalPrice || item.price + 30,
      discountedPrice: item.price,
      discountPercent: item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 15,
      rating: item.rating,
      totalRatings: 94,
      imageUrl: item.imageUrl || 'cover-master-emotions',
      inStock: true,
      category: 'ই-বুক',
      badgeText: item.badge || 'EBOOK'
    };
    onAddToCart(p);
  };

  // Helper conversion for grid lists
  const triggerGridItemAddToCart = (item: any, sectionType: string) => {
    if (item.isReal && item.realProduct) {
      onAddToCart(item.realProduct);
      return;
    }
    const foundReal = products.find(p => p.id === item.id || p.title === item.title);
    if (foundReal) {
      onAddToCart(foundReal);
      return;
    }
    const secLower = sectionType.toLowerCase();
    const determinedType = secLower.includes('ইলেক') || secLower.includes('tech') ? 'electronic' :
                           secLower.includes('সুপার') || secLower.includes('store') ? 'superstore' :
                           secLower.includes('কিড') || secLower.includes('kid') ? 'kids' : 'book';
    const p: Product = {
      id: item.id || `grid-${sectionType}-${item.title.substring(0,3)}`,
      title: item.title,
      type: determinedType,
      authorOrBrand: item.author || (determinedType === 'book' ? 'লেখক' : 'ব্র্যান্ড'),
      originalPrice: item.originalPrice || item.price + 45,
      discountedPrice: item.price,
      discountPercent: 12,
      rating: item.rating || 4.8,
      totalRatings: 32,
      imageUrl: item.imageUrl || '',
      inStock: true,
      category: sectionType
    };
    onAddToCart(p);
  };

  // Select slide item matching state
  const activeSlide = config.banners[currentSlideIndex];

  // Dynamic right app promo sidebar widget config
  const appPromo = config.appPromo || {
    badge: 'APP FIRST ORDER',
    title: 'অ্যাপে ১ম অর্ডারে ফ্রি শিপিং!',
    promoCode: 'PROMO: APP1ST',
    qrText: 'SCAN TO DOWNLOAD',
    osText: 'For iOS, Android & HarmonyOS',
    appStoreUrl: 'https://www.apple.com/app-store/',
    googlePlayUrl: 'https://play.google.com/store'
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* SECTION 1: Dynamic High Fidelity Hero Slider Carousel & Download App Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* Main Banner Slider Carousel */}
        <div id="home-banner-carousel" className="lg:col-span-3 rounded-xl overflow-hidden relative border border-slate-200/80 shadow-xs group aspect-[2.4/1] xs:aspect-[2.7/1] sm:aspect-[2.9/1] lg:aspect-auto min-h-[135px] xs:min-h-[155px] sm:min-h-[210px] md:min-h-[260px] lg:min-h-[300px] flex items-stretch bg-white">
          {isLoadingHomeConfig && !activeSlide ? (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          ) : activeSlide && (
            <div className="w-full flex flex-col justify-center relative transition-all duration-700 ease-in-out overflow-hidden">
              
              {/* Graphic Banner: Iconic Holiday Free Shipping ("ছুটির ঘণ্টা অফার") */}
              {activeSlide.type === 'chuti_banner' || activeSlide.id === 'slide-chuti' ? (
                <div 
                  onClick={() => {
                    if (activeSlide.actionUrl) {
                      if (onNavigateUrl) onNavigateUrl(activeSlide.actionUrl);
                      else onNavigateToTab(activeSlide.actionUrl.replace(/^#/, ''));
                    } else {
                      onNavigateToTab('offers');
                    }
                  }}
                  className="w-full h-full min-h-[135px] sm:min-h-[210px] md:min-h-[260px] lg:min-h-[300px] bg-gradient-to-r from-[#dff0ff] via-[#f1f7ff] to-[#e4f0ff] p-3 sm:p-6 md:p-8 flex items-center justify-between relative overflow-hidden cursor-pointer select-none"
                >
                  {/* Decorative Background Accents */}
                  <div className="absolute top-0 right-1/4 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 left-10 w-40 h-40 bg-amber-200/30 rounded-full blur-xl pointer-events-none"></div>
                  
                  {/* Left Illustrated Element: 3D Holiday Bell & Scooter Rider */}
                  <div className="hidden sm:flex flex-col items-center justify-center shrink-0 z-10 space-y-2">
                    {/* Topsell Brand badge */}
                    <div className="bg-white/95 border border-sky-200 px-3 py-0.5 rounded-full shadow-2xs flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                      <span className="text-[11px] font-black text-sky-800 tracking-tight">টপসেল</span>
                    </div>

                    {/* Circular 3D Offer Ring Badge */}
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 p-1 shadow-md flex items-center justify-center border-2 border-white">
                        <div className="w-full h-full rounded-full border border-amber-200/60 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-amber-400 to-amber-500">
                          <span className="text-xl leading-none">🔔</span>
                          <span className="text-xs sm:text-sm font-black text-slate-950 font-sans leading-tight mt-0.5 drop-shadow-2xs">
                            ছুটির ঘণ্টা
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-extrabold text-white bg-amber-600 px-2 py-0.2 rounded-full mt-0.5">
                            অফার
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Scooter Illustration badge */}
                    <div className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs flex items-center space-x-1.5">
                      <span className="text-base">🛵</span>
                      <span className="text-[10px] font-bold text-slate-700">সুপারফাস্ট ডেলিভারি</span>
                    </div>
                  </div>

                  {/* Center Hero Promotion Content */}
                  <div className="space-y-2.5 relative z-10 text-center sm:text-left flex-1 max-w-md mx-auto sm:mx-4">
                    {/* Top validity badge */}
                    <div className="inline-flex items-center space-x-1.5 bg-[#0954b8] text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-xs">
                      <span>⏰</span>
                      <span>২৮ আগস্ট রাত ১১:৫৯ পর্যন্ত</span>
                    </div>

                    {/* Subtitle */}
                    <div className="text-sm sm:text-base md:text-lg font-extrabold text-slate-800">
                      ৯৯৯+৳ অর্ডারে
                    </div>

                    {/* Big Bold Free Shipping Title */}
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0072bc] tracking-tight font-sans">
                      ফ্রি শিপিং
                    </div>

                    {/* Coupon Code Pill */}
                    <div className="pt-1 flex items-center justify-center sm:justify-start space-x-2">
                      <div className="inline-flex items-center space-x-1.5 bg-[#0b3b70] text-[#ffe600] border border-[#082a52] px-3.5 py-1.5 rounded-lg shadow-xs font-mono text-xs sm:text-sm font-black">
                        <span className="text-slate-300 font-sans text-xs">কুপন:</span>
                        <span className="tracking-wider">CHUTI</span>
                        <span className="text-white text-[10px] font-sans font-normal">ব্যবহার করুন</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Illustrated Element: Smartphone & Parcel Boxes mockup */}
                  <div className="hidden md:flex flex-col items-center justify-center shrink-0 z-10 relative pr-4">
                    {/* Phone App Preview mockup */}
                    <div className="w-24 h-40 bg-slate-900 rounded-2xl p-1.5 shadow-xl border-2 border-slate-700 relative transform rotate-6 group-hover:rotate-3 transition-transform duration-300">
                      <div className="w-full h-full bg-sky-50 rounded-xl overflow-hidden flex flex-col items-center justify-between p-1.5 text-center">
                        <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto"></div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-black text-sky-700 block">টপসেল</span>
                          <span className="text-[7px] font-extrabold text-emerald-600 bg-emerald-100 px-1 rounded block">ফ্রি শিপিং</span>
                        </div>
                        <span className="text-lg">📦</span>
                      </div>
                    </div>

                    {/* Stacked parcel boxes */}
                    <div className="absolute -bottom-2 -left-3 bg-amber-100 border border-amber-300 rounded p-1.5 shadow-md transform -rotate-6 flex items-center space-x-1">
                      <span className="text-sm">🎁</span>
                      <span className="text-[8px] font-black text-amber-900">PARCEL</span>
                    </div>

                    {/* Vertical disclaimer */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 rotate-90 origin-center select-none">
                      *শর্ত প্রযোজ্য
                    </div>
                  </div>
                </div>
              ) : (
                /* Pure High-Resolution Photo Banner without text overlay */
                <div 
                  onClick={() => {
                    if (activeSlide.actionUrl) {
                      if (onNavigateUrl) onNavigateUrl(activeSlide.actionUrl);
                      else onNavigateToTab(activeSlide.actionUrl.replace(/^#/, ''));
                    } else {
                      onNavigateToTab('offers');
                    }
                  }}
                  className={`w-full h-full bg-gradient-to-r ${activeSlide.bgColor || 'from-sky-900 to-indigo-950'} flex flex-col justify-center text-white relative min-h-[135px] sm:min-h-[210px] md:min-h-[260px] lg:min-h-[300px] cursor-pointer overflow-hidden`}
                >
                  {/* Full Slide High-Resolution Banner Image with crystal clear rendering */}
                  {activeSlide.imageUrl ? (
                    <img 
                      src={activeSlide.imageUrl} 
                      alt={activeSlide.title || 'Promo Banner'} 
                      className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700 group-hover:scale-[1.02]"
                      style={{ 
                        imageRendering: '-webkit-optimize-contrast',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden'
                      }}
                      loading="eager"
                      decoding="sync"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    /* Fallback only if no image is uploaded/provided */
                    <div className="p-4 sm:p-8 md:p-10 flex flex-col justify-center relative z-10 max-w-xl text-left my-auto">
                      {activeSlide.badge && (
                        <div className="mb-2">
                          <span className="bg-amber-400 text-slate-950 font-sans font-black text-[9px] sm:text-[10px] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded tracking-wider shadow-sm">
                            {activeSlide.badge}
                          </span>
                        </div>
                      )}
                      <h1 className="text-base sm:text-2xl md:text-3xl font-sans font-extrabold leading-tight tracking-tight text-white">
                        {activeSlide.title}
                      </h1>
                      {activeSlide.subtitle && (
                        <p className="text-[11px] sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed max-w-md mt-1 sm:mt-2">
                          {activeSlide.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Slider Left Arrow */}
          <button 
            onClick={handlePrevSlide}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1.5 sm:p-2 rounded-full cursor-pointer shadow-sm border border-slate-200 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          
          {/* Slider Right Arrow */}
          <button 
            onClick={handleNextSlide}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1.5 sm:p-2 rounded-full cursor-pointer shadow-sm border border-slate-200 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Slider Dots indicators */}
          <div className="absolute bottom-2 sm:bottom-3 inset-x-0 flex justify-center space-x-1.5 z-20">
            {config.banners.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'bg-amber-400 w-4 sm:w-5' : 'bg-white/70 hover:bg-white w-2 sm:w-2.5'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Download / Scan Sidebar Widget exactly matching design */}
        <div className="hidden lg:flex bg-gradient-to-b from-[#b8ccfa] to-[#9ebaf8] border border-blue-200/80 rounded-xl p-4 flex-col items-center text-center justify-between shadow-xs relative overflow-hidden">
          <div className="absolute -top-6 -right-6 bg-white/30 w-20 h-20 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="space-y-1 z-10">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 font-sans tracking-tight">
              {appPromo.title || 'অ্যাপে ১ম অর্ডারে ফ্রি শিপিং!'}
            </h3>
            <p className="text-[11px] font-extrabold text-slate-800">
              ১১৯৯+ টাকা এমাউন্টে
            </p>
            <div className="inline-block bg-white/85 border border-sky-300 text-sky-900 font-mono font-black text-[10px] px-2.5 py-0.5 rounded shadow-2xs">
              {appPromo.promoCode || 'PROMO: APP1ST'}
            </div>
          </div>

          {/* Crisp QR Code with Center Logo */}
          <div className="w-32 h-32 bg-white rounded-lg p-2 relative flex flex-col justify-center items-center shadow-xs overflow-hidden border border-slate-200/80 z-10">
            {appPromo.qrImageUrl ? (
              <img 
                src={appPromo.qrImageUrl} 
                alt="QR Code" 
                className="w-full h-full object-contain"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full relative flex items-center justify-center">
                {/* SVG vector high-res crisp QR code graphic */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <rect x="11" y="11" width="14" height="14" rx="1" fill="currentColor"/>
                  
                  <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <rect x="75" y="11" width="14" height="14" rx="1" fill="currentColor"/>
                  
                  <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5"/>
                  <rect x="11" y="75" width="14" height="14" rx="1" fill="currentColor"/>

                  {/* QR modules grid */}
                  <rect x="36" y="8" width="6" height="6" fill="currentColor"/>
                  <rect x="46" y="8" width="6" height="6" fill="currentColor"/>
                  <rect x="56" y="8" width="6" height="6" fill="currentColor"/>
                  <rect x="36" y="18" width="6" height="6" fill="currentColor"/>
                  <rect x="56" y="18" width="6" height="6" fill="currentColor"/>

                  <rect x="8" y="36" width="6" height="6" fill="currentColor"/>
                  <rect x="18" y="36" width="6" height="6" fill="currentColor"/>
                  <rect x="8" y="46" width="6" height="6" fill="currentColor"/>
                  <rect x="24" y="46" width="6" height="6" fill="currentColor"/>
                  <rect x="18" y="56" width="6" height="6" fill="currentColor"/>

                  <rect x="36" y="36" width="28" height="28" rx="4" fill="#0284c7"/>
                  <text x="50" y="54" fontSize="12" fontWeight="900" fill="white" textAnchor="middle" fontFamily="sans-serif">T</text>

                  <rect x="69" y="36" width="6" height="6" fill="currentColor"/>
                  <rect x="85" y="36" width="6" height="6" fill="currentColor"/>
                  <rect x="75" y="46" width="6" height="6" fill="currentColor"/>
                  <rect x="85" y="56" width="6" height="6" fill="currentColor"/>

                  <rect x="36" y="69" width="6" height="6" fill="currentColor"/>
                  <rect x="46" y="79" width="6" height="6" fill="currentColor"/>
                  <rect x="56" y="69" width="6" height="6" fill="currentColor"/>
                  <rect x="36" y="85" width="6" height="6" fill="currentColor"/>
                  <rect x="56" y="85" width="6" height="6" fill="currentColor"/>

                  <rect x="69" y="69" width="6" height="6" fill="currentColor"/>
                  <rect x="79" y="69" width="6" height="6" fill="currentColor"/>
                  <rect x="89" y="79" width="6" height="6" fill="currentColor"/>
                  <rect x="69" y="89" width="6" height="6" fill="currentColor"/>
                  <rect x="85" y="89" width="6" height="6" fill="currentColor"/>
                </svg>
              </div>
            )}
          </div>

          {/* App Store and Play Store official style badges */}
          <div className="w-full space-y-1 pt-1 z-10">
            <div className="flex justify-center space-x-1.5">
              <a
                href={appPromo.appStoreUrl || 'https://www.apple.com/app-store/'}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white text-[8px] font-bold px-2 py-1 rounded flex items-center space-x-1 cursor-pointer hover:bg-slate-900 transition-colors shadow-2xs"
              >
                <span className="text-[10px]"></span>
                <div className="text-left leading-tight">
                  <span className="text-[6px] block text-slate-300 font-sans leading-none">Download on</span>
                  <span className="font-sans font-bold leading-none">App Store</span>
                </div>
              </a>
              <a
                href={appPromo.googlePlayUrl || 'https://play.google.com/store'}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white text-[8px] font-bold px-2 py-1 rounded flex items-center space-x-1 cursor-pointer hover:bg-slate-900 transition-colors shadow-2xs"
              >
                <span className="text-[10px]">▶</span>
                <div className="text-left leading-tight">
                  <span className="text-[6px] block text-slate-300 font-sans leading-none">GET IT ON</span>
                  <span className="font-sans font-bold leading-none">Google Play</span>
                </div>
              </a>
            </div>
            <span className="text-[9px] text-slate-800 block font-bold leading-none pt-1">
              Scan the QR code to Download App
            </span>
          </div>

          {/* Vertical watermark */}
          <div className="absolute right-1 top-2 text-[8px] text-slate-500 font-medium">
            *শর্ত প্রযোজ্য
          </div>
        </div>
      </div>

      {/* SECTION 2: Shop By Category List Grid & Mobile Scroll Carousel matching screenshot Capture.PNG */}
      <div className="space-y-3 relative group/categories">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
            Shop By Category
          </h2>
          <span className="text-[11px] text-slate-400 font-medium sm:hidden flex items-center gap-1">
            স্ক্রোল করুন ➔
          </span>
        </div>
        
        {/* Scroll Container with left and right navigation chevron buttons */}
        <div className="relative">
          {/* Left Navigation Chevron Button */}
          {canScrollCategoryLeft && (
            <button
              onClick={() => handleCategoryScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="পূর্ববর্তী ক্যাটাগরি"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Horizontal Category Cards Row */}
          <div 
            ref={categoryScrollRef}
            onScroll={checkCategoryScroll}
            className="flex overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory gap-3 sm:gap-4 pb-2 pt-1 px-1"
          >
            {isLoadingHomeConfig && (!config.categories || config.categories.length === 0) ? (
              [...Array(8)].map((_, idx) => (
                <div key={idx} className="w-20 sm:w-24 md:w-28 shrink-0 snap-start flex flex-col items-center space-y-2">
                  <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl bg-slate-100 border border-slate-200/60 animate-pulse" />
                  <div className="w-14 h-3 bg-slate-100 rounded animate-pulse" />
                </div>
              ))
            ) : config.categories.map((cat: any, i: number) => (
              <div 
                key={i} 
                onClick={() => {
                  const targetTab = (cat.label && (cat.label.includes('ফ্যাশন') || cat.label.toLowerCase().includes('fashion')) && cat.id === 'electronics')
                    ? 'fashion'
                    : cat.id;
                  onNavigateToTab(targetTab);
                }}
                className="w-20 sm:w-24 md:w-28 shrink-0 snap-start flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-all select-none"
              >
                {/* Rounded White Card matching Capture.PNG */}
                <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl bg-white border border-slate-200/80 shadow-2xs group-hover:shadow-md group-hover:border-sky-300 transition-all duration-300 p-2 sm:p-2.5 flex items-center justify-center group-hover:scale-105">
                  {cat.imageUrl ? (
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.label} 
                      className="w-full h-full object-contain drop-shadow-2xs transition-transform duration-300 group-hover:scale-110"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full border ${cat.color || 'bg-sky-50 text-sky-600 border-sky-100'} flex items-center justify-center shadow-2xs`}>
                      {renderCategoryIcon(cat.icon)}
                    </div>
                  )}
                </div>

                {/* Category Title */}
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-tight leading-tight group-hover:text-sky-600 transition-colors line-clamp-2 px-0.5 mt-2">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right Navigation Chevron Button matching Capture.PNG */}
          {canScrollCategoryRight && (
            <button
              onClick={() => handleCategoryScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="পরবর্তী ক্যাটাগরি"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2.5: Flash Sale ⚡ Live Countdown Timer Section */}
      <div className="bg-rose-600/5 border border-rose-500/15 rounded-xl p-4 sm:p-4.5 space-y-4 shadow-xs">
        {/* Flash Sale Header - Single Line on Mobile & Desktop */}
        <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-3 border-b border-rose-500/10 pb-2.5 flex-nowrap overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap min-w-0">
            <div className="flex items-center space-x-1 bg-rose-600 text-white font-black text-[10.5px] sm:text-xs px-2 sm:px-2.5 py-1 rounded shadow-sm tracking-wide uppercase shrink-0 whitespace-nowrap">
              <span className="text-[10px] sm:text-[11px]">⚡</span>
              <span>ফ্ল্যাশ সেল</span>
            </div>
            
            {/* Live Glow Badge */}
            <div className="hidden xs:flex items-center space-x-1 bg-green-50 text-green-700 font-sans font-black border border-green-200 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-sm shrink-0">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span>LIVE</span>
            </div>

            {/* Premium Countdown Clock */}
            <div className="flex items-center space-x-1 font-sans select-none shrink-0">
              <div className="bg-slate-900 text-amber-400 font-extrabold text-[11px] sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-xs min-w-[22px] sm:min-w-[28px] text-center border border-slate-800">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="font-extrabold text-rose-600 text-xs animate-pulse">:</span>
              <div className="bg-slate-900 text-amber-400 font-extrabold text-[11px] sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-xs min-w-[22px] sm:min-w-[28px] text-center border border-slate-800">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="font-extrabold text-rose-600 text-xs animate-pulse">:</span>
              <div className="bg-slate-900 text-amber-400 font-extrabold text-[11px] sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-xs min-w-[22px] sm:min-w-[28px] text-center border border-slate-800">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab('offers')}
            className="text-rose-600 hover:text-rose-700 font-sans font-black text-[10.5px] sm:text-xs flex items-center transition-colors shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span className="sm:hidden">সব দেখুন</span>
            <span className="hidden sm:inline">সব অফার দেখুন</span>
            <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-[11px]">&gt;&gt;</span>
          </button>
        </div>

        {/* Flash Sale Product Row / Carousel */}
        <div className="relative group/flash">
          <div 
            ref={flashSaleScrollRef}
            className="flex overflow-x-auto gap-4 py-1.5 scrollbar-none scroll-smooth snap-x"
          >
            {/* Find standard products with high discounts or today's deals to showcase */}
            {(() => {
              if (isLoadingProducts || isLoadingHomeConfig) {
                return [...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-[155px] sm:w-[175px] shrink-0 snap-start">
                    <ProductSkeleton />
                  </div>
                ));
              }

              const flashSaleProducts = products.filter(p => p.isFlashSale);
              const otherSaleProducts = products.filter(p => !p.isFlashSale && p.discountPercent && p.discountPercent >= 10);
              const itemsToRender = [...flashSaleProducts, ...otherSaleProducts].slice(0, 12);

              return itemsToRender.map((prod: any, idx: number) => {
                const soldPercentage = [84, 91, 73, 62, 95, 48, 88, 77][idx % 8] || 75;
                const stockLeft = [3, 2, 5, 8, 1, 9, 4, 6][idx % 8] || 5;

                return (
                  <div 
                    key={prod.id || idx} 
                    onClick={() => {
                      const p: Product = {
                        id: prod.id,
                        title: prod.title,
                        type: prod.type || 'superstore',
                        authorOrBrand: prod.authorOrBrand || 'ফ্ল্যাশ সেল',
                        originalPrice: prod.originalPrice || prod.discountedPrice * 1.5,
                        discountedPrice: prod.discountedPrice,
                        discountPercent: prod.discountPercent || 25,
                        rating: 4.8,
                        totalRatings: 100,
                        imageUrl: prod.imageUrl,
                        inStock: true,
                        category: prod.category || 'ফ্ল্যাশ সেল'
                      };
                      onSelectProduct?.(p);
                    }}
                    className="w-[155px] sm:w-[175px] shrink-0 bg-white border border-rose-550/10 rounded-lg p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative snap-start cursor-pointer"
                  >
                    {/* Urgency indicators */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-rose-600 text-white font-sans font-black text-[8px] sm:text-[9.5px] px-1.5 py-0.5 rounded-sm">
                        -{prod.discountPercent || 25}%
                      </span>
                    </div>

                    {stockLeft <= 3 && (
                      <div className="absolute top-2 right-2 z-10 animate-pulse">
                        <span className="bg-amber-500 text-slate-950 font-sans font-black text-[7px] uppercase px-1 py-0.5 rounded-sm">
                          মিনিটেই শেষ!
                        </span>
                      </div>
                    )}

                    {/* Image visual */}
                    <div className="w-full h-24 sm:h-28 rounded-md bg-slate-50 flex items-center justify-center p-2 relative select-none">
                      <img 
                        src={getProductImageUrl(prod)} 
                        alt={prod.title} 
                        className="w-full h-full object-contain mix-blend-multiply rounded"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Title & Pricing info */}
                    <div className="pt-2 text-left space-y-1">
                      <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-800 line-clamp-2 h-7 sm:h-8 leading-tight font-sans">
                        {prod.title}
                      </h4>

                      <div className="space-y-0.5 font-sans leading-none pt-0.5">
                        <div className="flex items-center space-x-1 text-slate-400 text-[9px] sm:text-[10px] line-through">
                          <span>Tk {prod.originalPrice ? prod.originalPrice.toLocaleString('bn-BD') : (prod.discountedPrice * 1.5).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex items-baseline text-rose-600 font-sans">
                          <span className="text-xs sm:text-sm font-black tracking-tight font-sans">
                            Tk {prod.discountedPrice.toLocaleString('bn-BD')}
                          </span>
                        </div>
                      </div>

                      {/* Stock Bar Urgency indicator */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-[7.5px] sm:text-[8px] font-bold text-slate-500">
                          <span className={stockLeft <= 3 ? 'text-rose-600 font-black' : ''}>
                            {stockLeft <= 3 ? `মাত্র ${stockLeft}টি বাকি!` : 'স্টকে আছে'}
                          </span>
                          <span>{soldPercentage}% বিক্রি</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              soldPercentage >= 90 ? 'bg-rose-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${soldPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Add to Cart CTA */}
                      <div className="pt-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const p: Product = {
                              id: prod.id,
                              title: prod.title,
                              type: prod.type || 'superstore',
                              authorOrBrand: prod.authorOrBrand || 'ফ্ল্যাশ সেল',
                              originalPrice: prod.originalPrice || prod.discountedPrice * 1.5,
                              discountedPrice: prod.discountedPrice,
                              discountPercent: prod.discountPercent || 25,
                              rating: 4.8,
                              totalRatings: 100,
                              imageUrl: prod.imageUrl,
                              inStock: true,
                              category: prod.category || 'ফ্ল্যাশ সেল'
                            };
                            onAddToCart(p);
                          }}
                          className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-[10px] font-black py-1.5 rounded flex items-center justify-center space-x-1 shadow-2xs transition-all cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>কার্টে যোগ করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Physics Scroll Left Trigger */}
          <button 
            onClick={() => scrollContainer(flashSaleScrollRef, 'left')}
            className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-slate-200 cursor-pointer hidden sm:block hover:bg-rose-50"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Physics Scroll Right Trigger */}
          <button 
            onClick={() => scrollContainer(flashSaleScrollRef, 'right')}
            className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-slate-200 cursor-pointer hidden sm:block hover:bg-rose-50"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 3: Quick Deal ⚡ Campaign Sections (Sequential) */}
      <div className="space-y-4">
        {config.quickDealTabs.map((tab: string) => (
          <QuickDealSectionRow
            key={tab}
            tabGroup={tab}
            products={products}
            config={config}
            isLoadingProducts={isLoadingProducts || isLoadingHomeConfig}
            triggerQuickDealAddToCart={triggerQuickDealAddToCart}
            getProductImageUrl={getProductImageUrl}
            scrollContainer={scrollContainer}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>

      {/* SECTION: Core Category Product Showcases (বই, ইলেক্ট্রনিক্স, সুপার স্টোর, ফ্যাশন, কিডস জোন) */}
      <RokomariFeaturesShowcase
        products={products}
        isLoadingProducts={isLoadingProducts}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        onNavigateToTab={onNavigateToTab}
        onSearchCategory={(catQuery) => {
          onNavigateToTab('books', catQuery);
        }}
      />

      {/* SECTION 4: Best Selling eBooks Section */}
      <div className="space-y-2.5">
        <div className="flex flex-row justify-between items-center gap-2 border-b border-gray-150 pb-1.5 flex-nowrap overflow-hidden">
          <div className="flex items-center space-x-1.5 min-w-0 flex-nowrap">
            <h2 className="text-sm font-black text-slate-800 tracking-tight font-sans whitespace-nowrap truncate">
              বেস্টসেলিং ই-বুক
            </h2>
            <span className="bg-amber-150 text-amber-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
              eBooks
            </span>
          </div>
          
          <button 
            onClick={() => {
              if (onSearchAuthorOrPublisher) {
                onSearchAuthorOrPublisher('ই-বুক');
              } else {
                onNavigateToTab('books');
              }
            }}
            className="border border-slate-200 hover:border-sky-500 rounded px-2.5 py-1 text-[10px] font-black text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer font-sans shrink-0 whitespace-nowrap"
          >
            সব দেখুন
          </button>
        </div>

        {/* Carousel containing eBook Cards */}
        <div className="relative">
          <div 
            ref={ebooksScrollRef}
            className="flex overflow-x-auto gap-4 py-1.5 scroll-smooth scrollbar-none snap-x"
          >
            {isLoadingProducts ? (
              [...Array(6)].map((_, idx) => (
                <div key={idx} className="w-[145px] shrink-0 snap-start">
                  <ProductSkeleton />
                </div>
              ))
            ) : (
              getEbooksList().map((eb: any) => (
                <div 
                  key={eb.id} 
                  onClick={() => {
                    const real = products.find(p => p.id === eb.id || p.title === eb.title);
                    if (real && onSelectProduct) {
                      onSelectProduct(real);
                    } else if (onSelectProduct) {
                      onSelectProduct({
                        id: eb.id,
                        title: eb.title,
                        type: 'book',
                        authorOrBrand: eb.author,
                        originalPrice: eb.originalPrice || eb.price + 50,
                        discountedPrice: eb.price,
                        discountPercent: Math.round(((eb.originalPrice - eb.price) / (eb.originalPrice || eb.price + 50)) * 100) || 20,
                        rating: eb.rating || 4.8,
                        totalRatings: 56,
                        imageUrl: eb.imageUrl || 'cover-master-emotions',
                        inStock: true,
                        category: 'ই-বুক',
                        badgeText: eb.badge || 'EBOOK'
                      });
                    }
                  }}
                  className="w-[145px] shrink-0 bg-white border border-slate-150 rounded-lg p-2.5 flex flex-col justify-between shadow-2xs snap-start hover:shadow-xs transition-shadow relative group text-left cursor-pointer"
                  title={`${eb.title} - বিস্তারিত দেখতে ক্লিক করুন`}
                >
                  {/* Book styling with placeholder decorative styles matching uploaded image aspect ratios */}
                  <div className="w-full h-32 bg-slate-100 rounded border border-slate-20% shadow-2xs flex items-center justify-center relative overflow-hidden select-none p-2">
                    {eb.imageUrl ? (
                      <img 
                        src={getProductImageUrl(eb)} 
                        alt={eb.title} 
                        className="w-full h-full object-contain mix-blend-multiply rounded"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-y-0 left-0 w-2.5 bg-sky-650 opacity-40 shadow-sm z-10 rounded-l"></div>
                        {/* Book graphic covers matching standard books visual layouts */}
                        <div className="w-full h-full bg-linear-to-b from-sky-450 to-indigo-700 rounded-sm flex flex-col justify-between p-1.5 text-white">
                          <span className="text-[6px] font-black tracking-widest block uppercase text-amber-300">
                            R-EBOOK
                          </span>
                          <h5 className="text-[9px] font-black leading-tight text-white line-clamp-3">
                            {eb.title}
                          </h5>
                          <span className="text-[7px] font-semibold block text-slate-100/90 truncate">
                            {eb.author}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-2 text-left space-y-1">
                    <h4 className="text-[10px] sm:text-[10.5px] font-black text-slate-800 truncate font-sans group-hover:text-sky-600 transition-colors">
                      {eb.title}
                    </h4>
                    <p className="text-[8.5px] text-slate-400 font-bold truncate">
                      {eb.author}
                    </p>

                    {/* Sub-block pricing */}
                    <div className="flex items-center justify-between font-sans leading-none pt-0.5">
                      <div className="text-slate-800 text-[10.5px] font-black">
                        TK. {eb.price}
                      </div>
                      {eb.originalPrice && (
                        <div className="text-slate-400 text-[8.5px] line-through">
                          TK. {eb.originalPrice}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                        {eb.rating}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerEbookAddToCart(eb);
                        }}
                        className="text-sky-500 hover:text-indigo-600 font-black text-[9px] underline focus:outline-hidden cursor-pointer"
                        title="কার্টে যোগ করুন"
                      >
                        Buy eBook
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Trigger Left */}
          <button 
            onClick={() => scrollContainer(ebooksScrollRef, 'left')}
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1 rounded-full shadow border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Trigger Right */}
          <button 
            onClick={() => scrollContainer(ebooksScrollRef, 'right')}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1 rounded-full shadow border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 5: Popular Authors & Publishers Dual-Tab Carousel Section */}
      <div id="popular-authors-section" className="space-y-4 scroll-mt-28">
        <div className="flex flex-row justify-between items-center gap-2 border-b border-gray-150 pb-2 flex-nowrap overflow-hidden">
          <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans whitespace-nowrap truncate">
            জনপ্রিয় লেখক ও প্রকাশনী
          </h2>
          
          {/* Tabs for switching between Authors and Publishers */}
          <div className="flex space-x-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
            <button
              id="tab-btn-authors"
              onClick={() => setActiveAuthorPublisherTab('authors')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeAuthorPublisherTab === 'authors'
                  ? 'bg-white text-slate-800 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              লেখক
            </button>
            <button
              id="tab-btn-publishers"
              onClick={() => setActiveAuthorPublisherTab('publishers')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeAuthorPublisherTab === 'publishers'
                  ? 'bg-white text-slate-800 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              প্রকাশনী
            </button>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="relative">
          {activeAuthorPublisherTab === 'authors' ? (
            <div 
              ref={authorsScrollRef}
              className="flex overflow-x-auto gap-4 py-1.5 scrollbar-none scroll-smooth snap-x"
            >
              {config.authors.map((aut: any) => {
                const authorImg = aut.imageUrl || AUTHOR_PHOTO_MAP[aut.name];
                return (
                  <div 
                    key={aut.id} 
                    className="w-20 sm:w-24 shrink-0 flex flex-col items-center text-center space-y-1.5 group cursor-pointer snap-start"
                    onClick={() => {
                      if (onViewAuthor) {
                        onViewAuthor(aut.name);
                      } else if (onSearchAuthorOrPublisher) {
                        onSearchAuthorOrPublisher(aut.name);
                      } else {
                        onNavigateToTab('books');
                      }
                    }}
                    title={`${aut.name} - প্রোফাইল ও বই দেখতে ক্লিক করুন`}
                  >
                    {/* Visual photo or styled initials block representing Avatar photo */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-200/80 group-hover:border-sky-500 ${aut.avatarBg} flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300 relative overflow-hidden bg-slate-100`}>
                      {authorImg ? (
                        <img 
                          src={authorImg} 
                          alt={aut.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10"></div>
                          <span className="text-xs sm:text-sm font-sans font-black tracking-tight select-none">
                            {aut.name.substring(0, 2)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="space-y-0.5 leading-none">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-800 block truncate w-18 sm:w-22 font-sans group-hover:text-sky-600 transition-colors">
                        {aut.name}
                      </span>
                      <span className="text-[7.5px] sm:text-[8px] text-slate-400 font-semibold block truncate w-18 sm:w-22">
                        {aut.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div 
              ref={publishersScrollRef}
              className="flex overflow-x-auto gap-4 py-1.5 scrollbar-none scroll-smooth snap-x"
            >
              {(config.publishers || []).map((pub: any) => (
                <div 
                  key={pub.id} 
                  className="w-24 sm:w-28 shrink-0 flex flex-col items-center text-center space-y-1.5 group cursor-pointer snap-start"
                  onClick={() => {
                    if (onSearchAuthorOrPublisher) {
                      onSearchAuthorOrPublisher(pub.name);
                    } else {
                      onNavigateToTab('books');
                    }
                  }}
                  title={`${pub.name} - এই প্রকাশনীর সকল বই দেখতে ক্লিক করুন`}
                >
                  {/* Rectangular / Rounded Square badge for Publisher logo look */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-slate-200/80 group-hover:border-indigo-500 ${pub.avatarBg} flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300 p-2 text-center`}>
                    <span className="text-base select-none mb-0.5">🏛️</span>
                    <span className="text-[9.5px] sm:text-[10px] font-sans font-black leading-tight tracking-tight select-none block break-words">
                      {pub.name.substring(0, 5)}
                    </span>
                  </div>
                  <div className="space-y-0.5 leading-none">
                    <span className="text-[9.5px] sm:text-[10px] font-black text-slate-800 block truncate w-22 sm:w-26 font-sans group-hover:text-indigo-600 transition-colors">
                      {pub.name}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] text-slate-400 font-semibold block truncate w-22 sm:w-26">
                      {pub.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trigger Left */}
          <button 
            onClick={() => scrollContainer(activeAuthorPublisherTab === 'authors' ? authorsScrollRef : publishersScrollRef, 'left')}
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50 z-10 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Trigger Right */}
          <button 
            onClick={() => scrollContainer(activeAuthorPublisherTab === 'authors' ? authorsScrollRef : publishersScrollRef, 'right')}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50 z-10 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 6: Shop From Top Brands Sub-nav Option & Logos Container Block */}
      <div className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-xs">
        {/* Title and selector row */}
        <div className="bg-sky-50 px-3.5 sm:px-4 py-2.5 border-b border-slate-150 flex flex-row justify-between items-center gap-2 flex-nowrap overflow-hidden">
          <h3 className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider font-sans flex items-center whitespace-nowrap shrink-0">
            <BadgePercent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 mr-1 shrink-0" />
            <span>টপ ব্র্যান্ডস</span>
          </h3>

          <div className="flex space-x-1 p-0.5 bg-slate-200/50 rounded-md border border-slate-200 overflow-x-auto scrollbar-none shrink-0">
            {config.brandTabs.map((bt: string) => (
              <button
                key={bt}
                onClick={() => setActiveBrandTab(bt)}
                className={`px-2 py-0.5 rounded text-[9px] sm:text-[9.5px] font-black transition-all cursor-pointer font-sans whitespace-nowrap shrink-0 ${
                  activeBrandTab === bt 
                    ? 'bg-white text-slate-800 font-black shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
        </div>

        {/* Oval Badges Display row */}
        <div className="relative p-4">
          <div 
            ref={brandsScrollRef}
            className="flex overflow-x-auto gap-3 py-1 scrollbar-none scroll-smooth snap-x"
          >
            {config.brands[activeBrandTab]?.map((brand: any, idx: number) => (
              <div 
                key={idx}
                onClick={() => onNavigateToTab('electronics')}
                className={`px-5 py-2.5 rounded-full border ${brand.logoBg} font-mono font-black text-[10px] sm:text-xs shrink-0 select-none cursor-pointer snap-start hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center min-w-[100px] shadow-2xs hover:shadow-xs`}
              >
                {brand.name}
              </div>
            ))}
          </div>

          {/* Trigger Left */}
          <button 
            onClick={() => scrollContainer(brandsScrollRef, 'left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1 rounded-full shadow border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          {/* Trigger Right */}
          <button 
            onClick={() => scrollContainer(brandsScrollRef, 'right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-slate-800 p-1 rounded-full shadow border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* SECTION 7: Subsections Grid (বই, ইলেক্ট্রনিক্স, সুপার স্টোর, কিডস জোন) */}
      {(() => {
        // Resolve grids dynamically to guarantee the 4 core sections: books, electronics, superstore, kids
        const resolvedGrids = (config.grids?.books || config.grids?.electronics || config.grids?.superstore || config.grids?.kids)
          ? {
              books: config.grids.books || DEFAULT_HOME_GRIDS.books,
              electronics: config.grids.electronics || DEFAULT_HOME_GRIDS.electronics,
              superstore: config.grids.superstore || DEFAULT_HOME_GRIDS.superstore,
              kids: config.grids.kids || DEFAULT_HOME_GRIDS.kids
            }
          : DEFAULT_HOME_GRIDS;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {Object.entries(resolvedGrids).map(([key, grid]: any) => (
              <div key={key} className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow">
                
                {/* Column Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center space-x-1.5">
                    <span className="text-base">{grid.icon || (key === 'books' ? '📚' : key === 'electronics' ? '⚡' : key === 'superstore' ? '🛒' : '🧸')}</span>
                    <span>{grid.title}</span>
                  </h3>
                  <button 
                    onClick={() => onNavigateToTab(grid.link || key)}
                    className="text-[9.5px] font-black text-sky-600 hover:text-sky-700 flex items-center font-sans hover:underline cursor-pointer"
                  >
                    সব দেখুন <span className="ml-0.5">&gt;</span>
                  </button>
                </div>

                {/* Grid 2x2 of Products with Image and Direct Add To Cart */}
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {getGridItems(key, grid.items).map((item: any, i: number) => (
                    <div 
                      key={i} 
                      className="flex flex-col space-y-1.5 group cursor-pointer text-left bg-slate-50/50 hover:bg-slate-50 p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-all hover:shadow-2xs"
                      onClick={() => {
                        if (item.realProduct) {
                          onSelectProduct?.(item.realProduct);
                        } else {
                          triggerGridItemAddToCart(item, grid.title);
                        }
                      }}
                      title={`${item.title} - বিস্তারিত দেখতে ক্লিক করুন`}
                    >
                      <div className="w-full h-24 rounded border border-slate-200/50 p-1 shadow-3xs flex flex-col justify-between text-white relative overflow-hidden bg-white">
                        {item.imageUrl ? (
                          <div className="w-full h-full bg-white rounded flex items-center justify-center overflow-hidden relative">
                            <img 
                              src={getProductImageUrl(item)} 
                              alt={item.title} 
                              className="w-full h-full object-contain mix-blend-multiply rounded group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {item.badge && (
                              <span className="absolute top-1 left-1 bg-slate-900/70 text-white text-[7px] font-black px-1 py-0.5 rounded leading-none backdrop-blur-xs">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className={`w-full h-full rounded flex flex-col justify-between p-1.5 ${item.bg}`}>
                            <span className="text-[6px] font-bold block uppercase tracking-widest text-white/80">
                              {key === 'books' ? 'BOOK' : key === 'electronics' ? 'TECH' : key === 'superstore' ? 'STORE' : 'KIDS'}
                            </span>
                            <h5 className="text-[8.5px] font-black leading-tight line-clamp-3">
                              {item.title}
                            </h5>
                            <span className="text-[7px] font-semibold block text-slate-100 truncate pb-0.5">
                              {item.author}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-left leading-tight pl-0.5">
                        <span className="text-[9px] font-black text-slate-800 line-clamp-1 block group-hover:text-sky-600 transition-colors">
                          {item.title}
                        </span>
                        <div className="flex items-center justify-between text-[7px] text-slate-400 font-sans leading-none pt-1">
                          <span className="font-extrabold text-blue-600">Tk {item.price}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerGridItemAddToCart(item, grid.title);
                            }}
                            className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-sky-500 hover:text-white font-bold transition-colors cursor-pointer"
                            title="কার্টে যোগ করুন"
                          >
                            + কার্ট
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        );
      })()}

      {/* SECTION 8: Category Wise Product Preview */}
      <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-row justify-between items-center border-b border-slate-100 pb-2.5 gap-2 flex-nowrap overflow-hidden">
          <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center space-x-1.5 whitespace-nowrap truncate">
            <span>📁 ক্যাটাগরি ভিত্তিক পণ্যসমূহ</span>
            <span className="bg-sky-500 text-white font-mono font-bold text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              New
            </span>
          </h2>
          
          {/* Quick Stats of displayed items */}
          <div className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-sky-100 font-sans shrink-0 whitespace-nowrap">
            {previewProducts.length} টি পণ্য
          </div>
        </div>

        {/* Categories Grid and Product Display Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: Subcategory list */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pb-1">ক্যাটাগরি তালিকা</span>
            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-1.5 pr-1 pb-2 md:pb-0 max-h-72 scrollbar-none">
              {previewSubcategories.map(({ deptId, subcat }) => {
                const isSelected = selectedPreviewSubcat === subcat;
                const deptLabel = deptId === 'books' ? 'বই' : 
                                  deptId === 'electronics' ? 'টেক' : 
                                  deptId === 'superstore' ? 'সুপার' : 
                                  deptId === 'fashion' ? 'ফ্যাশন' : 'কিডস';
                                  
                return (
                  <button
                    key={subcat}
                    onClick={() => handleSelectPreviewSubcat(subcat)}
                    className={`text-[11.5px] text-left py-2 px-3 rounded-lg transition-all flex justify-between items-center shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white font-extrabold shadow-sm'
                        : 'bg-slate-50 text-slate-650 hover:bg-slate-100 border border-slate-200/55'
                    }`}
                  >
                    <span className="truncate">{subcat}</span>
                    <span className={`text-[8px] px-1 py-0.5 rounded ml-2 font-mono ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      {deptLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Products Grid with Child Category Filter at top */}
          <div className="md:col-span-3 space-y-4">
            
            {/* Child category filters (if active subcat has children) */}
            {(() => {
              const activeSubcatObj = previewSubcategories.find(s => s.subcat === selectedPreviewSubcat);
              const children = activeSubcatObj?.children || [];
              
              if (children.length === 0) return null;
              
              return (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">চাইল্ড ক্যাটাগরি ফিল্টার:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {/* All Child Categories button */}
                    <button
                      onClick={() => setSelectedPreviewChildCat('')}
                      className={`text-[10.5px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                        selectedPreviewChildCat === ''
                          ? 'bg-sky-50 text-sky-700 border-sky-400 shadow-3xs'
                          : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'
                      }`}
                    >
                      সকল সাব-আইটেম
                    </button>
                    {children.map((child) => {
                      const isChildSelected = selectedPreviewChildCat === child;
                      return (
                        <button
                          key={child}
                          onClick={() => setSelectedPreviewChildCat(child)}
                          className={`text-[10.5px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            isChildSelected
                              ? 'bg-sky-50 text-sky-700 border-sky-400 font-extrabold shadow-3xs'
                              : 'bg-white text-slate-650 border-gray-200 hover:bg-slate-50'
                          }`}
                        >
                          {child}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Products display grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoadingProducts ? (
                [...Array(8)].map((_, idx) => (
                  <div key={idx} className="w-full">
                    <ProductSkeleton />
                  </div>
                ))
              ) : (
                previewProducts.map((prod) => (
                  <div key={prod.id} className="w-full">
                    <ProductCard
                      product={prod}
                      onAddToCart={onAddToCart}
                      onPreview={onPreview}
                      onSelectProduct={onSelectProduct}
                      onAddToCompare={onAddToCompare}
                      isComparing={compareItems.some((item) => item.id === prod.id)}
                      isFavorite={favoriteProductIds.includes(prod.id)}
                      onToggleFavorite={onToggleFavorite}
                      onViewAuthor={onViewAuthor}
                    />
                  </div>
                ))
              )}
            </div>

            {/* No products found state */}
            {!isLoadingProducts && previewProducts.length === 0 && (
              <div className="bg-slate-50/55 rounded-xl border border-dashed border-slate-200 text-center py-12 px-4 space-y-2">
                <div className="text-xl">📦</div>
                <h4 className="text-xs font-bold text-slate-700">এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি</h4>
                <p className="text-[10.5px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  অ্যাডমিন প্যানেল থেকে এই সাব-ক্যাটাগরির অধীনে নতুন প্রোডাক্ট অ্যাড করুন অথবা ক্যাটাগরি ফিল্টার পরিবর্তন করুন।
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
