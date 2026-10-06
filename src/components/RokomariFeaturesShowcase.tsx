import React, { useRef } from 'react';
import { 
  CreditCard, 
  BookOpen, 
  Coins, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingCart, 
  Eye, 
  Star,
  Zap,
  CheckCircle,
  Award
} from 'lucide-react';
import { Product } from '../types';
import { getProductImageUrl } from '../lib/bookUtils';
import { BOOKS_DATA, ELECTRONICS_DATA, SUPERSTORE_DATA, FASHION_DATA, KIDS_DATA } from '../data';

export interface BookTrustBannersProps {
  onNavigateToTab?: (tab: string) => void;
  onPreviewSampleBook?: () => void;
}

export function BookTrustBanners({ onNavigateToTab, onPreviewSampleBook }: BookTrustBannersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Banner 1: Cash On Delivery */}
      <div 
        onClick={() => onNavigateToTab?.('offers')}
        className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[11px] sm:text-xs font-black text-slate-700 block">বই হাতে পেয়ে</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 block tracking-tight group-hover:text-amber-600 transition-colors">
            মূল্য পরিশোধ করুন
          </span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black text-lg sm:text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          ৳
        </div>
      </div>

      {/* Banner 2: Read Before Order (একটু পড়ে দেখুন) */}
      <div 
        onClick={() => {
          if (onPreviewSampleBook) {
            onPreviewSampleBook();
          } else {
            onNavigateToTab?.('books');
          }
        }}
        className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-sky-400 transition-all cursor-pointer group"
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[11px] sm:text-xs font-black text-slate-700 block">বই অর্ডার করার আগে</span>
          <span className="text-sm sm:text-base font-extrabold text-sky-600 block tracking-tight">
            একটু পড়ে দেখুন...
          </span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Banner 3: Loyalty Points (অর্ডার করলেই থাকছে পয়েন্ট) */}
      <div 
        onClick={() => onNavigateToTab?.('offers')}
        className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-rose-400 transition-all cursor-pointer group"
      >
        <div className="space-y-0.5 text-left">
          <span className="text-[11px] sm:text-xs font-black text-slate-700 block">অর্ডার করলেই</span>
          <span className="text-sm sm:text-base font-extrabold text-rose-600 block tracking-tight">
            থাকছে পয়েন্ট 🏅
          </span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          <Award className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface RokomariFeaturesShowcaseProps {
  products: Product[];
  isLoadingProducts?: boolean;
  showTrustBanners?: boolean;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onNavigateToTab?: (tab: string) => void;
  onSearchCategory?: (cat: string) => void;
}

