import { Product, BannerSlide, ReviewTestimonial } from './types';

export const BOOKS_DATA: Product[] = [
  {
    id: 'b1',
    type: 'book',
    title: 'লাস্টমে ইউর ইমোশন',
    originalTitle: 'Master Your Emotions',
    authorOrBrand: 'থিবো মেউরিচ',
    originalPrice: 200,
    discountedPrice: 129,
    discountPercent: 36,
    rating: 4.8,
    totalRatings: 12,
    imageUrl: 'cover-master-emotions',
    inStock: true,
    category: 'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন',
    publisherCompany: 'বইঘর প্রকাশনী',
    badgeText: '36% OFF',
    previewChapters: [
      { title: 'অধ্যায় ১: আবেগের উৎস', content: 'আমাদের আবেগগুলো কোন বাহ্যিক ঘটনা থেকে নয়, বরং আমাদের চিন্তা ও ব্যাখ্যা থেকে উৎপন্ন হয়। এই অধ্যায়ে আমরা দেখবো কীভাবে মনের সূক্ষ্ম পরিবর্তনগুলো আমাদের অনুভূতি নিয়ন্ত্রণ করে।' },
      { title: 'অধ্যায় ২: নেতিবাচক চিন্তার বিনাশ', content: 'নেতিবাচক চিন্তা এক ধরণের মানসিক লুপ। যখন আপনি এই বৃত্তে আটকা পড়েন, তখন সচেতন শ্বাস-প্রশ্বাস এবং দৃষ্টি পরিবর্তনের মাধ্যমে নিজেকে মুক্ত করতে হবে।' },
      { title: 'অধ্যায় ৩: আবেগ নিয়ন্ত্রণের বাস্তব সূত্র', content: 'প্রতিদিনের রুটিনে ৫টি ছোট পরিবর্তন আনুন। আবেগ প্রকাশ করার আগে ১০ সেকেন্ড থামুন, চিন্তা করুন এবং তারপর যৌক্তিক প্রতিক্রিয়া দিন।' }
    ]
  },
  {
    id: 'b2',
    type: 'book',
    title: 'লা-তাহযান (হতাশ হবেন না)',
    originalTitle: 'La Tahzan',
    authorOrBrand: 'ড. আয়েজ আল করনী',
    originalPrice: 200,
    discountedPrice: 129,
    discountPercent: 36,
    rating: 4.9,
    totalRatings: 320,
    imageUrl: 'cover-la-tahzan',
    inStock: true,
    category: 'ইসলামি বই',
    publisherCompany: 'রুহামা পাবলিকেশন',
    badgeText: '36% OFF',
    previewChapters: [
      { title: 'ভূমিকা: সুসংবাদ', content: 'এই বইটি আপনাকে হতাশা থেকে আশার আলো দেখাবে। আল্লাহর প্রতি আস্থা রাখুন এবং দুঃখকে শক্তিতে রূপান্তর করুন।' },
      { title: 'অধ্যায় ১: আজকের দিনটিই আপনার জীবন', content: 'অতীত চলে গেছে, ভবিষ্যৎ এখনও আসেনি। আপনার কাছে কেবল আজকের দিনটি আছে। তাই আজকের প্রতিটি মুহূর্ত সচেতনভাবে এবং আল্লাহর ইবাদত ও ভাল কাজে ব্যয় করুন।' }
    ]
  },
  {
    id: 'b3',
    type: 'book',
    title: 'বিদায় পুষ্পে প্রলয়',
    authorOrBrand: 'সৈকত আমীন',
    originalPrice: 180,
    discountedPrice: 159,
    discountPercent: 12,
    rating: 4.2,
    totalRatings: 45,
    imageUrl: 'cover-biday-pushpe',
    inStock: true,
    category: 'উপন্যাস',
    publisherCompany: 'লাবণ্য সাহিত্য প্রকাশনী',
    badgeText: '12% OFF',
    previewChapters: [
      { title: 'প্রথম পরিচ্ছেদ: ধূসর বসন্ত', content: 'সেদিন বিকেলের আকাশটা ছিল অদ্ভুত রকম লাল। বিদায় নেওয়ার সময় সে বলেছিল, আবার যখন শিমুল ফুটবে তখন সে ফিরবে। কিন্তু বসন্ত পেরিয়ে গ্রীষ্ম এলেও শিমুল গাছগুলো আর নতুন পাতা মেলেনি।' }
    ]
  },
  {
    id: 'b4',
    type: 'book',
    title: 'Water Resource Utilization and Micro-Irrigation',
    authorOrBrand: 'লর্ড আই. সি. জো',
    originalPrice: 500,
    discountedPrice: 450,
    discountPercent: 10,
    rating: 4.5,
    totalRatings: 8,
    imageUrl: 'cover-water-resource',
    inStock: true,
    category: 'কৃষি ও কৃষক',
    publisherCompany: 'অক্সফোর্ড প্রেস',
    badgeText: '10% OFF',
    previewChapters: [
      { title: 'Chapter 1: Global Water Crisis & Agriculture', content: 'Agriculture consumes over 70% of freshwater resources globally. Exploring efficient delivery mechanisms is not an option, but an existential mandate.' }
    ]
  },
  {
    id: 'b5',
    type: 'book',
    title: 'দ্যা হাইল্যান্ডার',
    originalTitle: 'The Highlander',
    authorOrBrand: 'ক্যাথলিন উইন্ডসর',
    originalPrice: 250,
    discountedPrice: 215,
    discountPercent: 14,
    rating: 4.6,
    totalRatings: 67,
    imageUrl: 'cover-highlander',
    inStock: true,
    category: 'অনুবাদ',
    publisherCompany: 'রৌদ্রছায়া প্রকাশনী',
    badgeText: '14% OFF',
    previewChapters: [
      { title: 'সূচনা: স্কটিশ উপত্যকা', content: 'পার্বত্য অঞ্চলের কনকনে ঠান্ডা বাতাস আর দিগন্ত বিস্তৃত সবুজ উপত্যকায় এক নতুন বীরের উত্থান হচ্ছিল। তার তরবারির প্রতিটি ঝলকানি ছিল স্বাধীনতার সুর।' }
    ]
  },
  // Weekly Best Seller Ebook
  {
    id: 'b6',
    type: 'book',
    title: 'এটমিক হ্যাবিটস',
    originalTitle: 'Atomic Habits',
    authorOrBrand: 'জেমস ক্লিয়ার',
    originalPrice: 350,
    discountedPrice: 299,
    discountPercent: 15,
    rating: 4.9,
    totalRatings: 512,
    imageUrl: 'cover-atomic-habits',
    inStock: true,
    category: 'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন',
    publisherCompany: 'সৃজনী প্রকাশন',
    badgeText: 'EBOOK',
    previewChapters: [
      { title: 'Chapter 1: The Surprising Power of 1% Better', content: 'Tiny changes compounded over years yield massive transformations. Getting 1% better every day results in becoming 37 times better over one year.' }
    ]
  },
  {
    id: 'b7',
    type: 'book',
    title: 'সহজ ভাষায় ইংলিশ গ্রামার',
    authorOrBrand: 'সাইফুল ইসলাম',
    originalPrice: 220,
    discountedPrice: 180,
    discountPercent: 18,
    rating: 4.7,
    totalRatings: 84,
    imageUrl: 'cover-english-grammar',
    inStock: true,
    category: 'ভাষা শিক্ষা ও ব্যাকরণ',
    publisherCompany: 'বইমেলা একাডেমি',
    badgeText: 'RECOMMENDED',
    previewChapters: [
      { title: 'অধ্যায় ১: Tense এর আত্মকাহিনি', content: 'Tense মুখস্থ করার দিন শেষ! ৩টি সাধারণ ছকের সাহায্যে আজীবন মনে রাখার ম্যাজিক্যাল টেকনিক শিখবো এই ভিডিও ক্লাস ও বইয়ের সংমিশ্রণে।' }
    ]
  },
  {
    id: 'b8',
    type: 'book',
    title: 'ক্যারিয়ার ভাবনা',
    authorOrBrand: 'ডা. শামসুল আরেফীন',
    originalPrice: 300,
    discountedPrice: 199,
    discountPercent: 33,
    rating: 4.8,
    totalRatings: 110,
    imageUrl: 'cover-career-bhabna',
    inStock: true,
    category: 'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন',
    publisherCompany: 'সমর্পণ প্রকাশন',
    badgeText: '33% OFF',
    previewChapters: [
      { title: 'সূচনা: লক্ষ্য নির্ধারণ', content: 'ভুল পেশা জীবনকে নরক বানিয়ে দিতে পারে। কীভাবে নিজের সঠিক প্রতিভা চিহ্নিত করে সেই অনুযায়ী ক্যারিয়ার গড়বেন তার বাস্তব গাইডলাইন।' }
    ]
  },
  {
    id: 'b9',
    type: 'book',
    title: 'ইউ লাস্ট টু বিজনেস',
    authorOrBrand: 'সাইদ চৌধুরী',
    originalPrice: 280,
    discountedPrice: 112,
    discountPercent: 60,
    rating: 4.5,
    totalRatings: 28,
    imageUrl: 'cover-business-last',
    inStock: true,
    category: 'ব্যবাসা, বিনিয়োগ ও অর্থনীতি',
    publisherCompany: 'জ্ঞান বিতরণী',
    badgeText: '60% OFF',
    previewChapters: [
      { title: 'অধ্যায় ১: স্টার্টআপ শুরু', content: 'কম পুঁজি দিয়ে কীভাবে একটি সাস্টেইনেবল ব্যবসা গড়ে তুলবেন। ঝুঁকি ব্যবস্থাপনা ও কাস্টমার রিলেশন তৈরির মূল সূত্র।' }
    ]
  },
  {
    id: 'b10',
    type: 'book',
    title: 'গবেষণা ১০১',
    authorOrBrand: 'আব্দুল্লাহ আল-জাবির',
    originalPrice: 400,
    discountedPrice: 220,
    discountPercent: 45,
    rating: 4.9,
    totalRatings: 34,
    imageUrl: 'cover-gobeshona-101',
    inStock: true,
    category: 'বিজ্ঞান ও প্রযুক্তি',
    publisherCompany: 'আবিষ্কার প্রকাশনী',
    badgeText: '45% OFF',
    previewChapters: [
      { title: 'অধ্যায় ১: থিসিস পেপার রাইটিং', content: 'একটি হাই-কোয়ালিটি বা স্ট্যান্ডার্ড রিসার্চ পেপার লেখার প্রথম ধাপ হলো সঠিক টাইটেল এবং লিটারেচার রিভিউ করা। এই অধ্যায়ে চমৎকার উদাহরণসহ তা আলোচনা করা হয়েছে।' }
    ]
  }
];

