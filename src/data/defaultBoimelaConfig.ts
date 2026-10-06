import { BoimelaConfig } from '../types';

export const DEFAULT_BOIMELA_CONFIG: BoimelaConfig = {
  hero: {
    bannerTitle: 'বইমেলা ২০২৬ স্পেশাল উৎসব ও বই সম্ভার',
    bannerSubtitle: 'অমর একুশে বইমেলার সকল নতুন বই, বেস্টসেলার এবং বিশেষ ছাড়ে কিনুন টপসেলে',
    announcementBadge: '🎪 অমর একুশে বইমেলা ২০২৬ লাইভ',
    discountText: '২৫% পর্যন্ত বিশেষ মেলা ছাড়',
    bannerImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    trustCards: [
      {
        id: 'tc-1',
        title: 'বই হাতে পেয়ে',
        subtitle: 'মূল্য পরিশোধ করুন',
        iconText: '৳',
        categoryQuery: 'উপন্যাস'
      },
      {
        id: 'tc-2',
        title: 'বই অর্ডার করার আগে',
        subtitle: 'একটু পড়ে দেখুন',
        iconText: '📖',
        categoryQuery: 'একটু পড়ে দেখুন'
      },
      {
        id: 'tc-3',
        title: 'অর্ডার করলেই',
        subtitle: 'থাকছে পয়েন্ট',
        iconText: '🪙',
        categoryQuery: 'ইসলামি বই'
      }
    ]
  },
  categories: [
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
  ],
  reels: [
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
  ],
  priceDeals: [
    {
      id: 'pd-1',
      title: '৯৯ টাকায় নিচে বই',
      badge: '৳৯৯',
      priceLimit: 99,
      query: '৯৯ টাকায় নিচে বই',
      color: 'emerald'
    },
    {
      id: 'pd-2',
      title: '১৯৯ টাকায় নিচে বই',
      badge: '৳১৯৯',
      priceLimit: 199,
      query: '১৯৯ টাকায় নিচে বই',
      color: 'amber'
    },
    {
      id: 'pd-3',
      title: '২৯৯ টাকায় নিচে বই',
      badge: '৳২৯৯',
      priceLimit: 299,
      query: '২৯৯ টাকায় নিচে বই',
      color: 'rose'
    },
    {
      id: 'pd-4',
      title: 'মেলা স্পেশাল ফ্রি ডেলিভারি',
      badge: '🚚 ফ্রি',
      priceLimit: 500,
      query: 'ফ্রি ডেলিভারি',
      color: 'sky'
    }
  ],
  authors: [
    { name: 'হুমায়ূন আহমেদ', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80' },
    { name: 'আরিফ আজাদ', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { name: 'মুহম্মদ জাফর ইকবাল', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { name: 'শামসুর রাহমান', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80' }
  ],
  publishers: [
    { name: 'প্রথমা প্রকাশন', logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80' },
    { name: 'তাম্রলিপি', logo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80' },
    { name: 'অনন্যা প্রকাশনী', logo: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=120&q=80' },
    { name: 'ঐতিহ্য', logo: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=120&q=80' }
  ],
  leaderboard: {
    fiction: [
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
    ],
    nonFiction: [
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
    ],
    career: [
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
    ],
    contemporary: [
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
    ],
    topAuthors: [
      { id: 'a-1', rank: 1, name: 'হুমায়ূন আহমেদ', booksCount: 220, totalSold: '১,৫০,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', badge: 'কিংবদন্তি লেখক' },
      { id: 'a-2', rank: 2, name: 'আরিফ আজাদ', booksCount: 14, totalSold: '১,২০,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', badge: 'বেস্টসেলার' },
      { id: 'a-3', rank: 3, name: 'মুহম্মদ জাফর ইকবাল', booksCount: 95, totalSold: '৮৫,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', badge: 'জনপ্রিয়' },
      { id: 'a-4', rank: 4, name: 'ড. খোন্দকার আব্দুল্লাহ জাহাঙ্গীর', booksCount: 32, totalSold: '৭০,০০০+ কপি', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', badge: 'ইসলামিক স্কলার' }
    ]
  },
  sectionToggles: {
    showTrustBanners: true,
    showCategories: true,
    showReels: true,
    showAuthorPublisher: true,
    showPriceDeals: true,
    showLeaderboard: true
  }
};