// Custom sample datasets matching screenshot precisely
export const NEWLY_RELEASED_ITEMS: Array<Partial<Product> & { brand?: string }> = [
  {
    id: 'nr-hoco-d109',
    title: 'Hoco D109 Smart FULLY Charged Disconnector',
    authorOrBrand: 'Hoco',
    brand: 'Hoco',
    originalPrice: 1050,
    discountedPrice: 999,
    discountPercent: 5,
    rating: 4.9,
    totalRatings: 18,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Newly Released',
    badgeText: '05% OFF'
  },
  {
    id: 'nr-avivita-mineral',
    title: 'AVIVITA Universal Bird Mineral Block 25gm',
    authorOrBrand: 'AVIVITA',
    brand: 'AVIVITA',
    originalPrice: 45,
    discountedPrice: 39,
    discountPercent: 6,
    rating: 4.8,
    totalRatings: 12,
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80',
    type: 'superstore',
    inStock: true,
    category: 'Newly Released',
    badgeText: '06% OFF'
  },
  {
    id: 'nr-golden-rose-powder',
    title: 'Golden Rose Pressed Powder 12.7gm',
    authorOrBrand: 'Golden Rose',
    brand: 'Golden Rose',
    originalPrice: 1950,
    discountedPrice: 1900,
    discountPercent: 3,
    rating: 4.7,
    totalRatings: 25,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    type: 'superstore',
    inStock: true,
    category: 'Newly Released',
    badgeText: '03% OFF'
  },
  {
    id: 'nr-productivity-timer',
    title: 'Productivity F6 Timer 2/5/10/30/60 Minute',
    authorOrBrand: 'Productivity Timer',
    brand: 'F6 Tech',
    originalPrice: 1799,
    discountedPrice: 1499,
    discountPercent: 6,
    rating: 4.9,
    totalRatings: 44,
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Newly Released',
    badgeText: '06% OFF'
  },
  {
    id: 'nr-aval-v535-speaker',
    title: 'Awal Y535 Mini Portable Bluetooth Speaker',
    authorOrBrand: 'Awal',
    brand: 'Awal',
    originalPrice: 2000,
    discountedPrice: 1550,
    discountPercent: 23,
    rating: 4.6,
    totalRatings: 31,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Newly Released',
    badgeText: '23% OFF'
  },
  {
    id: 'nr-kindle-paperwhite',
    title: 'Amazon Kindle Paperwhite 12th Gen 32GB 7-inch With Wi-Fi',
    authorOrBrand: 'Amazon Kindle',
    brand: 'Amazon',
    originalPrice: 37000,
    discountedPrice: 32973,
    discountPercent: 13,
    rating: 5.0,
    totalRatings: 110,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Newly Released',
    badgeText: '13% OFF'
  }
];

export const CHARGER_FAN_ITEMS: Array<Partial<Product> & { brand?: string }> = [
  {
    id: 'cf-handheld-1pcs',
    title: 'Handheld Mini Fan 1 pcs',
    authorOrBrand: 'Non-Brand',
    brand: 'Non-Brand',
    originalPrice: 700,
    discountedPrice: 459,
    discountPercent: 35,
    rating: 4.8,
    totalRatings: 15,
    imageUrl: 'https://images.unsplash.com/photo-1523039649-56a2a9a21418?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Charger Fan',
    badgeText: '35% OFF'
  },
  {
    id: 'cf-toybliss-handheld',
    title: 'Toybliss Portable Handheld Fan (677-55) (Ages 3 Plus)',
    authorOrBrand: 'Toybliss',
    brand: 'Toybliss',
    originalPrice: 1150,
    discountedPrice: 950,
    discountPercent: 17,
    rating: 4.9,
    totalRatings: 28,
    imageUrl: 'https://images.unsplash.com/photo-1618945832961-1e9a4f4e7d1b?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Charger Fan',
    badgeText: '17% OFF'
  },
  {
    id: 'cf-rechargeable-dp7627',
    title: 'Rechargeable Portable Usb Fan With Led Light DP 7627 4000mAh',
    authorOrBrand: 'DP Light',
    brand: 'DP',
    originalPrice: 2500,
    discountedPrice: 2059,
    discountPercent: 18,
    rating: 4.7,
    totalRatings: 42,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Charger Fan',
    badgeText: '18% OFF'
  },
  {
    id: 'cf-mini-desktop-camping',
    title: 'Mini Desktop Rechargeable Fan Portable Table and Camping Fan with LED Lamp...',
    authorOrBrand: 'Non-Brand',
    brand: 'Non-Brand',
    originalPrice: 1600,
    discountedPrice: 899,
    discountPercent: 44,
    rating: 4.6,
    totalRatings: 56,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Charger Fan',
    badgeText: '44% OFF'
  },
  {
    id: 'cf-jisulife-f8x',
    title: 'JISULIFE F8X Mini Portable Fan (New/Upgrade Version) - F8X',
    authorOrBrand: 'JISULIFE',
    brand: 'JISULIFE',
    originalPrice: 1700,
    discountedPrice: 1615,
    discountPercent: 5,
    rating: 5.0,
    totalRatings: 139,
    imageUrl: 'https://images.unsplash.com/photo-1517055720413-6e5454a7c44a?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Charger Fan',
    badgeText: '05% OFF'
  },
  {
    id: 'cf-12inch-wireless-fan',
    title: '12" Pac Desktop Wireless Mini Fan',
    authorOrBrand: 'Memco',
    brand: 'Memco',
    originalPrice: 3800,
    discountedPrice: 2959,
    discountPercent: 22,
    rating: 4.8,
    totalRatings: 19,
    imageUrl: 'https://images.unsplash.com/photo-1523039649-56a2a9a21418?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Charger Fan',
    badgeText: '22% OFF'
  }
];

