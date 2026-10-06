import { X, BookOpen, Quote, Sparkles, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';
import { getBookCoverUrl } from '../lib/bookUtils';

interface BookPreviewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onViewAuthor?: (authorName: string) => void;
}

export default function BookPreviewModal({ product, onClose, onAddToCart, onViewAuthor }: BookPreviewProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (!product) return null;

  const chapters = product.previewChapters || [
    { title: 'সূচনা', content: 'এই অসাধারণ বইটির বিস্তারিত সূচিপত্র ও নমুনা অধ্যায় খুব শীঘ্রই যুক্ত করা হবে। কেনাকাটার সাথেই থাকুন।' },
  ];

  const handleBuy = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card container */}
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[70vh] z-10 overflow-hidden animate-scale-up border border-slate-100">
        
        {/* Left column: product visual, publisher & Purchase Buttons */}
        <div className="w-full md:w-64 bg-slate-50 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-150 flex-shrink-0">
          <div className="space-y-4">
            <div className="flex justify-between items-start md:block">
              <span className="bg-sky-50 text-sky-700 text-[10px] font-black tracking-wider px-2 py-0.5 rounded uppercase font-mono block w-fit mb-2">
                কেনাকাটা একটু পড়ে দেখুন
              </span>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 md:hidden cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated cover graphic or real book cover image */}
            <div className="w-32 h-44 bg-slate-100 border border-slate-200 rounded-md shadow-lg mx-auto flex flex-col justify-between p-3.5 select-none relative overflow-hidden">
              {product.imageUrl && (
                <img 
                  src={getBookCoverUrl(product.imageUrl)} 
                  alt={product.title} 
                  referrerPolicy="no-referrer" 
                  className="absolute inset-0 w-full h-full object-cover z-0" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-1"></div>
              
              {/* Cover visual representation text overlays */}
              <div className="relative z-10 text-[7px] font-bold text-slate-100 uppercase font-mono tracking-wider">
                RM ORIGINAL PREVIEW
              </div>
              <div className="relative z-10 text-center my-auto space-y-1">
                <div className="text-[11px] font-black text-white leading-tight drop-shadow-md line-clamp-2">
                  {product.title}
                </div>
                <div className="text-[8px] text-slate-200 truncate drop-shadow-sm">
                  {product.authorOrBrand}
                </div>
              </div>
              <div className="relative z-10 bg-amber-400 text-slate-900 text-[8px] py-0.5 text-center font-bold rounded-sm shadow-xs">
                SAMPLE PREVIEW
              </div>
            </div>

            {/* Info panel */}
            <div className="text-center md:text-left space-y-1 pt-2">
              <h3 className="text-sm font-black text-slate-800 leading-tight">{product.title}</h3>
              <div className="flex items-center justify-center md:justify-start">
                {onViewAuthor ? (
                  <button
                    type="button"
                    onClick={() => onViewAuthor(product.authorOrBrand)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer focus:outline-hidden"
                  >
                    {product.authorOrBrand}
                  </button>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">{product.authorOrBrand}</p>
                )}
              </div>
              {product.publisherCompany && (
                <p className="text-[10px] text-slate-400 font-semibold font-sans">প্রকাশনী: {product.publisherCompany}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4 md:mt-0">
            <div className="flex justify-between items-baseline p-2 bg-white rounded border border-gray-150">
              <span className="text-[10px] font-medium text-slate-400">কেনাকাটা মূল্য :</span>
              <span className="text-sm font-black text-indigo-600 font-mono">TK. {product.discountedPrice}</span>
            </div>
            
            <button
              onClick={handleBuy}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs py-2 rounded shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>কার্টে যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Right column: reading stage with chapters selector */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-150 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center space-x-2 text-slate-700">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <span className="font-bold text-xs md:text-sm font-sans">নমুনা সুচিপত্র ও বইয়ের পাতা ({chapters.length} অধ্যায়)</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-800 hidden md:block cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chapters tab line */}
          <div className="flex border-b border-gray-150 bg-slate-50 overflow-x-auto scrollbar-none flex-shrink-0">
            {chapters.map((chap, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChapterIndex(idx)}
                className={`px-4 py-2.5 text-xs font-bold leading-tight font-sans border-r border-gray-150 shrink-0 cursor-pointer ${
                  activeChapterIndex === idx
                    ? 'bg-white text-sky-600 border-t-2 border-t-sky-500 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {chap.title}
              </button>
            ))}
          </div>

          {/* Chapters content page body */}
          <div className="flex-1 p-5 overflow-y-auto bg-amber-50/10 min-w-0">
            <div className="prose max-w-none space-y-4">
              <div className="flex items-center space-x-1 text-slate-400">
                <Quote className="w-4 h-4 text-sky-300" />
                <span className="text-[10px] font-semibold tracking-wider font-mono">KENAKATA SAMPLE PAGE READER</span>
              </div>
              <h2 className="text-md font-black text-slate-800 font-sans border-b border-gray-150 pb-2">
                {chapters[activeChapterIndex].title}
              </h2>
              <p className="text-slate-700 leading-relaxed font-sans text-xs sm:text-sm whitespace-pre-wrap p-3.5 bg-yellow-50/40 border border-yellow-105 rounded-xl text-justify shadow-xs">
                {chapters[activeChapterIndex].content}
              </p>
              
              <div className="flex items-center space-x-1.5 p-3.5 bg-sky-50/40 border border-sky-100 rounded-lg text-[11px] text-sky-800 leading-relaxed font-sans">
                <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                <span>এটি বইটির একটি সংক্ষিপ্ত নমুনা পাতা। পুরো বইটি পড়তে এবং আপনার সংকলনে সাজাতে কার্টে যোগ করুন!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
