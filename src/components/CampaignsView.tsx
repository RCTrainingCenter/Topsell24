import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock, ShoppingBag, Gift, Percent, Flame, 
  Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Share2
} from 'lucide-react';
import { Product, Campaign } from '../types';
import { getProductImageUrl } from '../lib/bookUtils';

interface CampaignsViewProps {
  campaigns: Campaign[];
  products: Product[];
  onAddToCart: (product: Product, customPrice?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export default function CampaignsView({
  campaigns,
  products,
  onAddToCart,
  onSelectProduct,
}: CampaignsViewProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Active campaigns
  const activeCampaigns = campaigns.filter(c => c.isActive);

  // Selected Campaign details
  const currentCampaign = campaigns.find(c => c.id === selectedCampaignId);

  // Get products included in the current campaign
  const campaignProducts = currentCampaign 
    ? products.filter(p => currentCampaign.productIds.includes(p.id))
    : [];

  // Calculate campaign price for a product based on campaign discount
  const getCampaignPrice = (product: Product, discountPercent: number) => {
    return Math.round(product.originalPrice * (1 - discountPercent / 100));
  };

  // Calculate total combo original and campaign price
  const originalTotalPrice = campaignProducts.reduce((sum, p) => sum + p.originalPrice, 0);
  const regularDiscountedPrice = campaignProducts.reduce((sum, p) => sum + p.discountedPrice, 0);
  const comboTotalPrice = currentCampaign 
    ? campaignProducts.reduce((sum, p) => sum + getCampaignPrice(p, currentCampaign.discountPercent), 0)
    : 0;

  const handleAddAllToCart = () => {
    if (!currentCampaign) return;
    campaignProducts.forEach(p => {
      onAddToCart(p, getCampaignPrice(p, currentCampaign.discountPercent));
    });
    setShowToast(`🎉 সফলভাবে "${currentCampaign.title}" কম্বো প্যাকের সকল পণ্য বিশেষ মূল্যে কার্টে যোগ করা হয়েছে!`);
    setTimeout(() => {
      setShowToast(null);
    }, 4000);
  };

  if (currentCampaign) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <button
            onClick={() => setSelectedCampaignId(null)}
            className="flex items-center space-x-2 text-xs font-black text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-500" />
            <span>সকল ক্যাম্পেইন অফারে ফিরে যান</span>
          </button>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono font-bold uppercase">
            <span>Campaign Ref:</span>
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px]">{currentCampaign.id}</span>
          </div>
        </div>

        {/* Campaign Hero Block */}
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl overflow-hidden relative shadow-lg">
          {/* Cover image with linear gradient overlay */}
          <div className="relative h-48 md:h-72 w-full">
            <img 
              src={currentCampaign.bannerImage} 
              alt={currentCampaign.title}
              className="w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
            
            {/* Absolute Badges on Cover */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="bg-rose-600 text-white text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center space-x-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>HOT COMBO OFFER</span>
              </span>
              {currentCampaign.giftDetails && (
                <span className="bg-emerald-600 text-white text-[9.5px] font-black px-2.5 py-1 rounded-md flex items-center space-x-1 shadow-sm">
                  <Gift className="w-3.5 h-3.5 text-amber-200" />
                  <span>উপহার নিশ্চিত</span>
                </span>
              )}
            </div>
          </div>

          {/* Content panel overlaying hero */}
          <div className="p-6 md:p-8 space-y-5 -mt-16 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {currentCampaign.discountPercent}% OFF BUNDLE
                </span>
                <span className="bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>১০০% অথেন্টিক টপসেল গ্যারান্টি</span>
                </span>
              </div>

              <h1 className="text-lg md:text-2xl font-black text-amber-300 leading-tight">
                {currentCampaign.title}
              </h1>
              
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {currentCampaign.description}
              </p>
            </div>

            {/* Countdown and Actions Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              {/* Live Countdown Timer */}
              <CountdownTimer targetDate={currentCampaign.endDate} />

              {/* Combo Summary Panel & 1-Click Buy */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Bundle Pricing</span>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className="text-xl font-black text-amber-400 font-mono">৳{comboTotalPrice}</span>
                      <span className="text-xs text-slate-400 line-through font-mono">৳{originalTotalPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-bold block">সরাসরি সঞ্চয়</span>
                    <strong className="text-xs text-emerald-400 font-mono">৳{originalTotalPrice - comboTotalPrice} ({currentCampaign.discountPercent}%)</strong>
                  </div>
                </div>

                <button
                  onClick={handleAddAllToCart}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>পুরো কম্বো প্যাক একসাথে কিনুন (৳{comboTotalPrice})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gift or Bonus Offer highlight */}
        {currentCampaign.giftDetails && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-3 text-emerald-900 shadow-2xs">
            <span className="text-2xl mt-0.5">🎁</span>
            <div className="space-y-0.5 flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">বোনাস অফার ও গিফট আইটেম:</h4>
              <p className="text-xs font-bold font-sans">
                {currentCampaign.giftDetails}। এই ক্যাম্পেইনের কম্বো অর্ডার করলে গিফট আইটেমটি আপনার শিপিং কার্টনে স্বয়ংক্রিয়ভাবে প্যাক করা হবে।
              </p>
            </div>
          </div>
        )}

        {/* Combo Items Section Header */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>কম্বো অফারের অন্তর্ভুক্ত আইটেম সমূহ ({campaignProducts.length})</span>
            </h3>
          </div>

          {campaignProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              দুঃখিত, এই ক্যাম্পেইনের কোন পণ্য তালিকায় পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {campaignProducts.map((product) => {
                const cmpPrice = getCampaignPrice(product, currentCampaign.discountPercent);
                return (
                  <div 
                    key={product.id}
                    className="bg-white border border-slate-250 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative bg-slate-50 p-4 flex justify-center items-center h-44 border-b border-slate-100 group">
                      <img 
                        src={getProductImageUrl(product)} 
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* Hot Sale Badge */}
                      <span className="absolute top-2 left-2 bg-rose-600 text-white text-[8px] font-bold py-0.5 px-2 rounded-full shadow-2xs">
                        {currentCampaign.discountPercent}% OFF
                      </span>
                    </div>

                    {/* Description info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h4 
                          onClick={() => onSelectProduct(product)}
                          className="text-xs font-black text-slate-800 line-clamp-2 leading-snug hover:text-sky-600 cursor-pointer transition-colors"
                        >
                          {product.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {product.type === 'book' ? 'লেখক:' : 'ব্র্যান্ড:'} <strong className="text-slate-700">{product.authorOrBrand}</strong>
                        </p>
                      </div>

                      {/* Pricing block with custom combo pricing details */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-400 font-bold">সাধারণ মূল্য:</span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold line-through">৳{product.discountedPrice}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-amber-50/70 border border-amber-200/50 p-1.5 rounded-lg">
                          <span className="text-[10px] text-amber-850 font-black">কম্বো মূল্য:</span>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-xs text-slate-400 line-through font-mono">৳{product.originalPrice}</span>
                            <span className="text-sm font-extrabold text-slate-900 font-mono">৳{cmpPrice}</span>
                          </div>
                        </div>

                        {/* Button control */}
                        <button
                          onClick={() => onAddToCart(product, cmpPrice)}
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-[11px] py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>কার্টে যোগ করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-emerald-500/30 text-white font-sans text-xs font-bold py-3.5 px-6 rounded-xl shadow-2xl z-50 flex items-center space-x-2.5 animate-scale-up max-w-[90%] md:max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{showToast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Intro Panel banner */}
      <div className="p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 rounded-xl text-white space-y-2 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient-net opacity-10"></div>
        <div className="max-w-xl space-y-1 relative z-10">
          <span className="bg-white/25 text-white font-mono text-[9px] py-0.5 px-2 rounded font-black uppercase inline-block">CAMPAIGNS & COMBO PACKS</span>
          <h2 className="text-sm sm:text-xl font-black">টপসেল ধামাকা কম্বো অফারসমূহ!</h2>
          <p className="text-[11px] text-indigo-150 font-medium">
            একাধিক আকর্ষণীয় পণ্য একসাথে কিনুন আরও বেশি ছাড়ে। আমাদের রিয়েল-টাইম অফার ক্যাম্পেইনগুলো নিচে দেখুন এবং সরাসরি লুফে নিন!
          </p>
        </div>
      </div>

      {activeCampaigns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-2xs">
          <span className="text-3xl block">🎁</span>
          <h3 className="text-sm font-black text-slate-700">আপাতত কোন অফার ক্যাম্পেইন নেই</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            এডমিন কন্ট্রোল প্যানেল থেকে খুব শীঘ্রই নতুন ধামাকা কম্বো অফার যোগ করা হচ্ছে! নিয়মিত চোখ রাখুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCampaigns.map((campaign) => (
            <div 
              key={campaign.id}
              onClick={() => setSelectedCampaignId(campaign.id)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer group"
            >
              {/* Image banner */}
              <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                <img 
                  src={campaign.bannerImage} 
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                
                {/* Badges on card thumbnail */}
                <div className="absolute top-3 left-3">
                  <span className="bg-rose-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
                    {campaign.discountPercent}% OFF
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[9px] bg-slate-900/60 font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-2xs">
                    {campaign.productIds.length} টি পণ্য একসাথে
                  </span>
                </div>
              </div>

              {/* Text metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                {/* Bottom link bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-150 text-[11px] text-slate-400 font-sans">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-bold text-slate-600 text-[10px]">অফার শেষ হতে চলেছে</span>
                  </div>
                  <span className="font-black text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-0.5 text-[10.5px]">
                    <span>বিস্তারিত দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Interactive Realtime Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: any = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-center">
      <span className="text-[9px] text-rose-400 font-black tracking-widest uppercase mb-1.5 text-center flex items-center justify-center space-x-1 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
        <span>COUNTDOWN TO DEADLINE</span>
      </span>
      
      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
        <div className="bg-slate-900 border border-slate-800 rounded-md p-1">
          <strong className="text-sm font-black text-amber-400 block leading-none">{String(timeLeft.days).padStart(2, '0')}</strong>
          <span className="text-[7.5px] text-slate-500 block uppercase font-sans font-bold mt-1">Days</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-md p-1">
          <strong className="text-sm font-black text-amber-400 block leading-none">{String(timeLeft.hours).padStart(2, '0')}</strong>
          <span className="text-[7.5px] text-slate-500 block uppercase font-sans font-bold mt-1">Hours</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-md p-1">
          <strong className="text-sm font-black text-amber-400 block leading-none">{String(timeLeft.minutes).padStart(2, '0')}</strong>
          <span className="text-[7.5px] text-slate-500 block uppercase font-sans font-bold mt-1">Mins</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-md p-1">
          <strong className="text-sm font-black text-amber-400 block leading-none">{String(timeLeft.seconds).padStart(2, '0')}</strong>
          <span className="text-[7.5px] text-slate-500 block uppercase font-sans font-bold mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}