export const ELECTRONICS_DATA: Product[] = [
  {
    id: 'vision-blender-373560',
    type: 'electronic',
    title: 'VISION Blender RE-VIS-GEL-011(Crushers)-Pro - 373560',
    authorOrBrand: 'Vision',
    originalPrice: 4775,
    discountedPrice: 4279,
    discountPercent: 15,
    rating: 5.0,
    totalRatings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    category: 'Blenders'
  },
  {
    id: 'e1',
    type: 'electronic',
    title: 'Orico 25PW1-C3 Type C Port Hard Drive Enclosure',
    authorOrBrand: 'Orico (ওরিকো)',
    originalPrice: 900,
    discountedPrice: 679,
    discountPercent: 25,
    rating: 4.6,
    totalRatings: 18,
    imageUrl: 'el-orico-enclosure',
    inStock: true,
    category: 'Computer & Accessories'
  },
  {
    id: 'e2',
    type: 'electronic',
    title: 'Sanford Japan White Laser With Emergency LED Torch',
    authorOrBrand: 'Sanford (স্যানফোর্ড)',
    originalPrice: 1950,
    discountedPrice: 1279,
    discountPercent: 34,
    rating: 4.3,
    totalRatings: 3,
    imageUrl: 'el-sanford-torch',
    inStock: true,
    category: 'Mobile & Accessories'
  },
  {
    id: 'e3',
    type: 'electronic',
    title: 'UGREEN 10109 HDMI Male to Male Cable 5m (Black) HD104',
    authorOrBrand: 'UGREEN (ইউগ্রীন)',
    originalPrice: 800,
    discountedPrice: 589,
    discountPercent: 14,
    rating: 4.8,
    totalRatings: 35,
    imageUrl: 'el-ugreen-cable',
    inStock: true,
    category: 'Computer & Accessories'
  },
  {
    id: 'e4',
    type: 'electronic',
    title: 'GEEOO X12 Super Bass Wired Earphone with Mic',
    authorOrBrand: 'GEEOO (জিইও)',
    originalPrice: 460,
    discountedPrice: 289,
    discountPercent: 37,
    rating: 4.4,
    totalRatings: 7,
    imageUrl: 'el-geeoo-earphone',
    inStock: true,
    category: 'Sound System'
  },
  {
    id: 'e5',
    type: 'electronic',
    title: 'Brushless DC 24V Fan Silent Cooling (80x80x25mm)',
    authorOrBrand: 'Non-Brand',
    originalPrice: 180,
    discountedPrice: 169,
    discountPercent: 6,
    rating: 4.1,
    totalRatings: 1,
    imageUrl: 'el-silent-fan',
    inStock: true,
    category: 'Computer & Accessories'
  },
  {
    id: 'e6',
    type: 'electronic',
    title: 'Defender OSK-2916 Rechargeable Table Fan Maroon 16-Inch',
    authorOrBrand: 'Defender (ডিফেন্ডার)',
    originalPrice: 5500,
    discountedPrice: 4569,
    discountPercent: 15,
    rating: 4.5,
    totalRatings: 3,
    imageUrl: 'el-defender-fan',
    inStock: true,
    category: 'Appliances'
  },
  {
    id: 'e7',
    type: 'electronic',
    title: 'Megastar M8 Wired High Fidelity Headphone with Detachable Cable',
    authorOrBrand: 'Megastar (মেগাস্টার)',
    originalPrice: 792,
    discountedPrice: 219,
    discountPercent: 72,
    rating: 4.7,
    totalRatings: 10,
    imageUrl: 'el-megastar-headphone',
    inStock: true,
    category: 'Sound System'
  }
];

