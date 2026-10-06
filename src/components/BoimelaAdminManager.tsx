import React, { useState } from 'react';
import { 
  BoimelaConfig, 
  BoimelaCategoryItem, 
  BoimelaReelItem, 
  BoimelaAuthorItem, 
  BoimelaPublisherItem, 
  BoimelaPriceDealItem,
  BoimelaLeaderboardItem,
  BoimelaLeaderboardAuthor 
} from '../types';
import { DEFAULT_BOIMELA_CONFIG } from '../data/defaultBoimelaConfig';
import { 
  BookOpen, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Play, 
  Tag, 
  Users, 
  Building2, 
  Award, 
  Layers, 
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

interface BoimelaAdminManagerProps {
  config?: BoimelaConfig;
  onUpdateConfig: (updated: BoimelaConfig) => void;
  onOpenImageGallery?: (callback: (url: string) => void) => void;
}

export default function BoimelaAdminManager({
  config = DEFAULT_BOIMELA_CONFIG,
  onUpdateConfig,
  onOpenImageGallery
}: BoimelaAdminManagerProps) {
  // Local working copy of config for unsaved modifications
  const [formData, setFormData] = useState<BoimelaConfig>(() => ({
    hero: { ...DEFAULT_BOIMELA_CONFIG.hero, ...(config.hero || {}) },
    categories: config.categories?.length ? config.categories : DEFAULT_BOIMELA_CONFIG.categories,
    reels: config.reels?.length ? config.reels : DEFAULT_BOIMELA_CONFIG.reels,
    authors: config.authors?.length ? config.authors : DEFAULT_BOIMELA_CONFIG.authors,
    publishers: config.publishers?.length ? config.publishers : DEFAULT_BOIMELA_CONFIG.publishers,
    priceDeals: config.priceDeals?.length ? config.priceDeals : DEFAULT_BOIMELA_CONFIG.priceDeals,
    leaderboard: {
      fiction: config.leaderboard?.fiction || DEFAULT_BOIMELA_CONFIG.leaderboard.fiction,
      nonFiction: config.leaderboard?.nonFiction || DEFAULT_BOIMELA_CONFIG.leaderboard.nonFiction,
      career: config.leaderboard?.career || DEFAULT_BOIMELA_CONFIG.leaderboard.career,
      contemporary: config.leaderboard?.contemporary || DEFAULT_BOIMELA_CONFIG.leaderboard.contemporary,
      topAuthors: config.leaderboard?.topAuthors || DEFAULT_BOIMELA_CONFIG.leaderboard.topAuthors
    },
    sectionToggles: { ...DEFAULT_BOIMELA_CONFIG.sectionToggles, ...(config.sectionToggles || {}) }
  }));

  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'categories' | 'reels' | 'authors' | 'deals' | 'leaderboards'>('hero');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // New item inputs
  const [newCat, setNewCat] = useState({ title: '', count: '', query: '', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80' });
  const [newReel, setNewReel] = useState({ title: '', speaker: '', duration: '0:45', views: '১২.৫K', thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' });
  const [newAuthor, setNewAuthor] = useState({ name: '', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' });
  const [newPublisher, setNewPublisher] = useState({ name: '', logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80' });
  const [newDeal, setNewDeal] = useState({ title: '', priceLimit: 150, query: '১৫০ টাকার বই', color: 'emerald' });

  // Save handler
  const handleSave = () => {
    onUpdateConfig(formData);
    setSaveSuccessMessage('✅ বইমেলা ২০২৬ সেটিংস সফলভাবে সেভ ও লাইভ আপডেট হয়েছে!');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Reset to default handler
  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি সত্যিই বইমেলা ২০২৬-এর সমস্ত তথ্য ডিফল্ট সেটিংসে ফিরিয়ে নিতে চান?')) {
      setFormData(DEFAULT_BOIMELA_CONFIG);
      onUpdateConfig(DEFAULT_BOIMELA_CONFIG);
      setSaveSuccessMessage('🔄 বইমেলা সেটিংস ডিফল্টে রিস্টোর করা হয়েছে!');
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-6 font-sans select-none animate-fade-in text-slate-800 pb-12">
      {/* Top Banner & Action Controls */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-rose-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎪</span>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-sans tracking-tight">
              বইমেলা ২০২৬ পূর্ণাঙ্গ কন্ট্রোল প্যানেল (Boimela Manager)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 font-medium max-w-2xl">
            বইমেলা পেজের ব্যানার, শীর্ষ বই ক্যাটাগরি, বুক রিলস, সেরা লেখক-প্রকাশনী, প্রাইস ডিল ও বেস্টসেলার লিডারবোর্ড সরাসরি এখান থেকে নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-200 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 transition-all cursor-pointer flex items-center space-x-1.5"
            title="রিসেট ডিফল্ট"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট ডিফল্ট</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all cursor-pointer flex items-center space-x-2 active:scale-95"
            id="save-boimela-config-btn"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>সেভ করুন</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'hero', label: '🎪 হিরো ব্যানার ও ঘোষণা', icon: Sparkles },
          { id: 'sections', label: '👁️ সেকশন টগল', icon: Layers },
          { id: 'categories', label: '📚 বইয়ের ক্যাটাগরি', icon: BookOpen },
          { id: 'reels', label: '🎬 ভিডিও রিলস', icon: Play },
          { id: 'authors', label: '✍️ লেখক ও প্রকাশনী', icon: Users },
          { id: 'deals', label: '🏷️ বাজেট ডিলস', icon: Tag },
          { id: 'leaderboards', label: '🏆 বেস্টসেলার লিডারবোর্ড', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-black rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & ANNOUNCEMENT SETTINGS */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 font-sans flex items-center space-x-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>হিরো ব্যানার ও মূল ঘোষণা কনফিগারেশন</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">ঘোষণা ব্যাজ (Announcement Badge)</label>
                <input
                  type="text"
                  value={formData.hero.announcementBadge}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, announcementBadge: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-rose-500 focus:outline-none bg-slate-50 focus:bg-white font-medium"
                  placeholder="যেমন: 🎪 অমর একুশে বইমেলা ২০২৬ লাইভ"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">বিশেষ ছাড় হাইলাইট (Discount Text)</label>
                <input
                  type="text"
                  value={formData.hero.discountText}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, discountText: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-rose-500 focus:outline-none bg-slate-50 focus:bg-white font-medium"
                  placeholder="যেমন: ২৫% পর্যন্ত বিশেষ মেলা ছাড়"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">ব্যানার মূল শিরোনাম (Banner Title)</label>
                <input
                  type="text"
                  value={formData.hero.bannerTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, bannerTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-rose-500 focus:outline-none bg-slate-50 focus:bg-white font-bold"
                  placeholder="বইমেলা ২০২৬ স্পেশাল উৎসব ও বই সম্ভার"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">ব্যানার সাবটাইটেল (Banner Subtitle)</label>
                <textarea
                  rows={2}
                  value={formData.hero.bannerSubtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, bannerSubtitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-rose-500 focus:outline-none bg-slate-50 focus:bg-white font-medium"
                  placeholder="অমর একুশে বইমেলার সকল নতুন বই, বেস্টসেলার এবং বিশেষ ছাড়ে কিনুন টপসেলে"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">ব্যানার ব্যাকগ্রাউন্ড ইমেজ URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.hero.bannerImageUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, bannerImageUrl: e.target.value }
                    })}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-rose-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                    placeholder="https://..."
                  />
                  {onOpenImageGallery && (
                    <button
                      type="button"
                      onClick={() => onOpenImageGallery((url) => setFormData({
                        ...formData,
                        hero: { ...formData.hero, bannerImageUrl: url }
                      }))}
                      className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                      <span>গ্যালারি</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Top Trust Cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 font-sans border-b border-slate-100 pb-2">
              🛡️ ৩টি ট্রাস্ট ও সার্ভিস কার্ড (Trust Cards)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {formData.hero.trustCards.map((card, idx) => (
                <div key={card.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-rose-600">কার্ড #{idx + 1}</span>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block">শিরোনাম (Line 1)</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...formData.hero.trustCards];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, hero: { ...formData.hero, trustCards: updated } });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block">উপ-শিরোনাম (Line 2)</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.hero.trustCards];
                        updated[idx].subtitle = e.target.value;
                        setFormData({ ...formData, hero: { ...formData.hero, trustCards: updated } });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block">আইকন টেক্সট</label>
                      <input
                        type="text"
                        value={card.iconText}
                        onChange={(e) => {
                          const updated = [...formData.hero.trustCards];
                          updated[idx].iconText = e.target.value;
                          setFormData({ ...formData, hero: { ...formData.hero, trustCards: updated } });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block">সার্চ কোয়েরি</label>
                      <input
                        type="text"
                        value={card.categoryQuery}
                        onChange={(e) => {
                          const updated = [...formData.hero.trustCards];
                          updated[idx].categoryQuery = e.target.value;
                          setFormData({ ...formData, hero: { ...formData.hero, trustCards: updated } });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTION TOGGLES */}
      {activeTab === 'sections' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-800 font-sans border-b border-slate-100 pb-2">
            👁️ বইমেলা পেজের সেকশন সমূহের ভিজিবিলিটি (অন / অফ)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'showTrustBanners', title: 'ট্রাস্ট ও সার্ভিস কার্ডস', desc: 'ক্যাশ অন ডেলিভারি, পড়ে দেখুন ইত্যাদি' },
              { key: 'showCategories', title: 'জনপ্রিয় বইয়ের ক্যাটাগরি', desc: 'উপন্যাস, অনুবাদ, ইসলামিক বই ইত্যাদি গ্রিড' },
              { key: 'showReels', title: 'ভিডিও রিলস ও ট্রেইলার', desc: 'বইয়ের ভিডিও রিভিউ ও ট্রেইলার' },
              { key: 'showAuthorPublisher', title: 'লেখক ও প্রকাশনী স্পটলাইট', desc: 'সেরা লেখক ও প্রকাশনী অন্বেষণ' },
              { key: 'showPriceDeals', title: 'বাজেট ও প্রাইস ডিলস', desc: '৳৯৯, ৳১৯৯, ৳২৯৯ এর নিচে বই' },
              { key: 'showLeaderboard', title: 'বেস্টসেলার র‍্যাঙ্কিং লিডারবোর্ড', desc: 'কথাসাহিত্য, ক্যারিয়ার ও টপ লেখক লিডারবোর্ড' },
            ].map((sec) => {
              const isEnabled = (formData.sectionToggles as any)[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  onClick={() => setFormData({
                    ...formData,
                    sectionToggles: {
                      ...formData.sectionToggles,
                      [sec.key]: !isEnabled
                    }
                  })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isEnabled
                      ? 'bg-rose-50/50 border-rose-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-black text-slate-900 block">{sec.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium block">{sec.desc}</span>
                  </div>

                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isEnabled ? 'bg-rose-600' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BOOK CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          {/* Add Category Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-800 font-sans flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>নতুন বই ক্যাটাগরি যুক্ত করুন</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <input
                type="text"
                placeholder="ক্যাটাগরি শিরোনাম (যেমন: সায়েন্স ফিকশন)"
                value={newCat.title}
                onChange={(e) => setNewCat({ ...newCat, title: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              />
              <input
                type="text"
                placeholder="বইয়ের সংখ্যা (যেমন: ৩,২০০+ বই)"
                value={newCat.count}
                onChange={(e) => setNewCat({ ...newCat, count: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              />
              <input
                type="text"
                placeholder="সার্চ কোয়েরি (যেমন: সাই-ফাই)"
                value={newCat.query}
                onChange={(e) => setNewCat({ ...newCat, query: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              />
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  placeholder="ইমেজ URL"
                  value={newCat.imageUrl}
                  onChange={(e) => setNewCat({ ...newCat, imageUrl: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white font-mono text-[10px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newCat.title.trim()) return alert('দয়া করে ক্যাটাগরির শিরোনাম লিখুন');
                    const added: BoimelaCategoryItem = {
                      id: `cat-${Date.now()}`,
                      title: newCat.title,
                      count: newCat.count || '১,০০০+ বই',
                      query: newCat.query || newCat.title,
                      imageUrl: newCat.imageUrl
                    };
                    setFormData({ ...formData, categories: [added, ...formData.categories] });
                    setNewCat({ title: '', count: '', query: '', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80' });
                  }}
                  className="px-3 py-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  যোগ করুন
                </button>
              </div>
            </div>
          </div>

          {/* Existing Categories Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-800">
              বর্তমান ক্যাটাগরি তালিকা ({formData.categories.length}টি)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {formData.categories.map((cat, idx) => (
                <div key={cat.id || idx} className="p-2.5 border border-slate-200 rounded-lg flex items-center justify-between gap-2 hover:border-slate-300 bg-slate-50/50">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img src={cat.imageUrl} alt={cat.title} className="w-10 h-12 object-cover rounded shrink-0 border border-slate-200" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{cat.title}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block">{cat.count}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.categories.filter((_, i) => i !== idx);
                      setFormData({ ...formData, categories: filtered });
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REELS & VIDEO TRAILERS */}
      {activeTab === 'reels' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-800 font-sans flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>নতুন ভিডিও রিল যুক্ত করুন</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <input
                type="text"
                placeholder="রিল শিরোনাম"
                value={newReel.title}
                onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              />
              <input
                type="text"
                placeholder="বক্তা / রিভিউয়ার"
                value={newReel.speaker}
                onChange={(e) => setNewReel({ ...newReel, speaker: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
              />
              <input
                type="text"
                placeholder="ভিডিও URL / Embed"
                value={newReel.videoUrl}
                onChange={(e) => setNewReel({ ...newReel, videoUrl: e.target.value })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white font-mono text-[10px]"
              />
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  placeholder="থাম্বনেইল ইমেজ URL"
                  value={newReel.thumbnail}
                  onChange={(e) => setNewReel({ ...newReel, thumbnail: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white font-mono text-[10px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newReel.title.trim()) return alert('রিল শিরোনাম লিখুন');
                    const added: BoimelaReelItem = {
                      id: `reel-${Date.now()}`,
                      title: newReel.title,
                      speaker: newReel.speaker || 'বইপ্রেমী',
                      duration: newReel.duration,
                      views: newReel.views,
                      thumbnail: newReel.thumbnail,
                      videoUrl: newReel.videoUrl
                    };
                    setFormData({ ...formData, reels: [added, ...formData.reels] });
                    setNewReel({ title: '', speaker: '', duration: '0:45', views: '১২.৫K', thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' });
                  }}
                  className="px-3 py-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  যুক্ত করুন
                </button>
              </div>
            </div>
          </div>

          {/* Existing Reels */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-800">
              বর্তমান বুক রিলস ({formData.reels.length}টি)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {formData.reels.map((reel, idx) => (
                <div key={reel.id || idx} className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
                  <img src={reel.thumbnail} alt={reel.title} className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2 flex flex-col justify-between text-white">
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = formData.reels.filter((_, i) => i !== idx);
                        setFormData({ ...formData, reels: filtered });
                      }}
                      className="self-end p-1 rounded-full bg-black/60 hover:bg-rose-600 transition-colors text-white"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div>
                      <p className="text-[10px] font-bold leading-tight line-clamp-2">{reel.title}</p>
                      <span className="text-[9px] text-amber-300 block truncate">{reel.speaker}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUTHORS & PUBLISHERS */}
      {activeTab === 'authors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Top Authors */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span>✍️ শীর্ষ লেখকবৃন্দ ({formData.authors.length} জন)</span>
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="লেখকের নাম"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="ছবি URL"
                value={newAuthor.photo}
                onChange={(e) => setNewAuthor({ ...newAuthor, photo: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-[10px]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newAuthor.name.trim()) return;
                  const added: BoimelaAuthorItem = { id: `aut-${Date.now()}`, name: newAuthor.name, photo: newAuthor.photo };
                  setFormData({ ...formData, authors: [...formData.authors, added] });
                  setNewAuthor({ name: '', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' });
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                যোগ
              </button>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {formData.authors.map((auth, idx) => (
                <div key={auth.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <img src={auth.photo} alt={auth.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-800">{auth.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.authors.filter((_, i) => i !== idx);
                      setFormData({ ...formData, authors: filtered });
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Publishers */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span>🏢 শীর্ষ প্রকাশনী ({formData.publishers.length}টি)</span>
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="প্রকাশনীর নাম"
                value={newPublisher.name}
                onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="লোগো URL"
                value={newPublisher.logo}
                onChange={(e) => setNewPublisher({ ...newPublisher, logo: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-[10px]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newPublisher.name.trim()) return;
                  const added: BoimelaPublisherItem = { id: `pub-${Date.now()}`, name: newPublisher.name, logo: newPublisher.logo };
                  setFormData({ ...formData, publishers: [...formData.publishers, added] });
                  setNewPublisher({ name: '', logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80' });
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                যোগ
              </button>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {formData.publishers.map((pub, idx) => (
                <div key={pub.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <img src={pub.logo} alt={pub.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    <span className="text-xs font-bold text-slate-800">{pub.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.publishers.filter((_, i) => i !== idx);
                      setFormData({ ...formData, publishers: filtered });
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BUDGET PRICE DEALS */}
      {activeTab === 'deals' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-800 font-sans border-b border-slate-100 pb-2">
            🏷️ ৪টি বাজেট প্রাইস টায়ার কার্ড (Price Deals)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {formData.priceDeals.map((deal, idx) => (
              <div key={deal.id || idx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <span className="text-[10px] font-black text-rose-600 uppercase">ডিল #{idx + 1}</span>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block">শিরোনাম</label>
                  <input
                    type="text"
                    value={deal.title}
                    onChange={(e) => {
                      const updated = [...formData.priceDeals];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, priceDeals: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block">সর্বোচ্চ মূল্য (Limit ৳)</label>
                  <input
                    type="number"
                    value={deal.priceLimit}
                    onChange={(e) => {
                      const updated = [...formData.priceDeals];
                      updated[idx].priceLimit = Number(e.target.value);
                      setFormData({ ...formData, priceDeals: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block">সার্চ কোয়েরি</label>
                  <input
                    type="text"
                    value={deal.query}
                    onChange={(e) => {
                      const updated = [...formData.priceDeals];
                      updated[idx].query = e.target.value;
                      setFormData({ ...formData, priceDeals: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: BESTSELLER LEADERBOARDS */}
      {activeTab === 'leaderboards' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 font-sans border-b border-slate-100 pb-2">
              🏆 বইমেলা সেরা লেখক র‍্যাঙ্কিং (Top Authors Leaderboard)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {formData.leaderboard.topAuthors.map((author, idx) => (
                <div key={author.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <img src={author.photoUrl} alt={author.name} className="w-8 h-8 rounded-full object-cover" />
                    <input
                      type="text"
                      value={author.name}
                      onChange={(e) => {
                        const updated = [...formData.leaderboard.topAuthors];
                        updated[idx].name = e.target.value;
                        setFormData({
                          ...formData,
                          leaderboard: { ...formData.leaderboard, topAuthors: updated }
                        });
                      }}
                      className="text-xs font-bold border-b border-slate-300 bg-transparent flex-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block">মোট বিক্রয়</label>
                    <input
                      type="text"
                      value={author.totalSold}
                      onChange={(e) => {
                        const updated = [...formData.leaderboard.topAuthors];
                        updated[idx].totalSold = e.target.value;
                        setFormData({
                          ...formData,
                          leaderboard: { ...formData.leaderboard, topAuthors: updated }
                        });
                      }}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block">ব্যাজ (Badge)</label>
                    <input
                      type="text"
                      value={author.badge}
                      onChange={(e) => {
                        const updated = [...formData.leaderboard.topAuthors];
                        updated[idx].badge = e.target.value;
                        setFormData({
                          ...formData,
                          leaderboard: { ...formData.leaderboard, topAuthors: updated }
                        });
                      }}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded text-amber-700 font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