export const POWER_BANK_ITEMS: Array<Partial<Product> & { brand?: string }> = [
  {
    id: 'pb-awal-p13k',
    title: 'Awal P13K 22.5W PD Powerbank 20000mAh Fast Charging',
    authorOrBrand: 'Awal',
    brand: 'Awal',
    originalPrice: 1650,
    discountedPrice: 1479,
    discountPercent: 5,
    rating: 4.9,
    totalRatings: 54,
    imageUrl: 'https://images.unsplash.com/photo-1609592424317-573522194917?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Power Bank',
    badgeText: '05% OFF'
  },
  {
    id: 'pb-mini-portable-multi',
    title: 'Mini Portable Power Bank (Multicolor)',
    authorOrBrand: 'Non-Brand',
    brand: 'Non-Brand',
    originalPrice: 1250,
    discountedPrice: 1000,
    discountPercent: 20,
    rating: 4.2,
    totalRatings: 18,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Power Bank',
    badgeText: '20% OFF'
  },
  {
    id: 'pb-hoco-60000mah',
    title: 'Hoco Large Capacity Power Bank 60000mAh 22.5W (DB33)',
    authorOrBrand: 'Hoco',
    brand: 'Hoco',
    originalPrice: 5200,
    discountedPrice: 4999,
    discountPercent: 4,
    rating: 5.0,
    totalRatings: 32,
    imageUrl: 'https://images.unsplash.com/photo-1597872200919-0127a8b3fb16?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Power Bank',
    badgeText: '04% OFF'
  },
  {
    id: 'pb-baseus-ppcxm20',
    title: 'Baseus PPCXM20 20W 20000mAh Magnetic Mini Wireless Fast Charging Pow...',
    authorOrBrand: 'Baseus',
    brand: 'Baseus',
    originalPrice: 3200,
    discountedPrice: 2750,
    discountPercent: 14,
    rating: 4.8,
    totalRatings: 61,
    imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Power Bank',
    badgeText: '14% OFF'
  },
  {
    id: 'pb-joyroom-jr-pb112',
    title: 'JOYROOM JR-PB112 2.4A LED Power Bank 12W 10000mAh',
    authorOrBrand: 'JOYROOM',
    brand: 'JOYROOM',
    originalPrice: 999,
    discountedPrice: 899,
    discountPercent: 10,
    rating: 4.5,
    totalRatings: 22,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Power Bank',
    badgeText: '10% OFF'
  },
  {
    id: 'pb-joyroom-jr-pbm08',
    title: 'Joyroom JR-PBM08 Pro 20W Metal Magnetic Wireless Power Bank - 10000mAh',
    authorOrBrand: 'JOYROOM',
    brand: 'JOYROOM',
    originalPrice: 3100,
    discountedPrice: 2599,
    discountPercent: 16,
    rating: 4.9,
    totalRatings: 40,
    imageUrl: 'https://images.unsplash.com/photo-1609592424317-573522194917?auto=format&fit=crop&w=400&q=80',
    type: 'electronic',
    inStock: true,
    category: 'Power Bank',
    badgeText: '16% OFF'
  }
];

