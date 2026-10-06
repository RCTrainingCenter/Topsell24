import { X, Send, Award, Users, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

interface RequestQuoteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote?: (quote: { 
    clientName: string; 
    institution: string; 
    phone: string; 
    email: string; 
    bookDetails: string; 
    quantity: number; 
  }) => void;
}

export default function RequestQuoteModal({ isOpen, onClose, onSubmitQuote }: RequestQuoteProps) {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('books');
  const [quantity, setQuantity] = useState(100);
  const [notes, setNotes] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !org || !email || !phone) {
      alert('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন!');
      return;
    }
    if (onSubmitQuote) {
      onSubmitQuote({
        clientName: name,
        institution: org,
        phone,
        email,
        bookDetails: notes || `ক্যাটাগরি: ${category} - প্রাতিষ্ঠানিক বাল্ক কেনাকাটার কাস্টম মক রিকোয়েস্ট`,
        quantity,
      });
    }
    setIsSent(true);
  };

  const handleDone = () => {
    setName('');
    setOrg('');
    setEmail('');
    setPhone('');
    setNotes('');
    setIsSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col z-10 overflow-hidden animate-scale-up border border-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-150 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 font-sans text-sm">প্রাতিষ্ঠানিক কোটেশন রিকোয়েস্ট (Request A Quote)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          /* Sent notification state screen */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 font-sans">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-md font-bold text-slate-800">রিকোয়েস্ট সফলভাবে সম্পন্ন হয়েছে!</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              ধন্যবাদ! আপনার প্রাতিষ্ঠানিক কোটেশন রিকোয়েস্টটি আমাদের সিস্টেমে নথিভুক্ত করা হয়েছে। ২৪ ঘণ্টার মধ্যে কেনাকাটা করপোরেট টিম আপনার সাথে ইমেইল (<span className="font-semibold text-slate-700">{email}</span>) অথবা ফোনে যোগাযোগ করবেন।
            </p>
            <button
              onClick={handleDone}
              className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          /* Form details stage */
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
            <div className="text-xs text-slate-500 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/40 leading-relaxed font-sans">
              কেনাকাটা প্রাতিষ্ঠানিক দলের মাধ্যমে স্কুল, কলেজ, বিশ্ববিদ্যালয়, করপোরেট অফিস, এবং এনজিও লাইব্রেরির জন্য কাস্টমাইজড ডিসকাউন্টে সরাসরি বই ও এক্সেসরিজ সংগ্রহ করুন।
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">যোগাযোগকারীর নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: ডেনিস রিচি"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">প্রতিষ্ঠানের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: ব্র্যাক বিশ্ববিদ্যালয় লাইব্রেরি"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  placeholder="EX: rfq@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">মোবাইল নাম্বার *</label>
                <input
                  type="tel"
                  required
                  placeholder="EX: 01711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">প্রোডাক্ট ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded px-3 py-1.5 text-xs focus:outline-hidden"
                >
                  <option value="books">বই সংগ্রহ (Books Catalog)</option>
                  <option value="electronics">ইলেকট্রনিক্স (Corporate Electronics)</option>
                  <option value="superstore">সুপারস্টোর উপহার (Superstore & Gifts)</option>
                  <option value="mixed">মিশ্রিত পণ্য সামগ্রী (Mixed Assorted Items)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">আনুমানিক পরিমাণ (পিস/কপি) *</label>
                <input
                  type="number"
                  required
                  min="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 font-sans block font-medium">কাস্টমাইজড রিকোয়ারমেন্টস বা পণ্য তালিকা</label>
              <textarea
                rows={3}
                placeholder="আপনার কাঙ্ক্ষিত বইয়ের তালিকা, কাস্টম উপহার প্যাকিং নির্দেশনাবলী অথবা অন্য কোনো নির্দেশনা থাকলে এখানে লিখুন..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-3 border-t border-gray-150 flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>রিকোয়েস্ট কোটেশন প্রেরণ করুন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
