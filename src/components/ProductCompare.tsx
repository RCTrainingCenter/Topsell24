import { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  ShoppingCart, 
  Trash2, 
  Maximize2, 
  Check, 
  Star, 
  CheckCircle2, 
  Pin, 
  Sparkles, 
  Filter, 
  Search, 
  RotateCcw, 
  AlertCircle, 
  Info, 
  ChevronRight, 
  HelpCircle 
} from 'lucide-react';
import { Product } from '../types';
import { getProductImageUrl } from '../lib/bookUtils';

interface ProductCompareProps {
  compareItems: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product) => void;
}

// Comprehensive technical specification structures mapped dynamically for books, electronics, and home appliances
const SPEC_GROUPS = [
  {
    id: 'basic',
    labelBn: 'মৌলিক তথ্য (Basic Info)',
    specs: [
      { key: 'itemCode', labelBn: 'আইটেম কোড (Product SKU)', getValue: (p: Product) => `#${p.id.toUpperCase()}` },
      { key: 'type', labelBn: 'পণ্যের ধরণ', getValue: (p: Product) => p.type === 'book' ? 'বই (Printed Book)' : p.type === 'electronic' ? 'ইলেকট্রনিক্স (Electronics)' : p.type === 'fashion' ? 'ফ্যাশন (Fashion & Apparel)' : p.type === 'kids' ? 'কিডস জোন (Kids Zone)' : 'সুপারস্টোর আইটেম' },
      { key: 'category', labelBn: 'মূল ক্যাটাগরি', getValue: (p: Product) => p.category || 'জেনারেল' },
      { key: 'brand', labelBn: 'ব্র্যান্ড / লেখক', getValue: (p: Product) => p.authorOrBrand || 'N/A' },
      { key: 'discount', labelBn: 'মূল্যছাড় (Discount)', getValue: (p: Product) => p.discountPercent > 0 ? `${p.discountPercent}% ছাড়` : 'কোনো ছাড় নেই' },
      { key: 'mediaGallery', labelBn: 'ছবি ও ভিডিও গ্যালারি', getValue: (p: Product) => {
        const count = p.images?.length || 1;
        const video = p.videoUrl ? ' + ভিডিও সহ' : '';
        return `${count}টি ছবি${video}`;
      } },
    ]
  },
  {
    id: 'tech',
    labelBn: 'কারিগরি বৈশিষ্ট্য (Technical Specs)',
    specs: [
      {
        key: 'capacity',
        labelBn: 'পৃষ্ঠা সংখ্যা / ক্ষমতা / সাইজ',
        getValue: (p: Product) => {
          if (p.type === 'book') {
            if (p.id === 'b1') return '২২৪ পৃষ্ঠা';
            if (p.id === 'b2') return '৩৮৪ পৃষ্ঠা';
            if (p.id === 'b3') return '১৬০ পৃষ্ঠা';
            return '১৯২ পৃষ্ঠা';
          }
          if (p.type === 'electronic') {
            const title = (p.title || '').toLowerCase();
            if (title.includes('blender') || p.id === 'vision-blender-373560') return '৩টি জার (১.৫ লিঃ লিকুইডাইজার, ১.০ লিঃ গ্রাইন্ডার, ০.৩ লিঃ চাটনি জার)';
            if (p.id === 'e6' || title.includes('fan')) return '১৬ ইঞ্চি সুইং সাইজ, ৩টি পিএস উইন্ড ব্লেড';
            if (p.id === 'e1' || title.includes('hard drive') || title.includes('enclosure')) return 'সর্বোচ্চ ৬টিবি এসএসডি/এইচডিডি সাপোর্ট';
            if (p.id === 'e4' || title.includes('earphone') || title.includes('headphone')) return 'ডুয়াল ড্রাইভ হাই-ফাই স্টেরিও';
            if (p.id === 'e2' || title.includes('torch') || title.includes('laser')) return '৫০০০ এমএএইচ হাই-ক্যাপাসিটি সেল';
            return 'স্ট্যান্ডার্ড সাইজ';
          }
          if (p.type === 'superstore') {
            if (p.id === 's1') return '১০০ গ্রাম জার প্যাক';
            if (p.id === 's2') return '১০০ মিলি বোতল প্যাক';
            return 'স্ট্যান্ডার্ড সাইজ';
          }
          if (p.type === 'kids') {
            if (p.id === 'k1') return 'সিলিকন বেবি নিবলার চুষনি';
            return 'স্ট্যান্ডার্ড কিডস প্যাক';
          }
          return 'N/A';
        }
      },
      {
        key: 'power',
        labelBn: 'পাওয়ার ও মোটর / মূল উপাদান',
        getValue: (p: Product) => {
          if (p.type === 'book') return 'N/A (প্রিন্টেড সংস্করণ)';
          if (p.type === 'electronic') {
            const title = (p.title || '').toLowerCase();
            if (title.includes('blender') || p.id === 'vision-blender-373560') return '৭৫০ ওয়াট প্রিমিয়াম হাই-স্পিড কপার মোটর';
            if (p.id === 'e6' || title.includes('fan')) return '১৫ ওয়াট লো-নয়েজ ডিসি সেভিং মোটর';
            if (p.id === 'e1') return 'USB পোর্ট বাস পাওয়ারড (৫ ভোল্ট)';
            if (p.id === 'e2' || title.includes('torch')) return '৫ ওয়াট সুপার ব্রাইট ফোকাস লেজার এলইডি';
            if (p.id === 'e4' || title.includes('earphone')) return '১০ মিলিওয়াট হাই-রেস অডিও ড্রাইভার';
            return 'স্মার্ট এনার্জি সেভিং পাওয়ার';
          }
          if (p.type === 'superstore') {
            if (p.id === 's1') return '১০০% অরগানিক কেশরাজ ও কালোকোশি ভেষজ চূর্ণ';
            if (p.id === 's2') return '১০০% খাঁটি কোল্ড-প্রেসড ক্যাস্টর অয়েল';
            return 'প্রাকৃতিক অর্গানিক উপাদান';
          }
          if (p.type === 'kids') {
            return 'বিপিএ-ফ্রি নন-টক্সিক ফুড গ্রেড সিলিকন';
          }
          return 'N/A';
        }
      },
      {
        key: 'connectivity',
        labelBn: 'কানেক্টিভিটি / বাইন্ডিং টাইপ',
        getValue: (p: Product) => {
          if (p.type === 'book') {
            return p.id === 'b6' || p.id.startsWith('eb') ? 'ডিজিটাল ডাউনলোড (PDF/EPUB)' : 'প্রিমিয়াম পেপারব্যাক বাইন্ডিং';
          }
          if (p.type === 'electronic') {
            const title = (p.title || '').toLowerCase();
            if (p.id === 'e1' || title.includes('hard drive') || title.includes('enclosure')) return 'USB Type-C (USB 3.0 / 3.1)';
            if (p.id === 'e3' || title.includes('hdmi')) return 'HDMI 19-পিন মেল টু মেল গোল্ড-প্লেটেড';
            if (p.id === 'e4' || title.includes('earphone')) return '৩.৫ মিমি গোল্ড-প্লেটেড জ্যাক';
            if (p.id === 'e6') return 'এসি/ডিসি ক্যাবল সংযুক্ত দ্বৈত সংযোগ';
            return 'ওয়্যার্ড কানেক্টিভিটি';
          }
          return 'N/A';
        }
      },
      {
        key: 'performance',
        labelBn: 'বিশেষ পারফরম্যান্স বা রেঞ্জ',
        getValue: (p: Product) => {
          if (p.type === 'book') return 'পড়তে সহজ ও আকর্ষণীয় ফন্ট সাইজ';
          if (p.type === 'electronic') {
            const title = (p.title || '').toLowerCase();
            if (p.id === 'vision-blender-373560') return '১৮০০০ আরপিএম হাই-স্পিড ক্রাশিং';
            if (p.id === 'e6' || title.includes('fan')) return '৫-৮ ঘণ্টা ব্যাকআপ টাইম (৪৫০০ এমএএইচ)';
            if (p.id === 'e1') return '৫ জিবিপিএস (Gbps) আল্ট্রা-ফাস্ট ডাটা ট্রান্সফার';
            if (p.id === 'e2') return '৮০০ মিটার দীর্ঘ দূরবর্তী ফোকাস ও ইমার্জেন্সি সাইড লাইট';
            if (p.id === 'e4') return 'ডিভিডি অডিও কোয়ালিটি, নয়েজ ক্যান্সেলেশন';
            return 'উচ্চ পারফরম্যান্স কোয়ালিটি';
          }
          if (p.type === 'superstore') {
            return '১০০% পার্শ্বপ্রতিক্রিয়া মুক্ত ও ল্যাব পরীক্ষিত';
          }
          if (p.type === 'kids') {
            return 'শিশুদের জন্য সম্পূর্ণ নিরাপদ ও মোলায়েম টেক্সচার';
          }
          return 'N/A';
        }
      }
    ]
  },
  {
    id: 'warranty',
    labelBn: 'ওয়ারেন্টি ও পলিসি (Warranty & Policy)',
    specs: [
      {
        key: 'warrantyPeriod',
        labelBn: 'ওয়ারেন্টি পিরিয়ড',
        getValue: (p: Product) => {
          if (p.type === 'electronic') {
            if (p.id === 'vision-blender-373560') return '১ বছর ওরিজিনাল ব্র্যান্ড ওয়ারেন্টি';
            if (p.id === 'e1') return '১ বছর ওরিজিনাল Orico পার্টস ওয়ারেন্টি';
            if (p.id === 'e2') return '১ বছর Sanford অফিসিয়াল ওয়ারেন্টি';
            if (p.id === 'e6') return '৬ মাস রিচার্জেবল পার্টস ও মোটর ওয়ারেন্টি';
            return '৬ মাস সার্ভিস ওয়ারেন্টি';
          }
          return 'লাইফটাইম সাপোর্ট (অফিসিয়াল রিফান্ড পলিসি প্রযোজ্য)';
        }
      },
      {
        key: 'origin',
        labelBn: 'ব্র্যান্ড বা পাবলিশার অরিজিন',
        getValue: (p: Product) => p.type === 'book' ? (p.publisherCompany || 'রকমারি পাবলিকেশন্স (বাংলাদেশ)') : `${p.authorOrBrand || 'আমদানিকৃত ওরিজিনাল ব্র্যান্ড'}`
      },
      {
        key: 'returnPolicy',
        labelBn: 'রিটার্ন পলিসি',
        getValue: (p: Product) => '৭ দিনের সহজ রিটার্ন বা এক্সচেঞ্জ গ্যারান্টি (কোনো প্রশ্ন ছাড়াই)'
      }
    ]
  },
  {
    id: 'additional',
    labelBn: 'অন্যান্য তথ্য (Others)',
    specs: [
      {
        key: 'safety',
        labelBn: 'সুরক্ষা ও সার্টিফিকেশন',
        getValue: (p: Product) => {
          if (p.type === 'electronic') {
            return 'স্মার্ট এনার্জি সেভিং এবং ফিউজ শর্ট-সার্কিট প্রটেকশন';
          }
          if (p.type === 'kids') {
            return 'FDA সার্টিফাইড BPA-ফ্রি নন-টক্সিক ফুড গ্রেড সিলিকন';
          }
          if (p.type === 'superstore') {
            return 'BSTI অনুমোদিত ও ১০০% প্রাকৃতিক হাইজিন উপাদান';
          }
          return 'উচ্চ মানের কাগজ ও দীর্ঘস্থায়ী কভার প্রটেকশন';
        }
      },
      {
        key: 'usage',
        labelBn: 'ব্যবহার বিধি বা বয়সসীমা',
        getValue: (p: Product) => {
          if (p.type === 'book') return 'সকলের জন্য পাঠযোগ্য ও শিক্ষণীয়';
          if (p.type === 'kids') return '০ থেকে ৪ বছর বয়সী বাচ্চার খাবার ও খেলনার নিরাপদ সামগ্রী';
          if (p.type === 'superstore') return 'নিয়মিত ব্যবহারে চুল ও ত্বকের গভীর পুষ্টি নিশ্চিত করে';
          return 'বাসাবাড়ি, ডেস্কটপ বা পোর্টেবল ব্যবহার উপযোগি';
        }
      },
      {
        key: 'delivery',
        labelBn: 'হোম ডেলিভারি চার্জ',
        getValue: (p: Product) => p.discountedPrice >= 3000 ? 'সম্পূর্ণ ফ্রি ডেলিভারি (Free Shipping)' : 'দেশজুড়ে মাত্র ৫০ টাকা হোম ডেলিভারি'
      }
    ]
  }
];

