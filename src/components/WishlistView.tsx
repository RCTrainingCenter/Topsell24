import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Heart, ArrowRight, CheckCircle, X, Info, Share2, Copy, Check, Link, Mail } from 'lucide-react';
import { Product } from '../types';
import { getProductImageUrl } from '../lib/bookUtils';

interface WishlistViewProps {
  products: Product[];
  favoriteProductIds: string[];
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onClose?: () => void;
}

export default function WishlistView({
  products,
  favoriteProductIds,
  onToggleFavorite,
  onAddToCart,
  onClose
}: WishlistViewProps) {
  const wishlistItems = products.filter((p) => favoriteProductIds.includes(p.id));
  const [toast, setToast] = useState<{ message: string; type: 'add' | 'remove' | 'success'; id: number } | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const triggerToast = (message: string, type: 'add' | 'remove' | 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // "Move to Cart" adds the product to the cart and removes it from the wishlist
  const handleMoveToCart = (product: Product) => {
    onAddToCart(product);
    onToggleFavorite(product);
    triggerToast(`"${product.title}" সফলভাবে কার্টে যোগ করা হয়েছে!`, 'add');
  };

  const handleRemoveFromWishlist = (product: Product) => {
    onToggleFavorite(product);
    triggerToast(`"${product.title}" উইশলিস্ট থেকে সরানো হয়েছে!`, 'remove');
  };

  return (
    <div className="space-y-6 animate-scale-up" id="wishlist-view-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3" id="wishlist-view-header">
        <div>
          <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
            <span>আমার সংরক্ষিত উইশলিস্ট ({wishlistItems.length})</span>
          </h3>
          <p className="text-[10px] text-slate-450 font-medium">আপনার পছন্দের বই ও পণ্যগুলো সহজে কার্টে যুক্ত করুন</p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            type="button"
            onClick={() => setIsShareOpen(!isShareOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-3xs shrink-0 self-start sm:self-auto ${
              isShareOpen 
                ? 'bg-rose-500 text-white' 
                : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
            }`}
            id="wishlist-share-toggle-btn"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>শেয়ার করুন (Share List)</span>
          </button>
        )}
      </div>

      {/* Share Wishlist Panel */}
      {isShareOpen && wishlistItems.length > 0 && (
        <div 
          className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fade-in" 
          id="wishlist-share-panel"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black text-slate-700 flex items-center space-x-1.5">
              <Link className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>আপনার উইশলিস্ট লিংকটি বন্ধুদের সাথে শেয়ার করুন:</span>
            </h4>
            <button 
              type="button"
              onClick={() => setIsShareOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Copyable input group */}
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              readOnly 
              value={`${window.location.origin}${window.location.pathname}?shared_wishlist=${encodeURIComponent(wishlistItems.map(item => item.id).join(','))}`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg text-slate-600 focus:outline-none select-all font-mono"
              id="wishlist-share-url-input"
            />
            <button
              type="button"
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?shared_wishlist=${encodeURIComponent(wishlistItems.map(item => item.id).join(','))}`;
                navigator.clipboard.writeText(url);
                setCopied(true);
                triggerToast('শেয়ারিং লিংকটি সফলভাবে কপি করা হয়েছে! 📋', 'success');
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg cursor-pointer transition-colors flex items-center space-x-1 shadow-3xs shrink-0"
              id="wishlist-share-copy-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Share Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* WhatsApp */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('আমার পছন্দের উইশলিস্টটি দেখুন: ' + `${window.location.origin}${window.location.pathname}?shared_wishlist=${wishlistItems.map(i => i.id).join(',')}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
            >
              <span className="font-sans">WhatsApp</span>
            </a>

            {/* Email */}
            <a 
              href={`mailto:?subject=${encodeURIComponent('My Saved Wishlist Items')}&body=${encodeURIComponent('Hey! Check out my saved wishlist items here: ' + `${window.location.origin}${window.location.pathname}?shared_wishlist=${wishlistItems.map(i => i.id).join(',')}`)}`}
              className="bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>Email</span>
            </a>

            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?shared_wishlist=${wishlistItems.map(i => i.id).join(',')}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
            >
              <span>Facebook</span>
            </a>
          </div>
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-150 rounded-2xl space-y-4" id="wishlist-empty-state">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">আপনার উইশলিস্টটি খালি আছে!</h4>
            <p className="text-[10.5px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              পণ্য বা বই দেখার সময় "পছন্দের তালিকা" বা হার্ট আইকনে ক্লিক করে সহজেই এখানে সেভ করে রাখতে পারেন।
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 transition-colors text-slate-950 font-black text-[11px] py-2 px-5 rounded-lg inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
              id="wishlist-explore-btn"
            >
              <span>টপসেলে কেনাকাটা শুরু করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="wishlist-items-grid">
          {wishlistItems.map((prod) => {
            const imageUrl = getProductImageUrl(prod);
            const hasDiscount = prod.originalPrice && prod.originalPrice > prod.discountedPrice;

            return (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 relative group"
                id={`wishlist-item-${prod.id}`}
              >
                {/* Remove button at top-right corner */}
                <button
                  onClick={() => handleRemoveFromWishlist(prod)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all cursor-pointer z-10 shadow-3xs"
                  title="উইশলিস্ট থেকে মুছুন"
                  id={`wishlist-remove-btn-${prod.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-3">
                  {/* Product visual cover representation */}
                  <div className="h-32 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-center overflow-hidden text-center relative shadow-3xs">
                    <img
                      src={imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    
                    {/* Badge */}
                    {prod.badgeText && (
                      <span className="absolute top-2 left-2 bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide shadow-xs">
                        {prod.badgeText}
                      </span>
                    )}

                    {/* Stock Status indicator */}
                    {!prod.inStock && (
                      <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-white text-[10px] font-bold">
                        স্টক আউট (Out of Stock)
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded uppercase inline-block">
                      {prod.type === 'book' ? 'বই' : prod.category}
                    </span>
                    <h4 className="text-[11.5px] font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-rose-550 transition-colors" title={prod.title}>
                      {prod.title}
                    </h4>
                    <p className="text-[10px] text-slate-450 font-semibold truncate">
                      {prod.authorOrBrand}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  {/* Price info row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-rose-600 text-[13px] font-black font-mono">৳{prod.discountedPrice}</span>
                      {hasDiscount && (
                        <span className="text-[10.5px] text-slate-400 line-through font-mono">৳{prod.originalPrice}</span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className="text-[9px] bg-rose-50 text-rose-600 font-bold px-1 py-0.2 rounded border border-rose-100 font-mono">
                        -{prod.discountPercent || Math.round(((prod.originalPrice - prod.discountedPrice) / prod.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Move directly to Cart action button */}
                  <button
                    onClick={() => handleMoveToCart(prod)}
                    disabled={!prod.inStock}
                    className={`w-full py-2 px-3 rounded-lg text-[10.5px] font-black transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer ${
                      prod.inStock
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-97'
                        : 'bg-slate-100 text-slate-400 border border-slate-150 cursor-not-allowed'
                    }`}
                    id={`wishlist-move-btn-${prod.id}`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>কার্টে নিয়ে যান (Move to Cart)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 max-w-sm p-4 rounded-xl shadow-lg border text-white ${
            toast.type === 'add'
              ? 'bg-slate-900 border-slate-800'
              : toast.type === 'success'
              ? 'bg-emerald-900 border-emerald-800 text-emerald-50'
              : 'bg-rose-950 border-rose-900 text-rose-100'
          }`}
          style={{
            animation: 'toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          id="wishlist-toast-notification"
        >
          <style>{`
            @keyframes toastSlideIn {
              from { transform: translateX(120%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
          {toast.type === 'add' || toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="flex-1 text-[11px] font-bold leading-snug">
            {toast.message}
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white/70 hover:text-white"
            id="wishlist-toast-close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