export const SUPERSTORE_DATA: Product[] = [
  {
    id: 's1',
    type: 'superstore',
    title: 'VesojE Agro Kesraj & Kalokeshi Hair Care Powder 100gm',
    authorOrBrand: 'ভেষজ এগ্রো',
    originalPrice: 150,
    discountedPrice: 120,
    discountPercent: 20,
    rating: 4.5,
    totalRatings: 1,
    imageUrl: 'ss-vesoje-agro',
    inStock: true,
    category: 'Beauty & Personal Care'
  },
  {
    id: 's2',
    type: 'superstore',
    title: 'Cosprof Organic Castor Oil For Haircare & Eyebrow Growth 100ml',
    authorOrBrand: 'COSPROF',
    originalPrice: 200,
    discountedPrice: 159,
    discountPercent: 20,
    rating: 4.8,
    totalRatings: 3,
    imageUrl: 'ss-cosprof-oil',
    inStock: true,
    category: 'Beauty & Personal Care'
  },
  {
    id: 's3',
    type: 'superstore',
    title: 'Fast Sharpener Knife Sharpener Tool with Ergonomic Grip',
    authorOrBrand: 'Non-Brand',
    originalPrice: 350,
    discountedPrice: 179,
    discountPercent: 49,
    rating: 4.4,
    totalRatings: 3,
    imageUrl: 'ss-fast-sharpener',
    inStock: true,
    category: 'Stationery'
  },
  {
    id: 's4',
    type: 'superstore',
    title: 'Kitchen Knives Set - Stainless Steel Razor Blades 6pcs Set',
    authorOrBrand: 'Non-Brand',
    originalPrice: 2500,
    discountedPrice: 1425,
    discountPercent: 43,
    rating: 4.6,
    totalRatings: 15,
    imageUrl: 'ss-knives-set',
    inStock: true,
    category: 'Stationery'
  },
  {
    id: 's5',
    type: 'superstore',
    title: "Layer'r Wottagirl Fresh Citrus Body Splash For Women 135ml",
    authorOrBrand: "Layer'r",
    originalPrice: 600,
    discountedPrice: 450,
    discountPercent: 25,
    rating: 4.3,
    totalRatings: 1,
    imageUrl: 'ss-wottagirl-perfume',
    inStock: true,
    category: 'Beauty & Personal Care'
  },
  // Newly Released Lipstick line
  {
    id: 's6',
    type: 'superstore',
    title: 'Lily Creamy Pop Lipstick - Ruby Red Velvet Matte',
    authorOrBrand: 'Lily (লিলি)',
    originalPrice: 250,
    discountedPrice: 129,
    discountPercent: 48,
    rating: 4.7,
    totalRatings: 6,
    imageUrl: 'ss-lily-lipstick',
    inStock: true,
    category: 'Beauty & Personal Care'
  },
  {
    id: 's7',
    type: 'superstore',
    title: 'Lily Creamy Pop Lipstick - Berry Kiss Glossy',
    authorOrBrand: 'Lily (লিলি)',
    originalPrice: 250,
    discountedPrice: 129,
    discountPercent: 48,
    rating: 4.5,
    totalRatings: 12,
    imageUrl: 'ss-lily-lipstick-berry',
    inStock: true,
    category: 'Beauty & Personal Care'
  },
  {
    id: 's8',
    type: 'superstore',
    title: 'Lily Creamy Pop Lipstick - Caramel Toffee Nude',
    authorOrBrand: 'Lily (লিলি)',
    originalPrice: 250,
    discountedPrice: 129,
    discountPercent: 48,
    rating: 4.6,
    totalRatings: 8,
    imageUrl: 'ss-lily-lipstick-nude',
    inStock: true,
    category: 'Beauty & Personal Care'
  }
];

