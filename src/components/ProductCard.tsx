import { Star, Eye, ShoppingCart, CheckCircle2, ArrowLeftRight, Heart, Play, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { getBookCoverUrl, getProductImageUrl } from '../lib/bookUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onPreview: (p: Product) => void;
  onSelectProduct?: (p: Product) => void;
  onAddToCompare?: (p: Product) => void;
  isComparing?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (p: Product) => void;
  onViewAuthor?: (authorName: string) => void;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onPreview, 
  onSelectProduct,
  onAddToCompare,
  isComparing = false,
  isFavorite = false,
  onToggleFavorite,
  onViewAuthor
}: ProductCardProps) {
  // Generate beautiful background styles representing book/product mockups as seen in screenshots
  const renderProductGraphic = () => {
    if (product.type === 'book') {
      const coverUrl = getBookCoverUrl(product.imageUrl);
      return (
        <div className="absolute inset-0 bg-white flex shadow-inner rounded-r overflow-hidden border border-gray-150 select-none">
          {/* Simulated 3D Book spine shadow on the left */}
          <div className="w-3 h-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-r border-slate-300 flex-shrink-0 z-10 shadow-lg"></div>
          {/* Cover image area */}
          <div className="flex-1 relative bg-slate-50 flex items-center justify-center h-full">
            {coverUrl && (
              <img 
                src={coverUrl} 
                alt={product.title} 
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
            <div className="absolute inset-0 p-2 flex flex-col justify-between z-10 text-white">
              <span className="text-[6.5px] font-mono font-bold text-sky-300 tracking-wider">KENAKATA</span>
              <div className="my-auto space-y-0.5">
                <h4 className="text-[10px] font-black leading-tight drop-shadow-md text-slate-50 line-clamp-3">{product.title}</h4>
                <p className="text-[8px] text-slate-200 font-semibold truncate">{product.authorOrBrand}</p>
              </div>
              <div className="bg-amber-400 text-slate-900 text-[7px] py-0.5 text-center font-extrabold rounded-xs w-fit px-1.5 self-center uppercase font-mono shadow-xs">
                পড়ে দেখুন
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If the product has a custom/user-uploaded image or any web URL image, prioritize rendering it over the hardcoded mockup
    if (product.imageUrl && (product.imageUrl.startsWith('data:') || product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://'))) {
      return (
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          referrerPolicy="no-referrer" 
          className="w-full h-full object-cover rounded" 
        />
      );
    }

    switch (product.id) {
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
              {/* Islamic dome custom SVG shape */}
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
            {/* Visual background artwork of landscape profile */}
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
          <div className="absolute inset-0 bg-sky-900 flex flex-col justify-between p-3 border border-sky-950 shadow-inner rounded text-white overflow-hidden animate-pulse">
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
      case 'e1': // Orico Enclosure
        return (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-3 border border-slate-200 shadow-inner rounded overflow-hidden">
            <div className="w-20 h-10 border border-slate-300 bg-white rounded-md flex flex-col justify-between p-1.5 shadow-sm relative">
              {/* Textured USB stripes */}
              <div className="absolute inset-x-0 top-2 h-0.5 bg-slate-100"></div>
              <div className="absolute inset-x-0 top-4 h-0.5 bg-slate-100"></div>
              <div className="absolute inset-x-0 top-6 h-0.5 bg-slate-100"></div>
              <div className="flex justify-between items-center">
                <div className="text-[5px] text-slate-400 font-bold scale-90">ORICO</div>
                <div className="w-1.5 h-1 bg-sky-500 rounded-full animate-ping"></div>
              </div>
              <div className="text-[6px] text-sky-600 font-black self-end">TYPE C 3.1</div>
            </div>
          </div>
        );
      case 'e2': // Sanford Torch
        return (
          <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-3 border border-zinc-950 shadow-inner rounded overflow-hidden">
            <div className="w-8 h-20 bg-stone-800 rounded-b border border-stone-700 flex flex-col items-center relative shadow-md">
              <div className="w-10 h-6 bg-stone-700 rounded-t border-b border-stone-600 flex items-center justify-center relative shadow-sm">
                <div className="w-8 h-4 rounded-full bg-yellow-300 opacity-80 blur-[2px]"></div>
              </div>
              <div className="w-2 h-1 bg-amber-500 rounded my-2"></div>
              <div className="w-6 h-8 bg-black/40 rounded flex flex-col justify-around p-0.5 mt-2">
                <div className="w-full h-1 bg-amber-200 rounded"></div>
                <div className="w-full h-1 bg-amber-200 rounded animate-pulse"></div>
              </div>
              <div className="absolute -top-1 w-2 h-1 bg-yellow-400/80"></div>
            </div>
          </div>
        );
      case 'e3': // UGreen Cable
        return (
          <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center p-3 border border-neutral-200 shadow-inner rounded overflow-hidden">
            <div className="flex flex-col items-center space-y-1">
              <div className="flex space-x-2">
                <div className="w-4 h-6 bg-neutral-800 rounded-t flex flex-col justify-between p-0.5 border-b border-amber-400">
                  <div className="w-3 h-1 bg-amber-300 rounded-sm"></div>
                </div>
                <div className="w-4 h-6 bg-neutral-800 rounded-t flex flex-col justify-between p-0.5 border-b border-amber-400">
                  <div className="w-3 h-1 bg-amber-300 rounded-sm"></div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center animate-spin-slow">
                <div className="w-5 h-5 rounded-full border border-slate-300"></div>
              </div>
              <div className="text-[8px] text-amber-500 font-bold tracking-tight">UGREEN 5m</div>
            </div>
          </div>
        );
      case 'e4': // Geeoo Headphones
        return (
          <div className="absolute inset-0 bg-neutral-50 flex flex-col items-center justify-center p-3 border border-neutral-200 shadow-inner rounded overflow-hidden">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center relative">
              <div className="absolute top-2 w-3 h-3 rounded-full bg-zinc-800 flex items-center justify-center">
                <div className="w-1 h-1 bg-sky-400 rounded-full"></div>
              </div>
              <div className="absolute left-2 top-8 w-2 h-4 bg-zinc-700 rounded"></div>
              <div className="absolute right-2 top-8 w-2 h-4 bg-zinc-700 rounded"></div>
              <div className="w-12 h-12 rounded-full border border-dashed border-emerald-300"></div>
            </div>
          </div>
        );
      case 'e5': // Brushless cooling fan
        return (
          <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-3 border border-gray-200 shadow-inner rounded overflow-hidden">
            <div className="w-16 h-16 border border-zinc-400 bg-zinc-800 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-1 border border-zinc-700 rounded-full flex items-center justify-center">
                {/* Rotating blade effect */}
                <div className="w-12 h-1.5 bg-zinc-500 transform rotate-12 origin-center animate-spin-fast rounded-sm"></div>
                <div className="w-12 h-1.5 bg-zinc-500 transform -rotate-12 origin-center animate-spin-fast rounded-sm"></div>
              </div>
              <div className="absolute w-4 h-4 rounded-full bg-zinc-900 border border-zinc-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'e6': // Defender rechargeable fan
        return (
          <div className="absolute inset-0 bg-zinc-100 flex flex-col items-center justify-center p-3 border border-zinc-200 shadow-inner rounded overflow-hidden">
            <div className="flex flex-col items-center space-y-1">
              <div className="relative w-16 h-16 rounded-full border border-neutral-400 bg-white flex items-center justify-center">
                <div className="absolute inset-0.5 border border-maroon bg-rose-50 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-12 bg-rose-800 rounded transform rotate-[45deg] animate-spin-slow"></div>
                  <div className="w-1.5 h-12 bg-rose-800 rounded transform rotate-[135deg] animate-spin-slow"></div>
                </div>
                <div className="w-4 h-4 bg-rose-900 rounded-full border border-amber-300 z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="w-10 h-6 bg-rose-900 rounded border border-rose-950 flex flex-col justify-around p-0.5">
                <div className="flex justify-around">
                  <span className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></span>
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                </div>
                <span className="text-[5px] text-white text-center font-bold font-mono">DEFENDER</span>
              </div>
            </div>
          </div>
        );
      case 'e7': // Megastar M8
        return (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-3 border border-slate-200 shadow-inner rounded overflow-hidden">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-16 h-14 border-t-4 border-x-4 border-slate-700 rounded-t-lg bg-transparent flex justify-between items-end">
                <div className="w-4 h-6 bg-red-600 rounded-l border border-red-700 shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-3 bg-neutral-800 rounded-sm"></div>
                </div>
                <div className="w-4 h-6 bg-red-600 rounded-r border border-red-700 shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-3 bg-neutral-800 rounded-sm"></div>
                </div>
              </div>
              <div className="text-[7px] text-red-600 font-bold uppercase tracking-widest mt-1">MEGASTAR M8</div>
            </div>
          </div>
        );

      // Superstore Items
      case 's1': // Hair powder
        return (
          <div className="absolute inset-0 bg-yellow-50/40 flex flex-col items-center justify-center p-3 border border-yellow-100 shadow-inner rounded overflow-hidden">
            <div className="w-10 h-16 bg-amber-100 border-2 border-amber-300 rounded-md shadow-xs flex flex-col justify-between p-1">
              <div className="text-[6px] text-amber-800 font-black tracking-tight text-center bg-amber-200 py-0.5 rounded-sm">ভেষজ এগ্রো</div>
              <div className="text-[5px] font-bold text-slate-700 text-center uppercase leading-none mt-1">Kesraj Powder</div>
              <div className="text-[4px] text-amber-600 text-center font-bold">100% ORGANIC</div>
            </div>
          </div>
        );
      case 's2': // Castor oil
        return (
          <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-3 border border-slate-200 shadow-inner rounded overflow-hidden">
            <div className="w-9 h-18 bg-[#1a4422] border border-amber-400 rounded flex flex-col justify-between p-1 text-white shadow relative">
              <div className="absolute inset-x-1.5 top-5 bottom-1.5 border border-dashed border-amber-300/30"></div>
              <div className="text-[5px] text-center font-bold text-amber-300 tracking-tight">COSPROF</div>
              <div className="text-[6px] font-bold text-center leading-none text-slate-100">CASTOR OIL</div>
              <div className="text-[4px] text-amber-200 text-center font-serif">HAIRGROW</div>
            </div>
          </div>
        );
      case 's3': // Knife sharpener
        return (
          <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center p-3 border border-neutral-200 shadow-inner rounded overflow-hidden">
            <div className="relative w-20 h-10 flex items-center justify-center">
              <div className="w-16 h-5 bg-red-600 rounded-full border border-red-700 flex items-center justify-around p-0.5">
                <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-800 tracking-tighter">V</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              </div>
              <div className="absolute top-1 w-6 h-1 bg-red-900 border rounded"></div>
            </div>
          </div>
        );
      case 's4': // Kitchen Knife set
        return (
          <div className="absolute inset-0 bg-cyan-50/50 flex flex-col items-center justify-center p-3 border border-cyan-100 shadow-inner rounded overflow-hidden">
            <div className="w-20 h-14 bg-amber-950 border border-amber-900 rounded p-1 flex justify-around items-center shadow-lg relative">
              <div className="absolute top-0.5 right-1 text-[4px] text-amber-200 font-mono">KITCHEN SET</div>
              <div className="w-2 h-10 bg-slate-100 border border-slate-300 rounded shadow-xs transform -rotate-12 flex flex-col justify-between p-0.5">
                <div className="w-1 h-3 bg-red-600 rounded-sm"></div>
              </div>
              <div className="w-2.5 h-11 bg-slate-100 border border-slate-300 rounded shadow-xs transform rotate-6 flex flex-col justify-between p-0.5">
                <div className="w-1.5 h-4 bg-orange-600 rounded-sm"></div>
              </div>
              <div className="w-2 h-9 bg-slate-100 border border-slate-300 rounded shadow-xs transform rotate-45 flex flex-col justify-between p-0.5">
                <div className="w-1 h-2 h- bg-zinc-800 rounded-sm"></div>
              </div>
            </div>
          </div>
        );
      case 's5': // Wottagirl Spray
        return (
          <div className="absolute inset-0 bg-purple-50 flex flex-col items-center justify-center p-3 border border-purple-200 shadow-inner rounded overflow-hidden">
            <div className="w-7 h-18 bg-purple-300/40 border-2 border-purple-400 rounded-xl relative flex flex-col justify-between p-1.5 shadow-md">
              <div className="absolute top-0.5 inset-x-2 h-3 bg-purple-600/60 rounded-t-md"></div>
              <span className="text-[5px] text-purple-950 tracking-tighter text-center mt-3 font-extrabold uppercase leading-none">WottaGirl!</span>
              <span className="text-[4px] text-center text-purple-600 leading-none">Fresh Citrus Splash</span>
            </div>
          </div>
        );
      case 's6': // Lily Creamy Pop lipstick Mat
      case 's7':
      case 's8':
        return (
          <div className="absolute inset-0 bg-rose-50 flex flex-col items-center justify-center p-3 border border-rose-200 shadow-inner rounded overflow-hidden">
            <div className="w-6 h-18 flex flex-col justify-end items-center relative">
              <div className="w-4 h-10 bg-black rounded-b border border-zinc-900 flex flex-col justify-around p-0.5 shadow-md">
                <div className="w-full h-1 bg-amber-400 rounded-sm scale-75"></div>
              </div>
              <div className="absolute top-3 w-3.5 h-5 bg-gold border border-zinc-700 rounded-t-sm flex justify-center pt-0.5 z-5 overflow-hidden">
                <div className="w-2.5 h-6 bg-rose-600 rounded-t-full transform -skew-y-12"></div>
              </div>
            </div>
          </div>
        );

      // Kids Items
      case 'k1': // Fruit pacifier
        return (
          <div className="absolute inset-0 bg-sky-50 flex flex-col items-center justify-center p-3 border border-sky-100 shadow-inner rounded overflow-hidden">
            <div className="w-12 h-16 relative flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border-4 border-sky-400 flex items-center justify-center">
                <div className="w-4 h-4 bg-sky-200 rounded-full"></div>
              </div>
              <div className="w-6 h-6 bg-amber-400 border border-amber-500 rounded-b-md -mt-2"></div>
              <div className="w-4 h-4 bg-lime-300 rounded-full border border-lime-500 z-10 p-0.5"></div>
            </div>
          </div>
        );
      case 'k2': // Barbie Princess
        return (
          <div className="absolute inset-0 bg-pink-50 flex flex-col items-center justify-center p-3 border border-pink-200 shadow-inner rounded overflow-hidden">
            <div className="w-14 h-18 bg-pink-600 rounded border-2 border-white flex flex-col justify-between p-1.5 shadow text-white">
              <span className="text-[7px] font-black italic tracking-widest text-center">Barbie</span>
              <div className="my-auto self-center">
                {/* Visual princess outline using custom text/emoji/svg safely */}
                <span className="text-xl">👸</span>
              </div>
              <span className="text-[5px] uppercase font-bold text-pink-200 text-center">PRINCESS DOLL</span>
            </div>
          </div>
        );
      case 'k3': // Wooden puzzle
        return (
          <div className="absolute inset-0 bg-amber-50/50 flex flex-col items-center justify-center p-3 border border-amber-100 shadow-inner rounded overflow-hidden">
            <div className="w-16 h-14 bg-amber-100 rounded border-2 border-amber-300 grid grid-cols-2 gap-1.5 p-1.5 shadow">
              <div className="bg-red-500 rounded-sm w-full h-full text-[9px] font-extrabold text-white flex items-center justify-center shadow-xs">▲</div>
              <div className="bg-blue-500 rounded-sm w-full h-full text-[9px] font-extrabold text-white flex items-center justify-center shadow-xs">■</div>
              <div className="bg-yellow-500 rounded-sm w-full h-full text-[9px] font-extrabold text-white flex items-center justify-center shadow-xs">●</div>
              <div className="bg-green-500 rounded-sm w-full h-full text-[9px] font-extrabold text-white flex items-center justify-center shadow-xs">★</div>
            </div>
          </div>
        );
      case 'k4': // Plastic baby straw bottle
        return (
          <div className="absolute inset-0 bg-emerald-50/50 flex flex-col items-center justify-center p-3 border border-emerald-100 shadow-inner rounded overflow-hidden">
            <div className="w-8 h-18 bg-emerald-300/40 border-2 border-emerald-400 rounded-xl relative flex flex-col justify-between items-center p-1 shadow-md">
              <div className="w-6 h-4 bg-amber-400 rounded-md flex items-center justify-center shadow-xs">
                {/* Drinking straw handle */}
                <div className="w-4 h-1 bg-amber-500 rounded-full"></div>
              </div>
              <div className="text-[5px] text-emerald-950 font-black mt-4 uppercase">Applebear</div>
              <div className="w-1 h-3 bg-red-500 rounded mb-0.5"></div>
            </div>
          </div>
        );
      case 'k5': // Baby mosquito net
        return (
          <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center p-3 border border-blue-200 shadow-inner rounded overflow-hidden">
            <div className="w-18 h-12 bg-sky-200/50 border border-sky-400 rounded-t-full flex items-center justify-center relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-radial-gradient-net animate-pulse"></div>
              <div className="w-14 h-8 bg-sky-400/20 border border-sky-300 rounded-t-full flex items-center justify-center">
                <span className="text-[5px] text-sky-800 font-bold tracking-tighter uppercase font-mono">MITU HOME NET</span>
              </div>
            </div>
          </div>
        );
      case 'k6': // Philips nipple
      case 'k7':
        return (
          <div className="absolute inset-0 bg-zinc-50 flex flex-col items-center justify-center p-3 border border-zinc-200 shadow-inner rounded overflow-hidden">
            <div className="w-14 h-14 bg-zinc-100/60 border border-zinc-300 rounded-full flex items-center justify-center shadow-inner relative">
              <div className="w-6 h-6 rounded-full border border-zinc-400/40 bg-white/80 shadow-xs flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#E5E7EB] border border-[#CBD5E1]"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-3.5 border-t border-dashed border-zinc-400 rotate-45"></div>
            </div>
          </div>
        );

      default:
        return (
          <img 
            src={getProductImageUrl(product)} 
            alt={product.title} 
            referrerPolicy="no-referrer" 
            className="w-full h-full object-cover rounded" 
          />
        );
    }
  };

  return (
    <div 
      onClick={() => onSelectProduct?.(product)}
      className="bg-white rounded border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 p-2.5 flex flex-col group relative overflow-visible cursor-pointer"
    >
      
      {/* Product Image Stage */}
      <div className="relative w-full aspect-[4/5] bg-neutral-50 rounded mb-2.5 overflow-hidden border border-gray-100/60 shadow-xs flex items-center justify-center">
        {renderProductGraphic()}

        {/* Hover overlay with button actions as in Rokomari UI */}
        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 space-y-2 z-20">
          {product.type === 'book' && (
            <button
              id={`pview-${product.id}`}
              onClick={(e) => { e.stopPropagation(); onPreview(product); }}
              className="w-full bg-white text-slate-800 text-[11px] font-bold py-1.5 px-3 rounded shadow-xs hover:bg-slate-100 hover:text-sky-600 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>একটু পড়ে দেখুন</span>
            </button>
          )}
          <button
            id={`pcart-${product.id}`}
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 text-[11px] font-black py-1.5 px-3 rounded shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>কার্টে যোগ করুন</span>
          </button>
          {onAddToCompare && (
            <button
              id={`pcompare-overlay-${product.id}`}
              onClick={(e) => { e.stopPropagation(); onAddToCompare(product); }}
              className={`w-full text-[11px] font-bold py-1.5 px-3 rounded shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer ${
                isComparing
                  ? 'bg-rose-550 hover:bg-rose-600 text-white border border-rose-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isComparing ? 'সরিয়ে ফেলুন' : 'তুলনা করুন'}</span>
            </button>
          )}
        </div>

        {/* Compare Absolute Button on top-right of image stage */}
        {onAddToCompare && (
          <button
            title={isComparing ? 'তুলনা থেকে সরান' : 'অন্য পণ্যের সাথে তুলনা করুন'}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCompare(product);
            }}
            className={`absolute top-1.5 right-1.5 z-30 p-2 rounded-full transition-all duration-200 border shadow-md flex items-center justify-center cursor-pointer ${
              isComparing
                ? 'bg-amber-400 border-amber-300 text-slate-950 scale-105'
                : 'bg-white/90 hover:bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Favorite Absolute Button */}
        {onToggleFavorite && (
          <button
            title={isFavorite ? 'পছন্দ তালিকা থেকে সরান' : 'পছন্দ তালিকায় যোগ করুন'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`absolute z-30 p-2 rounded-full transition-all duration-200 border shadow-md flex items-center justify-center cursor-pointer ${
              onAddToCompare ? 'top-[46px]' : 'top-1.5'
            } right-1.5 ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                : 'bg-white/95 hover:bg-white border-slate-200 text-slate-400 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 w-10 h-10 bg-red-600 border border-red-500 text-white font-extrabold text-[10.5px] flex flex-col items-center justify-center rounded-full shadow-md z-10 leading-none">
            <span>{product.discountPercent}%</span>
            <span className="text-[8px] font-bold opacity-95 uppercase mt-0.5">OFF</span>
          </div>
        )}

        {/* Media Badges (Video or Multi-image indicator) */}
        {(product.videoUrl || (product.images && product.images.length > 1)) && (
          <div className="absolute bottom-2 left-2 z-20 flex items-center space-x-1 pointer-events-none">
            {product.videoUrl && (
              <span className="bg-indigo-600 text-white text-[8.5px] font-black px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-sm">
                <Play className="w-2.5 h-2.5 fill-white" />
                <span>ভিডিও</span>
              </span>
            )}
            {product.images && product.images.length > 1 && (
              <span className="bg-slate-900/85 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-sm">
                <ImageIcon className="w-2.5 h-2.5" />
                <span>{product.images.length}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        <h3 className="font-sans text-[13.5px] font-bold text-slate-850 leading-snug line-clamp-2 min-h-[2.5rem] tracking-tight group-hover:text-amber-600 transition-colors" title={product.title}>
          {product.title}
        </h3>
        
        {/* Author or Brand */}
        {product.type === 'book' ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewAuthor) {
                onViewAuthor(product.authorOrBrand);
              }
            }}
            className="text-[12px] text-rose-600 hover:text-rose-800 font-bold hover:underline truncate mt-1 text-left cursor-pointer focus:outline-hidden"
            id={`product-author-btn-${product.id}`}
          >
            {product.authorOrBrand}
          </button>
        ) : (
          <span className="text-[12px] text-slate-550 font-semibold truncate mt-1">
            Brand: {product.authorOrBrand}
          </span>
        )}

        {/* Ratings Star Widget */}
        <div className="flex items-center space-x-1 mt-1.5">
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-250'
                }`}
              />
            ))}
          </div>
          <span className="text-[11.5px] text-slate-400 font-bold">({product.totalRatings})</span>
        </div>

        {/* Stock status & Available Sizes indicator - Single Line */}
        <div className="flex flex-nowrap items-center gap-1 mt-1.5 overflow-hidden">
          {product.inStock ? (
            <div className="flex items-center space-x-1 text-[10.5px] text-emerald-600 font-bold bg-emerald-50/70 py-0.5 px-1.5 w-fit rounded-xs shrink-0 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>In Stock</span>
            </div>
          ) : (
            <span className="text-[10.5px] text-red-500 font-bold shrink-0 whitespace-nowrap">Out of Stock</span>
          )}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <span className="text-[9.5px] font-black font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-xs truncate">
              {product.availableSizes.join(',')}
            </span>
          )}
        </div>

        {/* Prices Layout */}
        <div className="flex items-baseline space-x-1.5 mt-2.5 pt-1.5 border-t border-gray-100/70">
          <span className="text-slate-950 font-black text-[15.5px] font-mono whitespace-nowrap">
            TK. {product.discountedPrice}
          </span>
          {product.discountPercent > 0 && (
            <span className="text-slate-400 line-through text-[12px] font-mono">
              TK. {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
