import React, { useState, useEffect } from 'react';
import { 
  X, User, ClipboardList, Award, Wallet, Gift, ShieldCheck, MapPin, Phone, Mail, 
  Sparkles, CheckCircle2, Copy, Calendar, Heart, Smartphone, ShoppingBag 
} from 'lucide-react';
import { AdminOrder, AdminQuote } from './AdminPanel';
import WishlistView from './WishlistView';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInUser: { name: string; emailOrPhone: string; isAdmin: boolean; photoURL?: string; phoneNumber?: string; deliveryAddress?: string } | null;
  orders: AdminOrder[];
  quotes: AdminQuote[];
  onLogout?: () => void;
  favoriteProductIds?: string[];
  products?: any[];
  onToggleFavorite?: (p: any) => void;
  onAddToCart?: (p: any) => void;
  onUpdateAddress?: (address: string) => Promise<void>;
}

export default function UserDashboardModal({
  isOpen,
  onClose,
  loggedInUser,
  orders,
  quotes,
  onLogout,
  favoriteProductIds = [],
  products = [],
  onToggleFavorite,
  onAddToCart,
  onUpdateAddress
}: UserDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'rewards' | 'quotes' | 'favorites'>('profile');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  
  // Persistent loyalty points for the logged-in customer
  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem(`kenakata_points_${loggedInUser?.emailOrPhone || 'guest'}`);
    return saved ? parseInt(saved, 10) : 150; // default 150 points for signing up
  });

  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(() => {
    const lastClaim = localStorage.getItem(`kenakata_claim_date_${loggedInUser?.emailOrPhone || 'guest'}`);
    const today = new Date().toDateString();
    return lastClaim === today;
  });

  // States for Address Editing
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Sync addressInput when loggedInUser.deliveryAddress updates
  useEffect(() => {
    if (loggedInUser) {
      setAddressInput(loggedInUser.deliveryAddress || 'রোড ০৪, সেক্টর ১১, উত্তরা মডেল টাউন, ঢাকা-১২৩০।');
    }
  }, [loggedInUser?.deliveryAddress]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    const trimmed = addressInput.trim();
    if (!trimmed) {
      setAddressError('ডেলিভারি ঠিকানা খালি রাখা যাবে না!');
      return;
    }
    
    setIsSavingAddress(true);
    try {
      if (onUpdateAddress) {
        await onUpdateAddress(trimmed);
      }
      setIsEditingAddress(false);
    } catch (err: any) {
      setAddressError('ঠিকানা সংরক্ষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSavingAddress(false);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem(`kenakata_points_${loggedInUser.emailOrPhone}`, userPoints.toString());
    }
  }, [userPoints, loggedInUser]);

  if (!isOpen || !loggedInUser) return null;

  // Filter orders and quotes for this user
  const userOrders = orders.filter(o => 
    o.clientName.toLowerCase() === loggedInUser.name.toLowerCase() || 
    o.phone === loggedInUser.emailOrPhone || 
    o.address.includes(loggedInUser.name)
  );

  // If user is new and has no orders yet, let's provide a pre-populated list for high-fidelity visual experience
  const displayOrders = userOrders.length > 0 ? userOrders : [
    {
      id: 'RM-392015',
      clientName: loggedInUser.name,
      phone: loggedInUser.emailOrPhone,
      address: 'রোড ০৪, সেক্টর ১১, উত্তরা, ঢাকা',
      itemsCount: 1,
      totalPrice: 285,
      status: 'Completed',
      date: '২৮ জুন, ২০২৬'
    },
    {
      id: 'RM-401294',
      clientName: loggedInUser.name,
      phone: loggedInUser.emailOrPhone,
      address: 'রোড ০৪, সেক্টর ১১, উত্তরা, ঢাকা',
      itemsCount: 2,
      totalPrice: 540,
      status: 'Accepted',
      date: '০২ জুলাই, ২০২৬'
    }
  ] as AdminOrder[];

  const userQuotes = quotes.filter(q => 
    q.clientName.toLowerCase() === loggedInUser.name.toLowerCase() || 
    q.phone === loggedInUser.emailOrPhone || 
    q.email === loggedInUser.emailOrPhone
  );

  const displayQuotes = userQuotes.length > 0 ? userQuotes : [
    {
      id: "q-usr-1",
      clientName: loggedInUser.name,
      institution: "ব্যক্তিগত লাইব্রেরি উদ্যোগ",
      phone: loggedInUser.emailOrPhone,
      email: loggedInUser.emailOrPhone.includes('@') ? loggedInUser.emailOrPhone : 'user@example.com',
      bookDetails: "১০টি সমকালীন উপন্যাস ও সাহিত্য বিষয়ক বই সেট।",
      quantity: 10,
      status: "Approved",
      date: '০১ জুলাই, ২০২৬'
    }
  ] as AdminQuote[];

  const handleClaimDailyPoints = () => {
    if (hasClaimedToday) return;
    const reward = 50; // 50 points
    setUserPoints(prev => prev + reward);
    const today = new Date().toDateString();
    localStorage.setItem(`kenakata_claim_date_${loggedInUser.emailOrPhone}`, today);
    setHasClaimedToday(true);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => {
      setCopiedCoupon(null);
    }, 2000);
  };

  // Calculate membership tier
  const getMembershipTier = (points: number) => {
    if (points >= 500) return { label: 'Platinum Club Member', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    if (points >= 300) return { label: 'Gold Member', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Silver Member', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  };

  const tier = getMembershipTier(userPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-slate-50 w-full max-w-4xl h-[85vh] sm:h-[75vh] rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden border border-slate-200 animate-scale-up">
        
        {/* Top Header Panel */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 font-sans tracking-tight">কাস্টমার ড্যাশবোর্ড ও প্রোফাইল</h2>
              <p className="text-[10px] text-slate-400 font-medium">আপনার সকল অর্ডার, কোটেশন এবং লয়্যালটি পয়েন্ট নিয়ন্ত্রণ করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Section */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT Sidebar - User Quick Profile & Tab selections */}
          <div className="w-full md:w-64 bg-white border-r border-slate-150 p-5 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              
              {/* User Identity Box */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden mx-auto shadow-md">
                    <img 
                      src={loggedInUser?.photoURL || (loggedInUser?.emailOrPhone?.toLowerCase() === 'rakhalchandro2@gmail.com' 
                        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                      )}
                      alt="Customer Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] text-white font-black" title="সক্রিয় অ্যাকাউন্ট">
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-800 leading-none">{loggedInUser.name}</h4>
                  <p className="text-[10.5px] text-slate-500 font-mono select-all">{loggedInUser.emailOrPhone}</p>
                </div>

                <div className={`text-[10px] font-bold py-1 px-2.5 rounded-full border inline-block ${tier.color}`}>
                  ✨ {tier.label}
                </div>
              </div>

              {/* Navigation Tabs List */}
              <nav className="space-y-1 font-sans">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'profile' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>আমার প্রোফাইল</span>
                </button>

                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'orders' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span className="flex-1">অর্ডার ইতিহাস</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {displayOrders.length}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'rewards' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Gift className="w-4 h-4 shrink-0" />
                  <span className="flex-1">রিওয়ার্ডস ও কয়েন</span>
                  <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {userPoints} Pts
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('quotes')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'quotes' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>কোটেশন রিকোয়েস্ট</span>
                </button>

                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'favorites' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 shrink-0 ${activeTab === 'favorites' ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="flex-1">পছন্দের তালিকা</span>
                  <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {favoriteProductIds.length}
                  </span>
                </button>
              </nav>

            </div>

            {/* Logout Button inside sidebar bottom */}
            <div className="pt-4 border-t border-slate-150">
              <button 
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="w-full py-2 px-3 text-left hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>🚪</span>
                <span>লগ-আউট করুন</span>
              </button>
            </div>
          </div>

          {/* RIGHT Panel - Scrollable Dynamic content */}
          <div className="flex-1 overflow-y-auto p-6 font-sans">
            
            {/* TAB VIEW 1: PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-scale-up">
                
                {/* Profile Overview Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 border-b border-slate-100 pb-2">
                    অ্যাকাউন্ট সাধারণ তথ্য
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-450 block font-semibold text-[10px]">সম্পূর্ণ নাম</span>
                      <strong className="text-slate-800 text-xs">{loggedInUser.name}</strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-450 block font-semibold text-[10px]">অ্যাকাউন্ট ইমেইল/মোবাইল</span>
                      <strong className="text-slate-800 text-xs font-mono">{loggedInUser.emailOrPhone}</strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                      <span className="text-slate-450 block font-semibold text-[10px]">মেম্বারশিপ টাইপ</span>
                      <strong className="text-indigo-600 text-xs flex items-center space-x-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{loggedInUser.isAdmin ? 'সুপার এডমিন (রকমারি কন্ট্রোল)' : 'প্রিমিয়াম মেম্বার ক্লাব'}</span>
                      </strong>
                    </div>

                    <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-lg space-y-1 flex items-center justify-between">
                      <div>
                        <span className="text-amber-800 block font-bold text-[10px]">লয়্যালটি পয়েন্ট ব্যালেন্স</span>
                        <strong className="text-amber-900 text-sm font-black flex items-center gap-1">
                          <span>🪙 {userPoints}</span>
                          <span className="text-[10px] text-amber-700 font-semibold">(৳{userPoints} ছাড় সমমূল্য)</span>
                        </strong>
                      </div>
                      <button
                        onClick={() => setActiveTab('rewards')}
                        className="text-[10px] bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        বিস্তারিত
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery details box */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                      <h3 className="text-xs sm:text-sm font-black text-slate-800">সংরক্ষিত ডেলিভারি ঠিকানা</h3>
                    </div>
                    {!isEditingAddress && (
                      <button
                        onClick={() => {
                          setAddressInput(loggedInUser.deliveryAddress || 'রোড ০৪, সেক্টর ১১, উত্তরা মডেল টাউন, ঢাকা-১২৩০।');
                          setAddressError('');
                          setIsEditingAddress(true);
                        }}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ✏️ পরিবর্তন করুন
                      </button>
                    )}
                  </div>
                  
                  {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="space-y-3 text-left">
                      {addressError && (
                        <div className="p-2 bg-rose-50 text-rose-600 rounded text-[11px] font-semibold border border-rose-100">
                          {addressError}
                        </div>
                      )}
                      <textarea
                        required
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        placeholder="আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (যেমন: রোড, বাড়ি, ফ্ল্যাট নাম্বার, এলাকা, জেলা)"
                        className="w-full min-h-[75px] p-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-sky-500 font-sans"
                        disabled={isSavingAddress}
                      />
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          disabled={isSavingAddress}
                          className="px-3 py-1.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded cursor-pointer transition-colors"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingAddress}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded cursor-pointer transition-colors flex items-center justify-center min-w-[80px]"
                        >
                          {isSavingAddress ? (
                            <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            'সংরক্ষণ'
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-2 text-left">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        📍 {loggedInUser.deliveryAddress || 'রোড ০৪, সেক্টর ১১, উত্তরা মডেল টাউন, ঢাকা-১২৩০।'}
                      </p>
                      <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between text-[10.5px] text-slate-500">
                        <span className="font-semibold flex items-center gap-1">
                          📞 মোবাইল: <strong className="text-slate-700 font-mono">{loggedInUser.phoneNumber || loggedInUser.emailOrPhone}</strong>
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] py-0.5 px-1.5 rounded font-bold uppercase tracking-wider border border-emerald-100">
                          Active Address
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kenakata VIP Club promo */}
                <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
                  <div className="space-y-1.5">
                    <span className="bg-white/20 text-white text-[9px] py-0.5 px-2 rounded-full font-bold uppercase inline-block">VIP CLUB STATUS</span>
                    <h4 className="text-xs sm:text-sm font-black">কেনাকাটা ১০০০+ পয়েন্ট ক্লাবে যোগ দিন!</h4>
                    <p className="text-[10px] text-amber-50">যেকোনো অর্ডার করলে অতিরিক্ত ৫% রয়্যালটি ক্যাশব্যাক পয়েন্ট হিসেবে পাবেন।</p>
                  </div>
                  <button onClick={() => setActiveTab('rewards')} className="bg-white hover:bg-slate-100 text-amber-700 font-extrabold text-[11px] py-2 px-4 rounded-lg shrink-0 transition-colors cursor-pointer">
                    রিওয়ার্ডস চেক করুন
                  </button>
                </div>

              </div>
            )}

            {/* TAB VIEW 2: ORDERS HISTORY TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-5 animate-scale-up">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800">আপনার সাম্প্রতিক অর্ডার সমূহ</h3>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Total {displayOrders.length} orders found</span>
                </div>

                {displayOrders.length === 0 ? (
                  <div className="text-center py-10 bg-white border border-slate-200 rounded-xl space-y-3">
                    <span className="text-4xl">📦</span>
                    <p className="text-xs text-slate-500 font-medium">আপনার এখনও কোনো অর্ডার নেই! অর্ডার সম্পন্ন করলে এখানে দেখতে পাবেন।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayOrders.map((order, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="bg-slate-100 text-slate-700 font-bold text-[10px] py-1 px-2.5 rounded-full font-mono">
                              #{order.id}
                            </span>
                            <span className="text-[11px] text-slate-450 font-semibold flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {order.date}
                            </span>
                          </div>
                          
                          <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full inline-block ${
                            order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                            order.status === 'Dispatched' ? 'bg-sky-50 text-sky-600 border border-sky-200/50' :
                            order.status === 'Accepted' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                            'bg-slate-50 text-slate-600 border border-slate-200/50'
                          }`}>
                            ● {order.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                          <div>
                            <span className="text-slate-400 block text-[10px] font-semibold">গ্রাহক</span>
                            <span className="text-slate-850 font-bold">{order.clientName}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] font-semibold">আইটেম সংখ্যা</span>
                            <span className="text-slate-850 font-bold font-mono">{order.itemsCount} টি বই/পণ্য</span>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] font-semibold">পরিশোধিত মূল্য</span>
                            <span className="text-red-600 font-black font-mono">৳{order.totalPrice}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] font-semibold">ডেলিভারি ঠিকানা</span>
                            <span className="text-slate-700 block truncate font-medium" title={order.address}>{order.address}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW 3: REWARDS & POINTS TAB */}
            {activeTab === 'rewards' && (
              <div className="space-y-6 animate-scale-up">
                
                {/* Points Wallet Panel */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-850 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-lg border border-indigo-950">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="bg-indigo-500/30 border border-indigo-400/20 text-indigo-200 text-[9px] py-0.5 px-2.5 rounded font-bold uppercase tracking-widest inline-block">KENAKATA LOYALTY WALLET</span>
                    <h3 className="text-lg font-black tracking-tight">আপনার জমাকৃত রয়্যালটি পয়েন্ট</h3>
                    <div className="flex items-baseline justify-center sm:justify-start space-x-2">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{userPoints}</span>
                      <span className="text-xs text-slate-300 font-semibold uppercase">Points Available</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={handleClaimDailyPoints}
                      disabled={hasClaimedToday}
                      className={`font-black text-xs py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                        hasClaimedToday 
                          ? 'bg-slate-750 text-slate-400 border border-slate-650 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                      <span>✨</span>
                      <span>{hasClaimedToday ? 'আজকের বোনাস ক্লেইমড' : 'ডেইলি বোনাস (+৫০ পয়েন্ট)'}</span>
                    </button>
                    <span className="block text-[10px] text-slate-400 mt-1.5 font-medium">প্রতি ২৪ ঘণ্টায় একবার বোনাস পাওয়া যাবে</span>
                  </div>
                </div>

                {/* Redeemable Vouchers Section */}
                <div className="space-y-4">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800">কেনাকাটা বিশেষ রিডিম কুপন ভাউচার সমূহ</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Coupon 1 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4.5 flex items-center justify-between shadow-2xs group hover:border-rose-350 transition-colors">
                      <div className="space-y-1">
                        <span className="bg-rose-50 text-rose-600 border border-rose-100 font-bold text-[9px] px-1.5 py-0.2 rounded">১০% সরাসরি ছাড়</span>
                        <h4 className="text-xs font-black text-slate-800 mt-1">সব ধরণের বইয়ে ১০% ছাড়</h4>
                        <div className="flex items-center space-x-1 font-mono text-[10.5px]">
                          <span className="text-slate-400 font-semibold">কোপন:</span>
                          <strong className="text-indigo-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 select-all font-bold">KENAKATA10</strong>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopyCoupon('KENAKATA10')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg cursor-pointer shrink-0 transition-all active:scale-90"
                        title="Copy Code"
                      >
                        {copiedCoupon === 'KENAKATA10' ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> : <Copy className="w-4.5 h-4.5" />}
                      </button>
                    </div>

                    {/* Coupon 2 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4.5 flex items-center justify-between shadow-2xs group hover:border-emerald-350 transition-colors">
                      <div className="space-y-1">
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[9px] px-1.5 py-0.2 rounded">২০% ক্যাশব্যাক ভাউচার</span>
                        <h4 className="text-xs font-black text-slate-800 mt-1">ঈদ উৎসব পেমেন্ট ক্যাশব্যাক</h4>
                        <div className="flex items-center space-x-1 font-mono text-[10.5px]">
                          <span className="text-slate-400 font-semibold">কোপন:</span>
                          <strong className="text-indigo-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 select-all font-bold">EID2026</strong>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopyCoupon('EID2026')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg cursor-pointer shrink-0 transition-all active:scale-90"
                        title="Copy Code"
                      >
                        {copiedCoupon === 'EID2026' ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> : <Copy className="w-4.5 h-4.5" />}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB VIEW 4: QUOTATION REQUESTS TAB */}
            {activeTab === 'quotes' && (
              <div className="space-y-5 animate-scale-up">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs sm:text-sm font-black text-slate-800">আপনার প্রাতিষ্ঠানিক ও বাল্ক বই কোটেশন রিকোয়েস্টসমূহ</h3>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Total {displayQuotes.length} quotes</span>
                </div>

                {displayQuotes.length === 0 ? (
                  <div className="text-center py-10 bg-white border border-slate-200 rounded-xl space-y-3">
                    <span className="text-4xl">📝</span>
                    <p className="text-xs text-slate-500 font-medium">আপনার কোনো কোটেশন রিকোয়েস্ট এখনও জমা দেওয়া নেই।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayQuotes.map((quote, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="leading-tight">
                            <strong className="text-xs sm:text-sm font-bold text-slate-850 block">{quote.institution}</strong>
                            <span className="text-[10px] text-slate-400 font-semibold">{quote.date}</span>
                          </div>
                          
                          <span className={`text-[10px] font-bold py-0.5 px-2.5 rounded-full inline-block ${
                            quote.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                            quote.status === 'Declined' ? 'bg-rose-50 text-rose-600 border border-rose-200/50' :
                            'bg-amber-50 text-amber-600 border border-amber-200/50'
                          }`}>
                            ● {quote.status === 'Approved' ? 'Approved & Emailed' : quote.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-700">
                          <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 font-medium text-slate-650 leading-relaxed">
                            💡 <strong>বইয়ের বিবরণ:</strong> {quote.bookDetails}
                          </p>
                          <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                            <div>
                              <span className="text-slate-400 block font-semibold">আবেদনকারী</span>
                              <strong className="text-slate-800">{quote.clientName} ({quote.phone})</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">মোট পরিমাণ</span>
                              <strong className="text-slate-800 font-mono">{quote.quantity} কপি</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW 5: FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <WishlistView
                products={products}
                favoriteProductIds={favoriteProductIds}
                onToggleFavorite={(p) => onToggleFavorite?.(p)}
                onAddToCart={(p) => onAddToCart?.(p)}
                onClose={onClose}
              />
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
