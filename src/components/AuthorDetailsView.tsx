import React from 'react';
import { X, BookOpen, Star, Calendar, MapPin, Award, ExternalLink, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { getBookCoverUrl } from '../lib/bookUtils';

interface AuthorDetails {
  name: string;
  banglaName?: string;
  bio: string;
  born?: string;
  died?: string;
  location?: string;
  specialties: string[];
  awards?: string[];
  website?: string;
  avatarBg: string;
}

// Static database of popular author biographies
const AUTHORS_BIO_DB: Record<string, AuthorDetails> = {
  'হুমায়ূন আহমেদ': {
    name: 'হুমায়ূন আহমেদ',
    bio: 'হুমায়ূন আহমেদ ছিলেন একাধারে ঔপন্যাসিক, ছোটগল্পকার, নাট্যকার এবং গীতিকার, চিত্রনাট্যকার ও চলচ্চিত্র নির্মাতা। তিনি বিংশ শতাব্দীর বাঙালি জনপ্রিয় কথাসাহিত্যিকদের মধ্যে অন্যতম। তাঁকে বাংলা কথাসাহিত্যে সংলাপপ্রধান নতুন শৈলীর জনক বলা হয়। হিমু ও মিসির আলি তাঁর সৃষ্ট অত্যন্ত জনপ্রিয় দুটি চরিত্র। তাঁর সায়েন্স ফিকশন ও শিশুতোষ উপন্যাসগুলোও বাংলা সাহিত্যে অনন্য স্থান দখল করে আছে।',
    born: '১৩ নভেম্বর ১৯৪৮',
    died: '১৯ জুলাই ২০১২',
    location: 'নেত্রকোণা, বাংলাদেশ',
    specialties: ['উপন্যাস', 'ছোটগল্প', 'সায়েন্স ফিকশন', 'নাটক', 'চলচ্চিত্র'],
    awards: ['বাংলা একাডেমি সাহিত্য পুরস্কার (১৯৮১)', 'একুশে পদক (১৯৯৪)', 'জাতীয় চলচ্চিত্র পুরস্কার (একাধিকবার)'],
    website: 'https://humayunahmed.org',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  'মুহম্মদ জাফর ইকবাল': {
    name: 'মুহম্মদ জাফর ইকবাল',
    bio: 'মুহম্মদ জাফর ইকবাল একজন বাংলাদেশী লেখক, পদার্থবিদ ও শিক্ষাবিদ। তিনি মূলত সায়েন্স ফিকশন (বিজ্ঞান কল্পকাহিনী) ও শিশুতোষ সাহিত্যের জন্য অত্যন্ত পরিচিত। তাঁর সহজ ও সাবলীল লেখার ধারা কিশোর পাঠকদের দারুণভাবে আকৃষ্ট করে। এছাড়া তিনি কলামিস্ট ও বিজ্ঞান জনপ্রিয়করণ আন্দোলনের একজন অন্যতম পথিকৃৎ।',
    born: '২৩ ডিসেম্বর ১৯৫২',
    location: 'সিলেট, বাংলাদেশ',
    specialties: ['বিজ্ঞান কল্পকাহিনী', 'শিশুতোষ উপন্যাস', 'কিশোর অ্যাডভেঞ্চার', 'পপুলার সায়েন্স'],
    awards: ['বাংলা একাডেমি সাহিত্য পুরস্কার (২০০৪)', 'একুশে পদক', 'খলিল জিবরান আন্তর্জাতিক পুরস্কার'],
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  'সাদাত হোসাইন': {
    name: 'সাদাত হোসাইন',
    bio: 'সাদাত হোসাইন বাংলাদেশের একজন জনপ্রিয় সমকালীন কথাসাহিত্যিক, কবি ও চলচ্চিত্র নির্মাতা। তাঁর উপন্যাসগুলো মানব মনের গভীর আবেগ ও সম্পর্কের জটিলতাগুলো চমৎকারভাবে ফুটিয়ে তোলে। বাস্তবসম্মত চরিত্রায়ন এবং হৃদয়স্পর্শী ঘটনার ঘনঘটার মাধ্যমে স্বল্প সময়ে তিনি তরুণ পাঠকদের মাঝে বিপুল জনপ্রিয়তা অর্জন করেছেন।',
    born: '২১ মে ১৯৮৪',
    location: 'মাদারীপুর, বাংলাদেশ',
    specialties: ['সমকালীন উপন্যাস', 'ছোটগল্প', 'কবিতা', 'চিত্রনাট্য'],
    awards: ['এক্সিম ব্যাংক-অন্যদিন হ‌ুমায়ূন আহমেদ সাহিত্য পুরস্কার (২০১৬)', 'আইআইএফইউএ সেরা শর্ট ফিল্ম পুরস্কার'],
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  'আরিফ Azad': {
    name: 'আরিফ আজাদ',
    bio: 'আরিফ আজাদ সমকালীন বাংলাদেশের সবচেয়ে জনপ্রিয় লেখকদের একজন, যিনি মূলত বিশ্বাস ও আত্মসচেতনতামূলক সাহিত্য রচনা করেন। তাঁর বিখ্যাত গ্রন্থ "প্যারাডক্সিক্যাল সাজিদ" এবং "বেলা ফুরাবার আগে" তরুণ মুসলিম প্রজন্মের মাঝে তুমুল সাড়া জাগিয়েছে। তিনি সহজ ভাষায় জীবনধর্মী ও যৌক্তিক আলোচনা উপস্থাপনে পারদর্শী।',
    location: 'চট্টগ্রাম, বাংলাদেশ',
    specialties: ['ইসলামিক মোটিভেশন', 'ধর্মতত্ত্ব', 'সাজিদ সিরিজ', 'আত্মসচেতনতা'],
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  'আরিফ আজাদ': {
    name: 'আরিফ আজাদ',
    bio: 'আরিফ আজাদ সমকালীন বাংলাদেশের সবচেয়ে জনপ্রিয় লেখকদের একজন, যিনি মূলত বিশ্বাস ও আত্মসচেতনতামূলক সাহিত্য রচনা করেন। তাঁর বিখ্যাত গ্রন্থ "প্যারাডক্সিক্যাল সাজিদ" এবং "বেলা ফুরাবার আগে" তরুণ মুসলিম প্রজন্মের মাঝে তুমুল সাড়া জাগিয়েছে। তিনি সহজ ভাষায় জীবনধর্মী ও যৌক্তিক আলোচনা উপস্থাপনে পারদর্শী।',
    location: 'চট্টগ্রাম, বাংলাদেশ',
    specialties: ['ইসলামিক মোটিভেশন', 'ধর্মতত্ত্ব', 'সাজিদ সিরিজ', 'আত্মসচেতনতা'],
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  'সাদমান সাদিক': {
    name: 'সাদমান সাদিক',
    bio: 'সাদমান সাদিক একজন জনপ্রিয় তরুণ আইকন, মোটিভেশনাল স্পিকার এবং সফল কন্টেন্ট ক্রিয়েটর। তিনি তরুণদের জন্য দক্ষতা উন্নয়ন, পড়াশোনা ও ক্যারিয়ার বিষয়ক বাস্তবসম্মত বই লিখে ব্যাপক পরিচিতি পেয়েছেন। তিনি ১০ মিনিট স্কুলের অত্যন্ত জনপ্রিয় মেন্টর হিসেবেও কাজ করছেন।',
    specialties: ['সেলফ-হেল্প', 'ক্যারিয়ার উন্নয়ন', 'টাইম ম্যানেজমেন্ট', 'ব্যক্তিত্ব বিকাশ'],
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  'থিবো মেউরিচ': {
    name: 'থিবো মেউরিচ',
    bio: 'Thibaut Meurisse is a renowned self-help author, blogger, and founder of Whatispersonaldevelopment.org. He is best known for his "Master Your..." book series, which offers highly actionable, step-by-step guides for emotional management, productivity, and personal transformation.',
    born: 'France',
    specialties: ['Self-Help', 'Productivity', 'Mindfulness', 'Emotional Intelligence'],
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  'ড. আয়েজ আল করনী': {
    name: 'ড. আয়েজ আল করনী',
    bio: 'ড. আয়েজ ইবনে আবদুল্লাহ আল-করনী একজন বিশ্বখ্যাত সৌদি ইসলামি চিন্তাবিদ, গবেষক এবং লেখক। তাঁর লেখা সর্বকালের অন্যতম সেরা মোটিভেশনাল বই "লা-তাহযান" (হতাশ হবেন না) বিশ্বজুড়ে লাখ লাখ মানুষের জীবন বদলে দিয়েছে এবং কোটি কপি বিক্রি হয়েছে। তাঁর চমৎকার রচনারীতি মানুষকে শান্তি ও ইতিবাচক জীবন দর্শনের দিক নির্দেশনা দেয়।',
    born: '১ জানুয়ারি ১৯৫৯',
    location: 'আল-কারন, সৌদি আরব',
    specialties: ['ইসলামিক আত্মউন্নয়ন', 'তাফসীর ও হাদিস', 'মোটিভেশন'],
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  'রকিব হাসান': {
    name: 'রকিব হাসান',
    bio: 'রকিব হাসান বাংলাদেশের একজন অতি জনপ্রিয় কিশোর সাহিত্যিক, অনুবাদক ও সেবা প্রকাশনীর অন্যতম প্রধান লেখক। তিনি বিশ্ববিখ্যাত কিশোর গোয়েন্দা সিরিজ "তিন গোয়েন্দা"-র মূল রচয়িতা হিসেবে বাঙালি পাঠকদের কাছে স্মরণীয় হয়ে আছেন। এছাড়া তাঁর অসংখ্য অনুবাদ গ্রন্থ ও রহস্য উপন্যাস কিশোর ও প্রাপ্তবয়স্কদের মাঝে সমাদৃত।',
    born: '৩ ডিসেম্বর ১৯৫০',
    location: 'ভোলা, বাংলাদেশ',
    specialties: ['গোয়েন্দা কাহিনী', 'কিশোর অ্যাডভেঞ্চার', 'থ্রিলার', 'ক্লাসিক অনুবাদ'],
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  'কাজী আনোয়ার হোসেন': {
    name: 'কাজী আনোয়ার হোসেন',
    bio: 'কাজী আনোয়ার হোসেন ছিলেন সেবা প্রকাশনীর প্রতিষ্ঠাতা এবং অমর গোয়েন্দা সিরিজ "মাসুদ রানা"-র স্রষ্টা। তিনি "কুয়াশা" সিরিজ সহ অজস্র রোমাঞ্চকর উপন্যাসের রচয়িতা। বাংলা অ্যাডভেঞ্চার ও থ্রিলার প্রিয় পাঠকদের কাছে তিনি এক জীবন্ত কিংবদন্তি। তাঁর হাত ধরেই বাংলাদেশে পেপারব্যাক থ্রিলার সংস্কৃতির বিপ্লব ঘটেছিল।',
    born: '১৮ ডিসেম্বর ১৯৩৬',
    died: '১৯ জানুয়ারি ২০২২',
    location: 'ঢাকা, বাংলাদেশ',
    specialties: ['রোমাঞ্চকর থ্রিলার', 'গোয়েন্দা ও স্পাই থ্রিলার', 'অ্যাডভেঞ্চার'],
    awards: ['বাংলা একাডেমি সাহিত্য পুরস্কার (১৯৭৪)', 'জাতীয় চলচ্চিত্র পুরস্কার (চিত্রনাট্য)'],
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  'আনিসুল হক': {
    name: 'আনিসুল হক',
    bio: 'আনিসুল হক বাংলাদেশের একজন প্রখ্যাত কথাসাহিত্যিক, কবি, নাট্যকার ও সাংবাদিক। তাঁর বিখ্যাত উপন্যাস "মা" বাংলাদেশের কথাসাহিত্যের ইতিহাসে একটি মাইলফলক হিসেবে বিবেচিত। তিনি দৈনিক প্রথম আলোর সহযোগী সম্পাদক এবং তাঁর রসবোধ ও সামাজিক কলামগুলো বিপুল জনপ্রিয়।',
    born: '৪ মার্চ ১৯৬৫',
    location: 'রংপুর, বাংলাদেশ',
    specialties: ['উপন্যাস', 'মা সিরিজ', 'রম্য রচনা', 'নাটক ও চিত্রনাট্য'],
    awards: ['বাংলা একাডেমি সাহিত্য পুরস্কার (২০১২)', 'ইউরো শিশু সাহিত্য পুরস্কার'],
    avatarBg: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  'সুনীল গঙ্গোপাধ্যায়': {
    name: 'সুনীল গঙ্গোপাধ্যায়',
    bio: 'সুনীল গঙ্গোপাধ্যায় ছিলেন বিংশ শতাব্দীর শেষভাগের একজন প্রখ্যাত ভারতীয় বাঙালি কবি ও ঔপন্যাসিক। তিনি "নীললোহিত", "সনাতন পাঠক" ও "নীল উপাধ্যায়" ছদ্মনাম ব্যবহার করতেন। তাঁর ঐতিহাসিক উপন্যাস "সেই সময়", "প্রথম আলো" এবং কিশোর গোয়েন্দা চরিত্র "কাকাবাবু" দারুণ জনপ্রিয়।',
    born: '৭ সেপ্টেম্বর ১৯৩৪',
    died: '২৩ অক্টোবর ২০১২',
    location: 'ফরিদপুর (বর্তমানে বাংলাদেশ), কলকাতা',
    specialties: ['কবিতা', 'ঐতিহাসিক উপন্যাস', 'কিশোর গোয়েন্দা (কাকাবাবু)', 'ভ্রমণকাহিনী'],
    awards: ['সাহিত্য অকাদেমী পুরস্কার (১৯৮৫)', 'আনন্দ পুরস্কার (একাধিকবার)', 'বঙ্কিম পুরস্কার'],
    avatarBg: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  'তসলিমা নাসরিন': {
    name: 'তসলিমা নাসরিন',
    bio: 'তসলিমা নাসরিন একজন আন্তর্জাতিক খ্যাতিসম্পন্ন লেখিকা, কবি ও প্রাবন্ধিক। তিনি নব্বইয়ের দশকের শুরুতে তাঁর নারীবাদী প্রবন্ধ ও উপন্যাসের মাধ্যমে সারা বিশ্বে আলোড়ন সৃষ্টি করেন। মানবাধিকার, লিঙ্গ বৈষম্য রোধ এবং মুক্তচিন্তার পক্ষে তাঁর জোরালো কণ্ঠস্বর আধুনিক বাংলা সাহিত্যে এক অনন্য বিতর্কিত ও সাহসী ধারা তৈরি করেছে।',
    born: '২৫ আগস্ট ১৯৬২',
    location: 'ময়মনসিংহ, বাংলাদেশ',
    specialties: ['কবিতা', 'নারীবাদী প্রবন্ধ', 'আত্মজীবনীমূলক উপন্যাস'],
    awards: ['আনন্দ সাহিত্য পুরস্কার (১৯৯২)', 'সাখারভ পুরস্কার (১৯৯৪)', 'কুর্ট টুচোলস্কি পুরস্কার'],
    avatarBg: 'bg-pink-100 text-pink-800 border-pink-200'
  }
};

interface AuthorDetailsViewProps {
  authorName: string;
  products: Product[];
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onPreview: (p: Product) => void;
  onSelectProduct?: (p: Product) => void;
  favoriteProductIds?: string[];
  onToggleFavorite?: (p: Product) => void;
}

export default function AuthorDetailsView({
  authorName,
  products,
  onClose,
  onAddToCart,
  onPreview,
  onSelectProduct,
  favoriteProductIds = [],
  onToggleFavorite
}: AuthorDetailsViewProps) {
  // Find books written by this author
  const authorBooks = products.filter(
    (p) => p.type === 'book' && p.authorOrBrand.toLowerCase().trim() === authorName.toLowerCase().trim()
  );

  // Retrieve biography from DB, or fallback to generated content
  const authorBio = AUTHORS_BIO_DB[authorName] || {
    name: authorName,
    bio: `${authorName} একজন বিশিষ্ট লেখক ও মননশীল গবেষক। তাঁর সৃজনশীল সাহিত্যকর্ম ও অনন্য রচনাশৈলী পাঠকমহলে সমাদৃত হয়েছে। তিনি প্রতিনিয়ত নতুন ধারার চিন্তাভাবনা ও সুনিপুণ লেখনীর মাধ্যমে সমাজ ও সাধারণ মানুষের মনস্তাত্ত্বিক রূপ তুলে ধরছেন। তাঁর প্রতিটি বইয়ের পেছনে রয়েছে গভীর সামাজিক অবলোকন ও সুচিন্তিত দৃষ্টিভঙ্গি।`,
    specialties: ['সৃজনশীল সাহিত্য', 'মননশীল প্রবন্ধ', 'গবেষণা'],
    avatarBg: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const getInitials = (name: string) => {
    return name.trim().substring(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-up"
        style={{ maxHeight: '92vh' }}
        id="author-details-modal-container"
      >
        {/* Header Ribbon / Cover design */}
        <div className="bg-gradient-to-r from-rose-500/10 via-indigo-500/10 to-amber-500/10 p-6 border-b border-slate-100 relative shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shadow-3xs cursor-pointer z-10"
            id="author-details-close-btn"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            {/* Elegant Avatar Wrapper */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-md flex items-center justify-center shrink-0 ${authorBio.avatarBg} relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5"></div>
              <span className="text-xl sm:text-2xl font-sans font-black tracking-tight select-none">
                {getInitials(authorBio.name)}
              </span>
            </div>

            {/* Author Profile Information */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-none">
                  {authorBio.name}
                </h3>
                <span className="bg-rose-500 text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase shrink-0 shadow-3xs">
                  AUTHOR (লেখক)
                </span>
              </div>
              
              <p className="text-[11px] text-slate-500 font-bold max-w-md line-clamp-1">
                {authorBio.specialties.join(' • ')}
              </p>

              {/* Badges/Metadata Grid */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 pt-1 text-[10px] text-slate-500 font-bold">
                {authorBio.born && (
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>জন্ম: {authorBio.born} {authorBio.died ? `(মৃত্যু: ${authorBio.died})` : ''}</span>
                  </span>
                )}
                
                {authorBio.location && (
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span>স্থান: {authorBio.location}</span>
                  </span>
                )}

                <span className="flex items-center space-x-1.5 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-indigo-600 font-black">মোট বই: {authorBooks.length}টি</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {/* Section: Biography */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-1">
              <BookOpen className="w-4 h-4 text-rose-500 shrink-0" />
              <span>জীবনী ও সাহিত্যকর্ম (Biography)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify">
              {authorBio.bio}
            </p>
          </div>

          {/* Section: Specialties and Awards */}
          {((authorBio.awards && authorBio.awards.length > 0) || authorBio.website) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Awards */}
              {authorBio.awards && authorBio.awards.length > 0 && (
                <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2 shadow-3xs">
                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>পুরস্কার ও অর্জনসমূহ</span>
                  </h5>
                  <ul className="space-y-1 text-[10.5px] text-slate-600 font-semibold list-disc pl-4 leading-tight">
                    {authorBio.awards.map((aw, i) => (
                      <li key={i}>{aw}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Digital Presence / Info */}
              <div className="bg-white border border-slate-150 p-4 rounded-xl flex flex-col justify-between shadow-3xs">
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <ExternalLink className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>অফিসিয়াল পরিচিতি</span>
                  </h5>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    সম্পর্কিত বিস্তারিত তথ্য পেতে অফিসিয়াল রিসোর্সেস দেখুন।
                  </p>
                </div>
                {authorBio.website && (
                  <a
                    href={authorBio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10.5px] text-sky-600 hover:text-sky-800 font-black flex items-center space-x-1.5 mt-2 hover:underline"
                  >
                    <span>ওয়েবসাইট ভিজিট করুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Section: Published Books list in store */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-1">
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>প্রকাশিত বইসমূহ ({authorBooks.length}টি বই আমাদের স্টোরে আছে)</span>
              </span>
            </h4>

            {authorBooks.length === 0 ? (
              <div className="text-center py-8 bg-white border border-slate-150 rounded-xl">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-400 font-bold">দুঃখিত, এই লেখকের কোনো বই বর্তমানে স্টোরে নেই।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {authorBooks.map((prod) => {
                  const isFavorite = favoriteProductIds.includes(prod.id);
                  const coverUrl = getBookCoverUrl(prod.imageUrl);
                  
                  return (
                    <div 
                      key={prod.id}
                      className="bg-white border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all text-left font-sans"
                    >
                      {/* Product Left Column (cover & details) */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-15 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0 flex items-center justify-center">
                          <img 
                            src={coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'} 
                            alt={prod.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
                            }}
                          />
                        </div>
                        
                        <div className="min-w-0">
                          <h5 className="text-[11.5px] font-black text-slate-850 line-clamp-1 hover:text-rose-600 transition-colors cursor-pointer" title={prod.title} onClick={() => onSelectProduct?.(prod)}>
                            {prod.title}
                          </h5>
                          <p className="text-[9.5px] text-slate-450 font-semibold truncate">
                            {prod.publisherCompany || 'রকমারি প্রকাশনী'}
                          </p>
                          
                          {/* Price metrics */}
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className="text-rose-600 text-xs font-black font-mono">৳{prod.discountedPrice}</span>
                            {prod.originalPrice && prod.originalPrice > prod.discountedPrice && (
                              <span className="text-[9px] text-slate-400 line-through font-mono">৳{prod.originalPrice}</span>
                            )}
                          </div>
                          
                          {/* Star Ratings widget */}
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="flex items-center space-x-0.2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-2.5 h-2.5 ${i < Math.floor(prod.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[8.5px] text-slate-400 font-bold">({prod.totalRatings || 0})</span>
                          </div>
                        </div>
                      </div>

                      {/* Product Right Column (action handlers) */}
                      <div className="flex flex-col items-end space-y-1 shrink-0">
                        {onToggleFavorite && (
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(prod)}
                            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-center ${
                              isFavorite 
                                ? 'bg-rose-500 border-rose-500 text-white shadow-3xs' 
                                : 'bg-white border-slate-250 text-slate-500 hover:bg-slate-50 hover:text-rose-500'
                            }`}
                            title={isFavorite ? 'সংরক্ষিত' : 'উইশলিস্টে নিন'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onAddToCart(prod)}
                          disabled={!prod.inStock}
                          className={`p-1.5 rounded-lg text-[10px] font-black flex items-center justify-center transition-all shadow-3xs cursor-pointer ${
                            prod.inStock 
                              ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-97' 
                              : 'bg-slate-100 text-slate-450 cursor-not-allowed border border-slate-200'
                          }`}
                          title="কার্টে যুক্ত করুন"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs py-2 px-6 rounded-xl cursor-pointer transition-colors shadow-3xs"
            id="author-details-footer-close"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