export const QUICK_CATEGORY_BUTTONS = [
  { label: 'হুমায়ূন আহমেদ বই', categoryQuery: 'হুমায়ূন আহমেদ' },
  { label: 'ব্যতিক্রম ও মুক্তির গল্প', categoryQuery: 'ব্যতিক্রম' },
  { label: 'ছড়া, কবিতা ও আবৃত্তি', categoryQuery: 'কবিতা' },
  { label: 'বর্ণমালা ও নামতা শিক্ষা', categoryQuery: 'বর্ণমালা' },
  { label: 'জীবনী ও স্মৃতিকথা', categoryQuery: 'জীবনী' }
];

export const POPULAR_ACADEMIC_CATEGORIES = [
  {
    id: 'hsc-admission',
    title: 'এইচ.এস.সি',
    subtitle: 'HSC',
    iconBg: 'bg-sky-100 border-sky-300',
    badgeColor: 'text-sky-700',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'admission',
    title: 'এডমিশন',
    subtitle: 'Admission',
    iconBg: 'bg-amber-100 border-amber-300',
    badgeColor: 'text-amber-700',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'school',
    title: 'স্কুল',
    subtitle: 'School',
    iconBg: 'bg-emerald-100 border-emerald-300',
    badgeColor: 'text-emerald-700',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'madrasah',
    title: 'মাদ্রাসা',
    subtitle: 'Madrasah',
    iconBg: 'bg-teal-100 border-teal-300',
    badgeColor: 'text-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'university',
    title: 'ভার্সিটি',
    subtitle: 'University',
    iconBg: 'bg-indigo-100 border-indigo-300',
    badgeColor: 'text-indigo-700',
    imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'ielts-gre',
    title: 'উচ্চশিক্ষা',
    subtitle: 'Higher Ed',
    iconBg: 'bg-rose-100 border-rose-300',
    badgeColor: 'text-rose-700',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=300&q=80'
  }
];

