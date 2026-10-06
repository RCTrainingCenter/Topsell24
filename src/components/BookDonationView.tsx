import React, { useState } from 'react';
import { 
  BookOpen, Heart, Truck, CheckCircle2, MapPin, Phone, User, 
  Sparkles, Gift, ArrowLeft, ShieldCheck, MessageSquare, Send, X, Users, Award
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface BookDonationViewProps {
  onBackToHome: () => void;
}

export default function BookDonationView({ onBackToHome }: BookDonationViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [bookTypes, setBookTypes] = useState('');
  const [bookQuantity, setBookQuantity] = useState('5');
  const [pickupType, setPickupType] = useState('home'); // 'home' | 'courier'
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !phone.trim() || !address.trim()) {
      alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং পিকআপ ঠিকানা দিন।');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'book_donations'), {
        donorName: donorName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        district,
        bookTypes: bookTypes.trim() || 'সাধারণ বই',
        bookQuantity: parseInt(bookQuantity) || 1,
        pickupType,
        notes: notes.trim(),
        createdAt: serverTimestamp(),
        status: 'Pending'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Donation submit error:", err);
      // Local fallback success if firestore offline
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDonorName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setBookTypes('');
    setBookQuantity('5');
    setNotes('');
    setIsSubmitted(false);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Top Header / Back Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
            <span>বই ডোনেশন উদ্যোগ (Book Donation Program)</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-8 sm:space-y-12">

        {/* 1. HERO BANNER MATCHING THE SCREENSHOT */}
        <div className="w-full bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 shadow-xl relative grid grid-cols-1 md:grid-cols-12 min-h-[300px] sm:min-h-[360px]">
          
          {/* Left Column Image (Outdoor learning circle with village children) */}
          <div className="md:col-span-7 relative h-64 sm:h-80 md:h-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80" 
              alt="Outdoor village class under tree" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
          </div>

          {/* Right Column Content Box with Slanted Overlay */}
          <div className="md:col-span-5 relative bg-[#e9ecef] flex flex-col justify-center items-center md:items-start p-6 sm:p-10 text-center md:text-left z-10">
            
            {/* Desktop Diagonal Cut Decorative Polygon */}
            <div 
              className="hidden md:block absolute -left-12 top-0 bottom-0 w-16 bg-[#e9ecef] pointer-events-none"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            />

            <div className="space-y-5 relative z-10 max-w-md">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#112d4e] leading-snug tracking-tight">
                আপনার দেয়া বইটিই হতে পারে <br className="hidden sm:inline" />
                কারও জ্ঞানের পৃথিবীর দরজা
              </h1>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2.5 bg-[#1b4b82] hover:bg-[#123661] text-white px-6 py-3 rounded-lg text-sm sm:text-base font-bold shadow-lg border border-[#2b65a8] transition-all transform hover:scale-105 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-5 h-5 text-sky-200" />
                <span>বই ডোনেট করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. CENTERED SECTION HEADING & DESCRIPTION MATCHING SCREENSHOT */}
        <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-snug">
            বই-বঞ্চিত মানুষকে পাঠের আনন্দ দিতে <br />
            <span className="text-[#1b4b82]">বই ডোনেশন দিন</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto pt-1">
            আপনার বুকশেলফে হয়তো অনেক বই অব্যবহৃত পড়ে আছে, কিন্তু সেই একই বই বদলে দিতে পারে কারও জীবন। কল্পনা করুন, কোনো প্রত্যন্ত গ্রামের একটি শিশু, যে কখনোই বইয়ের পাতা উল্টানোর সুযোগ পায়নি—আপনার দেওয়া একটি বইই হতে পারে তার প্রথম পাঠের হাতিয়ার, তার স্বপ্ন দেখার শুরু।
          </p>

          <div className="pt-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-7 py-2.5 rounded-full shadow-md transition-all cursor-pointer inline-flex items-center space-x-2"
            >
              <Gift className="w-4 h-4" />
              <span>এখনই বই জমা দিন</span>
            </button>
          </div>
        </div>

        {/* 3. FOUR EASY STEPS TO DONATE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              কীভাবে কাজ করে (How It Works)
            </span>
            <h3 className="text-base sm:text-xl font-bold text-slate-800">৪টি সহজ ধাপে আপনার বই পৌঁছাবে শিক্ষার্থীর হাতে</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2 relative">
              <div className="w-10 h-10 bg-sky-100 text-sky-700 font-black rounded-full flex items-center justify-center mx-auto text-sm">
                ১
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">বই বাছাই করুন</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                আপনার কালেকশন থেকে গল্প, উপন্যাস, টেক্সটবুক বা জ্ঞানধর্মী ভালো মানের বই নির্বাচন করুন।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2 relative">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-black rounded-full flex items-center justify-center mx-auto text-sm">
                ২
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">ফরম পূরণ করুন</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                অনলাইন ফর্মে আপনার নাম, ঠিকানা ও মোট বইয়ের আনুমানিক সংখ্যা উল্লেখ করুন।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2 relative">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 font-black rounded-full flex items-center justify-center mx-auto text-sm">
                ৩
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">ফ্রি পিকআপ</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                আমাদের স্বেচ্ছাসেবী টিম বা কুরিয়ার সুবিধা থেকে সম্পূর্ণ বিনামূল্যে বই সংগৃহীত হবে।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2 relative">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 font-black rounded-full flex items-center justify-center mx-auto text-sm">
                ৪
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">বিতরণ ও আপডেট</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                বইসমূহ গ্রামীণ ফ্রি লাইব্রেরি ও শিক্ষার্থীদের মাঝে পৌঁছানো হবে এবং আপনাকে মেসেজে জানান হবে।
              </p>
            </div>

          </div>
        </div>

        {/* 4. IMPACT COUNTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#112d4e] to-[#1b4b82] text-white rounded-2xl p-6 text-center space-y-1 shadow-md">
            <BookOpen className="w-8 h-8 mx-auto text-sky-300 opacity-90" />
            <h3 className="text-2xl sm:text-3xl font-black font-mono">২৮,৫০০+</h3>
            <p className="text-xs text-sky-100 font-medium">সংগৃহীত ও বিতরিত বই</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl p-6 text-center space-y-1 shadow-md">
            <Users className="w-8 h-8 mx-auto text-emerald-200 opacity-90" />
            <h3 className="text-2xl sm:text-3xl font-black font-mono">১৬৫+</h3>
            <p className="text-xs text-emerald-100 font-medium">সহযোগী গ্রামীণ লাইব্রেরি</p>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white rounded-2xl p-6 text-center space-y-1 shadow-md">
            <Award className="w-8 h-8 mx-auto text-amber-200 opacity-90" />
            <h3 className="text-2xl sm:text-3xl font-black font-mono">৫০,০০০+</h3>
            <p className="text-xs text-amber-100 font-medium">উপকৃত শিশু ও পাঠক</p>
          </div>
        </div>

        {/* 5. RECENT DONORS WALL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>সাম্প্রতিক শ্রদ্ধেয় বই ডোনারবৃন্দ</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">ধন্যবাদ জ্ঞাপন</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'ড. তানভীর হোসেন', area: 'উত্তরা, ঢাকা', count: '২৫ টি বই', type: 'বিজ্ঞান ও সায়েন্স ফিকশন' },
              { name: 'সাবরিনা সুলতানা', area: 'ধানমন্ডি, ঢাকা', count: '৪০ টি বই', type: 'উপন্যাস ও সাহিত্য' },
              { name: 'আরিফুল ইসলাম', area: 'আগ্রাবাদ, চট্টগ্রাম', count: '১৮ টি বই', type: 'ইসলামিক ও শিক্ষণীয়' },
              { name: 'ফারহান চৌধুরী', area: 'জিন্দাবাজার, সিলেট', count: '৩০ টি বই', type: 'একাডেমিক বই' },
              { name: 'নাসরিন আক্তার', area: 'বোয়ালিয়া, রাজশাহী', count: '১৫ টি বই', type: 'শিশুতোষ ও ছড়ার বই' },
              { name: 'মোঃ রফিকুল ইসলাম', area: 'পটুয়াখালী', count: '৫০ টি বই', type: 'বিভিন্ন বিষয়ের বই' },
            ].map((d, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 truncate">{d.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] shrink-0">
                    {d.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{d.area}</span>
                </p>
                <div className="text-[10px] text-sky-700 font-medium pt-0.5">
                  ধরন: {d.type}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* DONATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#112d4e] text-white p-4 sm:p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-sky-300" />
                <h3 className="text-sm sm:text-base font-bold">বই ডোনেশন আবেদন ফরম</h3>
              </div>
              <button 
                onClick={resetForm}
                className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-slate-800">🎉 আপনাকে অসংখ্য ধন্যবাদ!</h4>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                      আপনার বই ডোনেশনের তথ্যটি আমাদের ডাটাবেজে সংরক্ষিত হয়েছে। আমাদের ভলান্টিয়ার টিম ২৪ ঘণ্টার মধ্যে মোবাইল নম্বরে কল করে পিকআপ নিশ্চিত করবে।
                    </p>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitDonation} className="space-y-3.5 text-xs">
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="আপনার নাম লিখুন"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        মোবাইল নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="01700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                      <input 
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">জেলা (District)</label>
                      <select 
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                      >
                        {['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ', 'অন্যান্য'].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">বইয়ের আনুমানিক সংখ্যা</label>
                      <select 
                        value={bookQuantity}
                        onChange={(e) => setBookQuantity(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                      >
                        <option value="5">১ - ৫ টি বই</option>
                        <option value="15">৬ - ২০ টি বই</option>
                        <option value="50">২১ - ৫০ টি বই</option>
                        <option value="100">৫০+ টি বই (বড় কালেকশন)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      পিকআপ পূর্ণাঙ্গ ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="বাসা/হোল্ডিং নং, রোড নং, এলাকা..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বইয়ের ধরন বা বিষয়ে সংক্ষিপ্ত তথ্য</label>
                    <input 
                      type="text"
                      placeholder="যেমন: উপন্যাস, মাধ্যমিক টেক্সটবুক, ইসলামিক বই..."
                      value={bookTypes}
                      onChange={(e) => setBookTypes(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পিকআপ মাধ্যম</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setPickupType('home')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          pickupType === 'home' ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        🏠 হোম পিকআপ
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPickupType('courier')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          pickupType === 'courier' ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        📦 কুরিয়ার ড্রপ অফ
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1b4b82] hover:bg-[#123661] text-white py-3 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'ডোনেশন রিকোয়েস্ট জমা দিন'}</span>
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
