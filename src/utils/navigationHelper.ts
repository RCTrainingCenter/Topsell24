/**
 * App Navigation & Universal URL Route Helper
 * Provides standardized deep links and route parsing for all pages.
 */

export interface PageLinkItem {
  id: string;
  name: string;
  nameEn: string;
  hash: string;
  category?: string;
  type: 'tab' | 'special' | 'action';
  description: string;
  color: string;
}

export const APP_PAGE_LINKS: PageLinkItem[] = [
  {
    id: 'home',
    name: 'হোম পেজ',
    nameEn: 'Home Page',
    hash: '#home',
    type: 'tab',
    description: 'মূল প্রচ্ছদ ও প্রধান হাইলাইট',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'books',
    name: 'বই সেকশন',
    nameEn: 'Books',
    hash: '#books',
    type: 'tab',
    description: 'সকল বই ও ক্যাটাগরি তালিকা',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'electronics',
    name: 'ইলেকট্রনিক্স',
    nameEn: 'Electronics',
    hash: '#electronics',
    type: 'tab',
    description: 'গেজেটস ও ইলেকট্রনিক পণ্য',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'superstore',
    name: 'সুপার স্টোর',
    nameEn: 'Superstore',
    hash: '#superstore',
    type: 'tab',
    description: 'গ্রোসারি ও গৃহস্থালি সামগ্রী',
    color: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  {
    id: 'fashion',
    name: 'ফ্যাশন',
    nameEn: 'Fashion',
    hash: '#fashion',
    type: 'tab',
    description: 'জামা, প্যান্ট, জুতা ও লাইফস্টাইল ফ্যাশন সামগ্রী',
    color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
  },
  {
    id: 'kids',
    name: 'কিডস জোন',
    nameEn: 'Kids Zone',
    hash: '#kids',
    type: 'tab',
    description: 'বাচ্চাদের খেলনা ও যত্ন সামগ্রী',
    color: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  {
    id: 'corporate',
    name: 'প্রাতিষ্ঠানিক / Corporate',
    nameEn: 'Corporate Supply',
    hash: '#corporate',
    type: 'tab',
    description: 'কর্পোরেট সাপ্লাই ও কোটেশন',
    color: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  {
    id: 'offers',
    name: 'আজকের অফার',
    nameEn: 'Special Offers',
    hash: '#offers',
    type: 'special',
    description: 'বিশেষ ছাড় ও মেগা ডিসকাউন্ট',
    color: 'bg-amber-50 text-amber-850 border-amber-300'
  },
  {
    id: 'campaigns',
    name: 'ক্যাম্পেইন পেইজ',
    nameEn: 'Mega Campaigns',
    hash: '#campaigns',
    type: 'special',
    description: 'লাইভ ফ্ল্যাশ সেল ও ক্যাম্পেইনসমূহ',
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'boimela',
    name: 'বইমেলা ২০২৬',
    nameEn: 'Boimela 2026',
    hash: '#boimela',
    type: 'special',
    description: 'অমর একুশে বইমেলা কালেকশন',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'donation',
    name: 'বই অনুদান',
    nameEn: 'Book Donation',
    hash: '#donation',
    type: 'special',
    description: 'জ্ঞান বিতরণে সুবিধাবঞ্চিতদের বই দান',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  {
    id: 'affiliate',
    name: 'অ্যাফিলিয়েট প্রোগ্রাম',
    nameEn: 'Affiliate Program',
    hash: '#affiliate',
    type: 'special',
    description: 'কেনাকাটা রেফারেল ও ইনকাম প্রোগ্রাম',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    id: 'awards',
    name: 'পুরস্কার ও রিওয়ার্ডস',
    nameEn: 'Awards & Rewards',
    hash: '#awards',
    type: 'special',
    description: 'রিওয়ার্ড পয়েন্ট ও কাস্টমার স্বীকৃতি',
    color: 'bg-yellow-50 text-yellow-800 border-yellow-300'
  },
  {
    id: 'order-tracking',
    name: 'অর্ডার ট্র্যাকিং',
    nameEn: 'Track Order',
    hash: '#order-tracking',
    type: 'action',
    description: 'পার্সেল ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস',
    color: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    id: 'cart',
    name: 'শপিং কার্ট',
    nameEn: 'Shopping Cart',
    hash: '#cart',
    type: 'action',
    description: 'ব্যাগে থাকা আইটেম ও চেকআউট',
    color: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  {
    id: 'whatsapp',
    name: 'হোয়াটসঅ্যাপ হেল্পলাইন',
    nameEn: 'WhatsApp Support',
    hash: '#whatsapp',
    type: 'action',
    description: 'সরাসরি কাস্টমার সার্ভিস চ্যাট',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  }
];

/**
 * Generates absolute or relative shareable URL for a given page/tab
 */
export const getFullPageUrl = (hashOrPath: string): string => {
  if (typeof window === 'undefined') return hashOrPath;
  const cleanHash = hashOrPath.startsWith('#') ? hashOrPath : `#${hashOrPath}`;
  return `${window.location.origin}${window.location.pathname}${cleanHash}`;
};

/**
 * Generates a unique hash route for a specific product (e.g. #product/b1)
 */
export const getProductHash = (productId: string): string => {
  return `#product/${encodeURIComponent(productId)}`;
};

/**
 * Generates a full shareable URL for a specific product
 */
export const getProductShareUrl = (productId: string): string => {
  return getFullPageUrl(getProductHash(productId));
};

/**
 * Parses any incoming hash or URL to determine target destination
 */
export interface RouteTarget {
  tab: string;
  category?: string;
  childCategory?: string;
  productId?: string;
  isAction?: 'cart' | 'tracker' | 'login' | 'quote' | 'whatsapp';
  isExternal?: boolean;
  externalUrl?: string;
}

export const parseRouteUrl = (rawUrl: string): RouteTarget => {
  if (!rawUrl) return { tab: 'home' };

  // 1. Check external URLs
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return {
      tab: 'home',
      isExternal: true,
      externalUrl: rawUrl
    };
  }

  // 2. Clean hash / path
  let target = rawUrl.trim();
  if (target.startsWith('#')) {
    target = target.slice(1);
  }

  // 3. Check for specific action modals
  if (target === 'whatsapp') {
    return { tab: 'home', isAction: 'whatsapp' };
  }
  if (target === 'order-tracking' || target === 'track') {
    return { tab: 'home', isAction: 'tracker' };
  }
  if (target === 'cart') {
    return { tab: 'home', isAction: 'cart' };
  }
  if (target === 'quote') {
    return { tab: 'corporate', isAction: 'quote' };
  }

  // 4. Check for Product Deep Link (e.g. product/prod-1 or product:prod-1)
  if (target.startsWith('product/') || target.startsWith('product:')) {
    const pId = decodeURIComponent(target.replace(/^product[/:]/, '').trim());
    return {
      tab: 'home',
      productId: pId
    };
  }

  // 5. Check for Category Deep Link (e.g. category/উপন্যাস or books/উপন্যাস)
  if (target.startsWith('category/') || target.startsWith('category:')) {
    const cat = decodeURIComponent(target.replace(/^category[/:]/, '').trim());
    return {
      tab: 'books',
      category: cat
    };
  }

  // 6. Direct known tabs
  const knownTabs = ['home', 'books', 'electronics', 'superstore', 'fashion', 'kids', 'corporate', 'offers', 'campaigns', 'boimela', 'donation', 'affiliate', 'awards'];
  
  // Split sub-paths (e.g. books/islamic-books)
  const parts = target.split('/');
  const mainTab = parts[0].toLowerCase();

  if (knownTabs.includes(mainTab)) {
    return {
      tab: mainTab,
      category: parts[1] ? decodeURIComponent(parts[1]) : undefined,
      childCategory: parts[2] ? decodeURIComponent(parts[2]) : undefined
    };
  }

  // 7. Fallback matches
  if (mainTab === 'offer' || mainTab === 'deals' || mainTab === 'mega-deals' || mainTab === 'offers-deals') {
    return { tab: 'offers' };
  }
  if (mainTab === 'campaign' || mainTab === 'flash-sale') {
    return { tab: 'campaigns' };
  }
  if (mainTab === 'book' || mainTab === 'boi') {
    return { tab: 'books' };
  }
  if (mainTab === 'electronic' || mainTab === 'gadget') {
    return { tab: 'electronics' };
  }

  return { tab: 'home' };
};