export default function RokomariFeaturesShowcase({
  products,
  isLoadingProducts = false,
  showTrustBanners = false,
  onSelectProduct,
  onAddToCart,
  onNavigateToTab,
  onSearchCategory
}: RokomariFeaturesShowcaseProps) {
  const booksRef = useRef<HTMLDivElement>(null);
  const electronicsRef = useRef<HTMLDivElement>(null);
  const superstoreRef = useRef<HTMLDivElement>(null);
  const fashionRef = useRef<HTMLDivElement>(null);
  const kidsRef = useRef<HTMLDivElement>(null);
  const academicCatRef = useRef<HTMLDivElement>(null);

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Filter products by category type directly from real products list (no demo fallback flash)
  const finalBooks = products.filter(p => p.type === 'book');
  const finalElectronics = products.filter(p => p.type === 'electronic');
  const finalSuperstore = products.filter(p => p.type === 'superstore');
  const finalFashion = products.filter(p => p.type === 'fashion');
  const finalKids = products.filter(p => p.type === 'kids');

  const renderProductCarousel = (
    title: string,
    subtitle: string,
    icon: string,
    items: Product[],
    ref: React.RefObject<HTMLDivElement | null>,
    viewAllTab: string
  ) => {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4.5 space-y-3.5 shadow-2xs">
        {/* Section Header - Strictly Single Line */}
        <div className="flex flex-row justify-between items-center gap-2 border-b border-slate-100 pb-2.5 flex-nowrap overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 flex-nowrap">
            <span className="text-lg sm:text-xl select-none shrink-0">{icon}</span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-sans whitespace-nowrap shrink-0">
              {title}
            </h3>
            <span className="bg-sky-50 text-sky-700 text-[9.5px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-full border border-sky-200 hidden md:inline-block whitespace-nowrap truncate">
              {subtitle}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap shrink-0">
              ({isLoadingProducts && items.length === 0 ? '...' : `${items.length}টি`})
            </span>
          </div>

          <button
            onClick={() => onNavigateToTab?.(viewAllTab)}
            className="group flex items-center space-x-1 border border-sky-400 hover:bg-sky-500 hover:text-white text-sky-600 text-[10.5px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all cursor-pointer shadow-3xs hover:shadow-xs active:scale-95 shrink-0 whitespace-nowrap"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* Carousel Row */}
        <div className="relative group/carousel">
          <div
            ref={ref}
            className="flex overflow-x-auto gap-3 py-1.5 scrollbar-none scroll-smooth snap-x"
          >
            {isLoadingProducts && items.length === 0 ? (
              [...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[150px] sm:w-[175px] shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-2.5 h-60 animate-pulse snap-start"
                />
              ))
            ) : items.map((item, idx) => {
              const discountP = item.discountPercent ?? (
                item.originalPrice && item.discountedPrice
                  ? Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)
                  : 0
              );
              const imageUrl = getProductImageUrl(item);

              return (
                <div
                  key={item.id || idx}
                  onClick={() => onSelectProduct?.(item)}
                  className="w-[150px] sm:w-[175px] shrink-0 bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-sky-400 transition-all duration-200 snap-start cursor-pointer group/card relative text-left"
                >
                  {/* Discount Badge */}
                  {discountP > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-rose-500 text-white font-sans font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded shadow-2xs">
                        {discountP}% OFF
                      </span>
                    </div>
                  )}

                  {/* Special Badge Text */}
                  {item.badgeText && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-amber-400 text-slate-950 font-sans font-black text-[7.5px] px-1 py-0.5 rounded uppercase shadow-3xs">
                        {item.badgeText}
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="w-full h-28 sm:h-32 rounded-lg bg-slate-50 flex items-center justify-center p-2 relative overflow-hidden select-none">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Meta */}
                  <div className="pt-2 space-y-1">
                    <h4 
                      className="text-[10.5px] sm:text-[11.5px] font-bold text-slate-800 line-clamp-2 h-7 sm:h-8 leading-tight font-sans group-hover/card:text-sky-600 transition-colors" 
                      title={item.title}
                    >
                      {item.title}
                    </h4>

                    {/* Brand / Author / In Stock strip */}
                    <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] text-slate-400">
                      <span className="truncate font-semibold max-w-[95px]">{item.authorOrBrand}</span>
                      {item.inStock !== false ? (
                        <span className="text-emerald-600 font-bold flex items-center space-x-0.5 shrink-0">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block"></span>
                          <span>স্টকে আছে</span>
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold shrink-0">স্টক শেষ</span>
                      )}
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center space-x-1 text-[8px] text-amber-500 font-bold">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${i < Math.floor(item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-400">({item.totalRatings || 12})</span>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-0.5 font-sans leading-none pt-0.5">
                      {item.originalPrice && item.originalPrice > (item.discountedPrice || 0) && (
                        <div className="text-slate-400 text-[8.5px] sm:text-[9px] line-through font-mono">
                          TK. {item.originalPrice.toLocaleString('en-US')}
                        </div>
                      )}
                      <div className="text-slate-900 font-black text-xs sm:text-sm tracking-tight font-sans">
                        TK. {(item.discountedPrice || 0).toLocaleString('en-US')}
                      </div>
                    </div>

                    {/* Add to cart button */}
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart?.(item);
                        }}
                        className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-[9.5px] font-bold py-1.5 rounded-md flex items-center justify-center space-x-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>কার্টে যোগ করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scrollHorizontally(ref, 'left')}
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-700 p-1.5 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50 transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollHorizontally(ref, 'right')}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-700 p-1.5 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50 transition-colors z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 font-sans select-none">
      
      {/* 1. TOP 3 TRUST BANNERS (Only when showTrustBanners is true) */}
      {showTrustBanners && (
        <BookTrustBanners 
          onNavigateToTab={onNavigateToTab} 
          onPreviewSampleBook={() => {
            const firstBook = products.find(p => p.type === 'book') || products[0];
            if (firstBook) onSelectProduct?.(firstBook);
          }} 
        />
      )}

      {/* 2. SECTION 1: বই (Books) */}
      {renderProductCarousel(
        'বই',
        'বেস্টসেলার ও জনপ্রিয় বই',
        '📚',
        finalBooks,
        booksRef,
        'books'
      )}

      {/* 3. SECTION 2: ইলেক্ট্রনিক্স (Electronics) */}
      {renderProductCarousel(
        'ইলেক্ট্রনিক্স',
        'স্মার্ট গ্যাজেট ও এক্সেসরিজ',
        '🔌',
        finalElectronics,
        electronicsRef,
        'electronics'
      )}

      {/* 4. QUICK CATEGORY PILLS BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
        {QUICK_CATEGORY_BUTTONS.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (onSearchCategory) {
                onSearchCategory(pill.categoryQuery);
              } else {
                onNavigateToTab?.('books');
              }
            }}
            className="bg-sky-50 hover:bg-sky-100 border border-sky-300 text-slate-850 hover:text-sky-700 text-[11px] sm:text-xs font-bold py-2.5 px-3 rounded-lg text-center transition-all duration-200 shadow-2xs truncate cursor-pointer active:scale-95"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* 5. SECTION 3: সুপার স্টোর (Superstore) */}
      {renderProductCarousel(
        'সুপার স্টোর',
        'নিত্যপ্রয়োজনীয় ও স্কিনকেয়ার',
        '🛒',
        finalSuperstore,
        superstoreRef,
        'superstore'
      )}

      {/* 5.5. SECTION: ফ্যাশন (Fashion) */}
      {renderProductCarousel(
        'ফ্যাশন',
        'জামা, প্যান্ট, জুতা ও লাইফস্টাইল',
        '👕',
        finalFashion,
        fashionRef,
        'fashion'
      )}

      {/* 6. SECTION 4: কিডস জোন (Kids Zone) */}
      {renderProductCarousel(
        'কিডস জোন',
        'বাচ্চাদের খেলনা, খাবার ও যত্ন',
        '🧸',
        finalKids,
        kidsRef,
        'kids'
      )}

      {/* 7. জনপ্রিয় একাডেমিক ও বিষয়ভিত্তিক ক্যাটাগরি */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
        <div className="flex flex-row justify-between items-center gap-2 border-b border-slate-100 pb-2 flex-nowrap overflow-hidden">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center space-x-1.5 whitespace-nowrap truncate">
            <span className="shrink-0">🎓</span>
            <span className="truncate">একাডেমিক ও বিষয়ভিত্তিক ক্যাটাগরি</span>
          </h3>
          <button
            onClick={() => onNavigateToTab?.('books')}
            className="border border-sky-400 hover:bg-sky-500 hover:text-white text-sky-600 text-[10.5px] sm:text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            সব দেখুন
          </button>
        </div>

        <div className="relative group/academic">
          <div
            ref={academicCatRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 py-2 scrollbar-none scroll-smooth snap-x justify-start sm:justify-around"
          >
            {POPULAR_ACADEMIC_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  if (onSearchCategory) {
                    onSearchCategory(cat.title);
                  } else {
                    onNavigateToTab?.('books');
                  }
                }}
                className="flex flex-col items-center text-center space-y-2 cursor-pointer group/cat shrink-0 snap-start"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-100 overflow-hidden shadow-2xs group-hover/cat:scale-105 group-hover/cat:shadow-md group-hover/cat:border-sky-400 transition-all duration-300 bg-slate-50 flex items-center justify-center p-1">
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-slate-700 group-hover/cat:text-sky-600 transition-colors">
                  {cat.title}
                </span>
              </div>
            ))}
          </div>

          {/* Left / Right scroll arrows */}
          <button
            onClick={() => scrollHorizontally(academicCatRef, 'left')}
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-700 p-1.5 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50 transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollHorizontally(academicCatRef, 'right')}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-white text-slate-700 p-1.5 rounded-full shadow-md border border-slate-200 cursor-pointer hidden sm:block hover:bg-slate-50 transition-colors z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
