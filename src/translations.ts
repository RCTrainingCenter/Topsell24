export interface TranslationType {
  // Header Top Strip
  hotline: string;
  trackOrder: string;
  initiative: string;
  earnHome: string;
  bookDonation: string;
  downloadApp: string;
  helloSignIn: string;
  myAccount: string;
  hello: string;
  youHave: string;
  points: string;
  searchPlaceholderGeneral: string;
  searchPlaceholderBooks: string;
  searchPlaceholderElectronics: string;
  searchPlaceholderSuperstore: string;
  searchPlaceholderKids: string;

  // Header Autocomplete
  categorySuggestion: string;
  productSuggestion: string;

  // Profile Dropdown
  adminPanel: string;
  accountInfo: string;
  ordersTracking: string;
  ratingsReviews: string;
  myInterests: string;
  followingAuthors: string;
  wishlist: string;
  savedList: string;
  ebookLibrary: string;
  bookshelf: string;
  bkashAccount: string;
  rokomariBalance: string;
  signOut: string;

  // Navigation Tabs
  homeTab: string;
  booksTab: string;
  electronicsTab: string;
  superstoreTab: string;
  fashionTab: string;
  kidsTab: string;
  corporateTab: string;
  awardsTab: string;
  offersTab: string;
  boimelaTab: string;

  // Subcategories (Translated where appropriate)
  authorSub: string;
  subjectSub: string;
  islamicSub: string;
  boimelaSub: string;
  academicSub: string;
  discountSub: string;
  publisherSub: string;
  cartOfferSub: string;
  englishBooksSub: string;
  englishMediumSub: string;
  hscSub: string;

  // Home View Headings & Labels
  flashDealsHeader: string;
  quickDealsHeader: string;
  latestEbooksHeader: string;
  popularAuthorsPublishersHeader: string;
  authorPublisherSubtext: string;
  popularAuthorsTab: string;
  popularPublishersTab: string;
  featuredProductsHeader: string;
  viewAllBtn: string;
  justForYou: string;
  todaysDealTab: string;
  trendingTab: string;
  boimelaSpecialTab: string;
  bookType: string;
  electronicsType: string;
  superstoreType: string;
  fashionType: string;
  kidsType: string;

  // Product Card Labels
  brandLabel: string;
  authorLabel: string;
  addToCart: string;
  addedToCart: string;
  inStock: string;
  outOfStock: string;
  originalPrice: string;
  discountPrice: string;

  // Cart Drawer
  myCartTitle: string;
  itemsLabel: string;
  cartEmpty: string;
  cartEmptySub: string;
  priceDetails: string;
  totalOriginalPrice: string;
  totalDiscount: string;
  shippingCharge: string;
  couponLabel: string;
  enterCoupon: string;
  applyCoupon: string;
  couponApplied: string;
  totalPayable: string;
  checkoutBtn: string;
  deliveryHint: string;

  // FAQ Section
  faqTitle: string;
  faqSubtitle: string;
  faqDeliveryQ: string;
  faqDeliveryA: string;
  faqReturnQ: string;
  faqReturnA: string;
  faqPaymentQ: string;
  faqPaymentA: string;
  faqOrderQ: string;
  faqOrderA: string;
  faqOriginalBookQ: string;
  faqOriginalBookA: string;

  // Footer static info
  footerAbout: string;
  footerAboutText: string;
  footerLinksHeader: string;
  footerContactHeader: string;
  footerRights: string;
}