export const KIDS_DATA: Product[] = [
  {
    id: 'k1',
    type: 'kids',
    title: 'Apple Bear Baby Fruit Pacifier with Extra Silcone Nipple 3 Nipple Sizes',
    authorOrBrand: 'অ্যাপেল বেয়ার',
    originalPrice: 310,
    discountedPrice: 259,
    discountPercent: 16,
    rating: 4.5,
    totalRatings: 4,
    imageUrl: 'kd-fruit-pacifier',
    inStock: true,
    category: 'Feeding'
  },
  {
    id: 'k2',
    type: 'kids',
    title: 'Barbie 65th Anniversary Princess Doll - HRG41 Premium Dress',
    authorOrBrand: 'Barbie (বার্বি)',
    originalPrice: 5250,
    discountedPrice: 4779,
    discountPercent: 9,
    rating: 4.9,
    totalRatings: 19,
    imageUrl: 'kd-barbie-doll',
    inStock: true,
    category: 'Kids Toys'
  },
  {
    id: 'k3',
    type: 'kids',
    title: 'Shape Four Color Battle Wooden Puzzle Set for Children WT-168',
    authorOrBrand: 'Non-Brand',
    originalPrice: 850,
    discountedPrice: 759,
    discountPercent: 11,
    rating: 4.4,
    totalRatings: 2,
    imageUrl: 'kd-wooden-puzzle',
    inStock: true,
    category: 'Kids Toys'
  },
  {
    id: 'k4',
    type: 'kids',
    title: 'Applebear Baby Milk Feeding Plastic Straw Bottle 150ml Leak Proof',
    authorOrBrand: 'অ্যাপেল বেয়ার',
    originalPrice: 350,
    discountedPrice: 268,
    discountPercent: 23,
    rating: 4.2,
    totalRatings: 5,
    imageUrl: 'kd-feeding-bottle',
    inStock: true,
    category: 'Feeding'
  },
  {
    id: 'k5',
    type: 'kids',
    title: 'Mitu Home and Curtain BMN4 Baby Mosquito Net Foldable 10mm Protective Steel',
    authorOrBrand: 'Mitu Home',
    originalPrice: 580,
    discountedPrice: 399,
    discountPercent: 31,
    rating: 4.6,
    totalRatings: 22,
    imageUrl: 'kd-mosquito-net',
    inStock: true,
    category: 'Kids Toys'
  },
  // Nipple products
  {
    id: 'k6',
    type: 'kids',
    title: 'Philips Avent Natural Bottle Nipple (3 Month Plus, 2 Pcs)',
    authorOrBrand: 'Philips Avent (ফিলিপস অ্যাভেন্ট)',
    originalPrice: 899,
    discountedPrice: 879,
    discountPercent: 2,
    rating: 4.8,
    totalRatings: 44,
    imageUrl: 'kd-philips-nipple',
    inStock: true,
    category: 'Feeding'
  },
  {
    id: 'k7',
    type: 'kids',
    title: 'Only Baby Wide-Mouth Soft Silicone Nipple (Single Pcs)',
    authorOrBrand: 'Non-Brand',
    originalPrice: 200,
    discountedPrice: 169,
    discountPercent: 15,
    rating: 4.3,
    totalRatings: 12,
    imageUrl: 'kd-onlybaby-nipple',
    inStock: true,
    category: 'Feeding'
  }
];

