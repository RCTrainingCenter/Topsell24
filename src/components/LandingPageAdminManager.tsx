import React, { useState } from 'react';
import { SingleProductLandingPage, Product } from '../types';
import { 
  Rocket, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Search, 
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Percent,
  Clock,
  Truck,
  Image as ImageIcon,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface LandingPageAdminManagerProps {
  landingPages: SingleProductLandingPage[];
  products: Product[];
  onUpdateLandingPages: (pages: SingleProductLandingPage[]) => void;
  onPreviewLandingPage: (page: SingleProductLandingPage) => void;
  onOpenImageGallery?: (callback: (url: string) => void) => void;
}

export default function LandingPageAdminManager({
  landingPages,
  products,
  onUpdateLandingPages,
  onPreviewLandingPage,
  onOpenImageGallery
}: LandingPageAdminManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SingleProductLandingPage>>({
    productId: products[0]?.id || '',
    title: '',
    subtitle: '',
    badgeText: '🔥 বিশেষ ধামাকা অফার',
    bannerImageUrl: '',
    offerPrice: 0,
    originalPrice: 0,
    discountPercent: 0,
    deliveryFee: 0,
    deliveryText: 'সারা দেশে হোম ডেলিভারি ফ্রি!',
    features: [
      '১০০% অরিজিনাল ব্র্যান্ডের পণ্য',
      'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ)',
      '৭ দিনের সহজ রিটার্ন ও রিপ্লেসমেন্ট গ্যারান্টি'
    ],
    urgencyText: 'সীমিত স্টক! আজকের অফার শেষ হতে আর মাত্র কয়েক ঘণ্টা বাকি!',
    countdownHours: 12,
    status: 'active'
  });

  const [featureInput, setFeatureInput] = useState('');

  // When product changes in form, auto-fill prices and image
  const handleProductSelect = (prodId: string) => {
    const selected = products.find(p => p.id === prodId);
    if (!selected) return;

    const origPrice = selected.originalPrice || selected.discountedPrice || 1000;
    const offPrice = selected.discountedPrice || Math.round(origPrice * 0.8);
    const disc = origPrice > 0 ? Math.round(((origPrice - offPrice) / origPrice) * 100) : 0;
    const img = selected.imageUrl || (selected.images && selected.images[0]) || '';

    setFormData(prev => ({
      ...prev,
      productId: prodId,
      title: prev.title || `${selected.title} — বিশেষ ডিসকাউন্ট অফার!`,
      subtitle: prev.subtitle || `${selected.authorOrBrand} এর জনপ্রিয় পণ্য বিশেষ মূল্যে কিনুন`,
      originalPrice: origPrice,
      offerPrice: offPrice,
      discountPercent: disc,
      bannerImageUrl: prev.bannerImageUrl || img
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingPageId(null);
    const firstProd = products[0];
    const origPrice = firstProd ? (firstProd.originalPrice || firstProd.discountedPrice || 1000) : 1000;
    const offPrice = firstProd ? (firstProd.discountedPrice || Math.round(origPrice * 0.8)) : 800;
    const disc = Math.round(((origPrice - offPrice) / origPrice) * 100);

    setFormData({
      id: 'lp-' + Date.now().toString(36),
      slug: (firstProd?.title ? firstProd.title.slice(0, 20).toLowerCase().replace(/[^a-z0-9]/g, '-') : 'special-offer') + '-' + Math.floor(100 + Math.random() * 900),
      productId: firstProd?.id || '',
      title: firstProd ? `${firstProd.title} — বিশেষ ধামাকা অফার!` : 'বিশেষ প্রোডাক্ট ল্যান্ডিং পেজ',
      subtitle: 'আজই অর্ডার করুন এবং জিতে নিন আকর্ষণীয় ছাড় ও ফ্রি ডেলিভারি!',
      badgeText: '🔥 আজকের এক্সক্লুসিভ মেগা ডিল',
      bannerImageUrl: firstProd?.imageUrl || '',
      offerPrice: offPrice,
      originalPrice: origPrice,
      discountPercent: disc,
      deliveryFee: 0,
      deliveryText: 'সারা দেশে হোম ডেলিভারি ফ্রি!',
      features: [
        '১০০% অরিজিনাল ও অথেনটিক পণ্য',
        'ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)',
        '৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি',
        'সুপারফাস্ট হোম ডেলিভারি নিশ্চয়তা'
      ],
      urgencyText: 'সীমিত স্টক! অফারটি শেষ হতে আর অল্প সময় বাকি!',
      countdownHours: 10,
      status: 'active',
      orderCount: 0,
      viewsCount: 0,
      createdAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (page: SingleProductLandingPage) => {
    setEditingPageId(page.id);
    setFormData({ ...page });
    setIsModalOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.productId) {
      alert('অনুগ্রহ করে পণ্যের নাম ও প্রোডাক্ট নির্বাচন করুন!');
      return;
    }

    const calculatedDisc = formData.originalPrice && formData.originalPrice > 0 
      ? Math.round((((formData.originalPrice || 0) - (formData.offerPrice || 0)) / formData.originalPrice) * 100)
      : 0;

    const targetPage: SingleProductLandingPage = {
      id: editingPageId || formData.id || 'lp-' + Date.now().toString(36),
      slug: formData.slug || 'deal-' + Date.now().toString(36),
      productId: formData.productId,
      title: formData.title,
      subtitle: formData.subtitle || '',
      badgeText: formData.badgeText || '🔥 বিশেষ অফার',
      bannerImageUrl: formData.bannerImageUrl || '',
      galleryImages: formData.galleryImages || [],
      videoUrl: formData.videoUrl || '',
      offerPrice: Number(formData.offerPrice) || 0,
      originalPrice: Number(formData.originalPrice) || 0,
      discountPercent: calculatedDisc,
      deliveryFee: Number(formData.deliveryFee) || 0,
      deliveryText: formData.deliveryText || 'ক্যাশ অন ডেলিভারি',
      features: formData.features && formData.features.length > 0 ? formData.features : ['১০০% অরিজিনাল পণ্য'],
      urgencyText: formData.urgencyText || '',
      countdownHours: Number(formData.countdownHours) || 12,
      status: formData.status || 'active',
      orderCount: formData.orderCount || 0,
      viewsCount: formData.viewsCount || 0,
      createdAt: formData.createdAt || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    if (editingPageId) {
      const updated = landingPages.map(p => p.id === editingPageId ? targetPage : p);
      onUpdateLandingPages(updated);
    } else {
      onUpdateLandingPages([targetPage, ...landingPages]);
    }

    setIsModalOpen(false);
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ল্যান্ডিং পেজটি মুছে ফেলতে চান?')) {
      const updated = landingPages.filter(p => p.id !== pageId);
      onUpdateLandingPages(updated);
    }
  };

  const handleToggleStatus = (pageId: string) => {
    const updated = landingPages.map(p => {
      if (p.id === pageId) {
        return { ...p, status: (p.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' };
      }
      return p;
    });
    onUpdateLandingPages(updated);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx)
    }));
  };

  const handleCopyLink = (slug: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/#landing/${slug}` : `#landing/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Filtered
  const filteredPages = landingPages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-sky-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 px-3 py-0.5 rounded-full text-[11px] font-bold border border-sky-400/30">
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span>SINGLE PRODUCT LANDING PAGE BUILDER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            সিঙ্গেল প্রোডাক্ট ল্যান্ডিং পেজ ম্যানেজার
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 max-w-xl">
            যেকোনো একক পণ্যের জন্য আকর্ষণীয় হাই-কনভার্টিং ল্যান্ডিং পেজ তৈরি করুন। এগুলো স্বয়ংক্রিয়ভাবে <strong className="text-amber-300">"আজকের অফার"</strong> পেজে প্রদর্শিত হবে।
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>নতুন ল্যান্ডিং পেজ তৈরি করুন</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">মোট ল্যান্ডিং পেজ</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{landingPages.length} টি</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">সক্রিয় অফার পেজ</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {landingPages.filter(p => p.status === 'active').length} টি
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">মোট প্রাপ্ত অর্ডার</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">
            {landingPages.reduce((acc, p) => acc + (p.orderCount || 0), 0)} টি
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">মোট ভিউ ও ট্রাফিক</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {landingPages.reduce((acc, p) => acc + (p.viewsCount || 0), 0)} বার
          </span>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিরোনাম বা স্লাগ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filteredPages.length} টি ল্যান্ডিং পেজ পাওয়া গেছে
          </span>
        </div>

        {/* Cards Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPages.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              কোনো ল্যান্ডিং পেজ পাওয়া যায়নি। উপরে থাকা "নতুন ল্যান্ডিং পেজ তৈরি করুন" বাটনে ক্লিক করুন।
            </div>
          ) : (
            filteredPages.map((page) => {
              const linkedProduct = products.find(p => p.id === page.productId);
              return (
                <div
                  key={page.id}
                  className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Thumbnail */}
                    <img
                      src={page.bannerImageUrl || linkedProduct?.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                      alt={page.title}
                      className="w-20 h-24 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50 shadow-2xs"
                    />

                    {/* Content Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          page.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {page.status === 'active' ? '● লাইভ (Offers পেজে দৃশ্যমান)' : 'ড্রাফট (বন্ধ)'}
                        </span>
                        {page.discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                            {page.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">
                        {page.title}
                      </h4>

                      <div className="flex items-baseline space-x-2 pt-0.5">
                        <span className="text-base font-black text-emerald-700">
                          ৳ {page.offerPrice}
                        </span>
                        {page.originalPrice > page.offerPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳ {page.originalPrice}
                          </span>
                        )}
                        {page.deliveryFee === 0 && (
                          <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                            ফ্রি ডেলিভারি
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        URL: #{page.slug}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleStatus(page.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          page.status === 'active' 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {page.status === 'active' ? 'বন্ধ করুন' : 'লাইভ করুন'}
                      </button>

                      <button
                        onClick={() => handleCopyLink(page.slug)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                        title="সরাসরি লিংক কপি করুন"
                      >
                        {copiedSlug === page.slug ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSlug === page.slug ? 'কপি হয়েছে' : 'লিংক'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onPreviewLandingPage(page)}
                        className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                        title="ল্যান্ডিং পেজটি প্রিভিউ করুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>প্রিভিউ</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(page)}
                        className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="এডিট করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">
                  {editingPageId ? 'সিঙ্গেল প্রোডাক্ট ল্যান্ডিং পেজ এডিট করুন' : 'নতুন সিঙ্গেল প্রোডাক্ট ল্যান্ডিং পেজ তৈরি করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scrollable Body */}
            <form onSubmit={handleSavePage} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Product Selector */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  টার্গেট প্রোডাক্ট নির্বাচন করুন *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} — ৳ {p.discountedPrice || p.originalPrice} ({p.authorOrBrand || p.category})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  পণ্য সিলেক্ট করলে স্বয়ংক্রিয়ভাবে রেগুলার মূল্য এবং প্রাথমিক তথ্য পূরণ হয়ে যাবে।
                </span>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-800 font-bold mb-1">
                    ক্যাম্পেইন শিরোনাম (Headline) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ভিশন ব্লেন্ডার - ৫০% পর্যন্ত ধামাকা ছাড়!"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    হাইলাইট ব্যাজ টেক্সট
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 🔥 আজকের মেগা ডিল"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  সাবটাইটেল / সংক্ষিপ্ত বিবরণ
                </label>
                <textarea
                  rows={2}
                  placeholder="পণ্যের প্রধান আকর্ষণীয় বৈশিষ্ট্য সংক্ষেপে লিখুন..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              {/* Pricing & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ল্যান্ডিং অফার মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-black text-emerald-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">আগের রেগুলার মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ডেলিভারি চার্জ (৳ ০ = ফ্রি)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm"
                  />
                </div>
              </div>

              {/* Custom Image & URL Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ব্যানার ছবির ইউআরএল (Image URL)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.bannerImageUrl}
                      onChange={(e) => setFormData({ ...formData, bannerImageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-[11px]"
                    />
                    {onOpenImageGallery && (
                      <button
                        type="button"
                        onClick={() => onOpenImageGallery((url) => setFormData({ ...formData, bannerImageUrl: url }))}
                        className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] shrink-0 cursor-pointer"
                      >
                        গ্যালারি
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ইউনিক পেজ স্লাগ (URL Slug) *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-2.5">
                    <span className="text-slate-400 font-mono text-xs">#landing/</span>
                    <input
                      type="text"
                      required
                      placeholder="vision-blender-deal"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      className="flex-1 py-2 bg-transparent focus:outline-none font-mono font-bold text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bullet Features (কেন এই পণ্যটি কিনবেন?) */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-slate-800 font-bold">
                  পণ্যের বিশেষ ফিচারসমূহ (Key Features / Bullet Points):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="যেমন: ১০০০ ওয়াটের শক্তিশালী কপার মোটর..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    + যোগ করুন
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {(formData.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-800 font-medium">✓ {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">কাউন্টডাউন টাইমার (ঘণ্টা)</label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={formData.countdownHours}
                    onChange={(e) => setFormData({ ...formData, countdownHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">ক্যাম্পেইন স্ট্যাটাস</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                  >
                    <option value="active">সক্রিয় (Offers পেজে সরাসরি দৃশ্যমান থাকবে)</option>
                    <option value="inactive">ড্রাফট / নিষ্ক্রিয়</option>
                  </select>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {editingPageId ? 'আপডেট সেভ করুন' : 'ল্যান্ডিং পেজ প্রকাশ করুন'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