export default function ProductCompare({
  compareItems,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
}: ProductCompareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightDiffs, setHighlightDiffs] = useState(true);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (compareItems.length === 0) return null;

  // Check if a technical spec has different values across the compared list
  const hasSpecDifferences = (specGetValue: (p: Product) => string) => {
    if (compareItems.length < 2) return false;
    const firstValue = specGetValue(compareItems[0]);
    return !compareItems.every(item => specGetValue(item) === firstValue);
  };

  // Algorithmic smart recommendation advisor engine
  const getSmartAdvice = () => {
    if (compareItems.length < 2) return null;

    let cheapest = compareItems[0];
    let topRated = compareItems[0];
    let bestDeal = compareItems[0];

    compareItems.forEach(item => {
      if (item.discountedPrice < cheapest.discountedPrice) {
        cheapest = item;
      }
      if (item.rating > topRated.rating || (item.rating === topRated.rating && item.totalRatings > topRated.totalRatings)) {
        topRated = item;
      }
      if (item.discountPercent > bestDeal.discountPercent) {
        bestDeal = item;
      }
    });

    return { cheapest, topRated, bestDeal };
  };

  const advice = getSmartAdvice();
  const pinnedItem = compareItems.find(p => p.id === pinnedItemId);

  // Filter groups based on selected tab and search query
  const filteredSpecGroups = SPEC_GROUPS.map(group => {
    // Filter specs inside the group
    const specs = group.specs.filter(spec => {
      // Tab Category filter
      if (activeCategory !== 'all' && group.id !== activeCategory) return false;

      // Differences Filter
      if (showOnlyDiffs && !hasSpecDifferences(spec.getValue)) return false;

      // Live Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const labelMatch = spec.labelBn.toLowerCase().includes(query);
        const valueMatch = compareItems.some(item => spec.getValue(item).toLowerCase().includes(query));
        return labelMatch || valueMatch;
      }

      return true;
    });

    return { ...group, specs };
  }).filter(group => group.specs.length > 0);

  return (
    <>
      {/* 1. FLOATING COMPARISON QUEUE DOCK / TRAY (Sticky dynamic bottom bar) */}
      <div 
        id="compare-tray"
        className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-amber-400 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-40 transition-all duration-300 animate-slide-up select-none"
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Block: Thumbnail Queue Counter & Helper Indicator */}
          <div className="flex items-center space-x-3 w-full md:w-auto" id="compare-tray-meta">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
              <ArrowLeftRight className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-none flex items-center gap-2">
                <span>প্রোডাক্ট তুলনা তালিকা</span>
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 text-[10.5px] rounded-full font-black">
                  {compareItems.length}/4
                </span>
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 font-medium mt-1 font-sans">
                মডেল স্পেসিফিকেশন, ওয়ারেন্টি ও দামের পাশে পাশে তুলনামূলক বিশ্লেষণ করুন।
              </p>
            </div>
          </div>

          {/* Center Block: Scrollable Queue Thumbnails List */}
          <div className="flex items-center space-x-2.5 w-full md:w-auto overflow-x-auto py-1 scrollbar-none justify-start md:justify-center flex-1" id="compare-tray-items">
            {compareItems.map((item) => (
              <div 
                key={item.id} 
                className="relative bg-slate-50 border border-slate-200/80 rounded-xl p-1.5 shrink-0 w-32 flex items-center gap-2 group/tray"
                id={`compare-item-${item.id}`}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <img 
                    src={getProductImageUrl(item)} 
                    alt={item.title} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-700 truncate leading-tight" title={item.title}>
                    {item.title}
                  </p>
                  <p className="text-[9px] font-mono font-black text-sky-600 mt-0.5">
                    Tk {item.discountedPrice.toLocaleString('bn-BD')}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFromCompare(item)}
                  className="absolute -top-1.5 -right-1.5 bg-slate-900 border border-slate-750 hover:bg-rose-600 text-white p-0.5 rounded-full shadow-md hover:scale-110 cursor-pointer transition-all duration-150"
                  title="তুলনা তালিকা থেকে বাদ দিন"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            
            {compareItems.length < 2 && (
              <div className="hidden lg:flex items-center space-x-2 text-slate-400 text-[11px] border border-dashed border-slate-300 rounded-xl px-4 py-2 bg-slate-50/50">
                <span className="animate-pulse">➕ আরও একটি প্রোডাক্ট যুক্ত করুন</span>
              </div>
            )}
          </div>

          {/* Right Block: Primary Action Buttons */}
          <div className="flex items-center space-x-2.5 w-full md:w-auto shrink-0 justify-end" id="compare-tray-actions">
            <button
              onClick={onClearCompare}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl bg-white flex items-center space-x-1.5 hover:bg-rose-50/30 cursor-pointer transition-all"
              id="clear-compare-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>তালিকা মুছুন</span>
            </button>
            <button
              onClick={() => setIsOpen(true)}
              disabled={compareItems.length < 2}
              className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                compareItems.length >= 2
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-500 hover:scale-[1.02]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
              id="trigger-compare-btn"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>তুলনা করুন ({compareItems.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. ADVANCED TECHNICAL SPECIFICATION COMPARISON MODAL */}
      {isOpen && (
        <div 
          id="compare-modal-overlay"
          className="fixed inset-0 bg-slate-950/75 flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in backdrop-blur-xs select-none"
        >
          <div 
            id="compare-modal"
            className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden animate-scale-up"
          >
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl shadow-xs">
                  <ArrowLeftRight className="w-5 h-5 font-black" />
                </div>
                <div>
                  <h3 className="font-sans text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                    <span>প্রোডাক্ট টেকনিক্যাল কম্প্যারেটর স্পেসিফিকেশন শিট</span>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full leading-none">
                      {compareItems.length} টি আইটেম
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-medium font-sans">
                    যেকোনো একটি প্রোডাক্টকে বেঞ্চমার্ক হিসাবে পিন করে বাকিগুলোর পার্থক্য এবং মূল্য সাশ্রয় যাচাই করুন।
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-slate-800/80 hover:bg-rose-600 hover:text-white text-slate-300 p-2 rounded-full cursor-pointer transition-colors"
                title="প্যানেল বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
              
              {/* Dynamic Advisory / Decision Engine Recommendations Bar */}
              {advice && (
                <div 
                  id="compare-advisory"
                  className="bg-white rounded-xl p-4 border border-amber-200/70 shadow-sm space-y-3"
                >
                  <div className="flex items-center space-x-2 text-amber-700 font-extrabold text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                    <span>স্মার্ট ডিশিশন অ্যাসিস্ট্যান্ট (Decision Advisor Engine)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Budget Choice card */}
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3 text-left">
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        💰 বেস্ট বাজেট চয়েস (Best Price)
                      </span>
                      <h5 className="text-[11.5px] font-extrabold text-slate-850 truncate mt-2">
                        {advice.cheapest.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1">
                        এটি আপনার তালিকার সর্বনিম্ন মূল্যের প্রোডাক্ট, কার্যকর মূল্য মাত্র <span className="font-bold text-emerald-600">Tk {advice.cheapest.discountedPrice.toLocaleString('bn-BD')}</span>
                      </p>
                    </div>

                    {/* Quality Choice card */}
                    <div className="bg-sky-50/40 border border-sky-100 rounded-lg p-3 text-left">
                      <span className="bg-sky-100 text-sky-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ⭐ টপ কোয়ালিটি ও রেটিং (Premium Choice)
                      </span>
                      <h5 className="text-[11.5px] font-extrabold text-slate-850 truncate mt-2">
                        {advice.topRated.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1">
                        গ্রাহকদের সর্বোচ্চ রেটিং প্রাপ্ত প্রোডাক্ট, রেটিং হচ্ছে <span className="font-bold text-sky-600">{advice.topRated.rating} / ৫.০</span> (মোট {advice.topRated.totalRatings} টি রিভিউ)
                      </p>
                    </div>

                    {/* Offer Discount card */}
                    <div className="bg-rose-50/40 border border-rose-100 rounded-lg p-3 text-left">
                      <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        🔥 সেরা অফার ডিল (Best Discount)
                      </span>
                      <h5 className="text-[11.5px] font-extrabold text-slate-850 truncate mt-2">
                        {advice.bestDeal.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-1">
                        ডিসকাউন্ট পার্সেন্টেজে সেরা অফার, সরাসরি পাচ্ছেন <span className="font-bold text-rose-600">{advice.bestDeal.discountPercent}% ফ্ল্যাট ছাড়</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Panel Filter bar */}
              <div 
                id="compare-control-panel"
                className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3"
              >
                {/* Search specifications input */}
                <div className="relative w-full lg:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="বৈশিষ্ট্য খুঁজুন (যেমন: ওয়ারেন্টি)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-sky-500 focus:bg-white text-xs pl-9 pr-4 py-2 rounded-xl outline-hidden font-sans text-slate-700 transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                    >
                      ক্লিয়ার
                    </button>
                  )}
                </div>

                {/* Spec categories tabs bar */}
                <div className="flex flex-wrap gap-1 items-center overflow-x-auto py-0.5 scrollbar-none">
                  {[
                    { id: 'all', label: 'সব বৈশিষ্ট্য' },
                    { id: 'basic', label: 'মৌলিক তথ্য' },
                    { id: 'tech', label: 'কারিগরি বৈশিষ্ট্য' },
                    { id: 'warranty', label: 'ওয়ারেন্টি ও পলিসি' },
                    { id: 'additional', label: 'অন্যান্য তথ্য' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
                        activeCategory === tab.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Difference Toggles panel */}
                <div className="flex items-center space-x-4 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-2 lg:pt-0 lg:pl-4">
                  
                  {/* Highlight different rows switch */}
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={highlightDiffs}
                      onChange={(e) => setHighlightDiffs(e.target.checked)}
                      className="w-3.5 h-3.5 text-sky-500 focus:ring-sky-400 border-slate-300 rounded-sm cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-slate-600 font-sans">
                      অমিল হাইলাইট করুন
                    </span>
                  </label>

                  {/* Show only different rows switch */}
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showOnlyDiffs}
                      onChange={(e) => setShowOnlyDiffs(e.target.checked)}
                      className="w-3.5 h-3.5 text-sky-500 focus:ring-sky-400 border-slate-300 rounded-sm cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-slate-600 font-sans">
                      শুধুমাত্র ভিন্ন বৈশিষ্ট্যগুলো দেখান
                    </span>
                  </label>
                </div>
              </div>

              {/* Core Side-by-Side Comparison Grid Table */}
              <div 
                id="compare-table-wrapper"
                className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm"
              >
                <table className="w-full border-collapse text-left min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200/80">
                      
                      {/* Top-Left Corner: baseline reset indicator */}
                      <th className="p-4 text-[11.5px] font-extrabold text-slate-600 w-1/5 min-w-[160px] bg-slate-100 sticky left-0 z-20 font-sans border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5 text-slate-500" />
                            <span>বৈশিষ্ট্যসমূহ</span>
                          </div>
                          {pinnedItemId && (
                            <button
                              onClick={() => setPinnedItemId(null)}
                              className="text-[9.5px] font-black text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer underline decoration-dotted mt-1"
                              title="বেঞ্চমার্ক পিন আউট করুন"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              <span>পিন রিসেট করুন</span>
                            </button>
                          )}
                        </div>
                      </th>

                      {/* Interactive Product Header Columns */}
                      {compareItems.map((item) => {
                        const isPinned = item.id === pinnedItemId;
                        return (
                          <th 
                            key={item.id} 
                            className={`p-4 text-xs font-black text-slate-800 relative w-1/4 min-w-[190px] border-l border-slate-200/80 group transition-all ${
                              isPinned ? 'bg-amber-50/40 ring-2 ring-inset ring-amber-400/55' : ''
                            }`}
                          >
                            {/* Header action controls panel */}
                            <div className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1">
                              
                              {/* Pin baseline comparator selector */}
                              <button
                                onClick={() => setPinnedItemId(isPinned ? null : item.id)}
                                className={`p-1 rounded-md transition-all cursor-pointer ${
                                  isPinned 
                                    ? 'bg-amber-400 text-slate-950 shadow-2xs' 
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                                }`}
                                title={isPinned ? "পিন সরিয়ে নিন" : "এটি বেঞ্চমার্ক হিসাবে পিন করুন"}
                              >
                                <Pin className={`w-3 h-3 ${isPinned ? 'fill-current rotate-45' : ''}`} />
                              </button>

                              {/* Remove individual item button */}
                              <button
                                onClick={() => {
                                  onRemoveFromCompare(item);
                                  if (compareItems.length <= 2) {
                                    setIsOpen(false);
                                  }
                                  if (isPinned) setPinnedItemId(null);
                                }}
                                className="bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                                title="তুলনা তালিকা থেকে বাদ দিন"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Pinned Benchmark Badge Indicator */}
                            {isPinned && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-amber-400 text-slate-950 font-black text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-2xs font-sans">
                                  Benchmark Pinned
                                </span>
                              </div>
                            )}

                            {/* Product Header Title & image block layout */}
                            <div className="flex flex-col items-center text-center space-y-2 mt-4">
                              <div className="w-16 h-20 bg-slate-50/80 rounded-lg p-1.5 border border-slate-200/60 flex items-center justify-center relative overflow-hidden shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
                                <img 
                                  src={getProductImageUrl(item)} 
                                  alt={item.title} 
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight line-clamp-2 h-8 font-sans max-w-[170px]" title={item.title}>
                                {item.title}
                              </h4>
                              <span className="inline-block text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                {item.authorOrBrand || 'Generic Brand'}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-200/80 font-sans text-xs">
                    
                    {/* STATIC ROW 1: Real Effective Price (Tk) with baseline saver variance */}
                    <tr className={`hover:bg-slate-50/50 transition-colors ${highlightDiffs && hasSpecDifferences(p => p.discountedPrice.toString()) ? 'bg-amber-50/15' : ''}`}>
                      <td className="p-4 font-bold text-slate-700 bg-slate-100/45 sticky left-0 z-10 border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                        <div className="flex items-center justify-between">
                          <span>কার্যকরী মূল্য (Price)</span>
                          {highlightDiffs && hasSpecDifferences(p => p.discountedPrice.toString()) && (
                            <span className="text-[8px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded-sm">ভিন্নতা</span>
                          )}
                        </div>
                      </td>
                      {compareItems.map((item) => {
                        const isPinned = item.id === pinnedItemId;
                        let priceVarianceText = null;
                        let priceVarianceColor = "";

                        // Pricing benchmark logic calculation
                        if (pinnedItemId && pinnedItem && !isPinned) {
                          const diff = item.discountedPrice - pinnedItem.discountedPrice;
                          if (diff > 0) {
                            priceVarianceText = `+Tk ${diff.toLocaleString('bn-BD')} বেশি`;
                            priceVarianceColor = "text-rose-600 bg-rose-50 border border-rose-100";
                          } else if (diff < 0) {
                            priceVarianceText = `-Tk ${Math.abs(diff).toLocaleString('bn-BD')} সাশ্রয়`;
                            priceVarianceColor = "text-emerald-600 bg-emerald-50 border border-emerald-100";
                          } else {
                            priceVarianceText = "সমান মূল্য";
                            priceVarianceColor = "text-slate-500 bg-slate-100";
                          }
                        }

                        return (
                          <td 
                            key={item.id} 
                            className={`p-4 border-l border-slate-200/80 font-sans leading-relaxed ${
                              isPinned ? 'bg-amber-50/15' : ''
                            }`}
                          >
                            <div className="flex items-baseline space-x-1.5 flex-wrap">
                              <span className="text-[13.5px] font-black text-sky-600 font-mono">
                                Tk {item.discountedPrice.toLocaleString('bn-BD')}
                              </span>
                              {item.discountPercent > 0 && (
                                <span className="text-slate-400 line-through text-[10.5px] font-mono">
                                  Tk {item.originalPrice.toLocaleString('bn-BD')}
                                </span>
                              )}
                            </div>
                            
                            {/* Saved tags */}
                            {item.discountPercent > 0 && (
                              <div className="mt-1 flex items-center space-x-1">
                                <span className="inline-block text-[8.5px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-sm px-1.5 py-0.5">
                                  {item.discountPercent}% ছাড় (Tk {Math.round(item.originalPrice - item.discountedPrice)} সেভ)
                                </span>
                              </div>
                            )}

                            {/* Benchmark Price Saving Badge */}
                            {priceVarianceText && (
                              <div className="mt-2">
                                <span className={`inline-flex items-center gap-0.5 text-[9px] font-extrabold px-2 py-0.5 rounded-sm ${priceVarianceColor}`}>
                                  {priceVarianceText}
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* STATIC ROW 2: Customer Rating with baseline rating variance */}
                    <tr className={`hover:bg-slate-50/50 transition-colors ${highlightDiffs && hasSpecDifferences(p => p.rating.toString()) ? 'bg-amber-50/15' : ''}`}>
                      <td className="p-4 font-bold text-slate-700 bg-slate-100/45 sticky left-0 z-10 border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                        <div className="flex items-center justify-between">
                          <span>গ্রাহক রেটিং ও রিভিউ</span>
                          {highlightDiffs && hasSpecDifferences(p => p.rating.toString()) && (
                            <span className="text-[8px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded-sm">ভিন্নতা</span>
                          )}
                        </div>
                      </td>
                      {compareItems.map((item) => {
                        const isPinned = item.id === pinnedItemId;
                        let ratingVarianceText = null;
                        let ratingVarianceColor = "";

                        // Ratings variance benchmark calc
                        if (pinnedItemId && pinnedItem && !isPinned) {
                          const diff = item.rating - pinnedItem.rating;
                          if (diff > 0) {
                            ratingVarianceText = `+${diff.toFixed(1)} বেশি`;
                            ratingVarianceColor = "text-emerald-600";
                          } else if (diff < 0) {
                            ratingVarianceText = `${diff.toFixed(1)} কম`;
                            ratingVarianceColor = "text-rose-600";
                          } else {
                            ratingVarianceText = "সমান রেটিং";
                            ratingVarianceColor = "text-slate-400";
                          }
                        }

                        return (
                          <td 
                            key={item.id} 
                            className={`p-4 border-l border-slate-200/80 ${
                              isPinned ? 'bg-amber-50/15' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-1.5">
                              <div className="flex items-center space-x-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < Math.floor(item.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 font-mono">({item.rating})</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">মোট {item.totalRatings || 42} টি কাস্টমার রিভিউ</p>

                            {/* Benchmark Rating Variance Badge */}
                            {ratingVarianceText && (
                              <p className="text-[9.5px] mt-1.5 font-bold flex items-center gap-1">
                                <span className="text-slate-400 font-medium">বেঞ্চমার্ক তফাত:</span>
                                <span className={ratingVarianceColor}>{ratingVarianceText}</span>
                              </p>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* STATIC ROW 3: In Stock Availability Status */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-700 bg-slate-100/45 sticky left-0 z-10 border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                        উপলব্ধতা (Availability)
                      </td>
                      {compareItems.map((item) => {
                        const isPinned = item.id === pinnedItemId;
                        return (
                          <td 
                            key={item.id} 
                            className={`p-4 border-l border-slate-200/80 ${
                              isPinned ? 'bg-amber-50/15' : ''
                            }`}
                          >
                            {item.inStock ? (
                              <div className="inline-flex items-center space-x-1 text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-100 rounded px-2.5 py-0.5 text-[10.5px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>স্টকে আছে (In Stock)</span>
                              </div>
                            ) : (
                              <span className="inline-block text-rose-500 bg-rose-50 border border-rose-100 rounded px-2.5 py-0.5 font-bold text-[10.5px]">
                                স্টক শেষ (Stock Out)
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* DYNAMIC ROWS: Mapped and grouped dynamically with filter categories */}
                    {filteredSpecGroups.map((group) => (
                      <tbody key={group.id} className="divide-y divide-slate-150">
                        {/* Group Header Row */}
                        <tr className="bg-slate-50/70 border-y border-slate-200/60">
                          <td 
                            colSpan={compareItems.length + 1}
                            className="p-3 text-[10.5px] font-black tracking-wider text-slate-500 bg-slate-50/70 uppercase pl-4 font-sans text-left"
                          >
                            {group.labelBn}
                          </td>
                        </tr>

                        {/* Group Specifications Rows */}
                        {group.specs.map((spec) => {
                          const isDifferent = hasSpecDifferences(spec.getValue);
                          return (
                            <tr 
                              key={spec.key} 
                              className={`hover:bg-slate-50/30 transition-colors ${
                                highlightDiffs && isDifferent ? 'bg-amber-50/20' : ''
                              }`}
                            >
                              {/* Spec Row Key Column */}
                              <td className="p-4 font-bold text-slate-600 bg-slate-100/35 sticky left-0 z-10 border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.01)] text-left">
                                <div className="flex items-center justify-between gap-2">
                                  <span>{spec.labelBn}</span>
                                  {highlightDiffs && isDifferent && (
                                    <span className="text-[8px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded-sm shrink-0">ভিন্নতা</span>
                                  )}
                                </div>
                              </td>

                              {/* Spec Values for each Product columns */}
                              {compareItems.map((item) => {
                                const isPinned = item.id === pinnedItemId;
                                const specValue = spec.getValue(item);
                                return (
                                  <td 
                                    key={item.id} 
                                    className={`p-4 border-l border-slate-200/80 text-slate-800 font-medium ${
                                      isPinned ? 'bg-amber-50/15' : ''
                                    }`}
                                  >
                                    {specValue === 'N/A' ? (
                                      <span className="text-slate-300 italic">N/A</span>
                                    ) : (
                                      <span className={highlightDiffs && isDifferent ? 'text-slate-900 font-semibold' : 'text-slate-700'}>
                                        {specValue}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    ))}

                    {/* STATIC ROW 4: Action CTR Add to Cart Button Block */}
                    <tr className="bg-slate-50/30">
                      <td className="p-4 font-bold text-slate-700 bg-slate-100/40 sticky left-0 z-10 border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.01)] text-left">
                        কার্ট অ্যাকশন (Buy Options)
                      </td>
                      {compareItems.map((item) => {
                        const isPinned = item.id === pinnedItemId;
                        return (
                          <td 
                            key={item.id} 
                            className={`p-4 border-l border-slate-200/80 text-center ${
                              isPinned ? 'bg-amber-50/15' : ''
                            }`}
                          >
                            <button
                              disabled={!item.inStock}
                              onClick={() => {
                                onAddToCart(item);
                                setIsOpen(false);
                              }}
                              className={`w-full py-2.5 px-3 rounded-xl text-xs font-black shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                                item.inStock
                                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-[0.98]'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              }`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>কার্টে যোগ করুন</span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* No rows fallback alert */}
              {filteredSpecGroups.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-extrabold font-sans">কোনো বৈশিষ্ট্যের মিল পাওয়া যায়নি!</p>
                  <p className="text-[10px] font-medium font-sans">অনুগ্রহ করে সার্চ বা ট্যাব ক্যাটাগরি ফিল্টার পরিবর্তন করুন।</p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-4.5 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[10.5px] font-medium">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>টপসেল টেকনিক্যাল কমপ্যারেটর সিস্টেম © ২০২৬</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 bg-white rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                প্যানেল বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