export const FASHION_DATA: Product[] = [
  {
    id: 'f1',
    type: 'fashion',
    title: 'Stylish New Polo Shirt - Premium PK Cotton Half Sleeve',
    authorOrBrand: 'Topsell Fashion',
    category: 'শার্ট ও পোলো টি-শার্ট (Shirts & Polo)',
    childCategory: 'পোলো শার্ট (Polo Shirt)',
    originalPrice: 850,
    discountedPrice: 490,
    discountPercent: 42,
    rating: 4.9,
    totalRatings: 64,
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    availableColors: ['Navy Blue', 'Black', 'Maroon', 'Olive Green'],
    productDescription: `Stylish New Polo Shirt\n\nProduct Type: Polo Shirt\nMain Material: Cotton\nFabrics: PK Cotton\nPremium Quality\nFabrication: 200(10+-)GSM\nSleeve: Half Sleeve\n100% Export Quality Sewing`,
    sizeChartDetails: `Size- M, L, XL, XXL\nM - Length 28 Chest 38\nL - Length 29 Chest: 40\nXL - Length 30 Chest 42\nXXL - Length 31 Chest 44`
  },
  {
    id: 'f2',
    type: 'fashion',
    title: 'Men Premium Stretchable Slim Fit Denim Jeans Pant',
    authorOrBrand: 'Denim Republic',
    category: 'প্যান্ট ও ট্রাউজার (Pants & Jeans)',
    childCategory: 'ডেনিম জিন্স (Denim Jeans)',
    originalPrice: 1450,
    discountedPrice: 890,
    discountPercent: 39,
    rating: 4.8,
    totalRatings: 42,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    availableSizes: ['30', '32', '34', '36'],
    availableColors: ['Dark Blue', 'Jet Black', 'Ice Blue'],
    productDescription: `Premium Stretchable Denim Jeans Pant\n\nProduct Type: Men Jeans Pant\nMaterial: 98% Cotton, 2% Spandex (Stretchable)\nFit Type: Slim Fit\nWash: Enzyme Stone Wash\n100% Export Quality Denim`,
    sizeChartDetails: `Waist Size: 30, 32, 34, 36\n30 - Length 40" Waist 30"\n32 - Length 40.5" Waist 32"\n34 - Length 41" Waist 34"\n36 - Length 41.5" Waist 36"`
  },
  {
    id: 'f3',
    type: 'fashion',
    title: 'Breathable Mesh Running Sneakers & Casual Sports Shoe',
    authorOrBrand: 'StepUp Footwear',
    category: 'জুতা ও স্নিকার্স (Shoes & Sneakers)',
    childCategory: 'স্নিকার্স ও কেডস (Sneakers)',
    originalPrice: 2200,
    discountedPrice: 1290,
    discountPercent: 41,
    rating: 4.9,
    totalRatings: 53,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    availableSizes: ['40', '41', '42', '43', '44'],
    availableColors: ['Red-White', 'All Black', 'Navy-Grey'],
    productDescription: `Breathable Mesh Running Sneakers\n\nProduct Type: Casual & Running Sneaker\nUpper Material: Breathable Flyknit Mesh\nOutsole: Anti-Slip EVA Rubber Sole\nInsole: Memory Foam Comfort Cushion\nLightweight & Durable`,
    sizeChartDetails: `EU Shoe Size: 40, 41, 42, 43, 44\n40 - Foot Length 25.0 cm\n41 - Foot Length 25.5 cm\n42 - Foot Length 26.0 cm\n43 - Foot Length 26.5 cm\n44 - Foot Length 27.0 cm`
  },
  {
    id: 'f4',
    type: 'fashion',
    title: 'Luxury Embroidered Cotton Panjabi for Men - Festive Collection',
    authorOrBrand: 'Aarong Style',
    category: 'পাঞ্জাবি ও ঐতিহ্যবাহী পোশাক (Panjabi & Ethnic)',
    childCategory: 'প্রিমিয়াম পাঞ্জাবি (Panjabi)',
    originalPrice: 1800,
    discountedPrice: 1150,
    discountPercent: 36,
    rating: 4.8,
    totalRatings: 38,
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    availableColors: ['White', 'Maroon', 'Navy Blue', 'Mustard'],
    productDescription: `Luxury Embroidered Cotton Panjabi\n\nProduct Type: Men Festive Panjabi\nMain Material: 100% Pure Combed Cotton\nWork: Neck & Cuff Fine Embroidery\nFit: Regular Comfort Fit\nPremium Snap Buttons`,
    sizeChartDetails: `Size- M, L, XL, XXL\nM (40) - Length 40" Chest 42"\nL (42) - Length 42" Chest 44"\nXL (44) - Length 44" Chest 46"\nXXL (46) - Length 45" Chest 48"`
  },
  {
    id: 'f5',
    type: 'fashion',
    title: 'Genuine Leather Formal Loafer & Office Shoe for Men',
    authorOrBrand: 'Apex Leather Craft',
    category: 'জুতা ও স্নিকার্স (Shoes & Sneakers)',
    childCategory: 'ফরমাল ও লোফার জুতা (Formal Shoes)',
    originalPrice: 2600,
    discountedPrice: 1650,
    discountPercent: 37,
    rating: 4.7,
    totalRatings: 29,
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    availableSizes: ['40', '41', '42', '43'],
    availableColors: ['Dark Brown', 'Classic Black'],
    productDescription: `Genuine Cowhide Leather Formal Loafer\n\nProduct Type: Men Formal / Casual Loafer\nMaterial: 100% Genuine Leather\nSole: TPR Non-Slip Comfort Sole\n100% Export Quality Stitching`,
    sizeChartDetails: `EU Shoe Size: 40, 41, 42, 43\n40 - 25.0 cm\n41 - 25.5 cm\n42 - 26.0 cm\n43 - 26.5 cm`
  },
  {
    id: 'f6',
    type: 'fashion',
    title: 'Designer Unstitched Cotton Salwar Kameez Three Piece for Women',
    authorOrBrand: 'Biba Ethnic',
    category: 'মেয়েদের ফ্যাশন (Women Fashion)',
    childCategory: 'সালোয়ার কামিজ ও থ্রি-পিস (Three Piece)',
    originalPrice: 1950,
    discountedPrice: 1250,
    discountPercent: 36,
    rating: 4.9,
    totalRatings: 47,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    availableSizes: ['Free Size', 'M', 'L', 'XL'],
    availableColors: ['Emerald Green', 'Crimson Red', 'Royal Blue'],
    productDescription: `Designer Digital Print Lawn Cotton Three Piece\n\nProduct Type: Salwar Kameez 3-Piece\nKameez: Pure Lawn Cotton Digital Print\nSalwar: 2.5 Yards Solid Dyed Cotton\nDupatta: 5 Hath Chiffon / Cotton Namazi Orna`,
    sizeChartDetails: `Available in Unstitched Free Size & Stitched (M, L, XL)\nM - Chest 38" Length 44"\nL - Chest 40" Length 45"\nXL - Chest 42" Length 46"`
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...BOOKS_DATA,
  ...ELECTRONICS_DATA,
  ...SUPERSTORE_DATA,
  ...FASHION_DATA,
  ...KIDS_DATA
];

export const BANNERS: Record<string, BannerSlide[]> = {
  books: [
    {
      id: 'b_slide_1',
      title: 'রোজকার জীবনে ইতিবাচক পরিবর্তন আনুন',
      subtitle: 'আজকের বেস্টসেলার বইগুলোতে সরাসরি ৩০% পর্যন্ত ক্যাশব্যাক!',
      badge: 'বইমেলা ধামাকা',
      bgColor: 'from-emerald-800 via-teal-900 to-green-750',
      imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#books'
    },
    {
      id: 'b_slide_2',
      title: 'প্রতিদিন প্রোডাক্টিভ কনটেন্ট এবং যে কোন অফার সবার আগে পেতে',
      subtitle: 'যুক্ত হোন আমাদের WhatsApp চ্যানেলে!',
      badge: 'হট ডিল ⚡',
      bgColor: 'from-teal-800 to-green-700',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#whatsapp'
    },
    {
      id: 'b_slide_3',
      title: 'ইসলামি জ্ঞান ও আদর্শ জীবনের পাথেয়',
      subtitle: 'ইসলামি বইয়ের সমৃদ্ধ সংগ্রহে ২৫% থেকে ৫০% পর্যন্ত ফ্ল্যাট ছাড়!',
      badge: 'ইসলামি বই',
      bgColor: 'from-cyan-900 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1584282479918-0970a25fc51a?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#islamic-books'
    }
  ],
  electronics: [
    {
      id: 'e_slide_1',
      title: 'গরমে বাচ্চাদের অস্বস্তিকর ঝুঁকি বেশি',
      subtitle: '- এর প্রধান কারণ গরমে ভিজে থাকা। বাচ্চার যত্নে সাথে রাখুন রিচার্জেবল ফ্যান! ৪৫% পর্যন্ত ছাড়!',
      badge: 'সমার গ্যাজেটস',
      bgColor: 'from-orange-400 to-amber-500',
      imageUrl: 'https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#electronic-fan'
    },
    {
      id: 'e_slide_2',
      title: 'স্মার্ট ওয়াচ ও ফিটনেস ট্র্যাকার কালেকশন',
      subtitle: 'সবচেয়ে কম মূল্যে প্রিমিয়াম ব্র্যান্ডের স্মার্টওয়াচ পান ১৫% অতিরিক্ত ডিসকাউন্টে!',
      badge: 'স্মার্ট গ্যাজেটস',
      bgColor: 'from-sky-850 via-blue-900 to-indigo-950',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#smartwatch'
    },
    {
      id: 'e_slide_3',
      title: 'কম্পিউটার ও আইটি অ্যাক্সেসরিজ মেলা',
      subtitle: 'কীবোর্ড, মাউস ও পেনড্রাইভসহ নিত্যপ্রয়োজনীয় আইটেম ৬০% ছাড়ে!',
      badge: 'আইটি মেলা',
      bgColor: 'from-slate-800 via-slate-900 to-zinc-950',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#accessories'
    }
  ],
  superstore: [
    {
      id: 's_slide_1',
      title: 'এই গরমে ঘরে কিংবা বাইরে থাকুন স্বস্তিতে',
      subtitle: 'টপসেল সুপার স্টোর থেকে পার্সোনাল কুলিং এবং হাইজিন আইটেম কিনুন ৬৫% পর্যন্ত ছাড়ে!',
      badge: 'সুপার স্টোর',
      bgColor: 'from-cyan-800 to-blue-700',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#superstore-discount'
    },
    {
      id: 's_slide_2',
      title: 'অর্গানিক ও ১০০% খাঁটি ফুড আইটেম',
      subtitle: 'ঘি, মধু ও খাঁটি সর্ষের তেলসহ অর্গানিক পণ্যে ২০% সরাসরি ফ্ল্যাট ডিসকাউন্ট!',
      badge: 'বিশুদ্ধ খাদ্য',
      bgColor: 'from-amber-800 to-amber-950',
      imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#organic-food'
    },
    {
      id: 's_slide_3',
      title: 'স্টেশনারি ও অফিস সাপ্লাই উৎসব',
      subtitle: 'ডায়েরী, প্রিমিয়াম কলম ও নোটবুকে রয়েছে আকর্ষণীয় কম্বো অফার!',
      badge: 'স্টেশনারি',
      bgColor: 'from-rose-900 to-indigo-950',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#stationery'
    }
  ],
  fashion: [
    {
      id: 'f_slide_1',
      title: 'ট্রেন্ডি ফ্যাশন ও লাইফস্টাইল কালেকশন!',
      subtitle: 'প্রিমিয়াম পোলো শার্ট, জিন্স প্যান্ট, পাঞ্জাবি ও ব্র্যান্ডেড জুতায় ৫০% পর্যন্ত ছাড়!',
      badge: 'ফ্যাশন ফেস্ট',
      bgColor: 'from-indigo-900 via-purple-900 to-rose-900',
      imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#fashion'
    },
    {
      id: 'f_slide_2',
      title: 'এক্সপোর্ট কোয়ালিটি পোলো শার্ট ও ডেনিম জিন্স',
      subtitle: '১০০% কটন ফেব্রিক এবং নিখুঁত মেজারমেন্ট গ্যারান্টি (Size: M, L, XL, XXL)',
      badge: 'প্রিমিয়াম পোশাক',
      bgColor: 'from-slate-900 via-emerald-900 to-teal-900',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#fashion'
    },
    {
      id: 'f_slide_3',
      title: 'স্টাইলিশ স্নিকার্স, লোফার ও জুতার বিশাল সমাহার!',
      subtitle: 'আকর্ষণীয় ডিজাইন ও আরামদায়ক সোল — ক্যাশ অন ডেলিভারিতে অর্ডার করুন',
      badge: 'ফুটওয়্যার কালেকশন',
      bgColor: 'from-rose-800 via-orange-700 to-amber-700',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#fashion'
    }
  ],
  kids: [
    {
      id: 'k_slide_1',
      title: 'বাচ্চার সুস্থতা ও বিনোদনে সেরা কিডস আইটেম!',
      subtitle: 'বেবি ফিডিংস, খেলনা ও লোশন কিনুন অবিশ্বাস্য ছাড়ে!',
      badge: 'কিডস জোন',
      bgColor: 'from-pink-500 to-purple-600',
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#kids-toys'
    },
    {
      id: 'k_slide_2',
      title: 'প্রিমিয়াম খেলনা ও বেবি গ্রুমিং আইটেমস',
      subtitle: 'মাদার অ্যান্ড বেবি কেয়ারের সকল আন্তর্জাতিক ব্র্যান্ডের পণ্যে ২৫% পর্যন্ত ছাড়!',
      badge: 'বেবি কেয়ার',
      bgColor: 'from-sky-700 to-blue-900',
      imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#baby-grooming'
    },
    {
      id: 'k_slide_3',
      title: 'বাচ্চাদের ডায়াপার ও হাইজিন উৎসব',
      subtitle: 'জনপ্রিয় ব্র্যান্ডের ডায়াপার কিনুন সরাসরি হোলসেল রেটে!',
      badge: 'ডায়াপার ডিল',
      bgColor: 'from-violet-850 to-pink-850',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#diapers'
    }
  ],
  corporate: [
    {
      id: 'c_slide_1',
      title: 'টপসেল থেকে প্রাতিষ্ঠানিক ক্লায়েন্টরা পাচ্ছেন কাস্টমাইজড সার্ভিস',
      subtitle: 'টেন্ডার, RFQ অথবা ডিরেক্ট পারচেজ যেভাবে হোক, সর্বোচ্চ ডিসকাউন্টে দেশি-বিদেশি বই সরবরাহ করছি!',
      badge: 'কর্পোরেট ডিল',
      bgColor: 'from-sky-750 via-blue-900 to-indigo-950',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#corporate'
    },
    {
      id: 'c_slide_2',
      title: 'স্কুল, কলেজ ও সরকারি লাইব্রেরি সাপ্লাই সার্ভিস',
      subtitle: 'একক অর্ডারে শতভাগ নির্ভুল ডেলিভারি ও বিশেষ বাৎসরিক বাজেট সুবিধা!',
      badge: 'লাইব্রেরি ডিল',
      bgColor: 'from-teal-900 via-cyan-950 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#library-supply'
    },
    {
      id: 'c_slide_3',
      title: 'কাস্টমাইজড গিফট ও স্যুভেনির সলিউশন',
      subtitle: 'আপনার ব্র্যান্ডের লোগোসহ কাস্টম বুক বাউন্ড ও ডায়েরি উপহার তৈরি করুন আকর্ষণীয় মূল্যে!',
      badge: 'উপহার সলিউশন',
      bgColor: 'from-amber-900 to-amber-950',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=95',
      actionUrl: '#custom-gifts'
    }
  ],
  offers: [
    {
      id: 'o_slide_1',
      title: 'তীব্র গরমে টপসেল চার্জার ফ্যানে ৬৫% পর্যন্ত সরাসরি ছাড়!',
      subtitle: 'অফারগুলোর শর্তাবলী জানতে নিচে ক্লিক করুন ও কার্টে যোগ করুন।',
      badge: 'FLASH SALE DEALS',
      bgColor: 'from-red-500 via-orange-500 to-amber-500',
      imageUrl: '',
      actionUrl: '#offers-deals'
    },
    {
      id: 'o_slide_2',
      title: 'আজকের মেগা ফ্ল্যাশ ডিল ও ক্যাশব্যাক অফার!',
      subtitle: '১২০০+ টাকার কেনাকাটায় সরাসরি ২০% ক্যাশব্যাক ভাউচার!',
      badge: 'মেগা অফার ⚡',
      bgColor: 'from-amber-600 via-rose-600 to-indigo-950',
      imageUrl: '',
      actionUrl: '#mega-deals'
    }
  ]
};

export const TESTIMONIALS: ReviewTestimonial[] = [
  {
    id: 't1',
    name: 'অনুপম সেন',
    company: 'অন্যপ্রকাশ প্রকাশনী',
    content: 'টপসেলের বাল্ক প্রাতিষ্ঠানিক সার্ভিস আমাদের চমৎকার অভিজ্ঞতা দিয়েছে। প্রতিটি বই সঠিক সময় এবং অক্ষত অবস্থায় আমাদের করপোরেট লাইব্রেরিতে ডেলিভার করা হয়েছে।',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 't2',
    name: 'তাসনিম ফাতেমা',
    company: 'ড্যাফোডিল ইন্টারন্যাশনাল স্কুল',
    content: 'স্কুল শিক্ষার্থীদের গিফট প্রদানের জন্য আমরা টপসেল প্রাতিষ্ঠানিক দলের সহায়তা নেই। তারা কাস্টমাইজড উপহার প্যাকেট এবং সঠিক ছাড়ের মূল্যে সুন্দর কোয়ালিটি নিশ্চিত করেছে।',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  }
];

export interface HomepageCategoryItem {
  id: string;
  label: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
}

export const DEFAULT_HOMEPAGE_CATEGORIES: HomepageCategoryItem[] = [
  {
    id: 'books',
    label: 'বই',
    icon: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  },
  {
    id: 'electronics',
    label: 'Electronics',
    icon: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  },
  {
    id: 'books',
    label: 'Ebook',
    icon: 'BookMarked',
    imageUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=300&q=80',
    color: 'bg-amber-50 text-amber-600 border-amber-100'
  },
  {
    id: 'superstore',
    label: 'Beauty & Health',
    icon: 'Smile',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
    color: 'bg-rose-50 text-rose-600 border-rose-100'
  },
  {
    id: 'fashion',
    label: 'ফ্যাশন (Fashion)',
    icon: 'ShoppingBag',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80',
    color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100'
  },
  {
    id: 'books',
    label: 'Audiobook',
    icon: 'Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-100'
  },
  {
    id: 'books',
    label: 'ভর্তি পরীক্ষার প্রস্তুতি',
    icon: 'GraduationCap',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80',
    color: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  {
    id: 'superstore',
    label: 'Stationery',
    icon: 'PenTool',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80',
    color: 'bg-teal-50 text-teal-600 border-teal-100'
  },
  {
    id: 'electronics',
    label: 'Science Kit',
    icon: 'Atom',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80',
    color: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  {
    id: 'superstore',
    label: 'Groceries',
    icon: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    color: 'bg-orange-50 text-orange-600 border-orange-100'
  }
];

