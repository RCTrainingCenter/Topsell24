import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Gift } from 'lucide-react';
import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder?: (order: {
    id: string;
    clientName: string;
    phone: string;
    address: string;
    itemsCount: number;
    totalPrice: number;
    status: string;
    date: string;
    customerUid?: string;
  }) => void;
  loggedInUser?: { name: string; emailOrPhone: string; isAdmin: boolean; photoURL?: string; phoneNumber?: string; deliveryAddress?: string } | null;
  coupons?: Coupon[];
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  loggedInUser,
  coupons = [],
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any | null>(null);
  
  // Pre-fill fields if user is logged in
  const [shippingAddress, setShippingAddress] = useState(() => {
    if (loggedInUser) {
      return loggedInUser.deliveryAddress || 'রোড ০৪, সেক্টর ১১, উত্তরা মডেল টাউন, ঢাকা-১২৩০।';
    }
    return '';
  });
  const [customerName, setCustomerName] = useState(() => loggedInUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => loggedInUser ? (loggedInUser.phoneNumber || (loggedInUser.emailOrPhone?.includes('@') ? '' : loggedInUser.emailOrPhone)) || '' : '');
  const [customerEmail, setCustomerEmail] = useState(() => loggedInUser && loggedInUser.emailOrPhone?.includes('@') ? loggedInUser.emailOrPhone || '' : '');

  // Update when user state changes
  React.useEffect(() => {
    if (loggedInUser) {
      if (!customerName) setCustomerName(loggedInUser.name);
      // Pre-populate phone if not empty
      const phoneValue = loggedInUser.phoneNumber || (loggedInUser.emailOrPhone.includes('@') ? '' : loggedInUser.emailOrPhone);
      if (!customerPhone && phoneValue) setCustomerPhone(phoneValue);
      // Pre-populate address
      const addressValue = loggedInUser.deliveryAddress || 'রোড ০৪, সেক্টর ১১, উত্তরা মডেল টাউন, ঢাকা-১২৩০।';
      if (!shippingAddress) setShippingAddress(addressValue);
      // Pre-populate email
      const emailValue = loggedInUser.emailOrPhone.includes('@') ? loggedInUser.emailOrPhone : '';
      if (!customerEmail && emailValue) setCustomerEmail(emailValue);
    }
  }, [loggedInUser]);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    
    // Find matching coupon from database
    const matchingCoupon = coupons.find(c => c.code.toUpperCase() === code);
    
    if (matchingCoupon) {
      if (!matchingCoupon.isActive) {
        setPromoMessage('দুঃখিত, এই প্রোমো কোডটি বর্তমানে নিষ্ক্রিয় রয়েছে!');
        setDiscountPercent(0);
        return;
      }
      
      const todayStr = new Date().toISOString().slice(0, 10);
      if (matchingCoupon.expiryDate && todayStr > matchingCoupon.expiryDate) {
        setPromoMessage('দুঃখিত, এই কুপন কোডটির মেয়াদ শেষ হয়ে গেছে!');
        setDiscountPercent(0);
        return;
      }
      
      const currentSubtotal = getSubtotal();
      if (currentSubtotal < matchingCoupon.minPurchase) {
        setPromoMessage(`এই কুপনটি ব্যবহারের জন্য নূন্যতম ৳${matchingCoupon.minPurchase} টপসেলে শপিং করা আবশ্যক! বর্তমানে ৳${currentSubtotal} রয়েছে।`);
        setDiscountPercent(0);
        return;
      }
      
      setDiscountPercent(matchingCoupon.discountPercent);
      setPromoMessage(`প্রোমো কোড ${matchingCoupon.code} সফলভাবে প্রয়োগ করা হয়েছে: ${matchingCoupon.discountPercent}% বিশেষ ছাড়!`);
    } else {
      setPromoMessage('ভুল বা অবৈধ প্রোমো কোড! সঠিক কোড দিয়ে আবার চেষ্টা করুন।');
      setDiscountPercent(0);
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.discountedPrice * item.quantity, 0);
  };

  const subtotal = getSubtotal();
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingCharge = subtotal > 1500 || subtotal === 0 ? 0 : 50; // free shipping over 1500
  const grandTotal = subtotal - discountAmount + shippingCharge;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      alert('অনুগ্রহ করে সঠিক তথ্য প্রদান করুন!');
      return;
    }

    const storedAffiliateRef = typeof window !== 'undefined' ? localStorage.getItem('rokomari_affiliate_ref') : null;
    const orderedItemsSummary = cartItems.map((item) => {
      const variantParts = [
        item.product.selectedSize ? `Size: ${item.product.selectedSize}` : '',
        item.product.selectedColor ? `Color: ${item.product.selectedColor}` : ''
      ].filter(Boolean).join(', ');
      return `${item.product.title}${variantParts ? ` (${variantParts})` : ''} × ${item.quantity}`;
    }).join(' | ');

    const newOrder = {
      id: 'RM-' + Math.floor(100000 + Math.random() * 900000),
      clientName: customerName,
      phone: customerPhone,
      address: shippingAddress,
      email: customerEmail || (loggedInUser && loggedInUser.emailOrPhone.includes('@') ? loggedInUser.emailOrPhone : ''),
      itemsCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: grandTotal,
      status: 'Pending',
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      customerUid: loggedInUser ? loggedInUser.emailOrPhone : 'guest',
      affiliateRef: storedAffiliateRef || undefined,
      affiliateCommission: storedAffiliateRef ? Math.round(grandTotal * 0.10) : undefined,
      itemsSummary: orderedItemsSummary
    };

    if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }

    setLastPlacedOrder(newOrder);
    setIsCheckedOut(true);
  };

  const handleCloseSuccess = () => {
    onClearCart();
    setIsCheckedOut(false);
    setLastPlacedOrder(null);
    setPromoCode('');
    setDiscountPercent(0);
    setPromoMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Inside drawer body */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10 overflow-hidden transform animate-slide-left">
        {/* Drawer Header */}
        <div className="bg-slate-50 border-b border-gray-150 px-5 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-sky-600" />
            <span className="font-bold text-slate-800 font-sans text-[14.5px]">Shopping Cart ({cartItems.length} items)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-850 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCheckedOut ? (
          /* Checked out popup success screen on submit */
          <div className="p-6 flex flex-col items-center justify-center my-auto text-center space-y-4 overflow-y-auto max-h-[85vh]">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-scale-up">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-sans">অর্ডার সম্পন্ন হয়েছে!</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-sm">
              আমাদের কাস্টমার কেয়ার টিম অতি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। আপনার অর্ডার আইডি: 
              <span className="font-bold text-sky-600 ml-1 font-mono">{lastPlacedOrder?.id}</span>
            </p>

            {/* Email Notification Status Box */}
            {lastPlacedOrder?.email && (
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-left w-full text-[11px] text-sky-800 flex items-start gap-2.5 shadow-3xs">
                <span className="text-[14px] mt-0.5 animate-pulse">📨</span>
                <div className="space-y-0.5">
                  <strong className="block font-extrabold text-sky-900">ইমেইল রসিদ পাঠানো হয়েছে!</strong>
                  <span className="text-slate-650 font-medium">Firebase Cloud Functions (v2) ট্রিগার হয়ে স্বয়ংক্রিয়ভাবে একটি কনফার্মেশন রসিদ আপনার ইমেইল এড্রেসে পাঠিয়েছে:</span>
                  <span className="block font-bold font-mono text-slate-800 mt-1 select-all underline decoration-sky-300 decoration-1">{lastPlacedOrder.email}</span>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-gray-150 rounded-lg p-3.5 text-left w-full text-xs space-y-1.5 font-sans">
              <div><strong>ক্রেতার নাম:</strong> {customerName}</div>
              <div><strong>মোবাইল নাম্বার:</strong> {customerPhone}</div>
              <div><strong>ডেলিভারি ঠিকানা:</strong> {shippingAddress}</div>
              {lastPlacedOrder?.email && (
                <div><strong>ইমেইল এড্রেস:</strong> {lastPlacedOrder.email}</div>
              )}
              <div className="pt-1.5 border-t border-dashed border-slate-200">
                <strong>মোট পরিশোধযোগ্য মূল্য:</strong> TK. {grandTotal}
              </div>
            </div>
            <button
              id="checkout-success-done"
              onClick={handleCloseSuccess}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded font-bold shadow-xs transition-colors cursor-pointer"
            >
              আজকের কেনাকাটা সম্পন্ন করুন
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty state screen inside cart */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 border border-dashed border-slate-200 rounded-full flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <h3 className="text-[14px] font-bold text-slate-700 font-sans">আপনার কার্টটি চমৎকারভাবে খালি!</h3>
            <p className="text-xs text-slate-400 font-sans max-w-xs">
              বইমেলা ২০২৬, টপসেল ইলেকট্রনিক্স এবং সুপারস্টোর থেকে আপনার পছন্দের পণ্যগুলো কার্টে যোগ করুন।
            </p>
            <button
              onClick={onClose}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2 px-5 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              টপসেলে কেনাকাটা শুরু করুন
            </button>
          </div>
        ) : (
          /* Active cart checklist and inputs */
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            {/* 1. Items List */}
            <div className="p-4 space-y-3 Divide-y divide-gray-100 flex-1 max-h-[48vh] overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex space-x-3 items-start justify-between">
                  <div className="flex space-x-2.5 items-start flex-1 min-w-0">
                    <div className="w-12 h-14 bg-slate-50 rounded border border-slate-200 flex items-center justify-center flex-shrink-0 text-[8px] font-bold text-slate-500 relative">
                      <span className="text-[14px]">{item.product.type === 'book' ? '📚' : '🔌'}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[12px] font-bold text-slate-800 truncate leading-tight" title={item.product.title}>
                        {item.product.title}
                      </h4>
                      {(item.product.selectedSize || item.product.selectedColor) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.product.selectedSize && (
                            <span className="text-[9.5px] font-black font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                              Size: {item.product.selectedSize}
                            </span>
                          )}
                          {item.product.selectedColor && (
                            <span className="text-[9.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.2 rounded">
                              Color: {item.product.selectedColor}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 font-semibold mt-1">
                        TK. {item.product.discountedPrice} × {item.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Quantity adjustments */}
                  <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                    <div className="flex items-center space-x-1.5 border border-slate-200 rounded overflow-hidden p-0.5 bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-50 hover:bg-white rounded cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black px-1.5 text-slate-800 font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-rose-50 cursor-pointer"
                      title="আইটেম মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Promo Coupons code applicator */}
            <div className="border-t border-gray-150 p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center font-semibold">
                  <Tag className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                  প্রোমো কোড প্রয়োগ করুন {coupons.filter(c => c.isActive).length > 0 ? `(${coupons.filter(c => c.isActive).map(c => c.code).join(', ')})` : ''}
                </span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="EX: KENAKATA10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono tracking-widest focus:outline-hidden"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-4 py-1.5 rounded font-bold cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <div className={`text-[10.5px] font-bold ${discountPercent > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {promoMessage}
                </div>
              )}
            </div>

            {/* 3. Checkout delivery form */}
            <form onSubmit={handleCheckoutSubmit} className="border-t border-gray-150 p-4 space-y-3 bg-white">
              <h4 className="text-xs font-bold text-slate-700 font-sans">Shipment Delivery Details</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="আপনার নাম (EX: Rakhal)"
                  required
                  value={customerName || ''}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
                <input
                  type="tel"
                  placeholder="মোবাইল নাম্বার (EX: 01700000000)"
                  required
                  value={customerPhone || ''}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-hidden"
                />
                <input
                  type="email"
                  placeholder="ইমেইল এড্রেস (EX: rakhal@gmail.com) *"
                  required
                  value={customerEmail || ''}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-hidden font-sans"
                />
                <textarea
                  placeholder="আপনার সম্পূর্ণ ডেলিভারি ঠিকানা..."
                  required
                  value={shippingAddress || ''}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-hidden resize-none h-14"
                />
              </div>

              {/* Dynamic Bills Breakdown */}
              <div className="pt-2 border-t border-dashed border-gray-150 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>সর্বমোট মূল্য:</span>
                  <span className="font-mono">TK. {subtotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>প্রোমো ডিসকাউন্ট ({discountPercent}%):</span>
                    <span className="font-mono">- TK. {discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono">
                    {shippingCharge === 0 ? 'FREE' : `TK. ${shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 font-black text-sm pt-1 border-t border-gray-100">
                  <span>সর্বমোট বিল:</span>
                  <span className="font-mono text-indigo-600">TK. {grandTotal}</span>
                </div>
                {shippingCharge > 0 && (
                  <p className="text-[9.5px] text-amber-600  font-medium italic text-right mt-1">
                    * ১৫০০ টাকার উপরে পণ্য কিনলে ফ্রি শিপিং!
                  </p>
                )}
              </div>

              {/* Order checkout submit trigger */}
              <button
                id="cart-submit-checkout-btn"
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs py-2.5 rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>অর্ডার কনফার্ম করুন (TK. {grandTotal})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
