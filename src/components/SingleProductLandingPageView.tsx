import React, { useState, useEffect, useRef } from 'react';
import { SingleProductLandingPage, Product } from '../types';
import { 
  Check, 
  Clock, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  PhoneCall, 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Flame,
  Award,
  ChevronRight,
  Headphones,
  CreditCard
} from 'lucide-react';

interface SingleProductLandingPageViewProps {
  landingPage: SingleProductLandingPage;
  products: Product[];
  hotline?: string;
  onBack: () => void;
  onPlaceOrder: (order: any) => void;
  onSelectProduct?: (product: Product) => void;
  loggedInUser?: any;
}

export default function SingleProductLandingPageView({
  landingPage,
  products,
  hotline = '16297',
  onBack,
  onPlaceOrder,
  onSelectProduct,
  loggedInUser
}: SingleProductLandingPageViewProps) {
  const linkedProduct = products.find(p => p.id === landingPage.productId);

  // Form State
  const [customerName, setCustomerName] = useState(loggedInUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(loggedInUser?.emailOrPhone || '');
  const [customerAddress, setCustomerAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Active Gallery Image
  const allImages = [
    landingPage.bannerImageUrl,
    ...(landingPage.galleryImages || []),
    linkedProduct?.imageUrl,
    ...(linkedProduct?.images || [])
  ].filter(Boolean) as string[];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: landingPage.countdownHours || 8,
    minutes: 42,
    seconds: 19
  });

  const orderFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToOrderForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const productPrice = landingPage.offerPrice || linkedProduct?.discountedPrice || 1000;
  const deliveryCharge = landingPage.deliveryFee || 0;
  const subTotal = productPrice * quantity;
  const grandTotal = subTotal + deliveryCharge;
  const savingAmount = Math.max(0, (landingPage.originalPrice - landingPage.offerPrice) * quantity);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা সঠিকভাবে দিন!');
      return;
    }

    setIsSubmitting(true);

    const generatedId = 'RM-' + Math.floor(100000 + Math.random() * 900000);
    const storedAffiliateRef = typeof window !== 'undefined' ? localStorage.getItem('rokomari_affiliate_ref') : null;

    const newOrder = {
      id: generatedId,
      clientName: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      email: loggedInUser?.emailOrPhone?.includes('@') ? loggedInUser.emailOrPhone : '',
      itemsCount: quantity,
      totalPrice: grandTotal,
      status: 'Pending',
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      customerUid: loggedInUser ? loggedInUser.emailOrPhone : 'guest',
      affiliateRef: storedAffiliateRef || undefined,
      affiliateCommission: storedAffiliateRef ? Math.round(grandTotal * 0.10) : undefined,
      orderNote: orderNote.trim(),
      source: `LandingPage: ${landingPage.title} (#${landingPage.slug})`
    };

    onPlaceOrder(newOrder);

    // Update landing page order count
    landingPage.orderCount = (landingPage.orderCount || 0) + 1;

    setPlacedOrderId(generatedId);
    setIsSubmitting(false);
    setIsOrderPlaced(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 animate-fade-in pb-20 md:pb-12">
      
      {/* 1. Top Countdown Urgency Bar */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white py-2 px-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left text-xs font-black">
          <div className="flex items-center space-x-2">
            <span className="animate-bounce">🔥</span>
            <span>{landingPage.urgencyText || 'সীমিত সময়ের ধামাকা অফার! স্টক শেষ হওয়ার আগেই অর্ডার করুন!'}</span>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-200" />
            <span>অফার শেষ হতে বাকি:</span>
            <div className="flex items-center space-x-1 font-black">
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-amber-200">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-amber-200">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-amber-200">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Clean Navigation Header */}
      <header className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল শপে ফিরে যান</span>
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-1 font-black text-xl text-slate-900 tracking-tight">
            <span>কেনাকাটা</span>
            <span className="text-sky-600">.কম</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
              মেগা অফার
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-500 hover:text-sky-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="লিংক শেয়ার করুন"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <a
              href={`tel:${hotline}`}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>হেল্পলাইন: {hotline}</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. Main Landing Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-10">
        
        {/* Hero Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Image Showcase & Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Big Image */}
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 shadow-md overflow-hidden relative group">
              {landingPage.badgeText && (
                <div className="absolute top-4 left-4 z-10 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <span>{landingPage.badgeText}</span>
                </div>
              )}

              {landingPage.discountPercent > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                  {landingPage.discountPercent}% OFF
                </div>
              )}

              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={allImages[activeImageIndex] || allImages[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={landingPage.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                {allImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-sky-600 ring-2 ring-sky-200 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Highlights under images */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] font-bold text-slate-700">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center space-y-1">
                <Truck className="w-5 h-5 text-sky-600" />
                <span>সুপারফাস্ট হোম ডেলিভারি</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>১০০% অরিজিনাল পণ্য</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center space-y-1">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span>৭ দিনের রিটার্ন গ্যারান্টি</span>
              </div>
            </div>
          </div>

          {/* Right: Pitch & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-xs font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>বিশেষ সীমিত সময়ের ক্যাম্পেইন ডিল</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {landingPage.title}
              </h1>

              {landingPage.subtitle && (
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {landingPage.subtitle}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 block">বিশেষ অফার মূল্য:</span>
                <div className="flex items-baseline space-x-3 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-700">
                    ৳ {landingPage.offerPrice}
                  </span>
                  {landingPage.originalPrice > landingPage.offerPrice && (
                    <span className="text-lg text-slate-400 line-through font-bold">
                      ৳ {landingPage.originalPrice}
                    </span>
                  )}
                </div>
                {savingAmount > 0 && (
                  <span className="text-xs font-bold text-rose-600 block mt-1">
                    ✓ আপনি সাশ্রয় করছেন ৳ {savingAmount} টাকা!
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start sm:items-end space-y-1">
                <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  {landingPage.deliveryFee === 0 ? '✓ ফ্রি হোম ডেলিভারি' : `ডেলিভারি চার্জ: ৳ ${landingPage.deliveryFee}`}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  ক্যাশ অন ডেলিভারি সুবিধা
                </span>
              </div>
            </div>

            {/* Key Bullet Features (কেন এই পণ্যটি কিনবেন?) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>এই প্রোডাক্টের বিশেষ বৈশিষ্ট্য ও উপকারিতা:</span>
              </h3>

              <ul className="space-y-2.5 text-xs sm:text-sm">
                {(landingPage.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action Button that scrolls to form */}
            <button
              onClick={scrollToOrderForm}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 animate-pulse"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>এখনই অর্ডার করতে এখানে ক্লিক করুন (ক্যাশ অন ডেলিভারি)</span>
            </button>

          </div>

        </div>

        {/* 4. FAST 1-CLICK ORDER FORM (ক্যাশ অন ডেলিভারি অর্ডার ফরম) */}
        <div 
          ref={orderFormRef}
          id="landing-order-form" 
          className="bg-white border-2 border-sky-500 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden"
        >
          {/* Header Tag */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="bg-sky-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
              FAST CHECKOUT FORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              অর্ডার করতে নিচের ফর্মটি পূরণ করুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন।
            </p>
          </div>

          {/* If Order is Placed: Show Success Confirmation Screen */}
          {isOrderPlaced ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                অভিনন্দন! আপনার অর্ডার সফল হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                অর্ডার ট্র্যাকিং নম্বর: <strong className="text-emerald-700 font-mono text-sm">{placedOrderId}</strong>
              </p>
              <p className="text-xs text-slate-500">
                আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন এবং দ্রুত ডেলিভারি পৌঁছে দেওয়া হবে।
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={onBack}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  হোম পেজে ফিরে যান
                </button>
                <button
                  onClick={() => {
                    setIsOrderPlaced(false);
                    setCustomerAddress('');
                  }}
                  className="px-6 py-2.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  আরেকটি অর্ডার করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Customer Delivery Details */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                
                {/* Full Name */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    আপনার পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ সাকিব আহমেদ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    সচল মোবাইল নম্বর * (ডেলিভারির সময় কল দেওয়া হবে)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-bold font-mono"
                  />
                </div>

                {/* Full Delivery Address */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    সম্পূর্ণ ডেলিভারি ঠিকানা * (বাসা নং, রোড, থানা, জেলা)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="যেমন: বাসা নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                  />
                </div>

                {/* Special Instruction */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    অর্ডার সংক্রান্ত কোনো নির্দেশনা থাকলে লিখুন (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                  />
                </div>

              </div>

              {/* Right Column: Order Summary & Instant Submit */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5 text-xs">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>অর্ডার সামারি</span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    ক্যাশ অন ডেলিভারি
                  </span>
                </h3>

                {/* Product preview & quantity selector */}
                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200">
                  <img
                    src={allImages[0]}
                    alt={landingPage.title}
                    className="w-14 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{landingPage.title}</h4>
                    <span className="text-emerald-700 font-black text-sm">৳ {productPrice}</span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-black cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 font-bold text-slate-900 text-xs">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 border-y border-slate-200 py-3 text-slate-600">
                  <div className="flex justify-between font-semibold">
                    <span>পণ্যের মূল্য ({quantity} টি):</span>
                    <span className="font-bold text-slate-900">৳ {subTotal}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-bold text-emerald-600">
                      {deliveryCharge === 0 ? 'ফ্রি (৳ ০)' : `৳ ${deliveryCharge}`}
                    </span>
                  </div>
                  {savingAmount > 0 && (
                    <div className="flex justify-between font-bold text-rose-600">
                      <span>মোট সাশ্রয়:</span>
                      <span>- ৳ {savingAmount}</span>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-baseline font-black text-slate-900 text-base">
                  <span>সর্বমোট প্রদেয় বিল:</span>
                  <span className="text-2xl text-emerald-700">৳ {grandTotal}</span>
                </div>

                {/* Payment Badge */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-2 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)</span>
                </div>

                {/* Big Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ ও গোপন রাখা হবে
                </p>

              </div>

            </form>
          )}

        </div>

      </main>

      {/* 5. Mobile Fixed Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 px-4 z-40 md:hidden flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">অফার প্রাইস:</span>
          <span className="text-xl font-black text-emerald-700">৳ {landingPage.offerPrice}</span>
        </div>

        <button
          onClick={scrollToOrderForm}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>এখনই অর্ডার করুন</span>
        </button>
      </div>

    </div>
  );
}
