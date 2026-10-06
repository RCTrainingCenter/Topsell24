import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Tag, Calendar, AlertCircle } from 'lucide-react';
import { Coupon } from '../types';

interface CouponManagerProps {
  coupons: Coupon[];
  onUpdateCoupons: (updated: Coupon[]) => void;
}

export default function CouponManager({
  coupons = [],
  onUpdateCoupons,
}: CouponManagerProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  // Start creating new coupon
  const handleCreateNew = () => {
    setEditingCoupon({
      id: 'coupon-' + Date.now().toString(36),
      code: '',
      discountPercent: 10,
      minPurchase: 500,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      isActive: true,
    });
    setIsEditing(true);
  };

  // Start editing existing coupon
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon({ ...coupon });
    setIsEditing(true);
  };

  // Delete coupon
  const handleDelete = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    onUpdateCoupons(updated);
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    onUpdateCoupons(updated);
  };

  // Save changes
  const handleSave = () => {
    if (!editingCoupon) return;
    if (!editingCoupon.code?.trim()) {
      alert('দয়া করে কুপনের কোডটি লিখুন!');
      return;
    }
    const cleanCode = editingCoupon.code.toUpperCase().trim();
    if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
      alert('কুপন কোড শুধুমাত্র ইংরেজি অক্ষর এবং সংখ্যা হতে হবে (যেমন: KENAKATA20)');
      return;
    }

    const discount = Number(editingCoupon.discountPercent);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      alert('ডিসকাউন্ট শতকরা ১ থেকে ১০০ এর মধ্যে হতে হবে!');
      return;
    }

    const minPur = Number(editingCoupon.minPurchase);
    if (isNaN(minPur) || minPur < 0) {
      alert('নূন্যতম ক্রয়ের পরিমাণ সঠিক সংখ্যা হতে হবে!');
      return;
    }

    const couponToSave = {
      ...editingCoupon,
      code: cleanCode,
      discountPercent: discount,
      minPurchase: minPur,
    } as Coupon;

    const exists = coupons.some(c => c.id === couponToSave.id);
    let updated: Coupon[] = [];
    if (exists) {
      updated = coupons.map(c => c.id === couponToSave.id ? couponToSave : c);
    } else {
      // Check if code already exists under different ID
      if (coupons.some(c => c.code === couponToSave.code)) {
        alert('এই কুপন কোডটি ইতিমধ্যেই বিদ্যমান রয়েছে!');
        return;
      }
      updated = [...coupons, couponToSave];
    }

    onUpdateCoupons(updated);
    setIsEditing(false);
    setEditingCoupon(null);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-cyan-200" />
            <h3 className="text-sm font-bold text-cyan-100 uppercase tracking-wider">Campaign & Promo Manager</h3>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-sans">লাইভ কুপন ও প্রমোশনাল কন্ট্রোল</h2>
          <p className="text-xs text-cyan-500 font-medium">সরাসরি রিয়েল টাইমে ডিসকাউন্ট কুপন তৈরি, মেয়াদ এবং নূন্যতম ক্রয়ের পরিমাণ কাস্টমাইজ করুন।</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="bg-white hover:bg-cyan-50 text-indigo-900 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all transform hover:scale-103 cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন কুপন তৈরি করুন</span>
          </button>
        )}
      </div>

      {isEditing && editingCoupon && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                <Tag className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-black text-slate-800 font-sans">
                {coupons.some(c => c.id === editingCoupon.id) ? 'কুপন সংশোধন করুন' : 'নতুন কুপন যুক্ত করুন'}
              </h3>
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingCoupon(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">কুপন কোড (Coupon Code)</label>
              <input
                type="text"
                value={editingCoupon.code || ''}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                placeholder="যেমন: EID2026, SUMMER30"
                className="w-full border border-slate-250 bg-white rounded-lg p-2.5 font-mono text-xs uppercase tracking-widest text-slate-800 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
              <p className="text-[10px] text-slate-400">স্পেস ছাড়া শুধুমাত্র ইংরেজি বড় হাতের লেখা এবং সংখ্যা দিন।</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">ডিসকাউন্টের শতকরা হার (Discount %)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={editingCoupon.discountPercent || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountPercent: Number(e.target.value) })}
                  placeholder="১০, ২০ বা ৩০"
                  className="w-full border border-slate-250 bg-white rounded-lg p-2.5 pl-8 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                />
                <span className="absolute left-3 top-3 text-slate-400 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">নূন্যতম ক্রয়ের পরিমাণ (Min Purchase BDT)</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={editingCoupon.minPurchase === undefined ? '' : editingCoupon.minPurchase}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, minPurchase: Number(e.target.value) })}
                  placeholder="যেমন: ৫০০ বা ১০০০"
                  className="w-full border border-slate-250 bg-white rounded-lg p-2.5 pl-8 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                />
                <span className="absolute left-3 top-3 text-slate-400 font-bold">৳</span>
              </div>
              <p className="text-[10px] text-slate-400">এই পরিমাণের কম কেনাকাটা করলে কুপন কাজ করবে না।</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">ডিসকাউন্টের মেয়াদ (Expiry Date)</label>
              <div className="relative">
                <input
                  type="date"
                  value={editingCoupon.expiryDate || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                  className="w-full border border-slate-250 bg-white rounded-lg p-2.5 pl-8 text-xs text-slate-800 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                />
                <Calendar className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 block">কুপন স্ট্যাটাস (Status)</label>
              <div className="flex items-center space-x-2 pt-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCoupon({ ...editingCoupon, isActive: !editingCoupon.isActive })}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    editingCoupon.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                      editingCoupon.isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-700">
                  {editingCoupon.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingCoupon(null);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-black text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              সেভ করুন 💾
            </button>
          </div>
        </div>
      )}

      {/* Coupon Grid/List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <strong className="text-xs font-bold text-slate-700">বিদ্যমান সক্রিয়/নিষ্ক্রিয় কুপন সমূহ ({coupons.length} টি)</strong>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-12 p-6">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-semibold">কোনো কুপন কোড পাওয়া যায়নি। নতুন কুপন তৈরি করতে উপরে ক্লিক করুন।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-650">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-150">
                <tr>
                  <th className="p-4">কোড (Code)</th>
                  <th className="p-4">ছাড় (Discount)</th>
                  <th className="p-4">নূন্যতম ক্রয় (Min Purchase)</th>
                  <th className="p-4">মেয়াদ উত্তীর্ণ (Expiry Date)</th>
                  <th className="p-4 text-center">স্ট্যাটাস</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {coupons.map((c) => {
                  const todayStr = new Date().toISOString().slice(0, 10);
                  const isExpired = c.expiryDate && todayStr > c.expiryDate;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="p-4 font-mono font-black text-slate-900 tracking-wider">
                        <span className="px-2 py-1 bg-cyan-50 border border-cyan-150 text-cyan-700 rounded text-[11px]">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-600">
                        {c.discountPercent}% OFF
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        ৳{c.minPurchase}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <span className={isExpired ? 'text-rose-500 font-bold' : 'text-slate-600'}>
                            {c.expiryDate || 'N/A'}
                          </span>
                          {isExpired && (
                            <span className="text-[9px] bg-rose-100 text-rose-600 px-1 py-0.2 rounded font-black">EXPIRED</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActive(c.id)}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-full transition-colors cursor-pointer ${
                            c.isActive && !isExpired
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {c.isActive && !isExpired ? 'ACTIVE' : c.isActive ? 'EXPIRED' : 'INACTIVE'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 hover:text-indigo-800 rounded transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-100 hover:text-rose-800 rounded transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
