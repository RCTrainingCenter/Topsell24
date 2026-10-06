import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, ShoppingCart, CheckCircle2, Heart, Share2, 
  ChevronLeft, ChevronRight, AlertCircle, ThumbsUp, ThumbsDown, 
  RotateCcw, Info, Check, ShieldCheck, HelpCircle, RefreshCcw,
  BookOpen, Eye, Send, Video, Play, Image as ImageIcon, Link2, Copy
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { getBookCoverUrl, getProductImageUrl } from '../lib/bookUtils';
import { getProductShareUrl } from '../utils/navigationHelper';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

interface ProductSinglePageViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  productsList: Product[];
  onSelectProduct: (p: Product) => void;
  onPreview?: (p: Product) => void;
  onViewAuthor?: (authorName: string) => void;
  loggedInUser?: { name: string; emailOrPhone: string; isAdmin: boolean; photoURL?: string; uid?: string } | null;
}

export default function ProductSinglePageView({
  product,
  onClose,
  onAddToCart,
  productsList = [],
  onSelectProduct,
  onPreview,
  onViewAuthor,
  loggedInUser = null,
}: ProductSinglePageViewProps) {
  const [activeReviewTab, setActiveReviewTab] = useState<'all' | 'verified'>('all');
  
  // Real-time reviews from Firestore
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  
  // Form states
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRatingInput, setReviewRatingInput] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fallback fallback states for backwards compatibility with any code that references them
  const [userRating, setUserRating] = useState<number>(0);
  const [wroteReview, setWroteReview] = useState<boolean>(false);
  const [helpfulCount, setHelpfulCount] = useState<number>(0);
  const [notHelpfulCount, setNotHelpfulCount] = useState<number>(0);
  const [isHelpfulClicked, setIsHelpfulClicked] = useState<boolean>(false);
  const [isNotHelpfulClicked, setIsNotHelpfulClicked] = useState<boolean>(false);

  // Active Media Gallery state (for up to 5 images and short video)
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
  const [selectedSize, setSelectedSize] = useState<string>(product?.availableSizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.availableColors?.[0] || '');
  const [copiedProductLink, setCopiedProductLink] = useState<boolean>(false);

  const handleCopyProductLink = () => {
    const shareUrl = getProductShareUrl(currentProduct.id);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedProductLink(true);
    setTimeout(() => setCopiedProductLink(false), 2500);
  };

  useEffect(() => {
    setActiveMediaIndex(0);
    setActiveMediaType('image');
    setSelectedSize(product?.availableSizes?.[0] || '');
    setSelectedColor(product?.availableColors?.[0] || '');
  }, [product?.id]);

  // If no product is loaded, let's build the fallback to Vision Blender as requested
  const currentProduct = product || {
    id: 'vision-blender-373560',
    type: 'electronic' as const,
    title: 'VISION Blender RE-VIS-GEL-011(Crushers)-Pro - 373560',
    authorOrBrand: 'Vision',
    originalPrice: 4775,
    discountedPrice: 4279,
    discountPercent: 15,
    rating: 5.0,
    totalRatings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    category: 'Blenders',
  };

  // Safe checks for values or backup defaults matching screenshot
  const discountPercent = currentProduct.discountPercent || 15;
  const savingAmount = Math.max(0, currentProduct.originalPrice - currentProduct.discountedPrice) || 770;
  const originalPrice = currentProduct.originalPrice || 4775;
  const discountedPrice = currentProduct.discountedPrice || 4279;

  // Compute up to 5 images list
  const productImages: string[] = (
    currentProduct.images && currentProduct.images.length > 0 
      ? currentProduct.images 
      : (currentProduct.imageUrl ? [currentProduct.imageUrl] : [])
  ).filter(Boolean);

  const activeImageUrl = productImages[activeMediaIndex] || productImages[0] || currentProduct.imageUrl;

  // Render a beautiful interactive mockup cover or product graphic representing the item
  const renderProductGraphic = (targetImgUrl?: string) => {
    const selectedUrl = targetImgUrl || activeImageUrl || currentProduct.imageUrl;

    // Custom or uploaded image takes top priority
    if (selectedUrl && (
      selectedUrl.startsWith('data:') || 
      selectedUrl.startsWith('http://') || 
      selectedUrl.startsWith('https://') || 
      selectedUrl.startsWith('/src/image/')
    )) {
      return (
        <img 
          src={selectedUrl} 
          alt={currentProduct.title} 
          referrerPolicy="no-referrer" 
          className="w-full h-full object-contain rounded p-2" 
        />
      );
    }

    if (currentProduct.type === 'book') {
      const coverUrl = getBookCoverUrl(selectedUrl);
      return (
        <div className="absolute inset-0 bg-white flex shadow-inner rounded-r overflow-hidden border border-gray-150 select-none">
          {/* Simulated 3D Book spine shadow on the left */}
          <div className="w-4 h-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-r border-slate-300 flex-shrink-0 z-10 shadow-lg"></div>
          {/* Cover image area */}
          <div className="flex-1 relative bg-slate-50 flex items-center justify-center h-full">
            {coverUrl && (
              <img 
                src={coverUrl} 
                alt={currentProduct.title} 
                referrerPolicy="no-referrer" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {/* Elegant overlay gradient to make text legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-1"></div>
            
            {/* Cover visual representation text */}
            <div className="absolute inset-0 p-3.5 flex flex-col justify-between z-10 text-white">
              <span className="text-[8px] font-mono font-bold text-sky-300 tracking-wider">KENAKATA ORIGINAL</span>
              <div className="my-auto space-y-1">
                <h4 className="text-[13px] font-black leading-tight drop-shadow-md text-slate-50">{currentProduct.title}</h4>
                <p className="text-[9px] text-slate-200 font-semibold truncate">{currentProduct.authorOrBrand}</p>
              </div>
              <div className="bg-amber-400 text-slate-900 text-[8.5px] py-0.5 text-center font-extrabold rounded-sm w-fit px-2 self-center uppercase font-mono shadow-xs">
                একটু পড়ে দেখুন
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If the product has a custom/user-uploaded image or any web URL image, prioritize rendering it over the hardcoded mockup
    if (currentProduct.imageUrl && (currentProduct.imageUrl.startsWith('data:') || currentProduct.imageUrl.startsWith('http://') || currentProduct.imageUrl.startsWith('https://'))) {
      return (
        <img 
          src={currentProduct.imageUrl} 
          alt={currentProduct.title} 
          referrerPolicy="no-referrer" 
          className="w-full h-full object-contain rounded p-2" 
        />
      );
    }

    switch (currentProduct.id) {
      // Books
      case 'b1': // Master Your Emotions
        return (
          <div className="absolute inset-0 bg-white flex flex-col justify-between p-3 border border-gray-100 shadow-inner rounded overflow-hidden">
            <div className="text-[10px] font-mono font-bold text-sky-600 tracking-wider">shortBook★</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
              <div className="w-12 h-12 rounded-full border border-sky-200 bg-sky-50 flex items-center justify-center relative">
                <div className="absolute w-8 h-8 rounded-full bg-amber-200 opacity-60 mix-blend-multiply"></div>
                <div className="absolute w-8 h-8 rounded-full bg-blue-200 translate-x-2 -translate-y-2 opacity-60 mix-blend-multiply"></div>
                <div className="absolute w-8 h-8 rounded-full bg-rose-200 -translate-x-1 translate-y-2 opacity-60 mix-blend-multiply"></div>
              </div>
              <div className="text-[11px] font-black uppercase text-slate-800 tracking-tighter leading-none mt-1">MASTER</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase leading-none">YOUR EMOTIONS</div>
            </div>
            <div className="bg-green-600 text-white text-[9px] py-0.5 text-center font-bold tracking-tight rounded-sm transform rotate-[-4deg] translate-y-1">
              একটু পড়ে দেখুন
            </div>
          </div>
        );
      case 'b2': // La Tahzan (Don't be sad)
        return (
          <div className="absolute inset-0 bg-emerald-800 flex flex-col justify-between p-3 border border-emerald-950 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[9px] text-emerald-300 font-bold">ইসলামি সংস্কৃতি</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1.5">
              <div className="w-10 h-10 border border-amber-300 rounded-t-full flex items-center justify-center bg-emerald-900/60 p-1">
                <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-[12px] font-bold text-amber-200 leading-snug">লা-তাহযান</div>
              <div className="text-[8px] text-emerald-100">হতাশ হবেন না</div>
            </div>
            <div className="bg-amber-400 text-emerald-950 text-[9px] py-0.5 text-center font-bold rounded-sm">
              একটু পড়ে দেখুন
            </div>
          </div>
        );
      case 'b3': // Biday Pushpe Proloy
        return (
          <div className="absolute inset-0 bg-slate-100 flex flex-col justify-between p-3 border border-slate-300 shadow-inner rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0"></div>
            <div className="absolute inset-0 flex items-center justify-center z-1">
              <svg className="w-16 h-16 text-slate-300 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <div className="relative z-10 text-[9px] text-slate-200">উপন্যাস</div>
            <div className="relative z-10 text-center my-auto space-y-1">
              <div className="text-[12px] font-black text-white leading-tight">বিদায় পুষ্পে প্রলয়</div>
              <div className="text-[8px] text-slate-300">সৈকত আমীন</div>
            </div>
            <div className="relative z-10 bg-rose-600 text-white text-[9px] py-0.5 text-center font-bold rounded-sm">
              একটু পড়ে দেখুন
            </div>
          </div>
        );
      case 'b4': // Water Resource Utilization and Micro-Irrigation
        return (
          <div className="absolute inset-0 bg-sky-900 flex flex-col justify-between p-3 border border-sky-950 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[9px] text-sky-200">TECHNICAL SERIES</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
              <div className="w-12 h-8 rounded bg-sky-800 border border-sky-400/40 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-4 bg-emerald-500 opacity-60"></div>
                <div className="w-1 h-8 bg-amber-300 transform rotate-12"></div>
                <div className="w-1 h-8 bg-amber-300 transform -rotate-12 translate-x-2"></div>
              </div>
              <div className="text-[10px] font-bold text-white uppercase leading-none mt-1">WATER RESOURCE</div>
              <div className="text-[7.5px] text-sky-300 uppercase leading-none font-mono">UTILIZATION & IRRIGATION</div>
            </div>
            <div className="bg-sky-500 text-white text-[9px] py-0.5 text-center font-bold rounded-sm">
              TECHNICAL BOOK
            </div>
          </div>
        );
      case 'b5': // The Highlander
        return (
          <div className="absolute inset-0 bg-amber-900/90 flex flex-col justify-between p-3 border border-amber-950 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[9px] text-amber-200">অনুবাদ উপন্যাস</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1.5">
              <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <div className="text-[12px] font-black leading-snug text-amber-100">দ্যা হাইল্যান্ডার</div>
            </div>
            <div className="bg-teal-600 text-white text-[9px] py-0.5 text-center font-bold rounded-sm">
              একটু পড়ে দেখুন
            </div>
          </div>
        );
      case 'b6': // Atomic Habits (Ebook)
        return (
          <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-3 border border-slate-950 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[9px] text-amber-400 font-bold">★ shortBook ★</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center animate-spin-slow">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              </div>
              <div className="text-[11px] font-extrabold text-white leading-tight uppercase">Atomic Habits</div>
            </div>
            <div className="bg-emerald-600 text-white text-[9px] py-0.5 text-center font-bold rounded-sm">
              পড়ে দেখুন
            </div>
          </div>
        );
      case 'b7': // Easy English Grammar
        return (
          <div className="absolute inset-0 bg-blue-50 flex flex-col justify-between p-3 border border-blue-200 shadow-inner rounded overflow-hidden">
            <div className="text-[9px] text-blue-600 font-bold">ENGLISH SECRETS</div>
            <div className="flex flex-col items-center justify-center my-auto text-center">
              <div className="text-blue-900 font-black text-xl leading-none">Aa</div>
              <div className="text-[10px] font-mono text-slate-700 mt-1 uppercase font-bold text-center">English Grammar</div>
            </div>
            <div className="bg-blue-600 text-white text-[9px] py-0.5 text-center font-bold rounded-sm">
              পড়ে দেখুন
            </div>
          </div>
        );
      case 'b8': // Career Bhabna
        return (
          <div className="absolute inset-0 bg-indigo-900 flex flex-col justify-between p-3 border border-indigo-950 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[8px] text-indigo-200">সাফল্যের চাবিকাঠি</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-[12px] font-bold text-indigo-50 leading-tight">ক্যারিয়ার ভাবনা</div>
            </div>
            <div className="bg-amber-500 text-indigo-950 text-[9px] py-0.5 text-center font-bold rounded-sm">
              পড়ে দেখুন
            </div>
          </div>
        );
      case 'b9': // You Last To Business
        return (
          <div className="absolute inset-0 bg-neutral-900 flex flex-col justify-between p-3 border border-neutral-800 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[9px] text-amber-500 font-bold">BUSINESS FIRST</div>
            <div className="flex flex-col items-center justify-center my-auto text-center">
              <div className="text-xl font-black text-amber-400">$</div>
              <div className="text-[10px] text-slate-300 font-bold leading-tight mt-1">ইউ লাস্ট টু বিজনেস</div>
            </div>
            <div className="bg-amber-400 text-black text-[9px] py-0.5 text-center font-bold rounded-sm">
              পড়ে দেখুন
            </div>
          </div>
        );
      case 'b10': // Research 101
        return (
          <div className="absolute inset-0 bg-cyan-900 flex flex-col justify-between p-3 border border-cyan-950 shadow-inner rounded text-white overflow-hidden">
            <div className="text-[8px] text-cyan-200 tracking-wider font-mono">ACADEMIC GUIDE</div>
            <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
              <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="text-[12px] font-bold text-white tracking-tight">গবেষণা ১০১</div>
            </div>
            <div className="bg-cyan-500 text-white text-[9px] py-0.5 text-center font-bold rounded-sm">
              পড়ে দেখুন
            </div>
          </div>
        );

      // Electronics
      case 'vision-blender-373560':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 relative bg-white">
            <div className="relative w-48 h-56 flex flex-col items-center">
              <div className="w-20 h-28 bg-sky-100/60 rounded-t-lg border-2 border-slate-350 flex flex-col justify-between p-2 shadow-inner relative">
                <div className="absolute right-2 top-4 space-y-1">
                  <div className="w-2.5 h-0.5 bg-slate-400"></div>
                  <div className="w-4 h-0.5 bg-slate-400"></div>
                  <div className="w-2.5 h-0.5 bg-slate-400"></div>
                  <div className="w-4 h-0.5 bg-slate-400"></div>
                </div>
                <div className="text-[6px] font-mono text-slate-400 font-bold self-start mt-2">1200 ML</div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-t-md shadow border-b border-slate-900 flex items-center justify-center">
                  <div className="w-6 h-2 bg-red-600 rounded-full"></div>
                </div>
                <div className="absolute left-[-16px] top-6 w-5 h-16 border-4 border-red-600 rounded-l-xl bg-transparent"></div>
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-slate-200/50 absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-5 h-1 bg-slate-600 rotate-45 transform origin-center"></div>
                  <div className="w-5 h-1 bg-slate-600 -rotate-45 transform origin-center"></div>
                </div>
              </div>
              <div className="w-16 h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 border-x border-slate-350 z-10 shadow-xs"></div>
              <div className="w-28 h-24 bg-red-600 rounded-b-2xl border-x border-b-2 border-red-700 relative flex flex-col items-center pt-2 shadow-md">
                <div className="w-18 h-10 bg-slate-100 border border-slate-300 rounded-lg shadow-inner flex items-center justify-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 text-[6px] font-black flex items-center justify-center">১</div>
                  <div className="w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[7px] font-bold flex items-center justify-center cursor-pointer shadow-xs border border-red-700">৩</div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 text-[6px] font-black flex items-center justify-center">২</div>
                </div>
                <div className="absolute bottom-[-4px] left-4 w-4 h-1.5 bg-slate-900 rounded-t"></div>
                <div className="absolute bottom-[-4px] right-4 w-4 h-1.5 bg-slate-900 rounded-t"></div>
                <div className="text-[10px] font-black tracking-widest text-white mt-1 uppercase font-sans">VISION</div>
              </div>
              <div className="absolute bottom-0 right-[-32px] w-14 h-16 bg-gradient-to-b from-slate-100 to-slate-250 border border-slate-400 rounded-b-lg flex flex-col justify-between p-1.5 shadow-xs">
                <div className="w-full h-1 bg-slate-800 rounded-t-sm"></div>
                <div className="w-3 h-8 border-2 border-red-600 rounded-r-lg absolute right-[-4px] top-4 bg-transparent"></div>
                <span className="text-[7px] text-center font-bold text-slate-500 tracking-tight block">0.5 L</span>
              </div>
              <div className="absolute bottom-0 left-[-32px] w-14 h-16 bg-gradient-to-b from-slate-150 to-slate-300 border border-slate-450 rounded-b-lg flex flex-col justify-between p-1.5 shadow-xs">
                <div className="w-full h-1 bg-slate-800 rounded-t-sm"></div>
                <div className="w-3 h-8 border-2 border-red-600 rounded-l-lg absolute left-[-4px] top-4 bg-transparent"></div>
                <span className="text-[7px] text-center font-bold text-slate-505 tracking-tight block">0.8 L</span>
              </div>
            </div>
          </div>
        );
      case 'e1': // Orico Enclosure
        return (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-3 border border-slate-200 shadow-inner rounded overflow-hidden">
            <div className="w-32 h-16 border border-slate-300 bg-white rounded-md flex flex-col justify-between p-2 shadow-sm relative">
              <div className="absolute inset-x-0 top-3 h-0.5 bg-slate-100"></div>
              <div className="absolute inset-x-0 top-6 h-0.5 bg-slate-100"></div>
              <div className="absolute inset-x-0 top-9 h-0.5 bg-slate-100"></div>
              <div className="flex justify-between items-center">
                <div className="text-[8px] text-slate-400 font-bold">ORICO</div>
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></div>
              </div>
              <div className="text-[9px] text-sky-600 font-black self-end">TYPE C 3.1</div>
            </div>
          </div>
        );
      case 'e2': // Sanford Torch
        return (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-3 border border-zinc-950 shadow-inner rounded overflow-hidden">
            <div className="w-12 h-32 bg-stone-800 rounded-b border border-stone-700 flex flex-col items-center relative shadow-md">
              <div className="w-16 h-10 bg-stone-700 rounded-t border-b border-stone-600 flex items-center justify-center relative shadow-sm">
                <div className="w-12 h-6 rounded-full bg-yellow-300 opacity-80 blur-[2px]"></div>
              </div>
              <div className="w-3 h-1.5 bg-amber-500 rounded my-3"></div>
              <div className="w-10 h-12 bg-black/40 rounded flex flex-col justify-around p-1 mt-2">
                <div className="w-full h-1.5 bg-amber-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      case 'e3': // UGreen Cable
        return (
          <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center p-3 border border-neutral-200 shadow-inner rounded overflow-hidden">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-3">
                <div className="w-6 h-8 bg-neutral-800 rounded-t flex flex-col justify-between p-1 border-b border-amber-400">
                  <div className="w-4 h-1 bg-amber-300 rounded-sm"></div>
                </div>
                <div className="w-6 h-8 bg-neutral-800 rounded-t flex flex-col justify-between p-1 border-b border-amber-400">
                  <div className="w-4 h-1 bg-amber-300 rounded-sm"></div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center animate-spin-slow">
                <div className="w-8 h-8 rounded-full border border-slate-300"></div>
              </div>
              <div className="text-[10px] text-amber-500 font-bold tracking-tight">UGREEN 5m</div>
            </div>
          </div>
        );
      case 'e4': // Geeoo Headphones
        return (
          <div className="absolute inset-0 bg-neutral-50 flex flex-col items-center justify-center p-3 border border-neutral-200 shadow-inner rounded overflow-hidden">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center relative">
              <div className="absolute top-3 w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
              </div>
              <div className="absolute left-3 top-12 w-3 h-6 bg-zinc-700 rounded"></div>
              <div className="absolute right-3 top-12 w-3 h-6 bg-zinc-700 rounded"></div>
            </div>
          </div>
        );
      case 'e5': // Brushless cooling fan
        return (
          <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-3 border border-gray-200 shadow-inner rounded overflow-hidden">
            <div className="w-24 h-24 border-2 border-zinc-400 bg-zinc-800 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-1.5 border border-zinc-700 rounded-full flex items-center justify-center">
                <div className="w-20 h-2 bg-zinc-500 transform rotate-12 origin-center animate-spin-fast rounded-sm"></div>
                <div className="w-20 h-2 bg-zinc-500 transform -rotate-12 origin-center animate-spin-fast rounded-sm"></div>
              </div>
              <div className="absolute w-6 h-6 rounded-full bg-zinc-900 border border-zinc-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'e6': // Defender rechargeable fan
        return (
          <div className="absolute inset-0 bg-zinc-100 flex flex-col items-center justify-center p-3 border border-zinc-200 shadow-inner rounded overflow-hidden">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-24 h-24 rounded-full border-2 border-neutral-400 bg-white flex items-center justify-center">
                <div className="absolute inset-1 border border-maroon bg-rose-50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-20 bg-rose-800 rounded transform rotate-[45deg] animate-spin-slow"></div>
                  <div className="w-2 h-20 bg-rose-800 rounded transform rotate-[135deg] animate-spin-slow"></div>
                </div>
                <div className="w-6 h-6 bg-rose-900 rounded-full border border-amber-300 z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="w-16 h-8 bg-rose-900 rounded border border-rose-950 flex flex-col justify-around p-1">
                <span className="text-[7px] text-white text-center font-bold font-mono">DEFENDER</span>
              </div>
            </div>
          </div>
        );
      case 'e7': // Megastar M8
        return (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-3 border border-slate-200 shadow-inner rounded overflow-hidden">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-20 border-t-4 border-x-4 border-slate-700 rounded-t-lg bg-transparent flex justify-between items-end">
                <div className="w-6 h-10 bg-red-600 rounded-l border border-red-700 shadow-sm flex items-center justify-center">
                  <div className="w-2 h-5 bg-neutral-800 rounded-sm"></div>
                </div>
                <div className="w-6 h-10 bg-red-600 rounded-r border border-red-700 shadow-sm flex items-center justify-center">
                  <div className="w-2 h-5 bg-neutral-800 rounded-sm"></div>
                </div>
              </div>
              <div className="text-[9px] text-red-600 font-bold uppercase tracking-widest font-mono">MEGASTAR M8</div>
            </div>
          </div>
        );

      // Superstore Items
      case 's1': // Hair powder
        return (
          <div className="absolute inset-0 bg-yellow-50/40 flex flex-col items-center justify-center p-3 border border-yellow-100 shadow-inner rounded overflow-hidden">
            <div className="w-16 h-28 bg-amber-100 border-2 border-amber-300 rounded-md shadow-xs flex flex-col justify-between p-2">
              <div className="text-[9px] text-amber-800 font-black tracking-tight text-center bg-amber-200 py-1 rounded-sm">ভেষজ এগ্রো</div>
              <div className="text-[8px] font-bold text-slate-700 text-center uppercase leading-none mt-2">Kesraj Powder</div>
              <div className="text-[6px] text-amber-600 text-center font-bold">100% ORGANIC</div>
            </div>
          </div>
        );
      case 's2': // Castor oil
        return (
          <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-3 border border-slate-200 shadow-inner rounded overflow-hidden">
            <div className="w-14 h-28 bg-[#1a4422] border-2 border-amber-400 rounded flex flex-col justify-between p-2 text-white shadow relative">
              <div className="absolute inset-x-2 top-8 bottom-3 border border-dashed border-amber-300/30"></div>
              <div className="text-[8px] text-center font-bold text-amber-300 tracking-tight">COSPROF</div>
              <div className="text-[9px] font-bold text-center leading-none text-slate-100">CASTOR OIL</div>
              <div className="text-[6px] text-amber-200 text-center font-serif">HAIRGROW</div>
            </div>
          </div>
        );
      case 's3': // Knife sharpener
        return (
          <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center p-3 border border-neutral-200 shadow-inner rounded overflow-hidden">
            <div className="relative w-28 h-14 flex items-center justify-center">
              <div className="w-24 h-8 bg-red-600 rounded-full border border-red-700 flex items-center justify-around p-1">
                <div className="w-5 h-5 rounded-full bg-slate-300 border border-slate-400 flex items-center justify-center">
                  <div className="text-[10px] font-bold text-slate-800">V</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
            </div>
          </div>
        );
      case 's4': // Kitchen Knife set
        return (
          <div className="absolute inset-0 bg-cyan-50/50 flex flex-col items-center justify-center p-3 border border-cyan-100 shadow-inner rounded overflow-hidden">
            <div className="w-28 h-20 bg-amber-950 border border-amber-900 rounded p-2 flex justify-around items-center shadow-lg relative">
              <div className="absolute top-1 right-2 text-[6px] text-amber-200 font-mono">KITCHEN SET</div>
              <div className="w-3 h-14 bg-slate-100 border border-slate-300 rounded shadow-xs transform -rotate-12 flex flex-col justify-between p-0.5">
                <div className="w-2 h-4 bg-red-600 rounded-sm"></div>
              </div>
              <div className="w-3.5 h-16 bg-slate-100 border border-slate-300 rounded shadow-xs transform rotate-6 flex flex-col justify-between p-0.5">
                <div className="w-2.5 h-6 bg-orange-600 rounded-sm"></div>
              </div>
            </div>
          </div>
        );
      case 's5': // Wottagirl Spray
        return (
          <div className="absolute inset-0 bg-purple-50 flex flex-col items-center justify-center p-3 border border-purple-200 shadow-inner rounded overflow-hidden">
            <div className="w-12 h-28 bg-purple-300/40 border-2 border-purple-400 rounded-xl relative flex flex-col justify-between p-2 shadow-md">
              <div className="absolute top-0.5 inset-x-3 h-4 bg-purple-600/60 rounded-t-md"></div>
              <span className="text-[8px] text-purple-950 tracking-tighter text-center mt-4 font-extrabold uppercase leading-none">WottaGirl!</span>
              <span className="text-[6px] text-center text-purple-600 leading-none">Fresh Citrus Splash</span>
            </div>
          </div>
        );
      case 's6': // Lily Creamy Pop lipstick Mat
      case 's7':
      case 's8':
        return (
          <div className="absolute inset-0 bg-rose-50 flex flex-col items-center justify-center p-3 border border-rose-200 shadow-inner rounded overflow-hidden">
            <div className="w-10 h-24 flex flex-col justify-end items-center relative">
              <div className="w-6 h-14 bg-black rounded-b border border-zinc-900 flex flex-col justify-around p-1 shadow-md">
                <div className="w-full h-1.5 bg-amber-400 rounded-sm scale-75"></div>
              </div>
              <div className="absolute top-4 w-5 h-8 bg-gold border border-zinc-700 rounded-t-sm flex justify-center pt-1 z-5 overflow-hidden">
                <div className="w-4 h-8 bg-rose-600 rounded-t-full transform -skew-y-12"></div>
              </div>
            </div>
          </div>
        );

      // Kids Items
      case 'k1': // Fruit pacifier
        return (
          <div className="absolute inset-0 bg-sky-50 flex flex-col items-center justify-center p-3 border border-sky-100 shadow-inner rounded overflow-hidden">
            <div className="w-16 h-24 relative flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-sky-400 flex items-center justify-center">
                <div className="w-6 h-6 bg-sky-200 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-amber-400 border border-amber-500 rounded-b-md -mt-2"></div>
            </div>
          </div>
        );
      case 'k2': // Barbie Princess
        return (
          <div className="absolute inset-0 bg-pink-50 flex flex-col items-center justify-center p-3 border border-pink-200 shadow-inner rounded overflow-hidden">
            <div className="w-20 h-28 bg-pink-600 rounded border-2 border-white flex flex-col justify-between p-3 shadow text-white">
              <span className="text-[10px] font-black italic tracking-widest text-center">Barbie</span>
              <div className="my-auto self-center">
                <span className="text-3xl">👸</span>
              </div>
              <span className="text-[7px] uppercase font-bold text-pink-200 text-center">PRINCESS DOLL</span>
            </div>
          </div>
        );
      case 'k3': // Wooden puzzle
        return (
          <div className="absolute inset-0 bg-amber-50/50 flex flex-col items-center justify-center p-3 border border-amber-100 shadow-inner rounded overflow-hidden">
            <div className="w-24 h-20 bg-amber-100 rounded border-2 border-amber-300 grid grid-cols-2 gap-2 p-2 shadow">
              <div className="bg-red-500 rounded-sm w-full h-full text-[12px] font-extrabold text-white flex items-center justify-center shadow-xs">▲</div>
              <div className="bg-blue-500 rounded-sm w-full h-full text-[12px] font-extrabold text-white flex items-center justify-center shadow-xs">■</div>
              <div className="bg-yellow-500 rounded-sm w-full h-full text-[12px] font-extrabold text-white flex items-center justify-center shadow-xs">●</div>
              <div className="bg-green-500 rounded-sm w-full h-full text-[12px] font-extrabold text-white flex items-center justify-center shadow-xs">★</div>
            </div>
          </div>
        );
      case 'k4': // Plastic baby straw bottle
        return (
          <div className="absolute inset-0 bg-emerald-50/50 flex flex-col items-center justify-center p-3 border border-emerald-100 shadow-inner rounded overflow-hidden">
            <div className="w-12 h-28 bg-emerald-300/40 border-2 border-emerald-400 rounded-xl relative flex flex-col justify-between items-center p-2 shadow-md">
              <div className="w-10 h-6 bg-amber-400 rounded-md flex items-center justify-center shadow-xs">
                <div className="w-6 h-1 bg-amber-500 rounded-full"></div>
              </div>
              <div className="text-[8px] text-emerald-950 font-black mt-4 uppercase">Applebear</div>
            </div>
          </div>
        );
      case 'k5': // Baby mosquito net
        return (
          <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center p-3 border border-blue-200 shadow-inner rounded overflow-hidden">
            <div className="w-24 h-16 bg-sky-200/50 border border-sky-400 rounded-t-full flex items-center justify-center relative overflow-hidden shadow-sm">
              <div className="w-20 h-12 bg-sky-400/20 border border-sky-300 rounded-t-full flex items-center justify-center">
                <span className="text-[7px] text-sky-800 font-bold tracking-tighter uppercase font-mono">MITU HOME NET</span>
              </div>
            </div>
          </div>
        );
      case 'k6': // Philips nipple
      case 'k7':
        return (
          <div className="absolute inset-0 bg-zinc-50 flex flex-col items-center justify-center p-3 border border-zinc-200 shadow-inner rounded overflow-hidden">
            <div className="w-20 h-20 bg-zinc-100/60 border border-zinc-300 rounded-full flex items-center justify-center shadow-inner relative">
              <div className="w-10 h-10 rounded-full border border-zinc-400/40 bg-white/80 shadow-xs flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#E5E7EB] border border-[#CBD5E1]"></div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <img 
            src={getProductImageUrl(currentProduct)} 
            alt={currentProduct.title} 
            referrerPolicy="no-referrer" 
            className="w-full h-full object-contain rounded p-2" 
          />
        );
    }
  };

  // Fetch reviews in real-time
  useEffect(() => {
    if (!currentProduct.id) return;
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', currentProduct.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ProductReview[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ProductReview);
      });
      setReviews(list);
    }, (err) => {
      console.error("Error fetching reviews:", err);
    });
    return () => unsubscribe();
  }, [currentProduct.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) {
      setReviewFeedback({ type: 'error', text: 'রিভিউ দেওয়ার জন্য অনুগ্রহ করে প্রথমে সাইটে লগইন করুন!' });
      return;
    }
    if (!reviewComment.trim()) {
      setReviewFeedback({ type: 'error', text: 'অনুগ্রহ করে আপনার মূল্যবান মতামতটি লিখুন!' });
      return;
    }

    setIsSubmitting(true);
    setReviewFeedback(null);

    try {
      const reviewId = 'review-' + Date.now().toString(36);
      const newReview: ProductReview = {
        id: reviewId,
        productId: currentProduct.id,
        userUid: loggedInUser.uid || loggedInUser.emailOrPhone,
        userName: loggedInUser.name || 'Anonymous User',
        userPhoto: loggedInUser.photoURL || '',
        rating: reviewRatingInput,
        comment: reviewComment.trim(),
        title: reviewTitle.trim() || undefined,
        createdAt: new Date().toISOString(),
        isVerified: true,
        helpfulCount: 0,
        notHelpfulCount: 0,
        helpfulUsers: [],
        notHelpfulUsers: []
      };

      await setDoc(doc(db, 'reviews', reviewId), newReview);
      
      setReviewTitle('');
      setReviewComment('');
      setReviewRatingInput(5);
      setReviewFeedback({ type: 'success', text: 'আপনার রিভিউটি সফলভাবে পোস্ট করা হয়েছে! ধন্যবাদ।' });
    } catch (err: any) {
      console.error("Error saving review:", err);
      setReviewFeedback({ type: 'error', text: 'দুঃখিত, রিভিউ পোস্ট করার সময় কোনো ত্রুটি ঘটেছে। আবার চেষ্টা করুন।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewVote = async (reviewId: string, type: 'helpful' | 'notHelpful') => {
    if (!loggedInUser) {
      alert('মতামত দেওয়ার জন্য অনুগ্রহ করে প্রথমে লগইন করুন!');
      return;
    }

    const userId = loggedInUser.uid || loggedInUser.emailOrPhone;
    const reviewRef = doc(db, 'reviews', reviewId);

    if (reviewId.startsWith('default-')) {
      const localVotesKey = `voted_${reviewId}`;
      const existingVote = localStorage.getItem(localVotesKey);
      if (existingVote) {
        alert('আপনি ইতিমধ্যেই এই রিভিউতে মতামত দিয়েছেন!');
        return;
      }
      localStorage.setItem(localVotesKey, type);
      alert('ধন্যবাদ! আপনার মূল্যবান মতামতটি রেকর্ড করা হয়েছে।');
      return;
    }

    try {
      const targetReview = reviews.find(r => r.id === reviewId);
      if (!targetReview) return;

      const helpfulUsers = targetReview.helpfulUsers || [];
      const notHelpfulUsers = targetReview.notHelpfulUsers || [];

      if (helpfulUsers.includes(userId) || notHelpfulUsers.includes(userId)) {
        alert('আপনি ইতিমধ্যেই এই রিভিউতে মতামত দিয়েছেন!');
        return;
      }

      let updatedHelpful = [...helpfulUsers];
      let updatedNotHelpful = [...notHelpfulUsers];
      let helpfulCount = targetReview.helpfulCount || 0;
      let notHelpfulCount = targetReview.notHelpfulCount || 0;

      if (type === 'helpful') {
        updatedHelpful.push(userId);
        helpfulCount++;
      } else {
        updatedNotHelpful.push(userId);
        notHelpfulCount++;
      }

      await updateDoc(reviewRef, {
        helpfulUsers: updatedHelpful,
        notHelpfulUsers: updatedNotHelpful,
        helpfulCount,
        notHelpfulCount
      });
    } catch (err) {
      console.error("Error updating review votes:", err);
    }
  };

  const handleHelpfulClick = () => {
    if (!isHelpfulClicked) {
      setHelpfulCount(prev => prev + 1);
      setIsHelpfulClicked(true);
      if (isNotHelpfulClicked) {
        setNotHelpfulCount(prev => Math.max(0, prev - 1));
        setIsNotHelpfulClicked(false);
      }
    }
  };

  const handleNotHelpfulClick = () => {
    if (!isNotHelpfulClicked) {
      setNotHelpfulCount(prev => prev + 1);
      setIsNotHelpfulClicked(true);
      if (isHelpfulClicked) {
        setHelpfulCount(prev => Math.max(0, prev - 1));
        setIsHelpfulClicked(false);
      }
    }
  };

  const submitCustomRating = (star: number) => {
    setReviewRatingInput(star);
  };

  // Find some other products from the same category or electronics tab
  const sameCategoryProducts = productsList
    .filter(p => p.type === currentProduct.type && p.id !== currentProduct.id)
    .slice(0, 5);

  const relatedProductsRightBar = productsList
    .filter(p => p.id !== currentProduct.id)
    .slice(4, 7);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-800 space-y-6">
      
      {/* Non-sticky Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-150 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center space-x-1.5 text-slate-600 hover:text-amber-600 transition-colors cursor-pointer text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফিরে যান</span>
          </button>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">ক্যাটাগরি</span>
            <span className="bg-sky-50 text-sky-800 text-[10px] font-black tracking-wide px-2 py-0.5 rounded uppercase border border-sky-100 font-mono">
              {currentProduct.category || 'Electronics'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        
        {/* Main Product info layout grid */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* COLUMN 1: Large primary product frame & Thumbnail Gallery */}
            <div className="md:col-span-1 lg:col-span-1 border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between items-center shadow-2xs min-h-[320px] space-y-3">
              <div className="w-full relative">
                {/* 15% OFF red badge top left */}
                {discountPercent > 0 && (
                  <div className="absolute top-0 left-0 w-11 h-11 bg-red-600 border border-red-500 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-[10px] leading-none text-center shadow-md animate-pulse z-10">
                    <span>{discountPercent}%</span>
                    <span className="text-[7.5px] font-bold tracking-tight">OFF</span>
                  </div>
                )}

                {/* Media Stage: Either Active Video or Active Image */}
                {activeMediaType === 'video' && currentProduct.videoUrl ? (
                  <div className="relative w-full aspect-[4/5] bg-black rounded-lg overflow-hidden border border-slate-800 shadow-md flex items-center justify-center min-h-[300px]">
                    <video 
                      src={currentProduct.videoUrl} 
                      controls 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-contain"
                    >
                      আপনার ব্রাউজারে ভিডিও সাপোর্ট নেই।
                    </video>
                  </div>
                ) : (
                  <div 
                    onClick={() => currentProduct.type === 'book' && onPreview?.(currentProduct)}
                    className={`relative w-full aspect-[4/5] bg-neutral-50 rounded-lg overflow-hidden border border-slate-200/85 shadow-xs flex items-center justify-center min-h-[300px] transition-transform duration-200 ${
                      currentProduct.type === 'book' ? 'cursor-pointer hover:scale-[1.02] group' : ''
                    }`}
                    title={currentProduct.type === 'book' ? 'বইটির ভেতরের পাতাগুলো পড়তে এখানে ক্লিক করুন' : ''}
                  >
                    {renderProductGraphic(activeImageUrl)}
                    
                    {currentProduct.type === 'book' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-3 z-20">
                        <div className="bg-sky-600/90 hover:bg-sky-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg flex items-center space-x-1.5 transform scale-90 group-hover:scale-100 transition-transform duration-250">
                          <Eye className="w-4 h-4" />
                          <span>একটু পড়ে দেখুন</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Media Thumbnails Selector Bar (Images up to 5 + Video Slot) */}
              {(productImages.length > 1 || currentProduct.videoUrl) && (
                <div className="w-full pt-1">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
                    {/* Image Thumbnails */}
                    {productImages.map((imgUrl, idx) => {
                      const isSelected = activeMediaType === 'image' && activeMediaIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setActiveMediaType('image');
                            setActiveMediaIndex(idx);
                          }}
                          className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 bg-slate-100 shrink-0 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105 shadow-xs' 
                              : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                          }`}
                          title={`ছবি ${idx + 1}`}
                        >
                          <img 
                            src={getProductImageUrl({ imageUrl: imgUrl, type: currentProduct.type })} 
                            alt={`Thumbnail ${idx + 1}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono text-center font-bold">
                            #{idx + 1}
                          </span>
                        </button>
                      );
                    })}

                    {/* Short Video Thumbnail (If available) */}
                    {currentProduct.videoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMediaType('video');
                        }}
                        className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 bg-slate-900 shrink-0 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          activeMediaType === 'video'
                            ? 'border-indigo-500 ring-2 ring-indigo-400/40 scale-105 shadow-xs'
                            : 'border-slate-300 hover:border-indigo-400 opacity-80 hover:opacity-100'
                        }`}
                        title="ভিডিও প্লে করুন"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-xs">
                          <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                        </div>
                        <span className="absolute bottom-0 inset-x-0 bg-indigo-950/80 text-indigo-200 text-[7.5px] font-bold text-center leading-tight">
                          ভিডিও
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {currentProduct.type === 'book' && onPreview && (
                <button
                  onClick={() => onPreview(currentProduct)}
                  className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2 uppercase tracking-wide border border-emerald-500/35"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>একটু পড়ে দেখুন</span>
                </button>
              )}

              <div className="text-center font-mono text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-1">
                ★ HIGH FIDELITY PRODUCT VISUALIZATION ★
              </div>
            </div>

            {/* COLUMN 2 & 3: Detailed Central Metadata info panel */}
            <div className="md:col-span-2 lg:col-span-2 space-y-5 flex flex-col justify-between">
              <div className="space-y-3.5">
                {/* Media Badges, Unique Product ID & Direct Link Copy */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center space-x-1 bg-slate-900 text-amber-400 font-mono text-[10.5px] font-black px-2.5 py-0.5 rounded shadow-2xs">
                      <span>ID: {currentProduct.id}</span>
                    </span>
                    {currentProduct.videoUrl && (
                      <span className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10.5px] font-black px-2 py-0.5 rounded-full">
                        <Video className="w-3 h-3 text-indigo-600" />
                        <span>ভিডিও সহ</span>
                      </span>
                    )}
                    {productImages.length > 1 && (
                      <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10.5px] font-black px-2 py-0.5 rounded-full">
                        <ImageIcon className="w-3 h-3 text-amber-600" />
                        <span>{productImages.length}টি ছবি</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyProductLink}
                    className={`inline-flex items-center space-x-1.5 text-[11px] font-black px-2.5 py-1 rounded-md border transition-all cursor-pointer active:scale-95 ${
                      copiedProductLink
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400'
                    }`}
                    title={getProductShareUrl(currentProduct.id)}
                  >
                    {copiedProductLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>লিংক কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5" />
                        <span>প্রোডাক্ট লিংক কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
                  {currentProduct.title}
                </h1>

                {/* Rating line */}
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-150">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 5 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">5.0 (1 Rating | 1 Review)</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-bold text-slate-500">
                    Brand: <span className="text-sky-505 font-black hover:underline cursor-pointer">{currentProduct.authorOrBrand}</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-bold text-slate-500">
                    Category: <span className="text-sky-505 font-black hover:underline cursor-pointer">{currentProduct.category}</span>
                  </span>
                </div>

                {/* Quick Deal Badge & Price Info */}
                <div className="flex items-center space-x-2.5">
                  <span className="bg-red-650 text-white text-[10px] lg:text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wide font-sans">
                    QUICK DEAL
                  </span>
                  <span className="text-lg lg:text-xl font-mono font-black text-slate-950">
                    TK. {discountedPrice}
                  </span>
                </div>

                {/* Regular line prices and calculated discount saving */}
                <div className="text-xs font-semibold text-slate-500 space-x-4">
                  <span>Regular Price: <span className="line-through font-mono">Tk. {originalPrice}</span></span>
                  <span className="text-teal-650 font-bold bg-teal-50 px-2 py-0.5 rounded">
                    You are saving TK. {savingAmount} ({discountPercent}% OFF)
                  </span>
                </div>

                {/* Interactive Size & Color Selection for Superstore / Kids / Clothing Products */}
                {((currentProduct.availableSizes && currentProduct.availableSizes.length > 0) || (currentProduct.availableColors && currentProduct.availableColors.length > 0)) && (
                  <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3.5 space-y-3">
                    {/* Size Selector */}
                    {currentProduct.availableSizes && currentProduct.availableSizes.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800">
                            Size (সাইজ নির্বাচন করুন): <span className="text-emerald-700 font-mono">{selectedSize || currentProduct.availableSizes[0]}</span>
                          </span>
                          <span className="text-[10.5px] font-bold text-slate-500 font-mono">
                            Available: {currentProduct.availableSizes.join(', ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentProduct.availableSizes.map((sz) => {
                            const activeSz = (selectedSize || currentProduct.availableSizes?.[0]) === sz;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setSelectedSize(sz)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-black font-mono border transition-all cursor-pointer active:scale-95 ${
                                  activeSz
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-300/60'
                                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-300'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Color Selector */}
                    {currentProduct.availableColors && currentProduct.availableColors.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-emerald-200/50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800">
                            Color (কালার নির্বাচন করুন): <span className="text-sky-700">{selectedColor || currentProduct.availableColors[0]}</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentProduct.availableColors.map((clr) => {
                            const activeClr = (selectedColor || currentProduct.availableColors?.[0]) === clr;
                            return (
                              <button
                                key={clr}
                                type="button"
                                onClick={() => setSelectedColor(clr)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                                  activeClr
                                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs ring-2 ring-sky-300/60'
                                    : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-300'
                                }`}
                              >
                                {clr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bullets highlighting attributes & Full Clothing / Product Description */}
                <div className="bg-slate-50 border border-slate-150 rounded-lg p-3.5 space-y-2.5 text-xs text-slate-700">
                  <h4 className="font-bold text-slate-800 text-[11.5px] uppercase tracking-wide font-mono">Highlights & Product Details:</h4>
                  {currentProduct.type === 'book' ? (
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>
                        Author:{' '}
                        {onViewAuthor ? (
                          <button
                            type="button"
                            onClick={() => onViewAuthor(currentProduct.authorOrBrand)}
                            className="font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer focus:outline-hidden"
                          >
                            {currentProduct.authorOrBrand}
                          </button>
                        ) : (
                          <strong className="text-slate-850">{currentProduct.authorOrBrand}</strong>
                        )}
                      </li>
                      {currentProduct.publisherCompany && (
                        <li>Publisher: <strong className="text-slate-850">{currentProduct.publisherCompany}</strong></li>
                      )}
                      <li>Category: <strong className="text-slate-850">{currentProduct.category}</strong></li>
                      <li>In Stock: <strong className="text-slate-850">{currentProduct.inStock ? 'হ্যাঁ (Yes)' : 'না (Out of Stock)'}</strong></li>
                    </ul>
                  ) : (currentProduct.productDescription || currentProduct.sizeChartDetails) ? (
                    <div className="space-y-3">
                      {currentProduct.productDescription && (
                        <div className="whitespace-pre-line font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                          {currentProduct.productDescription}
                        </div>
                      )}
                      {currentProduct.sizeChartDetails && (
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider block">
                            📐 Size Measurement Chart (সাইজ চার্ট):
                          </span>
                          <div className="whitespace-pre-line font-mono font-bold text-slate-800 text-xs leading-relaxed">
                            {currentProduct.sizeChartDetails}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Brand: <strong className="text-slate-850">{currentProduct.authorOrBrand}</strong></li>
                      <li>Category: <strong className="text-slate-850">{currentProduct.category}</strong></li>
                      <li>Country of Origin: <strong className="text-slate-850">Bangladesh</strong></li>
                      {currentProduct.type === 'electronic' && (
                        <li>Warranty Period: <strong className="text-slate-850">1.5 Months</strong> (or Service Warranty)</li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Return text */}
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-150/40 w-fit">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>৩ দিনের সহজ রিটার্ন পলিসি এবং শতভাগ আসল পণ্যের নিশ্চয়তা</span>
                </div>
              </div>

              {/* Action Buttons: orange Buy Now and blue Add to Cart */}
              <div className="space-y-3 pt-3 border-t border-gray-150">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      const productWithVariant: Product = {
                        ...currentProduct,
                        selectedSize: selectedSize || currentProduct.availableSizes?.[0] || undefined,
                        selectedColor: selectedColor || currentProduct.availableColors?.[0] || undefined,
                      };
                      onAddToCart(productWithVariant);
                      const variantInfo = [
                        productWithVariant.selectedSize ? `Size: ${productWithVariant.selectedSize}` : '',
                        productWithVariant.selectedColor ? `Color: ${productWithVariant.selectedColor}` : ''
                      ].filter(Boolean).join(', ');
                      alert(`${currentProduct.title}${variantInfo ? ` (${variantInfo})` : ''} আপনার কার্টে যুক্ত করা হয়েছে!`);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-black text-xs py-3.5 px-6 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer max-w-full inline-flex items-center justify-center space-x-1.5 uppercase"
                  >
                    <span>Buy Now</span>
                  </button>
                  <button 
                    onClick={() => {
                      const productWithVariant: Product = {
                        ...currentProduct,
                        selectedSize: selectedSize || currentProduct.availableSizes?.[0] || undefined,
                        selectedColor: selectedColor || currentProduct.availableColors?.[0] || undefined,
                      };
                      onAddToCart(productWithVariant);
                    }}
                    className="flex-1 bg-sky-551 hover:bg-sky-650 text-white font-sans font-black text-xs py-3.5 px-6 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer max-w-full inline-flex items-center justify-center space-x-1.5 uppercase"
                    style={{ backgroundColor: '#0083ca' }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Sub row links */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-sans pt-1">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1.5 cursor-pointer hover:text-slate-800">
                      <input type="checkbox" className="rounded text-sky-500 focus:ring-0 w-3.5 h-3.5 border-gray-300" />
                      <span>Add to comparison</span>
                    </label>
                    <button className="hover:text-slate-800 inline-flex items-center space-x-1 border border-slate-250 py-1 px-3 rounded-md bg-white">
                      <span>Add to List</span>
                      <span className="text-[8px] text-slate-600 self-center leading-none">▼</span>
                    </button>
                  </div>
                  <button 
                    onClick={handleCopyProductLink}
                    className="hover:text-sky-600 font-bold inline-flex items-center space-x-1 text-slate-600 cursor-pointer"
                  >
                    {copiedProductLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedProductLink ? 'Link Copied!' : 'Share This Product'}</span>
                  </button>
                </div>

                {/* Happy Return icons box */}
                <div className="flex justify-start items-center space-x-6 text-[10.5px] text-slate-400 font-bold font-sans pt-2 border-t border-slate-100">
                  <span className="flex items-center space-x-1">
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>7 Days Happy Return</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cash On Delivery</span>
                  </span>
                </div>
              </div>

            </div>

            {/* COLUMN 4: Sidebar: Related Products inside primary container */}
            <div className="md:col-span-3 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-150 pt-5 lg:pt-0 pl-0 lg:pl-5 space-y-4 font-sans text-xs flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 border-b border-gray-250 pb-1.5 tracking-tight">Related Products</h3>
                <div className="space-y-4">
                  {relatedProductsRightBar.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => onSelectProduct(item)}
                      className="flex space-x-2.5 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-150"
                    >
                      <div className="w-12 h-14 bg-slate-1 py-1 px-0.5 border border-slate-200/50 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={getProductImageUrl(item)} alt={item.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-bold text-[10.5px] text-slate-800 truncate leading-tight group-hover:text-amber-600 transition-colors" title={item.title}>
                          {item.title}
                        </h4>
                        <span className="text-[9.5px] text-slate-400 font-medium block truncate">Brand: {item.authorOrBrand}</span>
                        <div className="flex items-center space-x-0.5 text-amber-400 text-[10px]">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                          <span className="text-[8.5px] text-slate-400 ml-1 font-mono">({item.totalRatings})</span>
                        </div>
                        <span className="font-bold font-mono text-[10.5px] text-slate-800 block">Tk {item.discountedPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Products chevron switches */}
              <div className="flex justify-end space-x-1 pb-1">
                <button className="p-1 rounded border border-gray-250 bg-white hover:bg-slate-50 hover:text-sky-505 transition-colors cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded border border-gray-250 bg-white hover:bg-slate-50 hover:text-sky-505 transition-colors cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Specification Container Block */}
        <div id="product-specification-panel" className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-800 tracking-tight font-sans border-b border-gray-150 pb-2 uppercase tracking-wide">
            Specification
          </h3>

          <div className="overflow-x-auto text-xs font-sans">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-gray-150">
                <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors leading-relaxed">
                  <td className="p-2.5 font-bold text-slate-505 w-1/4">Title</td>
                  <td className="p-2.5 font-semibold text-slate-800">{currentProduct.title}</td>
                </tr>
                {currentProduct.type === 'book' ? (
                  <>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Author / Writer</td>
                      <td 
                        className="p-2.5 font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                        onClick={() => {
                          if (onViewAuthor) {
                            onViewAuthor(currentProduct.authorOrBrand);
                          }
                        }}
                      >
                        {currentProduct.authorOrBrand}
                      </td>
                    </tr>
                    {currentProduct.publisherCompany && (
                      <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-505">Publisher</td>
                        <td className="p-2.5 text-slate-700">{currentProduct.publisherCompany}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Category</td>
                      <td className="p-2.5 text-slate-700">{currentProduct.category}</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Language</td>
                      <td className="p-2.5 text-slate-700">Bengali / English</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">In Stock</td>
                      <td className="p-2.5 text-slate-700">{currentProduct.inStock ? "Yes (In Stock)" : "No (Out of Stock)"}</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Product Code / ID</td>
                      <td className="p-2.5 text-slate-700 font-mono">{currentProduct.id}</td>
                    </tr>
                  </>
                ) : ((currentProduct.availableSizes && currentProduct.availableSizes.length > 0) || (currentProduct.availableColors && currentProduct.availableColors.length > 0) || currentProduct.productDescription || currentProduct.sizeChartDetails || currentProduct.type === 'superstore' || currentProduct.type === 'kids') ? (
                  <>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Brand</td>
                      <td className="p-2.5 font-semibold text-sky-600">{currentProduct.authorOrBrand}</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Category</td>
                      <td className="p-2.5 text-slate-700">{currentProduct.category}</td>
                    </tr>
                    {currentProduct.availableSizes && currentProduct.availableSizes.length > 0 && (
                      <tr className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-2.5 font-bold text-slate-505">Available Sizes (সাইজ)</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-700">{currentProduct.availableSizes.join(', ')}</td>
                      </tr>
                    )}
                    {currentProduct.availableColors && currentProduct.availableColors.length > 0 && (
                      <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-505">Available Colors (কালার)</td>
                        <td className="p-2.5 font-semibold text-sky-700">{currentProduct.availableColors.join(', ')}</td>
                      </tr>
                    )}
                    {currentProduct.productDescription && (
                      <tr className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-2.5 font-bold text-slate-505 align-top">Product Details & Specifications</td>
                        <td className="p-2.5 text-slate-800 whitespace-pre-line leading-relaxed">{currentProduct.productDescription}</td>
                      </tr>
                    )}
                    {currentProduct.sizeChartDetails && (
                      <tr className="bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                        <td className="p-2.5 font-bold text-amber-900 align-top">Size Measurement Chart</td>
                        <td className="p-2.5 font-mono font-bold text-slate-800 whitespace-pre-line leading-relaxed">{currentProduct.sizeChartDetails}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Country of Origin</td>
                      <td className="p-2.5 text-slate-700">Bangladesh</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Product Code / ID</td>
                      <td className="p-2.5 text-slate-700 font-mono">{currentProduct.id}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Brand</td>
                      <td className="p-2.5 font-semibold text-sky-600 hover:underline cursor-pointer">{currentProduct.authorOrBrand}</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Warranty Period</td>
                      <td className="p-2.5 text-slate-700">1.5 Months</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Country of Origin</td>
                      <td className="p-2.5 text-slate-700">Bangladesh</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Watt</td>
                      <td className="p-2.5 text-slate-700">750 W</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Model</td>
                      <td className="p-2.5 text-slate-700">RE-VIS-GEL-011</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Product Code</td>
                      <td className="p-2.5 text-slate-700 font-mono">373560</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Voltage</td>
                      <td className="p-2.5 text-slate-700">220V - 240V</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Body Materials</td>
                      <td className="p-2.5 text-slate-700">ABS material Plastic body</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Frequency</td>
                      <td className="p-2.5 text-slate-700">50 Hz</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Motor Speed</td>
                      <td className="p-2.5 text-slate-700">20000 RPM</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Warranty Type</td>
                      <td className="p-2.5 text-slate-700">Service Warranty</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Jar Material</td>
                      <td className="p-2.5 text-slate-700">1.5 Gauge SS</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Lid Material</td>
                      <td className="p-2.5 text-slate-700">Polycarbonate</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Safety Feature</td>
                      <td className="p-2.5 text-slate-700">Overhead Protection</td>
                    </tr>
                    <tr className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Dimensions</td>
                      <td className="p-2.5 text-slate-700">12.7 x 10.6 x 10 Inch</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="p-2.5 font-bold text-slate-505">Noise Level</td>
                      <td className="p-2.5 text-slate-700">Low Noise</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Subtags listed in layout screen */}
          <div className="flex flex-wrap gap-2.5 pt-4">
            {['Electric Multi-cookers', 'Warming Drawers', 'Electric Kettle', 'Fire-and-Flame Detection', 'Measuring Tools & Scales', 'Toasters', 'Electric Sandwich Makers & Presses', 'Refrigerators'].map((tag) => (
              <span key={tag} className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10.5px] px-3 py-1.5 rounded-md cursor-pointer transition-colors shadow-2xs font-semibold">
                {tag}
              </span>
            ))}
          </div>

          <div className="text-center pt-3 border-t border-slate-100">
            <button 
              onClick={() => alert('মতামত ও সংশোধনের রিপোর্ট পাঠানো হয়েছে। ধন্যবাদ!')}
              className="inline-flex items-center space-x-1.5 text-xs text-rose-500 hover:text-rose-700 font-bold font-sans cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Report Incorrect Information</span>
            </button>
          </div>
        </div>

        {/* Section 3: Brand Information Row */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-800 tracking-tight font-sans border-b border-gray-150 pb-2 uppercase tracking-wide">
            Brand Information
          </h3>

          <div className="flex flex-col md:flex-row items-center gap-6 p-2">
            {/* Solid styled brand icon */}
            <div className="w-32 h-20 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center p-3 flex-shrink-0 shadow-3xs select-none">
              <span className="text-black font-black font-sans tracking-widest text-lg">VISION</span>
              <span className="text-[6.5px] text-red-650 tracking-wider font-extrabold uppercase mt-1">ELECTRONICS</span>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-slate-800">{currentProduct.authorOrBrand}</h4>
              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                Vision Electronics started business on March, 2013 as a sister concern of PRAN-RFL Group by launching 24" VISION LED TV at Ghorashal, Bangladesh. VISION Electronics has manufactured with the worldclass European state-of-the-art technology, with modern manufacturing facilities at Ghorashal, Gonga and Habiganj Industrial park. Simultaneously, VISION Electronics is producing and marketing LED TV, Refrigerator, AC, Washing Machine, Oven, Rice Cooker, Blender, Iron etc. assuring high standard.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Customers Also Bought (Spinner loading exactly as screenshot!) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-5 text-center">
          <h3 className="text-sm font-black text-slate-800 tracking-tight text-left font-sans border-b border-gray-150 pb-2 uppercase tracking-wide">
            Customers Also Bought
          </h3>
          
          {/* Exact circular spinner loop matching image perfectly */}
          <div className="flex flex-col items-center justify-center py-10 space-y-3.5">
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-sky-505 animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">লোড হচ্ছে...</p>
          </div>
        </div>

        {/* Section 5: Similar Category Best Selling Products row */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-gray-150 pb-2.5">
            <h3 className="text-sm font-black text-slate-800 tracking-tight font-sans uppercase tracking-wide">
              Similar Category Best Selling Products
            </h3>
            <div className="flex space-x-1.5">
              <button className="p-1 rounded border border-gray-250 bg-white hover:bg-slate-50 text-slate-650 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded border border-gray-250 bg-white hover:bg-slate-50 text-slate-650 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sameCategoryProducts.length > 0 ? (
              sameCategoryProducts.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => onSelectProduct(item)}
                  className="bg-white border border-gray-200/70 p-2.5 rounded-lg text-xs font-sans group cursor-pointer hover:shadow-md transition-all relative flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full bg-slate-50 rounded flex items-center justify-center mb-2 overflow-hidden border border-slate-100">
                    {item.discountPercent > 0 && (
                      <div className="absolute top-1 left-1 bg-yellow-400 border border-yellow-450 text-slate-900 font-extrabold text-[8.5px] w-7 h-7 flex flex-col items-center justify-center rounded-full shadow-xs leading-none">
                        <span>{item.discountPercent}%</span>
                        <span className="text-[6px]">ছাড়</span>
                      </div>
                    )}
                    <img src={getProductImageUrl(item)} alt={item.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="space-y-1.5 min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-[11px] text-slate-850 line-clamp-2 h-7.5 leading-tight group-hover:text-amber-600 transition-colors" title={item.title}>
                        {item.title}
                      </h4>
                      <span className="text-[9.5px] text-slate-550 block font-medium truncate mt-0.5">Brand: {item.authorOrBrand}</span>
                      
                      <div className="flex items-center space-x-0.5 mt-1 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current text-amber-450" />)}
                        <span className="text-[9px] text-slate-400 font-bold ml-1 font-mono">({item.totalRatings})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      {item.inStock ? (
                        <div className="text-[8.5px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 w-fit rounded leading-none">In Stock</div>
                      ) : (
                        <div className="text-[8.5px] font-black text-red-500">Out Of Stock</div>
                      )}
                      
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-bold font-mono text-slate-900 text-[11.5px]">Tk {item.discountedPrice}</span>
                        {item.discountPercent > 0 && (
                          <span className="text-slate-400 text-[9.5px] line-through font-mono">Tk {item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-slate-400 font-medium">কোন অনুরূপ পণ্য পাওয়া যায়নি।</div>
            )}
          </div>
        </div>

        {/* Section 6: Related Products (Larger) Carousel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-gray-150 pb-2.5">
            <h3 className="text-sm font-black text-slate-800 tracking-tight font-sans uppercase tracking-wide">
              Related Products
            </h3>
            <div className="flex space-x-1.5">
              <button className="p-1 rounded border border-gray-250 bg-white hover:bg-slate-50 text-slate-650 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded border border-gray-250 bg-white hover:bg-slate-50 text-slate-650 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productsList.slice(0, 5).map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectProduct(item)}
                className="bg-white border border-gray-200/75 p-3 rounded-lg text-xs font-sans group cursor-pointer hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-slate-50 rounded flex items-center justify-center mb-2 overflow-hidden border border-slate-100">
                  {item.discountPercent > 0 && (
                    <div className="absolute top-1 left-1 bg-yellow-450 text-slate-950 border border-yellow-500 font-extrabold text-[8.5px] w-7 h-7 flex flex-col items-center justify-center rounded-full shadow-xs leading-none">
                      <span>{item.discountPercent}%</span>
                      <span className="text-[6.5px]">ছাড়</span>
                    </div>
                  )}
                  <img src={getProductImageUrl(item)} alt={item.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                
                <div className="space-y-1 flex-1 flex flex-col justify-between pt-1">
                  <div>
                    <h4 className="font-bold text-[11px] text-slate-850 line-clamp-2 h-7.5 leading-tight group-hover:text-amber-600 transition-colors" title={item.title}>
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-medium truncate block mt-0.5">Brand: {item.authorOrBrand}</span>
                    
                    <div className="flex items-center space-x-0.5 text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                      <span className="text-[8.5px] text-slate-400 font-bold ml-1 font-mono">({item.totalRatings})</span>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-1.5 pt-2 border-t border-slate-100 font-bold mt-2">
                    <span className="font-mono text-slate-900 text-[11.5px]">Tk {item.discountedPrice}</span>
                    {item.discountPercent > 0 && (
                      <span className="text-slate-400 text-[9.5px] line-through font-mono font-medium">Tk {item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Reviews and Ratings */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-6">
          <h3 className="text-sm font-black text-slate-800 tracking-tight font-sans border-b border-gray-150 pb-2 uppercase tracking-wide">
            Reviews and Ratings
          </h3>

          {/* Review Stats Dashboard row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-5 border-b border-slate-100">
            {/* Left Box: Rate This Product & Submit form */}
            <div className="space-y-3.5 font-sans bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Leave your feedback</h4>
              
              <form onSubmit={handleSubmitReview} className="space-y-3">
                {/* Interactive Star Picker */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button"
                        key={star}
                        onClick={() => setReviewRatingInput(star)}
                        className="p-0.5 hover:scale-110 active:scale-95 transition-transform text-slate-200 hover:text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRatingInput ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title Input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Review Title (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Excellent Product, highly recommended!" 
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    disabled={!loggedInUser}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Review Comment Textarea */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Comments</label>
                  <textarea 
                    rows={3}
                    placeholder="Write your honest review here..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    disabled={!loggedInUser}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                  />
                </div>

                {/* Feedback message info alerts */}
                {reviewFeedback && (
                  <div className={`p-2 rounded text-xs font-semibold ${
                    reviewFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {reviewFeedback.text}
                  </div>
                )}

                {/* Submit action button */}
                {loggedInUser ? (
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-500 text-center font-medium bg-amber-50 border border-amber-100 p-2.5 rounded-lg leading-relaxed">
                    🔐 রিভিউ ও রেটিং দিতে অনুগ্রহ করে প্রথমে আমাদের সাইটে লগইন করুন।
                  </div>
                )}
              </form>
            </div>

            {/* Middle Box: Dynamic Overall Rating score */}
            {(() => {
              const defaultReviews: ProductReview[] = [
                {
                  id: 'default-review-1',
                  productId: currentProduct.id,
                  userUid: 'default-sabbir',
                  userName: 'By Wahiduzzaman Sabbir',
                  rating: 5,
                  comment: 'Superb!❤️',
                  title: 'superb!❤️',
                  createdAt: '2026-04-27T12:00:00Z',
                  isVerified: true,
                  helpfulCount: 8,
                  notHelpfulCount: 0,
                  helpfulUsers: [],
                  notHelpfulUsers: []
                }
              ];

              const allReviews = [...reviews, ...defaultReviews.filter(dr => !reviews.some(r => r.userUid === dr.userUid))];
              const totalReviewsCount = allReviews.length;
              const averageRating = totalReviewsCount > 0
                ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1))
                : 5.0;

              const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
              allReviews.forEach(r => {
                const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 5 | 4 | 3 | 2 | 1;
                if (starCounts[star] !== undefined) {
                  starCounts[star]++;
                }
              });

              const getStarPercentage = (star: 5 | 4 | 3 | 2 | 1) => {
                return totalReviewsCount > 0 ? (starCounts[star] / totalReviewsCount) * 100 : 0;
              };

              const filteredReviews = activeReviewTab === 'verified' ? allReviews.filter(r => r.isVerified) : allReviews;

              const formatDate = (dateStr: string) => {
                try {
                  const d = new Date(dateStr);
                  if (isNaN(d.getTime())) return dateStr;
                  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                } catch {
                  return dateStr;
                }
              };

              return (
                <>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5 font-sans h-full justify-center">
                    <div className="text-4xl lg:text-5xl font-black text-slate-850 font-mono">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center space-x-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star 
                          key={starIdx} 
                          className={`w-4 h-4 fill-current ${
                            starIdx <= Math.round(averageRating) ? 'text-amber-450 fill-amber-450' : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold block leading-none pt-1">
                      {totalReviewsCount} {totalReviewsCount === 1 ? 'Rating & Review' : 'Ratings & Reviews'}
                    </span>
                  </div>

                  {/* Right Box: Star Rating Progression Bar Chart */}
                  <div className="space-y-1.5 font-sans text-xs w-full max-w-xs md:max-w-none">
                    {([5, 4, 3, 2, 1] as const).map((star) => (
                      <div key={star} className="flex items-center space-x-2">
                        <span className="w-12 text-slate-400 text-[10.5px] font-bold leading-none">{star} Star</span>
                        <div className="flex-1 bg-slate-100 h-2 rounded overflow-hidden">
                          <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${getStarPercentage(star)}%` }}></div>
                        </div>
                        <span className="font-mono text-slate-600 font-bold w-4 text-right">
                          {starCounts[star]}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>

          {/* User Reviews list row bottom element */}
          {(() => {
            const defaultReviews: ProductReview[] = [
              {
                id: 'default-review-1',
                productId: currentProduct.id,
                userUid: 'default-sabbir',
                userName: 'By Wahiduzzaman Sabbir',
                rating: 5,
                comment: 'Superb!❤️',
                title: 'superb!❤️',
                createdAt: '2026-04-27T12:00:00Z',
                isVerified: true,
                helpfulCount: 8,
                notHelpfulCount: 0,
                helpfulUsers: [],
                notHelpfulUsers: []
              }
            ];

            const allReviews = [...reviews, ...defaultReviews.filter(dr => !reviews.some(r => r.userUid === dr.userUid))];
            const filteredReviews = activeReviewTab === 'verified' ? allReviews.filter(r => r.isVerified) : allReviews;

            const formatDate = (dateStr: string) => {
              try {
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              } catch {
                return dateStr;
              }
            };

            const getInitials = (name: string) => {
              return name ? name.replace(/By /i, '').charAt(0).toUpperCase() : 'U';
            };

            return (
              <div className="space-y-5">
                {/* Filter selectors tab row */}
                <div className="flex items-center space-x-1 border-b border-gray-150 pb-2.5 text-xs text-slate-500">
                  <button 
                    type="button"
                    onClick={() => setActiveReviewTab('all')}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      activeReviewTab === 'all' ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    All Reviews ({allReviews.length})
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveReviewTab('verified')}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      activeReviewTab === 'verified' ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    Verified Purchases ({allReviews.filter(r => r.isVerified).length})
                  </button>
                </div>

                {/* Render Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                    কোনো রিভিউ পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => {
                      const currentUserId = loggedInUser?.uid || loggedInUser?.emailOrPhone || '';
                      
                      const hasVotedHelpful = review.helpfulUsers?.includes(currentUserId) || 
                        (review.id.startsWith('default-') && localStorage.getItem(`voted_${review.id}`) === 'helpful');
                      
                      const hasVotedNotHelpful = review.notHelpfulUsers?.includes(currentUserId) || 
                        (review.id.startsWith('default-') && localStorage.getItem(`voted_${review.id}`) === 'not_helpful');

                      return (
                        <div key={review.id} className="border border-slate-150 p-4 rounded-xl space-y-2.5 font-sans hover:bg-slate-50/35 transition-colors">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center space-x-2.5">
                              {review.userPhoto ? (
                                <img 
                                  src={review.userPhoto} 
                                  alt={review.userName} 
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-3xs"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs shadow-3xs">
                                  {getInitials(review.userName)}
                                </div>
                              )}
                              <div>
                                <span className="font-extrabold text-[12px] text-slate-800 block">
                                  {review.userName} 
                                  {loggedInUser && (review.userUid === loggedInUser.uid || review.userUid === loggedInUser.emailOrPhone) && ' (You)'}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <div className="flex items-center text-amber-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} className={`w-2.5 h-2.5 fill-current ${star <= review.rating ? 'text-amber-400' : 'text-slate-250'}`} />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-semibold">• {formatDate(review.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            {review.isVerified && (
                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-110 rounded px-1.5 py-0.5 flex items-center space-x-0.5 shadow-3xs">
                                <span className="text-emerald-500 font-black">✓</span>
                                <span>Verified Purchase</span>
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 pl-1">
                            {review.title && (
                              <div className="text-[10px] text-slate-400 font-black tracking-tight flex items-center space-x-1 uppercase">
                                <span>Review Title:</span>
                                <span className="text-slate-800 lowercase">{review.title}</span>
                              </div>
                            )}
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {review.comment}
                            </p>
                          </div>

                          {/* Voting Row */}
                          <div className="flex items-center space-x-4 pt-2.5 border-t border-slate-100 text-xs">
                            <span className="text-slate-400 font-semibold">Was this review helpful to you?</span>
                            <div className="flex items-center space-x-2.5">
                              <button 
                                type="button"
                                onClick={() => handleReviewVote(review.id, 'helpful')}
                                className={`inline-flex items-center space-x-1 border py-1 px-3.5 rounded-lg font-bold transition-all cursor-pointer ${
                                  hasVotedHelpful 
                                    ? 'bg-sky-50 text-sky-600 border-sky-200 shadow-3xs' 
                                    : 'bg-white border-gray-250 hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>Helpful ({review.helpfulCount || 0})</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleReviewVote(review.id, 'notHelpful')}
                                className={`inline-flex items-center space-x-1 border py-1 px-3.5 rounded-lg font-bold transition-all cursor-pointer ${
                                  hasVotedNotHelpful 
                                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-3xs' 
                                    : 'bg-white border-gray-250 hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>Not Helpful ({review.notHelpfulCount || 0})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
}
