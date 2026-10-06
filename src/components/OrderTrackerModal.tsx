import React, { useState } from 'react';
import { 
  X, Search, ChevronRight, Package, Truck, Check, ClipboardList, 
  Smile, Star, User, BookOpen, List, Bookmark, Heart, Sparkles, 
  Award, Wallet, Users, GraduationCap, CreditCard, ShieldCheck, HardDrive,
  Mouse as MouseIcon, Headphones, Cpu, Radio, Keyboard as KeyboardIcon, ShieldAlert,
  Plus, Trash2, Edit3, CheckCircle2, AlertCircle, ArrowRight, Download, RefreshCw, Eye
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: any[];
  loggedInUser?: {
    name: string;
    emailOrPhone: string;
    isAdmin: boolean;
    photoURL?: string;
    phoneNumber?: string;
    deliveryAddress?: string;
  } | null;
}

export default function OrderTrackerModal({ isOpen, onClose, orders = [], loggedInUser }: OrderTrackerProps) {
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('My Orders');
  const [activeStatusTab, setActiveStatusTab] = useState<string>('All Orders');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Single order detail tracking view state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // My Account state
  const [profileData, setProfileData] = useState({
    name: loggedInUser?.name || 'Rakhal Chandro',
    phone: loggedInUser?.phoneNumber || '01700000000',
    email: loggedInUser?.emailOrPhone?.includes('@') ? loggedInUser.emailOrPhone : 'rakhal@gmail.com',
    address: loggedInUser?.deliveryAddress || 'মিরপুর ১০, ঢাকা ১২১৬',
    city: 'ঢাকা',
    postalCode: '১২১৬'
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // My eBooks
  const [ebooksList, setEbooksList] = useState([
    { id: 1, title: 'প্যারাডক্সিক্যাল সাজিদ ২', author: 'আরিফ আজাদ', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80', size: '12.4 MB', format: 'PDF' },
    { id: 2, title: 'স্মার্ট থিংকিং ও মাইন্ডসেট', author: 'তাহমিদ হাসান', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=150&auto=format&fit=crop&q=80', size: '8.1 MB', format: 'EPUB' },
    { id: 3, title: 'রিচ ড্যাড পুওর ড্যাড (অনুবাদ)', author: 'রবোট কিয়োসাকি', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80', size: '15.0 MB', format: 'PDF' }
  ]);
  const [readingEbook, setReadingEbook] = useState<any | null>(null);

  // My Lists
  const [userLists, setUserLists] = useState([
    { id: 1, name: 'আমার পছন্দের ইসলামিক বই', count: 5, color: 'bg-emerald-500' },
    { id: 2, name: 'প্রোগ্রামিং ও টেকনোলজি', count: 8, color: 'bg-sky-500' },
    { id: 3, name: 'বেস্টসেলার উপন্যাস ২০২৬', count: 3, color: 'bg-purple-500' }
  ]);
  const [newListTitle, setNewListTitle] = useState('');

  // Bookshelf state
  const [bookshelf, setBookshelf] = useState([
    { id: 1, title: 'বেলা ফুরোবার আগে', status: 'Currently Reading', progress: 65, totalPages: 220, currentPages: 143 },
    { id: 2, title: 'রি-অ্যাটমিক হ্যাবিটস', status: 'Want to Read', progress: 0, totalPages: 310, currentPages: 0 },
    { id: 3, title: 'গল্পগুচ্ছ (সমগ্র)', status: 'Completed', progress: 100, totalPages: 450, currentPages: 450 }
  ]);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([
    { id: 101, title: 'মাইন্ডসেট ও মানসিক শক্তি', author: 'মাকসুদুল আলম', price: 280, originalPrice: 350, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop&q=80' },
    { id: 102, title: 'পাইথন দিয়ে কোডিং শিখুন', author: 'তামিম শাহরিয়ার সুবিন', price: 320, originalPrice: 400, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&auto=format&fit=crop&q=80' }
  ]);

  // Interests state
  const [interests, setInterests] = useState<string[]>([
    'ইসলামিক বই', 'বিজ্ঞান ও প্রযুক্তি', 'প্রোগ্রামিং', 'অনুবাদ সাহিত্য', 'সায়েন্স ফিকশন'
  ]);
  const availableInterests = [
    'ইসলামিক বই', 'বিজ্ঞান ও প্রযুক্তি', 'প্রোগ্রামিং', 'অনুবাদ সাহিত্য', 'সায়েন্স ফিকশন',
    'বইমেলা ২০২৬', 'উপন্যাস', 'ইতিহাস ও রাজনীতি', 'ব্যবসা ও ক্যারিয়ার', 'ফ্রিল্যান্সিং', 'ইংরেজি ভাষা শিক্ষা'
  ];

  // Rating & Reviews
  const [userReviews, setUserReviews] = useState([
    { id: 1, bookTitle: 'প্যারাডক্সিক্যাল সাজিদ', rating: 5, date: '১৫ জানুয়ারি, ২০২৬', comment: 'অসাধারণ একটি বই! প্রতিটি প্রশ্নের লজিক্যাল উত্তর দেওয়া হয়েছে।' },
    { id: 2, bookTitle: 'স্মার্ট থিংকিং', rating: 4, date: '১০ ডিসেম্বর, ২০২৫', comment: 'চিন্তাধারা ইতিবাচক করতে বেশ সাহায্য করবে।' }
  ]);

  // Balance & Points state
  const [balance, setBalance] = useState<number>(250);
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  const [points, setPoints] = useState<number>(1450);
  const [transactions, setTransactions] = useState([
    { id: 'TXN1001', type: 'Cashback', amount: '+৳৫০', date: '২০ মে, ২০২৬' },
    { id: 'TXN1002', type: 'Order Payment', amount: '-৳২১০', date: '১৮ মে, ২০২৬' }
  ]);

  // Following authors
  const [followingAuthors, setFollowingAuthors] = useState([
    { id: 1, name: 'আরিফ আজাদ', books: 8, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 2, name: 'হুমায়ূন আহমেদ', books: 120, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 3, name: 'তামিম শাহরিয়ার সুবিন', books: 6, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
  ]);

  // Courses state
  const [userCourses, setUserCourses] = useState([
    { id: 1, title: 'ওয়েব ডেভেলপমেন্ট উইথ রিয়্যাক্ট ও নোড', mentor: 'ঝংকার মাহবুব', progress: 75, totalLessons: 24, completedLessons: 18, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&auto=format&fit=crop&q=80' },
    { id: 2, title: 'গ্রাফিক্স ডিজাইন মাস্টারক্লাস', mentor: 'আবু সাঈদ', progress: 30, totalLessons: 15, completedLessons: 5, image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=120&auto=format&fit=crop&q=80' }
  ]);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVouchers, setAppliedVouchers] = useState([
    { code: 'EID2026', discount: '২০% ক্যাশব্যাক', validTill: '৩১ জুলাই ২০২৬' }
  ]);
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; success: boolean } | null>(null);

  // bKash account state
  const [bkashNumber, setBkashNumber] = useState('01700000000');
  const [isBkashLinked, setIsBkashLinked] = useState(true);
  const [bkashEditMode, setBkashEditMode] = useState(false);

  if (!isOpen) return null;

  // Sidebar navigation menu options matching the screenshot
  const sidebarMenuItems = [
    { label: 'My Account', id: 'My Account', icon: User },
    { label: 'My Orders', id: 'My Orders', icon: Package },
    { label: 'My eBook Library', id: 'My eBook Library', icon: BookOpen },
    { label: 'My Lists', id: 'My Lists', icon: List },
    { label: 'My Bookshelf', id: 'My Bookshelf', icon: Bookmark },
    { label: 'My Wishlist', id: 'My Wishlist', icon: Heart },
    { label: 'My Interests', id: 'My Interests', icon: Sparkles },
    { label: 'My Rating & Reviews', id: 'My Rating & Reviews', icon: Star },
    { label: 'My Rokomari Balance', id: 'My Rokomari Balance', icon: Wallet },
    { label: 'My Points', id: 'My Points', icon: Award },
    { label: 'My Following Authors', id: 'My Following Authors', icon: Users },
    { label: 'My Courses', id: 'My Courses', icon: GraduationCap },
    { label: 'Load Voucher', id: 'Load Voucher', icon: CreditCard },
    { label: 'My Bkash Account', id: 'My Bkash Account', icon: ShieldCheck }
  ];

  // Status filter pills
  const statusFilterTabs = [
    'All Orders',
    'To Pay',
    'Processing',
    'Approved',
    'Ready to Ship',
    'Shipped'
  ];

  // Top Electronic Categories carousel items matching the screenshot
  const topCategories = [
    { name: 'Pen Drive', icon: HardDrive, img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&auto=format&fit=crop&q=80' },
    { name: 'Mouse', icon: MouseIcon, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&auto=format&fit=crop&q=80' },
    { name: 'Headphone', icon: Headphones, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Science Kit', icon: Sparkles, img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Speaker', icon: Cpu, img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Router', icon: Radio, img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80' },
    { name: 'Keyboard', icon: KeyboardIcon, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80' },
    { name: 'Hard Disk', icon: HardDrive, img: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=100&auto=format&fit=crop&q=80' },
    { name: 'Antivirus', icon: ShieldAlert, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' },
    { name: 'Moth', icon: Cpu, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80' }
  ];

  // User details
  const userName = profileData.name;
  const userPhoto = loggedInUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

  // Filter orders according to search query and status tab
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = !searchQuery.trim() || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.clientName && o.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.phone && o.phone.includes(searchQuery));

    if (!matchesSearch) return false;
    if (activeStatusTab === 'All Orders') return true;
    if (activeStatusTab === 'To Pay') return o.status === 'Pending' || o.paymentStatus === 'Unpaid';
    if (activeStatusTab === 'Processing') return o.status === 'Pending' || o.status === 'Processing';
    if (activeStatusTab === 'Approved') return o.status === 'Accepted' || o.status === 'Approved';
    if (activeStatusTab === 'Ready to Ship') return o.status === 'Accepted' || o.status === 'Packed';
    if (activeStatusTab === 'Shipped') return o.status === 'Dispatched' || o.status === 'Shipped';
    return true;
  });

  // Handle direct Firestore order lookup on search enter
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const trimmed = searchQuery.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === trimmed);
    if (found) {
      setSelectedOrder(found);
      return;
    }

    try {
      const docSnap = await getDoc(doc(db, 'orders', trimmed));
      if (docSnap.exists()) {
        setSelectedOrder({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (err) {
      console.error("Firestore lookup error:", err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (rating === 0) {
      alert('অনুগ্রহ করে অন্তত ১টি স্টার রেটিং নির্বাচন করুন।');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await setDoc(doc(db, 'orders', selectedOrder.id), {
        rating,
        feedback: feedback.trim()
      }, { merge: true });

      setSelectedOrder((prev: any) => prev ? { ...prev, rating, feedback: feedback.trim() } : null);
      alert('🎉 আপনার রেটিং এবং ফিডব্যাক সফলভাবে সংরক্ষণ করা হয়েছে!');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${selectedOrder.id}`);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Profile Form Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  // Add List Handler
  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    setUserLists(prev => [
      ...prev,
      { id: Date.now(), name: newListTitle.trim(), count: 0, color: 'bg-rose-500' }
    ]);
    setNewListTitle('');
  };

  // Toggle Interest Tag
  const toggleInterest = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests(prev => prev.filter(t => t !== tag));
    } else {
      setInterests(prev => [...prev, tag]);
    }
  };

  // Handle Voucher Load
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    const codeUpper = voucherCode.trim().toUpperCase();
    if (appliedVouchers.some(v => v.code === codeUpper)) {
      setVoucherMsg({ text: 'এই ভাউচার কোডটি আগেই যোগ করা হয়েছে!', success: false });
      return;
    }
    setAppliedVouchers(prev => [
      ...prev,
      { code: codeUpper, discount: '৳১০০ ছাড়', validTill: '৩১ ডিসেম্বর ২০২৬' }
    ]);
    setVoucherMsg({ text: `🎉 ভাউচার '${codeUpper}' সফলভাবে যোগ হয়েছে!`, success: true });
    setVoucherCode('');
    setTimeout(() => setVoucherMsg(null), 3000);
  };

  // Recharge Balance
  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBalance(prev => prev + amt);
    setTransactions(prev => [
      { id: `TXN${Math.floor(1000 + Math.random() * 9000)}`, type: 'Add Balance (bKash)', amount: `+৳${amt}`, date: 'আজ' },
      ...prev
    ]);
    setRechargeAmount('');
    alert(`🎉 ৳${amt} আপনার রকমারি ব্যালেন্সে যোগ করা হয়েছে!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      
      {/* Outer Card Shell */}
      <div className="relative bg-white w-full max-w-6xl min-h-[620px] max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 font-sans">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold tracking-wide">
              কাস্টমার একাউন্ট ও অর্ডার ট্র্যাকিং ড্যাশবোর্ড (My Account & Dashboard)
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <span>বন্ধ করুন</span>
            <X className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          
          {/* Left Sidebar Panel */}
          <div className="w-full md:w-60 lg:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col overflow-y-auto">
            
            {/* Profile Header Card */}
            <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-gradient-to-r from-slate-50 to-white">
              <img 
                src={userPhoto} 
                alt={userName}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-xs shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden leading-snug">
                <span className="text-[11px] text-slate-400 block font-medium">Hello,</span>
                <h3 className="text-xs font-bold text-slate-800 truncate" title={userName}>
                  {userName}
                </h3>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="p-2 space-y-0.5 flex-1">
              {sidebarMenuItems.map((item) => {
                const isActive = activeSidebarItem === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSidebarItem(item.id);
                      if (item.id !== 'My Orders') setSelectedOrder(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-bold border-l-3 border-emerald-500 shadow-2xs' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 bg-slate-50 justify-between">
            
            <div className="space-y-4">
              
              {/* Header Title Bar */}
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-700 font-bold">
                    {sidebarMenuItems.find(s => s.id === activeSidebarItem)?.icon && 
                     React.createElement(sidebarMenuItems.find(s => s.id === activeSidebarItem)!.icon, { className: "w-4 h-4" })}
                  </span>
                  <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                    {activeSidebarItem}
                  </h1>
                </div>
                {selectedOrder && activeSidebarItem === 'My Orders' && (
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-xs text-sky-600 hover:underline font-bold cursor-pointer"
                  >
                    ← সকল অর্ডারে ফিরে যান
                  </button>
                )}
              </div>

              {/* TAB 1: MY ACCOUNT */}
              {activeSidebarItem === 'My Account' && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  {profileSavedMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>আপনার অ্যাকাউন্ট প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">পূর্ণ নাম (Full Name)</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">মোবাইল নাম্বার (Phone)</label>
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">ইমেইল এড্রেস (Email)</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">শহর (City)</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">ডেলিভারি ঠিকানা (Address)</label>
                        <textarea
                          rows={2}
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      প্রোফাইল সেভ করুন (Save Changes)
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: MY ORDERS */}
              {activeSidebarItem === 'My Orders' && !selectedOrder && (
                <>
                  {/* Search Bar */}
                  <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search orders by ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-white text-xs font-medium text-slate-800 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-2xs"
                    />
                  </form>

                  {/* Status Filter Tabs */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/60 pt-1">
                    {statusFilterTabs.map((tab) => {
                      const isActive = activeStatusTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveStatusTab(tab)}
                          className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                            isActive
                              ? 'border border-sky-500 text-sky-600 font-bold bg-white shadow-2xs'
                              : 'text-slate-600 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  {/* Orders Content */}
                  {filteredOrders.length > 0 ? (
                    <div className="space-y-3 py-2">
                      {filteredOrders.map((o) => (
                        <div 
                          key={o.id} 
                          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-sky-300 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                          onClick={() => setSelectedOrder(o)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                                #{o.id}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                o.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                                o.status === 'Accepted' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {o.status || 'Pending'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600">
                              <strong>ক্রেতার নাম:</strong> {o.clientName} | <strong>তারিখ:</strong> {o.date || '২০২৬'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {o.itemsCount ? `${o.itemsCount} টি আইটেম` : 'মক বুক অর্ডার'} • মোট মূল্য: <strong className="text-slate-800">TK. {o.totalPrice}</strong>
                            </div>
                          </div>

                          <button className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0">
                            ট্র্যাক করুন →
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Empty State Illustration */
                    <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-24 h-24 z-10" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="52" cy="52" r="26" fill="#FBBF24" stroke="#334155" strokeWidth="3"/>
                          <line x1="70" y1="70" x2="95" y2="95" stroke="#334155" strokeWidth="8" strokeLinecap="round"/>
                          <circle cx="44" cy="47" r="2" fill="#334155"/>
                          <circle cx="60" cy="47" r="2" fill="#334155"/>
                          <path d="M45 58C48 55 56 55 59 58" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">No Order Found!</h3>
                      <p className="text-xs text-slate-500 max-w-xs">Looks like there are no orders in this category.</p>
                    </div>
                  )}
                </>
              )}

              {/* Order Detail View */}
              {activeSidebarItem === 'My Orders' && selectedOrder && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Order Reference</span>
                      <h3 className="text-sm font-black font-mono text-sky-600">#{selectedOrder.id}</h3>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {selectedOrder.status || 'Processing'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-150">
                    <div><strong>Customer Name:</strong> {selectedOrder.clientName}</div>
                    <div><strong>Phone:</strong> {selectedOrder.phone || 'N/A'}</div>
                    <div className="sm:col-span-2"><strong>Address:</strong> {selectedOrder.address || 'Dhaka, Bangladesh'}</div>
                    <div><strong>Order Date:</strong> {selectedOrder.date || '২০২৬'}</div>
                    <div><strong>Total Price:</strong> TK. {selectedOrder.totalPrice}</div>
                  </div>

                  {/* Feedback Form */}
                  {selectedOrder.status === 'Completed' && (
                    <div className="border-t border-dashed border-slate-200 pt-3 space-y-2">
                      <h5 className="text-xs font-bold text-slate-700">রেটিং এবং রিভিউ প্রদান করুন:</h5>
                      <form onSubmit={handleSubmitFeedback} className="space-y-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="text-amber-400 p-1 cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows={2}
                          placeholder="আপনার অভিজ্ঞতা কেমন ছিল লিখুন..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-xs"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingFeedback || rating === 0}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                        >
                          {isSubmittingFeedback ? 'সংরক্ষণ হচ্ছে...' : 'রিভিউ সেভ করুন'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MY EBOOK LIBRARY */}
              {activeSidebarItem === 'My eBook Library' && (
                <div className="space-y-3">
                  {readingEbook && (
                    <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl mb-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-sky-600 font-bold uppercase">অনলাইন রিডার মোড</span>
                        <h4 className="text-xs font-bold text-slate-800">{readingEbook.title} ({readingEbook.author})</h4>
                      </div>
                      <button 
                        onClick={() => setReadingEbook(null)}
                        className="bg-white border border-sky-300 text-sky-700 px-3 py-1 rounded text-xs font-bold hover:bg-sky-100 cursor-pointer"
                      >
                        পড়া শেষ করুন ✕
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ebooksList.map((book) => (
                      <div key={book.id} className="bg-white border border-slate-200 rounded-xl p-3 flex space-x-3 shadow-2xs hover:border-emerald-300 transition-all">
                        <img src={book.cover} alt={book.title} className="w-16 h-22 object-cover rounded shadow-2xs shrink-0" />
                        <div className="flex flex-col justify-between text-xs overflow-hidden">
                          <div>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">{book.format}</span>
                            <h4 className="font-bold text-slate-800 truncate mt-1">{book.title}</h4>
                            <p className="text-[11px] text-slate-500">{book.author}</p>
                          </div>
                          <div className="flex space-x-1.5 mt-2">
                            <button 
                              onClick={() => setReadingEbook(book)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer flex items-center space-x-0.5"
                            >
                              <Eye className="w-3 h-3" />
                              <span>পড়ুন</span>
                            </button>
                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold cursor-pointer flex items-center space-x-0.5">
                              <Download className="w-3 h-3" />
                              <span>ডাউনলোড</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MY LISTS */}
              {activeSidebarItem === 'My Lists' && (
                <div className="space-y-4">
                  <form onSubmit={handleCreateList} className="flex gap-2 bg-white p-3 border border-slate-200 rounded-xl shadow-2xs">
                    <input
                      type="text"
                      placeholder="নতুন বুক লিস্টের শিরোনাম..."
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>লিস্ট তৈরি করুন</span>
                    </button>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userLists.map((list) => (
                      <div key={list.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${list.color}`} />
                            <h4 className="text-xs font-bold text-slate-800">{list.name}</h4>
                          </div>
                          <span className="text-[11px] text-slate-500 block">{list.count} টি বই সংরক্ষিত</span>
                        </div>
                        <button 
                          onClick={() => setUserLists(prev => prev.filter(l => l.id !== list.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                          title="লিস্ট মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: MY BOOKSHELF */}
              {activeSidebarItem === 'My Bookshelf' && (
                <div className="space-y-3">
                  {bookshelf.map((book) => (
                    <div key={book.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            book.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            book.status === 'Currently Reading' ? 'bg-sky-100 text-sky-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {book.status}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">{book.title}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-600">{book.progress}%</span>
                      </div>

                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${book.progress}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>{book.currentPages} / {book.totalPages} পৃষ্ঠা পড়া হয়েছে</span>
                        <button 
                          onClick={() => {
                            const newPages = Math.min(book.totalPages, book.currentPages + 20);
                            const newProg = Math.round((newPages / book.totalPages) * 100);
                            setBookshelf(prev => prev.map(b => b.id === book.id ? { ...b, currentPages: newPages, progress: newProg, status: newProg === 100 ? 'Completed' : 'Currently Reading' } : b));
                          }}
                          className="text-emerald-600 font-bold hover:underline cursor-pointer"
                        >
                          +২০ পৃষ্ঠা আপডেট করুন
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: MY WISHLIST */}
              {activeSidebarItem === 'My Wishlist' && (
                <div className="space-y-3">
                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 flex space-x-3 shadow-2xs">
                          <img src={item.image} alt={item.title} className="w-14 h-20 object-cover rounded shrink-0" />
                          <div className="flex flex-col justify-between text-xs flex-1">
                            <div>
                              <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                              <p className="text-[11px] text-slate-500">{item.author}</p>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="font-bold text-emerald-600">৳{item.price}</span>
                                <span className="line-through text-slate-400 text-[10px]">৳{item.originalPrice}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <button className="bg-emerald-600 text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-emerald-500 cursor-pointer">
                                কার্টে যোগ করুন
                              </button>
                              <button 
                                onClick={() => setWishlistItems(prev => prev.filter(w => w.id !== item.id))}
                                className="text-rose-500 p-1 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-8">আপনার উইশলিস্টে কোনো বই নেই।</p>
                  )}
                </div>
              )}

              {/* TAB 7: MY INTERESTS */}
              {activeSidebarItem === 'My Interests' && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    পছন্দের বিষয়গুলো বেছে নিন যাতে আমরা আপনাকে সেরা বই ও অফার রেকমেন্ড করতে পারি:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map((tag) => {
                      const isSelected = interests.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleInterest(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-emerald-600 text-white shadow-2xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 8: MY RATING & REVIEWS */}
              {activeSidebarItem === 'My Rating & Reviews' && (
                <div className="space-y-3">
                  {userReviews.map((rev) => (
                    <div key={rev.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-800">{rev.bookTitle}</h4>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 9: MY ROKOMARI BALANCE */}
              {activeSidebarItem === 'My Rokomari Balance' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-xs text-emerald-100 block">বর্তমান ব্যালেন্স (Available Balance)</span>
                      <h3 className="text-2xl font-black font-mono mt-0.5">৳ {balance}.০০</h3>
                    </div>

                    <form onSubmit={handleRecharge} className="flex gap-2 w-full sm:w-auto">
                      <input
                        type="number"
                        placeholder="পরিমাণ (ex: 100)"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="bg-white text-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold w-32 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer shrink-0"
                      >
                        + রিচার্জ করুন
                      </button>
                    </form>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">লেনদেন বিবরণী (Transaction History)</h4>
                    <div className="space-y-2">
                      {transactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 last:border-0">
                          <div>
                            <span className="font-bold text-slate-700 block">{t.type}</span>
                            <span className="text-[10px] text-slate-400">{t.id} • {t.date}</span>
                          </div>
                          <span className={`font-mono font-bold ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {t.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: MY POINTS */}
              {activeSidebarItem === 'My Points' && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-amber-800 font-bold">মোট রিওয়ার্ড পয়েন্ট</span>
                      <h3 className="text-2xl font-black text-amber-600">{points} Points</h3>
                      <p className="text-[11px] text-amber-700 mt-1">১০ পয়েন্ট = ৳ ১ সমমূল্যের ক্যাশ ভাউচার</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (points < 100) {
                          alert('কমপক্ষে ১০০ পয়েন্ট থাকলে ভাউচারে কনভার্ট করতে পারবেন।');
                          return;
                        }
                        const discount = Math.floor(points / 10);
                        setPoints(0);
                        setAppliedVouchers(prev => [...prev, { code: `PTS-${Date.now()}`, discount: `৳${discount} ছাড়`, validTill: '৩০ দিন' }]);
                        alert(`🎉 ${points} পয়েন্ট সফলভাবে ৳${discount} ভাউচারে রূপান্তর করা হয়েছে!`);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shadow-2xs"
                    >
                      পয়েন্ট রিডিম করুন
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 11: MY FOLLOWING AUTHORS */}
              {activeSidebarItem === 'My Following Authors' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {followingAuthors.map((author) => (
                    <div key={author.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center space-x-3 shadow-2xs">
                      <img src={author.image} alt={author.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      <div className="overflow-hidden flex-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{author.name}</h4>
                        <span className="text-[11px] text-slate-500 block">{author.books} টি প্রকাশিত বই</span>
                        <button 
                          onClick={() => setFollowingAuthors(prev => prev.filter(a => a.id !== author.id))}
                          className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer mt-1 block"
                        >
                          আনফলো করুন
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 12: MY COURSES */}
              {activeSidebarItem === 'My Courses' && (
                <div className="space-y-3">
                  {userCourses.map((course) => (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 shadow-2xs">
                      <img src={course.image} alt={course.title} className="w-full sm:w-28 h-20 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 space-y-1.5 justify-between flex flex-col">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{course.title}</h4>
                          <p className="text-[11px] text-slate-500">মেন্টর: {course.mentor}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                            <span>{course.completedLessons}/{course.totalLessons} ক্লাস সম্পন্ন</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 13: LOAD VOUCHER */}
              {activeSidebarItem === 'Load Voucher' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">প্রোমো কোড বা ভাউচার রিডিম করুন</h4>
                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="এখানে ভাউচার কোড দিন (ex: EID2026)"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-hidden uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        আবেদন করুন
                      </button>
                    </form>

                    {voucherMsg && (
                      <div className={`p-2.5 rounded-lg text-xs font-bold ${voucherMsg.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {voucherMsg.text}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                    <h4 className="text-xs font-bold text-slate-800">আপনার সক্রিয় ভাউচারসমূহ</h4>
                    {appliedVouchers.map((v, i) => (
                      <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="font-mono font-bold text-sky-600 block">{v.code}</span>
                          <span className="text-[11px] text-emerald-600 font-bold">{v.discount}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">মেয়াদ: {v.validTill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 14: MY BKASH ACCOUNT */}
              {activeSidebarItem === 'My Bkash Account' && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center space-x-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <div className="w-10 h-10 bg-rose-600 text-white rounded-lg flex items-center justify-center font-black text-sm shrink-0">
                      bKash
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-rose-900">সংযুক্ত বিকাশ অ্যাকাউন্ট</h4>
                      <p className="text-[11px] text-rose-700">সহজে ১-ক্লিকে অনলাইন পেমেন্টের জন্য সংযুক্ত রাখা হয়েছে</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">বিকাশ মোবাইল নম্বর</label>
                      <input
                        type="text"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-1 focus:ring-rose-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoPay"
                        checked={isBkashLinked}
                        onChange={(e) => setIsBkashLinked(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <label htmlFor="autoPay" className="text-slate-700 text-xs">
                        ভবিষ্যৎ টপসেল অর্ডারে ১-ক্লিক দ্রুত পেমেন্ট সক্রিয় রাখুন
                      </label>
                    </div>

                    <button 
                      onClick={() => alert('🎉 বিকাশ অ্যাকাউন্ট তথ্য সফলভাবে আপডেট করা হয়েছে!')}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      সেভ করুন
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom "Top Electronic Categories" Carousel Bar (Matching Screenshot) */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-slate-800">
                  Top Electronic Categories
                </h3>
              </div>

              <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
                {topCategories.map((cat, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className="flex flex-col items-center justify-center min-w-[70px] space-y-1.5 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center overflow-hidden p-1 group-hover:border-sky-400 group-hover:bg-sky-50/50 transition-all shadow-2xs">
                        <img 
                          src={cat.img} 
                          alt={cat.name} 
                          className="w-full h-full object-cover rounded-md"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] text-slate-600 font-medium truncate max-w-[75px] text-center">
                        {cat.name}
                      </span>
                    </div>
                  );
                })}

                {/* Arrow Navigation Button */}
                <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center shrink-0 text-slate-600 shadow-2xs cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
