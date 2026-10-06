import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Sparkles, ArrowRight, ShoppingBag, Clock, Percent, Truck } from 'lucide-react';
import { PromoPopupConfig } from '../types';

interface PromoPopupModalProps {
  config: PromoPopupConfig;
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon?: (code: string) => void;
  onNavigateToOffers?: (targetTab?: string) => void;
}

export const DEFAULT_PROMO_POPUP_CONFIG: PromoPopupConfig = {
  isEnabled: true,
  title: 'ছুটির ঘণ্টা অফার',
  subtitle: 'আজ রাত ১১:৫৯ পর্যন্ত',
  highlightText: '১৯৯+ট অর্ডারে ফ্রি শিপিং',
  couponCode: 'CHUTI',
  couponDetails: 'CHUTI কোড ব্যবহারে',
  imageUrl: '',
  buttonText: 'অফারটি গ্রহণ করুন',
  buttonActionUrl: 'offers',
  termsText: '*শর্ত প্রযোজ্য',
  delaySeconds: 1,
  showFrequency: 'once_per_session'
};

export default function PromoPopupModal({
  config = DEFAULT_PROMO_POPUP_CONFIG,
  isOpen,
  onClose,
  onApplyCoupon,
  onNavigateToOffers
}: PromoPopupModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!config.couponCode) return;
    
    navigator.clipboard.writeText(config.couponCode);
    setCopied(true);
    if (onApplyCoupon) {
      onApplyCoupon(config.couponCode);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleActionButton = () => {
    if (config.couponCode && onApplyCoupon) {
      onApplyCoupon(config.couponCode);
    }
    if (onNavigateToOffers) {
      onNavigateToOffers(config.buttonActionUrl || 'offers');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="promo-popup-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all duration-300 font-sans"
          onClick={onClose}
        >
          <motion.div
            id="promo-popup-container"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] sm:max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-400/80 text-slate-800"
          >
            {/* Top Close Button */}
            <button
              id="promo-popup-close-btn"
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white flex items-center justify-center shadow-lg border border-white/30 transition-transform active:scale-90 cursor-pointer"
              title="বন্ধ করুন"
              aria-label="Close promotion modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Custom Full Image Mode if Admin uploaded a dedicated single full banner image */}
            {config.imageUrl ? (
              <div className="relative flex flex-col">
                <div className="relative w-full overflow-hidden bg-slate-100 max-h-[380px] sm:max-h-[420px] flex items-center justify-center">
                  <img
                    src={config.imageUrl}
                    alt={config.title || 'Promotional Offer'}
                    className="w-full h-auto object-cover max-h-[400px]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Action Strip Over Image */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent p-4 pt-10 text-white flex flex-col space-y-2">
                    {config.couponCode && (
                      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-2 px-3">
                        <div className="text-left">
                          <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
                            {config.couponDetails || 'কুপন কোড'}
                          </span>
                          <span className="text-sm font-black font-mono tracking-widest text-white">
                            {config.couponCode}
                          </span>
                        </div>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-transform active:scale-95 shadow cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-900" />
                              <span className="text-emerald-950">কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি করুন</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <button
                      id="promo-popup-action-btn"
                      onClick={handleActionButton}
                      className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <span>{config.buttonText || 'অফারটি উপভোগ করুন'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {config.termsText && (
                  <div className="bg-slate-900 py-1.5 px-4 text-center">
                    <p className="text-[10px] text-slate-400">{config.termsText}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Themed Rokomari Graphic Layout (Replicating the screenshot's exact blue, cyan, and gold festive aesthetic) */
              <div className="relative flex flex-col">
                {/* Header Graphic Gradient Area */}
                <div className="relative bg-gradient-to-b from-[#0084cc] via-[#0298e8] to-[#0ea5e9] pt-7 pb-6 px-6 text-white text-center overflow-hidden">
                  {/* Decorative background circles */}
                  <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute top-1/2 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-lg pointer-events-none" />

                  {/* Brand Tag / Logo Pill */}
                  <div className="inline-flex items-center space-x-1.5 bg-white px-3.5 py-1 rounded-full shadow-md mb-3 border border-sky-100">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-black text-sky-700 tracking-tight">টপসেল</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">স্পেশাল</span>
                  </div>

                  {/* Offer Main Badge Title (ছুটির ঘণ্টা অফার) */}
                  <div className="relative inline-block my-1">
                    <motion.div
                      animate={{ rotate: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xl sm:text-2xl px-6 py-2 rounded-2xl shadow-xl border-2 border-white/60 transform -rotate-1 inline-flex items-center space-x-2"
                    >
                      <Sparkles className="w-5 h-5 text-amber-800 shrink-0" />
                      <span>{config.title || 'ছুটির ঘণ্টা অফার'}</span>
                      <Sparkles className="w-5 h-5 text-amber-800 shrink-0" />
                    </motion.div>
                  </div>

                  {/* Validity / Date Tag */}
                  {config.subtitle && (
                    <div className="mt-3 inline-flex items-center space-x-1.5 bg-sky-950/40 backdrop-blur-xs border border-white/20 text-sky-100 text-[11px] font-bold px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{config.subtitle}</span>
                    </div>
                  )}
                </div>

                {/* Main Offer Body Section */}
                <div className="p-6 bg-gradient-to-b from-sky-50 to-white text-center space-y-4">
                  {/* Highlight Typography (১৯৯+ট অর্ডারে ফ্রি শিপিং) */}
                  <div className="space-y-1">
                    <div className="inline-flex items-center justify-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-lg">
                      <Truck className="w-4 h-4 text-emerald-600 animate-bounce" />
                      <span>ফ্রি ডেলিভারি অফার</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#0077b6] tracking-tight pt-1">
                      {config.highlightText || '১৯৯+ট অর্ডারে ফ্রি শিপিং'}
                    </h3>
                  </div>

                  {/* Visual Icons Cluster / Delivery Rider & Shopping illustration */}
                  <div className="flex items-center justify-center space-x-3 py-1">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 shadow-sm">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-md transform -rotate-3">
                      <Percent className="w-8 h-8" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Truck className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Coupon Code Pill with Copy Action */}
                  {config.couponCode && (
                    <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-3.5 border border-sky-700 shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-xs text-sky-200 font-medium">
                        <span>{config.couponDetails || 'কুপন কোড ব্যবহারে:'}</span>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                          ১০০% কার্যকর
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-slate-900/90 border border-sky-500/40 rounded-xl p-1.5 pl-3">
                        <span className="font-mono font-black text-lg text-amber-300 tracking-widest select-all">
                          {config.couponCode}
                        </span>
                        <button
                          id="promo-popup-copy-btn"
                          onClick={handleCopyCode}
                          className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow transition-all cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-800" />
                              <span className="text-emerald-950 font-bold">কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কোড কপি</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Main Call to Action Button */}
                  <button
                    id="promo-popup-shop-now-btn"
                    onClick={handleActionButton}
                    className="w-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base py-3 rounded-2xl shadow-xl shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-98 cursor-pointer"
                  >
                    <span>{config.buttonText || 'অফারটি গ্রহণ করুন'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Terms disclaimer */}
                  {config.termsText && (
                    <p className="text-[10.5px] text-slate-400 font-medium">
                      {config.termsText}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