export const translations: Record<'en' | 'bn', TranslationType> = {
  bn: {
    hotline: 'হটলাইন: ১৬২৯৭',
    trackOrder: 'অর্ডার ট্র্যাক করুন',
    initiative: 'টপসেল উদ্যোগ',
    earnHome: 'ঘরে বসে আয় করুন',
    bookDonation: 'বই ডোনেশন',
    downloadApp: 'অ্যাপ ডাউনলোড করুন',
    helloSignIn: 'হ্যালো, সাইন ইন',
    myAccount: 'আমার অ্যাকাউন্ট',
    hello: 'হ্যালো,',
    youHave: 'আপনার আছে',
    points: 'পয়েন্ট',
    searchPlaceholderGeneral: 'টপসেলে সার্চ করুন...',
    searchPlaceholderBooks: 'বই সার্চ করুন (মনের শক্তি, এটমিক হ্যাবিট...)',
    searchPlaceholderElectronics: 'ইলেক্ট্রনিক্স সার্চ করুন (চার্জার ফ্যান, স্মার্ট ওয়াচ...)',
    searchPlaceholderSuperstore: 'সুপারস্টোর সামগ্রী সার্চ করুন (ভেসলিন, ক্যাস্টর অয়েল...)',
    searchPlaceholderKids: 'কিডস সামগ্রী সার্চ করুন (খেলনা, ফিডিং বোতল...)',
    
    categorySuggestion: 'ক্যাটাগরি সাজেশন্স',
    productSuggestion: 'প্রোডাক্ট সাজেশন্স',

    adminPanel: '👑 এডমিন কন্ট্রোল প্যানেল (লাইভ)',
    accountInfo: 'অ্যাকাউন্ট তথ্য',
    ordersTracking: 'অর্ডার ও ট্র্যাকিং',
    ratingsReviews: 'আমার রেটিং ও রিভিউ',
    myInterests: 'আমার পছন্দসমূহ',
    followingAuthors: 'ফলো করা লেখকগণ',
    wishlist: 'আমার উইশলিস্ট',
    savedList: 'সেভ করা তালিকা',
    ebookLibrary: 'ই-বুক লাইব্রেরী',
    bookshelf: 'আমার বুকশেলফ',
    bkashAccount: 'বিকাশ অ্যাকাউন্ট লিংক',
    rokomariBalance: 'রকমারি ব্যালেন্স',
    signOut: 'লগ আউট করুন',

    homeTab: 'হোম',
    booksTab: 'বই',
    electronicsTab: 'ইলেক্ট্রনিক্স',
    superstoreTab: 'সুপার স্টোর',
    fashionTab: 'ফ্যাশন',
    kidsTab: 'কিডস জোন',
    corporateTab: 'প্রাতিষ্ঠানিক অর্ডার',
    awardsTab: 'বেস্টসেলার অ্যাওয়ার্ড',
    offersTab: 'আজকের অফার!',
    boimelaTab: 'বইমেলা ২০২৬',

    authorSub: 'লেখক',
    subjectSub: 'বিষয়',
    islamicSub: 'ইসলামী বই',
    boimelaSub: 'বইমেলা ২০২৬',
    academicSub: 'একাডেমিক বই',
    discountSub: 'অতিরিক্ত ছাড়ে বই',
    publisherSub: 'প্রকাশক',
    cartOfferSub: 'কার্ট অফার',
    englishBooksSub: 'ইংরেজি বই',
    englishMediumSub: 'ইংরেজি মাধ্যম বই',
    hscSub: 'এইচএসসি পড়াশোনা',

    flashDealsHeader: 'আজকের ফ্ল্যাশ ডিলসমূহ (Flash Deals)',
    quickDealsHeader: 'সুপারস্টোর কুইক ডিল (Quick Deals)',
    latestEbooksHeader: 'সর্বশেষ ই-বুক কারোসেল (Latest eBooks)',
    popularAuthorsPublishersHeader: 'জনপ্রিয় লেখক এবং প্রকাশনী (Popular Authors & Publishers)',
    authorPublisherSubtext: 'প্রিয় লেখক অথবা প্রকাশনীর নামের ওপর ক্লিক করে তাঁর প্রকাশিত বইগুলো সহজেই খুঁজে পান',
    popularAuthorsTab: 'জনপ্রিয় লেখক',
    popularPublishersTab: 'জনপ্রিয় প্রকাশনী',
    featuredProductsHeader: 'ফিচার্ড প্রোডাক্ট সমূহ (Featured Products)',
    viewAllBtn: 'সবগুলো দেখুন',
    justForYou: 'ForYou ✨',
    todaysDealTab: 'আজকের ডিল',
    trendingTab: 'জনপ্রিয় ডিল',
    boimelaSpecialTab: 'বইমেলা স্পেশাল',
    bookType: 'বই',
    electronicsType: 'ইলেক্ট্রনিক্স',
    superstoreType: 'সুপারস্টোর',
    fashionType: 'ফ্যাশন',
    kidsType: 'কিডস',

    brandLabel: 'ব্র্যান্ড',
    authorLabel: 'লেখক',
    addToCart: 'কার্টে যুক্ত করুন',
    addedToCart: 'যুক্ত হয়েছে',
    inStock: 'স্টকে আছে',
    outOfStock: 'স্টক শেষ',
    originalPrice: 'মূল মূল্য',
    discountPrice: 'ছাড়ে মূল্য',

    myCartTitle: 'আমার শপিং কার্ট',
    itemsLabel: 'টি প্রোডাক্ট',
    cartEmpty: 'আপনার কার্ট খালি আছে!',
    cartEmptySub: 'আপনার কার্টে কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি। দয়া করে পছন্দের প্রোডাক্ট যুক্ত করুন।',
    priceDetails: 'মূল্য বিবরণী',
    totalOriginalPrice: 'মোট আসল দাম',
    totalDiscount: 'মোট ছাড়',
    shippingCharge: 'ডেলিভারি চার্জ',
    couponLabel: 'প্রোমো কুপন কোড',
    enterCoupon: 'কুপন কোড দিন...',
    applyCoupon: 'প্রয়োগ করুন',
    couponApplied: 'কুপন কোড সফলভাবে প্রয়োগ হয়েছে',
    totalPayable: 'সর্বমোট পরিশোধযোগ্য',
    checkoutBtn: 'অর্ডার প্লেস করুন',
    deliveryHint: 'ডেলিভারি সময়সীমা: ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৩-৫ কার্যদিবস।',

    faqTitle: 'সাধারণ জিজ্ঞাসা ও সাহায্য (FAQ)',
    faqSubtitle: 'টপসেলে শপিং করতে গিয়ে কোনো প্রশ্ন আছে? নিচের সাধারণ প্রশ্নোত্তরের মাধ্যমে সমাধান পেয়ে যান নিমেষেই।',
    faqDeliveryQ: 'ডেলিভারি সময়সীমা কতদিন?',
    faqDeliveryA: 'ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হয়। ঢাকা সিটির বাইরে সাধারণত ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার দোরগোড়ায় পণ্য পৌঁছে যাবে।',
    faqReturnQ: 'আপনাদের রিটার্ন পলিসি কেমন?',
    faqReturnA: 'পণ্য পাওয়ার পর কোনো প্রকার ত্রুটি বা নষ্ট পণ্য থাকলে আমাদের ৩ দিনের মধ্যে জানান। আমরা কোনো অতিরিক্ত চার্জ ছাড়াই দ্রুত পণ্য পরিবর্তন বা রিফান্ড করে থাকি।',
    faqPaymentQ: 'কী কী পেমেন্ট মেথড সাপোর্ট করে?',
    faqPaymentA: 'আমরা ক্যাশ অন ডেলিভারি (COD) ছাড়াও বিকাশ, রকেট, নগদ, ভিসা, মাস্টারকার্ড সহ সকল ব্যাংক ও মোবাইল ব্যাংকিং পেমেন্ট মেথড সাপোর্ট করি।',
    faqOrderQ: 'আমি কীভাবে আমার অর্ডার ট্র্যাক করব?',
    faqOrderA: 'ওয়েবসাইটের ওপরে থাকা "অর্ডার ট্র্যাক করুন" বাটনে ক্লিক করে আপনার মোবাইল নম্বর এবং অর্ডার আইডি দিলেই সহজেই লাইভ আপডেট দেখতে পাবেন।',
    faqOriginalBookQ: 'আপনাদের বইগুলো কি আসল?',
    faqOriginalBookA: 'হ্যাঁ, আমাদের প্রতিটি বই সরাসরি সংশ্লিষ্ট প্রকাশনী বা লেখকের কাছ থেকে সংগৃহীত। আমরা ১০০% অরিজিনাল ও মানসম্মত বই ও পণ্যের গ্যারান্টি প্রদান করি।',

    footerAbout: 'টপসেল সম্পর্কে',
    footerAboutText: 'টপসেল.কম বাংলাদেশের অন্যতম বৃহত্তম অনলাইন বুকস্টোর ও লাইফস্টাইল ই-কমার্স প্ল্যাটফর্ম। আমরা সাশ্রয়ী মূল্যে ১০০% আসল বই, বিশ্বস্ত ইলেকট্রনিক্স ও প্রাত্যহিক সুপারস্টোর আইটেম সরাসরি আপনার দোরগোড়ায় পৌঁছে দিতে অঙ্গীকারবদ্ধ।',
    footerLinksHeader: 'গুরুত্বপূর্ণ লিঙ্ক',
    footerContactHeader: 'যোগাযোগ ও সাপোর্ট',
    footerRights: '© ২০২৬ টপসেল.কম। সর্বস্বত্ব সংরক্ষিত।'
  },
  en: {
    hotline: 'Hotline: 16297',
    trackOrder: 'Track Order',
    initiative: 'Rokomari Initiative',
    earnHome: 'Earn from Home',
    bookDonation: 'Book Donation',
    downloadApp: 'Download App',
    helloSignIn: 'Hello, Sign In',
    myAccount: 'My Account',
    hello: 'Hello,',
    youHave: 'You Have',
    points: 'Pts',
    searchPlaceholderGeneral: 'Search on Kenakata...',
    searchPlaceholderBooks: 'Search books (Mone Shokti, Atomic Habits...)',
    searchPlaceholderElectronics: 'Search electronics (Charger Fan, Smart Watch...)',
    searchPlaceholderSuperstore: 'Search superstore (Vaseline, Castor Oil...)',
    searchPlaceholderKids: 'Search kids items (Toys, Feeding Bottle...)',
    
    categorySuggestion: 'Category Suggestions',
    productSuggestion: 'Product Suggestions',

    adminPanel: '👑 Admin Control Panel (Live)',
    accountInfo: 'Account Info',
    ordersTracking: 'Orders & Tracking',
    ratingsReviews: 'My Ratings & Reviews',
    myInterests: 'My Interests',
    followingAuthors: 'Following Authors',
    wishlist: 'My Wishlist',
    savedList: 'Saved List',
    ebookLibrary: 'eBook Library',
    bookshelf: 'My Bookshelf',
    bkashAccount: 'Bkash Account Link',
    rokomariBalance: 'Rokomari Balance',
    signOut: 'Sign Out',

    homeTab: 'Home',
    booksTab: 'Books',
    electronicsTab: 'Electronics',
    superstoreTab: 'Super Store',
    fashionTab: 'Fashion',
    kidsTab: 'Kids Zone',
    corporateTab: 'Corporate Order',
    awardsTab: 'Bestseller Awards',
    offersTab: "Today's Offers",
    boimelaTab: 'Boimela 2026',

    authorSub: 'Authors',
    subjectSub: 'Subjects',
    islamicSub: 'Islamic Books',
    boimelaSub: 'Boimela 2026',
    academicSub: 'Academic Books',
    discountSub: 'Extra Discount Books',
    publisherSub: 'Publishers',
    cartOfferSub: 'Cart Offers',
    englishBooksSub: 'English Books',
    englishMediumSub: 'English Medium Books',
    hscSub: 'HSC Studies',

    flashDealsHeader: "Today's Flash Deals",
    quickDealsHeader: 'Superstore Quick Deals',
    latestEbooksHeader: 'Latest eBooks Carousel',
    popularAuthorsPublishersHeader: 'Popular Authors & Publishers',
    authorPublisherSubtext: 'Click on a popular author or publisher to easily find their published books',
    popularAuthorsTab: 'Popular Authors',
    popularPublishersTab: 'Popular Publishers',
    featuredProductsHeader: 'Featured Products',
    viewAllBtn: 'View All',
    justForYou: 'Just for you ✨',
    todaysDealTab: "Today's Deal",
    trendingTab: 'Trending Deal',
    boimelaSpecialTab: 'Boimela Special',
    bookType: 'Book',
    electronicsType: 'Electronics',
    superstoreType: 'Superstore',
    fashionType: 'Fashion',
    kidsType: 'Kids',

    brandLabel: 'Brand',
    authorLabel: 'Author',
    addToCart: 'Add to Cart',
    addedToCart: 'Added',
    inStock: 'In Stock',
    outOfStock: 'Stock Out',
    originalPrice: 'Original Price',
    discountPrice: 'Discount Price',

    myCartTitle: 'My Shopping Cart',
    itemsLabel: 'items',
    cartEmpty: 'Your cart is empty!',
    cartEmptySub: 'No products found in your cart. Please add some of your favorite items.',
    priceDetails: 'Price Details',
    totalOriginalPrice: 'Total Original Price',
    totalDiscount: 'Total Discount',
    shippingCharge: 'Shipping Charge',
    couponLabel: 'Promo Coupon Code',
    enterCoupon: 'Enter coupon code...',
    applyCoupon: 'Apply',
    couponApplied: 'Coupon code applied successfully',
    totalPayable: 'Total Payable',
    checkoutBtn: 'Place Order Now',
    deliveryHint: 'Delivery Timeline: Dhaka City 24-48 hours, Outside Dhaka 3-5 business days.',

    faqTitle: 'Frequently Asked Questions (FAQ)',
    faqSubtitle: 'Any questions while shopping? Find answers immediately with our common FAQs.',
    faqDeliveryQ: 'What is the delivery timeline?',
    faqDeliveryA: 'Delivery inside Dhaka city takes 24 to 48 hours. Delivery outside Dhaka usually takes 3 to 5 business days to reach your doorstep.',
    faqReturnQ: 'What is your return policy?',
    faqReturnA: 'If there are any defects or damaged items upon arrival, notify us within 3 days. We offer free replacements or full refunds immediately.',
    faqPaymentQ: 'Which payment methods do you support?',
    faqPaymentA: 'Besides Cash on Delivery (COD), we support bKash, Rocket, Nagad, Visa, Mastercard, and all other major credit cards and mobile bank options.',
    faqOrderQ: 'How can I track my order?',
    faqOrderA: 'Click on the "Track Order" button at the top header, enter your phone number and order ID, and you will see real-time updates.',
    faqOriginalBookQ: 'Are the books original copies?',
    faqOriginalBookA: 'Yes, every single book in our store is sourced directly from authors or official publishers. We guarantee 100% genuine and high-quality items.',

    footerAbout: 'About Kenakata',
    footerAboutText: 'Kenakata.com is one of Bangladesh\'s leading online bookstores and lifestyle e-commerce hubs. We are dedicated to delivering 100% original books, trusted electronics, and high-quality superstore supplies straight to your doorstep.',
    footerLinksHeader: 'Quick Links',
    footerContactHeader: 'Contact & Support',
    footerRights: '© 2026 Kenakata.com. All rights reserved.'
  }
};
