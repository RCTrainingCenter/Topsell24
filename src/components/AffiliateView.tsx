import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Share2, 
  Wallet, 
  Play, 
  X, 
  Copy, 
  Check, 
  ArrowRight, 
  Users, 
  ShoppingBag, 
  Banknote,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LogIn,
  UserPlus,
  LogOut,
  HelpCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  Search,
  MessageCircle,
  Share,
  AlertCircle
} from 'lucide-react';
import { Product, AffiliateUser, AffiliateWithdrawal, AffiliateProgramConfig } from '../types';
import { DEFAULT_AFFILIATE_CONFIG } from '../data/defaultAffiliates';

interface AffiliateViewProps {
  onBackToHome: () => void;
  onOpenLogin: () => void;
  language?: 'en' | 'bn';
  products?: Product[];
  affiliates?: AffiliateUser[];
  withdrawals?: AffiliateWithdrawal[];
  orders?: any[];
  config?: AffiliateProgramConfig;
  onRegisterAffiliate?: (aff: AffiliateUser) => void;
  onRequestWithdrawal?: (req: AffiliateWithdrawal) => void;
  loggedInUser?: any;
}

export default function AffiliateView({ 
  onBackToHome, 
  onOpenLogin, 
  language = 'bn',
  products = [],
  affiliates = [],
  withdrawals = [],
  orders = [],
  config = DEFAULT_AFFILIATE_CONFIG,
  onRegisterAffiliate,
  onRequestWithdrawal,
  loggedInUser
}: AffiliateViewProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  
  // Current Logged-in Affiliate State
  const [currentAffiliate, setCurrentAffiliate] = useState<AffiliateUser | null>(() => {
    try {
      const saved = localStorage.getItem('rokomari_active_affiliate');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Product Link Generator State
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [generatedProductLink, setGeneratedProductLink] = useState('');
  const [isProductLinkCopied, setIsProductLinkCopied] = useState(false);
  const [isGeneralLinkCopied, setIsGeneralLinkCopied] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: loggedInUser?.name || '',
    phoneOrEmail: loggedInUser?.emailOrPhone || '',
    password: '',
    paymentMethod: 'bKash' as 'bKash' | 'Nagad' | 'Rocket' | 'Bank',
    paymentNumber: '',
    channelUrl: ''
  });
  const [regSuccessMessage, setRegSuccessMessage] = useState(false);

  // Login Form State
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Withdrawal Request Form State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(config?.minimumWithdrawalAmount || 500);
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState(false);

  // Sync currentAffiliate with updated props if exists
  useEffect(() => {
    if (currentAffiliate && affiliates.length > 0) {
      const fresh = affiliates.find(a => a.id === currentAffiliate.id || a.referralCode === currentAffiliate.referralCode);
      if (fresh) {
        setCurrentAffiliate(fresh);
        localStorage.setItem('rokomari_active_affiliate', JSON.stringify(fresh));
      }
    }
  }, [affiliates]);

  // Set default product for generator
  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products]);

  // Generate general referral link
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rokomari.com';
  const generalReferralLink = currentAffiliate 
    ? `${originUrl}?ref=${currentAffiliate.referralCode}`
    : `${originUrl}?ref=ROK-AFF-DEMO`;

  // Handle Generate Product Link
  useEffect(() => {
    if (selectedProductId) {
      const code = currentAffiliate ? currentAffiliate.referralCode : 'ROK-AFF-DEMO';
      setGeneratedProductLink(`${originUrl}?product=${selectedProductId}&ref=${code}`);
    }
  }, [selectedProductId, currentAffiliate, originUrl]);

  const handleCopyGeneralLink = () => {
    navigator.clipboard.writeText(generalReferralLink);
    setIsGeneralLinkCopied(true);
    setTimeout(() => setIsGeneralLinkCopied(false), 2500);
  };

  const handleCopyProductLink = () => {
    if (!generatedProductLink) return;
    navigator.clipboard.writeText(generatedProductLink);
    setIsProductLinkCopied(true);
    setTimeout(() => setIsProductLinkCopied(false), 2500);
  };

  // Handle Affiliate Registration
  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.phoneOrEmail.trim()) return;

    // Generate unique code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAffiliate: AffiliateUser = {
      id: 'aff-' + Date.now().toString(36),
      name: regForm.name.trim(),
      phoneOrEmail: regForm.phoneOrEmail.trim(),
      password: regForm.password.trim() || 'pass123',
      referralCode: `ROK-${regForm.name.trim().slice(0, 3).toUpperCase()}-${randomSuffix}`,
      channelUrl: regForm.channelUrl.trim(),
      paymentMethod: regForm.paymentMethod,
      paymentNumber: regForm.paymentNumber.trim() || regForm.phoneOrEmail.trim(),
      status: 'active', // Auto-approved for frictionless experience
      commissionRate: config.defaultCommissionPercent || 10,
      totalClicks: 0,
      totalOrders: 0,
      totalSalesAmount: 0,
      totalEarnings: 0,
      currentBalance: 0,
      totalWithdrawn: 0,
      createdAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    if (onRegisterAffiliate) {
      onRegisterAffiliate(newAffiliate);
    }

    // Set logged-in affiliate
    setCurrentAffiliate(newAffiliate);
    localStorage.setItem('rokomari_active_affiliate', JSON.stringify(newAffiliate));
    setRegSuccessMessage(true);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setRegSuccessMessage(false);
    }, 1500);
  };

  // Handle Affiliate Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const target = affiliates.find(a => 
      a.phoneOrEmail.toLowerCase() === loginPhoneOrEmail.trim().toLowerCase() ||
      a.referralCode.toLowerCase() === loginPhoneOrEmail.trim().toLowerCase()
    );

    if (target) {
      setCurrentAffiliate(target);
      localStorage.setItem('rokomari_active_affiliate', JSON.stringify(target));
      setIsAuthModalOpen(false);
      setLoginPhoneOrEmail('');
      setLoginPassword('');
    } else {
      setLoginError('মোবাইল নম্বর বা রেফারেল কোড পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন বা নতুন রেজিস্ট্রেশন করুন।');
    }
  };

  // Demo Login Helper
  const handleDemoLogin = (affId: string) => {
    const demo = affiliates.find(a => a.id === affId) || affiliates[0];
    if (demo) {
      setCurrentAffiliate(demo);
      localStorage.setItem('rokomari_active_affiliate', JSON.stringify(demo));
      setIsAuthModalOpen(false);
    }
  };

  const handleLogout = () => {
    setCurrentAffiliate(null);
    localStorage.removeItem('rokomari_active_affiliate');
  };

  // Handle Withdrawal Request
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAffiliate) return;

    if (withdrawAmount > (currentAffiliate.currentBalance || 0)) {
      alert('আপনার পর্যাপ্ত ব্যালেন্স নেই!');
      return;
    }

    if (withdrawAmount < (config.minimumWithdrawalAmount || 500)) {
      alert(`সর্বনিম্ন উইথড্রয়াল পরিমাণ ৳ ${config.minimumWithdrawalAmount} টাকা!`);
      return;
    }

    const newWithdrawal: AffiliateWithdrawal = {
      id: 'w-' + Date.now().toString(36),
      affiliateId: currentAffiliate.id,
      affiliateName: currentAffiliate.name,
      affiliatePhone: currentAffiliate.phoneOrEmail,
      amount: withdrawAmount,
      paymentMethod: withdrawMethod,
      paymentNumber: withdrawNumber || currentAffiliate.paymentNumber,
      status: 'pending',
      requestDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    if (onRequestWithdrawal) {
      onRequestWithdrawal(newWithdrawal);
    }

    setWithdrawSuccessMsg(true);
    setTimeout(() => {
      setIsWithdrawModalOpen(false);
      setWithdrawSuccessMsg(false);
    }, 1800);
  };

  // Affiliate's personal withdrawals
  const affiliateWithdrawals = withdrawals.filter(w => currentAffiliate && w.affiliateId === currentAffiliate.id);

  // Affiliate's referred orders
  const affiliateOrders = orders.filter(o => currentAffiliate && o.affiliateRef === currentAffiliate.referralCode);

  // Selected product details
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  const selectedProductPrice = selectedProduct ? (selectedProduct.discountedPrice || selectedProduct.originalPrice) : 0;
  const estimatedCommission = selectedProduct 
    ? Math.round(selectedProductPrice * ((currentAffiliate?.commissionRate || config.defaultCommissionPercent) / 100))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 animate-fade-in">
      
      {/* 1. Header Bar for Affiliate Portal */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onBackToHome}>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                কেনাকাটা<span className="text-sky-600">.কম</span>
              </span>
              <span className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center space-x-1">
                <span>অ্যাফিলিয়েট</span>
              </span>
            </div>
          </div>

          {/* Action / User Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 rounded-lg transition-colors cursor-pointer"
            >
              মূল ওয়েবসাইটে ফিরুন
            </button>

            {currentAffiliate ? (
              <div className="flex items-center space-x-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentAffiliate.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-black text-slate-800 leading-tight">{currentAffiliate.name}</div>
                  <div className="text-[10px] font-mono text-sky-700 font-bold">{currentAffiliate.referralCode}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-full transition-colors cursor-pointer ml-1"
                  title="লগ-আউট করুন"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-600 border border-sky-600 rounded-full hover:bg-sky-50 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>লগ-ইন</span>
                </button>
                <button
                  onClick={() => {
                    setAuthTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-full transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>রেজিস্ট্রেশন করুন</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* 2. IF LOGGED IN: SHOW COMPREHENSIVE AFFILIATE DASHBOARD */}
      {currentAffiliate ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          
          {/* Dashboard Welcome Header */}
          <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>অ্যাফিলিয়েট পার্টনার ড্যাশবোর্ড</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">
                  স্বাগতম, {currentAffiliate.name}!
                </h1>
                <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                  আপনার রেফারেল কোড ব্যবহার করে যে কোনো বই বা পণ্য শেয়ার করুন এবং প্রতিটি অর্ডারে {currentAffiliate.commissionRate || config.defaultCommissionPercent}% কমিশন আয় করুন।
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Wallet className="w-4 h-4" />
                  <span>টাকা তুলুন (উইথড্র)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Withdrawable Balance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>উত্তোলনযোগ্য ব্যালেন্স</span>
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  ৳ {(currentAffiliate.currentBalance || 0).toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  সর্বনিম্ন উইথড্র ৳ {config.minimumWithdrawalAmount}
                </span>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>সর্বমোট আয়</span>
                <TrendingUp className="w-4 h-4 text-sky-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ৳ {(currentAffiliate.totalEarnings || 0).toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                  কমিশন হার: {currentAffiliate.commissionRate || config.defaultCommissionPercent}%
                </span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>সফল রেফারেল অর্ডার</span>
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {currentAffiliate.totalOrders || affiliateOrders.length || 0} টি
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  সেলস ভ্যালু: ৳ {(currentAffiliate.totalSalesAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total Link Clicks */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>মোট লিংক ভিজিট ও ক্লিক</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {(currentAffiliate.totalClicks || 0).toLocaleString()} বার
                </span>
                <span className="text-[11px] text-amber-600 font-bold block mt-0.5">
                  কনভার্সন ট্র্যাকিং সক্রিয়
                </span>
              </div>
            </div>
          </div>

          {/* Master Referral Link & Share Box */}
          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-600" />
                  <span>আপনার প্রধান রেফারেল লিংক</span>
                </h3>
                <p className="text-xs text-slate-500">
                  এই লিংকের মাধ্যমে কেউ কেনাকাটা করলেই আপনি পাবেন কমিশন
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold bg-sky-50 text-sky-800 px-3 py-1.5 rounded-lg border border-sky-200">
                <span>কোড: {currentAffiliate.referralCode}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-mono text-xs text-slate-800 break-all select-all flex items-center justify-between">
                <span>{generalReferralLink}</span>
              </div>
              <button
                onClick={handleCopyGeneralLink}
                className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
              >
                {isGeneralLinkCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{isGeneralLinkCopied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
              </button>
            </div>

            {/* Quick Social Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-semibold">সরাসরি শেয়ার করুন:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`বই ও গ্যাজেট কিনুন স্পেশাল ডিসকাউন্টে: ${generalReferralLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generalReferralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Facebook</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(generalReferralLink)}&text=${encodeURIComponent('সেরা বই ও পণ্য কিনুন!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Telegram</span>
              </a>
            </div>
          </div>

          {/* Product Specific Link Generator Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="bg-sky-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                PRODUCT LINK BUILDER
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                নির্দিষ্ট বই বা পণ্যের কাস্টম রেফারেল লিংক তৈরি করুন
              </h3>
              <p className="text-xs text-slate-500">
                যেকোনো একটি পণ্য নির্বাচন করুন এবং সেই নির্দিষ্ট পণ্যের সেলস লিংক তৈরি করে শেয়ার করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Product Selector */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পণ্য নির্বাচন করুন ({products.length} টি পণ্য পাওয়া গেছে):
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  >
                    {products.slice(0, 50).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} — ৳ {p.discountedPrice || p.originalPrice} ({p.authorOrBrand || p.category || 'General'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generated Custom Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    এই পণ্যের রেফারেল লিংক:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedProductLink}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      onClick={handleCopyProductLink}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      {isProductLinkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isProductLinkCopied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Preview of the selected product */}
              {selectedProduct && (
                <div className="md:col-span-5 bg-sky-50/60 border border-sky-200/70 rounded-2xl p-4 flex items-center space-x-4">
                  <img
                    src={selectedProduct.imageUrl || (selectedProduct.images && selectedProduct.images[0]) || ''}
                    alt={selectedProduct.title}
                    className="w-20 h-24 object-cover rounded-xl shadow-xs border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                      {selectedProduct.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {selectedProduct.authorOrBrand || selectedProduct.category}
                    </p>
                    <div className="text-xs font-black text-slate-900">
                      মূল্য: ৳ {selectedProduct.discountedPrice || selectedProduct.originalPrice}
                    </div>
                    <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      ✓ বিক্রয়ে কমিশন: ৳ {estimatedCommission} টাকা ({currentAffiliate?.commissionRate || config.defaultCommissionPercent}%)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payout & Withdrawal History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Withdrawal History Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>উইথড্রয়াল ও পে-আউট হিস্টোরি</span>
                </h3>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  + নতুন রিকোয়েস্ট
                </button>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {affiliateWithdrawals.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    এখনো কোনো উইথড্রয়াল রিকোয়েস্ট করা হয়নি
                  </div>
                ) : (
                  affiliateWithdrawals.map(w => (
                    <div key={w.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">৳ {w.amount.toLocaleString()} ({w.paymentMethod})</div>
                        <div className="text-[10px] text-slate-400">{w.requestDate} • {w.paymentNumber}</div>
                        {w.transactionId && (
                          <div className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5">TrxID: {w.transactionId}</div>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        w.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {w.status === 'approved' ? '✓ সম্পন্ন' : w.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Referred Orders Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                  <span>রেফার করা সেলস ও কমিশন হিস্টোরি</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  মোট {affiliateOrders.length} টি
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {affiliateOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    এখনো কোনো অর্ডার রেফার করা হয়নি। লিংক শেয়ার করুন!
                  </div>
                ) : (
                  affiliateOrders.map(o => (
                    <div key={o.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">অর্ডার #{o.id}</div>
                        <div className="text-[10px] text-slate-400">{o.date} • {o.itemsCount} টি আইটেম</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">৳ {o.totalPrice}</div>
                        <div className="text-[11px] font-black text-emerald-600">
                          +৳ {Math.round(o.totalPrice * ((currentAffiliate?.commissionRate || 10) / 100))} কমিশন
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </main>
      ) : (
        /* 3. IF NOT LOGGED IN: SHOW HERO & REGISTRATION LANDING PORTAL */
        <main>
          {/* Hero Section */}
          <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-sky-50/40 to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  
                  <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>কেনাকাটা অ্যাফিলিয়েট পার্টনারশিপ প্রোগ্রাম ২০২৬</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                    {config.bannerTitle || 'অ্যাফিলিয়েট হয়ে ঘরে বসে আয় করুন'}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {config.bannerSubtitle || 'পছন্দের বই ও পণ্য আপনার বন্ধুদের বা সোশ্যাল মিডিয়ায় রিকমেন্ড করুন, প্রতি সফল অর্ডারে জিতে নিন আকর্ষণীয় ১০%-২০% পর্যন্ত কমিশন।'}
                  </p>

                  {/* Sub Statistics Row */}
                  <div className="pt-2 pb-2">
                    <div className="inline-grid grid-cols-3 gap-3 sm:gap-6 border-y border-slate-200/80 py-4 max-w-xl mx-auto lg:mx-0 text-center">
                      <div className="px-2 sm:px-4 border-r border-slate-200">
                        <strong className="text-lg sm:text-2xl font-black text-slate-900 block">
                          {(affiliates.length + 450).toLocaleString()} +
                        </strong>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium block mt-0.5">
                          সক্রিয় অ্যাফিলিয়েট
                        </span>
                      </div>

                      <div className="px-2 sm:px-4 border-r border-slate-200">
                        <strong className="text-lg sm:text-2xl font-black text-slate-900 block">
                          ১০% - ২০%
                        </strong>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium block mt-0.5">
                          কমিশন রেট
                        </span>
                      </div>

                      <div className="px-2 sm:px-4">
                        <strong className="text-lg sm:text-2xl font-black text-emerald-600 block">
                          ৳ ৫০০
                        </strong>
                        <span className="text-[11px] sm:text-xs text-slate-500 font-medium block mt-0.5">
                          ন্যূনতম উইথড্র সীমা
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Call To Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                    <button
                      onClick={() => {
                        setAuthTab('register');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-extrabold text-white bg-sky-600 hover:bg-sky-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <span>এখনই রেজিস্ট্রেশন করুন (ফ্রি)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setAuthTab('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-sky-600" />
                      <span>লগইন করুন</span>
                    </button>
                  </div>

                  {/* Demo Login Quick Link for Reviewers */}
                  {affiliates.length > 0 && (
                    <div className="text-xs text-slate-500 pt-2 flex items-center justify-center lg:justify-start gap-2">
                      <span>টেস্ট করতে চান?</span>
                      <button
                        onClick={() => handleDemoLogin(affiliates[0].id)}
                        className="text-sky-600 font-bold hover:underline cursor-pointer"
                      >
                        ১-ক্লিকে ডেমো অ্যাকাউন্টে প্রবেশ করুন →
                      </button>
                    </div>
                  )}

                </div>

                {/* Right Video Thumbnail Box Column */}
                <div className="lg:col-span-5 flex justify-center">
                  <div 
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-full max-w-md bg-slate-900 rounded-2xl p-2 border-2 border-sky-500 shadow-xl relative group cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
                  >
                    <div className="relative aspect-video rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 overflow-hidden flex flex-col justify-between p-4 text-white">
                      
                      <div className="flex items-center justify-between z-10">
                        <span className="bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>নতুনদের জন্য অ্যাফিলিয়েট গাইড</span>
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-90 pointer-events-none">
                        <div className="text-center space-y-1">
                          <p className="text-base font-black text-amber-300 drop-shadow">অ্যাফিলিয়েট মার্কেটিং শুরু করবেন কীভাবে?</p>
                          <span className="inline-block bg-emerald-500 text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow">
                            কমিশন ব্যালেন্স: ৳ ৫,০০০+
                          </span>
                        </div>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-14 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs mt-auto">
                        <span>ভিডিও টিউটোরিয়াল দেখুন</span>
                        <span className="font-bold text-red-400">YouTube</span>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 3 Step Cards Section */}
          <section className="py-16 sm:py-20 bg-white border-y border-slate-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  সহজ ৩ ধাপে আয় করুন
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  কোনো বাড়তি জটিলতা ছাড়াই যুক্ত হয়ে যান বাংলাদেশের বিশ্বস্ত কেনাকাটা অ্যাফিলিয়েশন প্রোগ্রামে
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Step 1 */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-sky-200/50">
                    <FileText className="w-8 h-8 text-sky-600" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    ১. বিনামূল্যে অ্যাকাউন্ট খুলুন
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    আপনার নাম, মোবাইল নম্বর ও পেমেন্ট নম্বর (বিকাশ/নগদ) দিয়ে ১ মিনিটে রেজিস্ট্রেশন সম্পন্ন করুন
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-sky-200/50">
                    <Share2 className="w-8 h-8 text-sky-600" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    ২. বই বা পণ্যের লিংক শেয়ার করুন
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    আপনার ড্যাশবোর্ড থেকে রেফারেল লিংক তৈরি করে ফেসবুক, হোয়াটসঅ্যাপ, ইউটিউব বা ব্লগে শেয়ার করুন
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-emerald-200/50">
                    <Wallet className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    ৩. কমিশন তুলুন সরাসরি
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    আপনার লিংক দিয়ে অর্ডার হলেই স্বয়ংক্রিয়ভাবে জমা হবে কমিশন। ৳ ৫০০ হলেই বিকাশ বা নগদে তুলে নিন
                  </p>
                </div>

              </div>

              {/* Commission Table Section */}
              <div className="mt-14 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-black text-slate-900 text-center mb-6">
                  ক্যাটাগরি ভিত্তিক আকর্ষণীয় কমিশন চার্ট
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl border border-sky-150 shadow-2xs">
                    <div className="text-xs font-bold text-slate-500">বই ও সাহিত্য</div>
                    <div className="text-xl font-black text-sky-600 mt-1">১০% - ১৫%</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-sky-150 shadow-2xs">
                    <div className="text-xs font-bold text-slate-500">একাডেমিক ও গাইড বই</div>
                    <div className="text-xl font-black text-sky-600 mt-1">৮% - ১২%</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-sky-150 shadow-2xs">
                    <div className="text-xs font-bold text-slate-500">ইলেকট্রনিক্স ও গ্যাজেট</div>
                    <div className="text-xl font-black text-sky-600 mt-1">৫% - ৮%</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-sky-150 shadow-2xs">
                    <div className="text-xs font-bold text-slate-500">সুপারস্টোর ও স্টেশনারি</div>
                    <div className="text-xl font-black text-sky-600 mt-1">৭% - ১০%</div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </main>
      )}

      {/* 4. Video Tutorial Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-white">
              <h3 className="text-xs sm:text-sm font-bold flex items-center space-x-2">
                <Play className="w-4 h-4 text-red-500 fill-red-500" />
                <span>নতুনদের জন্য অ্যাফিলিয়েট সেলস গাইডলাইন</span>
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={config.tutorialVideoUrl || "https://www.youtube.com/embed/5aL-7aG_718"}
                title="Affiliate Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Registration & Login Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="bg-sky-600 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">
                  {authTab === 'register' ? 'অ্যাফিলিয়েট রেজিস্ট্রেশন' : 'অ্যাফিলিয়েট লগইন'}
                </h3>
                <p className="text-[11px] text-sky-100 mt-0.5">
                  {authTab === 'register' ? 'সহজ পদক্ষেপে একাউন্ট খুলে ইনকাম শুরু করুন' : 'আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setRegSuccessMessage(false);
                }}
                className="text-sky-100 hover:text-white p-1 rounded-lg hover:bg-sky-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Tab Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors cursor-pointer ${
                    authTab === 'register' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  নতুন রেজিস্ট্রেশন
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors cursor-pointer ${
                    authTab === 'login' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  লগইন
                </button>
              </div>

              {regSuccessMessage ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    রেজিস্ট্রেশন সফল হয়েছে!
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    আপনার অ্যাফিলিয়েট অ্যাকাউন্ট অনুমোদিত হয়েছে। আপনাকে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
                  </p>
                </div>
              ) : authTab === 'register' ? (
                <form onSubmit={handleRegSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">আপনার পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ শরিফুল ইসলাম"
                      value={regForm.name}
                      onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">মোবাইল নম্বর বা ইমেইল *</label>
                    <input
                      type="text"
                      required
                      placeholder="017xxxxxxxx"
                      value={regForm.phoneOrEmail}
                      onChange={(e) => setRegForm({...regForm, phoneOrEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">পেমেন্ট মেথড *</label>
                      <select
                        value={regForm.paymentMethod}
                        onChange={(e) => setRegForm({...regForm, paymentMethod: e.target.value as any})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium bg-white"
                      >
                        <option value="bKash">বিকাশ (bKash)</option>
                        <option value="Nagad">নগদ (Nagad)</option>
                        <option value="Rocket">রকেট (Rocket)</option>
                        <option value="Bank">ব্যাংক ট্রান্সফার</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">অ্যাকাউন্ট নম্বর *</label>
                      <input
                        type="text"
                        required
                        placeholder="017xxxxxxxx"
                        value={regForm.paymentNumber}
                        onChange={(e) => setRegForm({...regForm, paymentNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">ফেসবুক পেজ / ইউটিউব চ্যানেল লিংক (ঐচ্ছিক)</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/yourpage"
                      value={regForm.channelUrl}
                      onChange={(e) => setRegForm({...regForm, channelUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    অ্যাকাউন্ট তৈরি করুন (ফ্রি)
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                  {loginError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">মোবাইল নম্বর বা রেফারেল কোড *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 01711223344 বা ROK-AFF-101"
                      value={loginPhoneOrEmail}
                      onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    ড্যাশবোর্ডে লগইন করুন
                  </button>

                  {/* Demo Fast Login Buttons */}
                  {affiliates.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 block mb-1.5">
                        টেস্টিং ডেমো অ্যাকাউন্ট:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {affiliates.slice(0, 3).map(a => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => handleDemoLogin(a.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 rounded-lg text-[11px] font-semibold cursor-pointer"
                          >
                            {a.name} ({a.referralCode})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              )}

            </div>

          </div>
        </div>
      )}

      {/* 6. Withdrawal Request Modal */}
      {isWithdrawModalOpen && currentAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm">টাকা তোলার আবেদন (উইথড্রয়াল)</h3>
                <p className="text-[11px] text-emerald-100">
                  বর্তমান ব্যালেন্স: ৳ {(currentAffiliate.currentBalance || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {withdrawSuccessMsg ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">রিকোয়েস্ট সফলভাবে জমা হয়েছে!</h4>
                  <p className="text-xs text-slate-500">
                    আমাদের ফিনান্স টিম খুব দ্রুত আপনার পেমেন্ট নাম্বারে টাকা পাঠিয়ে দিবে।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">উইথড্রয়াল পরিমাণ (টাকা) *</label>
                    <input
                      type="number"
                      required
                      min={config.minimumWithdrawalAmount || 500}
                      max={currentAffiliate.currentBalance || 0}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      সর্বনিম্ন ৳ {config.minimumWithdrawalAmount} টাকা
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">পেমেন্ট মেথড *</label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold bg-white"
                    >
                      <option value="bKash">বিকাশ (bKash Personal)</option>
                      <option value="Nagad">নগদ (Nagad Personal)</option>
                      <option value="Rocket">রকেট (Rocket)</option>
                      <option value="Bank">ব্যাংক অ্যাকাউন্ট</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">পেমেন্ট নম্বর / ব্যাংক হিসাব *</label>
                    <input
                      type="text"
                      required
                      placeholder="017xxxxxxxx"
                      value={withdrawNumber || currentAffiliate.paymentNumber}
                      onChange={(e) => setWithdrawNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    আবেদন নিশ্চিত করুন
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
