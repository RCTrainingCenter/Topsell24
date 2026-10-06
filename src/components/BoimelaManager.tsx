import React, { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  RefreshCw, 
  Check, 
  Eye, 
  Film, 
  Award, 
  BookOpen, 
  DollarSign, 
  Layers, 
  Users, 
  Building2, 
  Tag, 
  ChevronRight,
  ExternalLink,
  Flame,
  Crown,
  Play
} from 'lucide-react';
import { 
  BoimelaConfig, 
  BoimelaCategoryItem, 
  BoimelaReelItem, 
  BoimelaPriceDealItem, 
  BoimelaLeaderboardItem,
  BoimelaLeaderboardAuthor
} from '../types';
import { DEFAULT_BOIMELA_CONFIG } from '../data/defaultBoimelaConfig';
import { optimizeImageFileAsync } from '../utils/imageOptimizer';

interface BoimelaManagerProps {
  config?: BoimelaConfig;
  onUpdateConfig: (updated: BoimelaConfig) => void;
  onPreviewBoimelaPage?: () => void;
}

export default function BoimelaManager({
  config,
  onUpdateConfig,
  onPreviewBoimelaPage
}: BoimelaManagerProps) {
  const [currentConfig, setCurrentConfig] = useState<BoimelaConfig>(() => config || DEFAULT_BOIMELA_CONFIG);
  const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'reels' | 'deals' | 'leaderboard' | 'authors' | 'toggles'>('hero');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Selected column for leaderboard editing
  const [leaderboardCol, setLeaderboardCol] = useState<'fiction' | 'nonFiction' | 'career' | 'contemporary' | 'authors'>('fiction');

  // Category modal states
  const [editingCategory, setEditingCategory] = useState<BoimelaCategoryItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Reel modal states
  const [editingReel, setEditingReel] = useState<BoimelaReelItem | null>(null);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);

  // Leaderboard book modal states
  const [editingLeaderboardBook, setEditingLeaderboardBook] = useState<BoimelaLeaderboardItem | null>(null);
  const [isLeaderboardBookModalOpen, setIsLeaderboardBookModalOpen] = useState(false);

  // Author modal states
  const [editingAuthorItem, setEditingAuthorItem] = useState<{ id: string; name: string; photo: string } | null>(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  // Save changes handler
  const handleSave = () => {
    onUpdateConfig(currentConfig);
    setIsSaved(true);
    setSaveMessage('বইমেলা ২০২৬ কনফিগারেশন সফলভাবে সেভ করা হয়েছে!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage('');
    }, 3000);
  };

  // Reset to defaults
  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে বইমেলার সকল ডাটা ডিফল্ট সেটিংসে ফিরিয়ে নিতে চান?')) {
      setCurrentConfig(DEFAULT_BOIMELA_CONFIG);
      onUpdateConfig(DEFAULT_BOIMELA_CONFIG);
      setIsSaved(true);
      setSaveMessage('ডিফল্ট কনফিগারেশন রিস্টোর করা হয়েছে!');
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  // Handle Image Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await optimizeImageFileAsync(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
      callback(res.base64);
    } catch (err) {
      console.error('Image upload failed', err);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans pb-10">
      {/* Top Banner & Action Controls */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[11px] font-black uppercase tracking-wider">
              বইমেলা ড্যাশবোর্ড
            </span>
            <span className="text-amber-200 text-xs font-bold">লাইভ কন্ট্রোল প্যানেল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            বইমেলা ২০২৬ পেজ ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-rose-100 mt-0.5">
            বইমেলা পেজের হিরো ব্যানার, বই ক্যাটাগরি, ভিডিও রিলস, বেস্টসেলার লিডারবোর্ড ও অফারসমূহ সহজে পরিবর্তন করুন
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-end md:self-auto">
          {onPreviewBoimelaPage && (
            <button
              onClick={onPreviewBoimelaPage}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border border-white/20"
              title="বইমেলা পেজ দেখুন"
            >
              <Eye className="w-4 h-4" />
              <span>পেজ দেখুন</span>
            </button>
          )}

          <button
            onClick={handleResetToDefault}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center space-x-1 cursor-pointer border border-white/20"
            title="ডিফল্ট সেটিংস রিস্টোর"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রিসেট</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'সংরক্ষিত!' : 'সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center space-x-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs in Boimela Manager */}
      <div className="flex overflow-x-auto gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 scrollbar-none">
        {[
          { id: 'hero', label: 'হিরো ও ট্রাস্ট ব্যানার', icon: BookOpen },
          { id: 'categories', label: 'বইয়ের ক্যাটাগরি', icon: Layers },
          { id: 'reels', label: 'ভিডিও রিলস / স্টোরিজ', icon: Film },
          { id: 'deals', label: 'প্রাইস অফার কার্ড', icon: DollarSign },
          { id: 'leaderboard', label: 'বেস্টসেলার লিডারবোর্ড', icon: Award },
          { id: 'authors', label: 'লেখক ও প্রকাশনী', icon: Users },
          { id: 'toggles', label: 'সেকশন দৃশ্যমানতা', icon: Tag }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-white text-sky-600 shadow-xs font-black' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & TRUST BANNERS */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-xs text-left">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">হিরো ব্যানার ও ট্রাস্ট কার্ড কন্ট্রোল</h3>
            <p className="text-xs text-slate-500">বইমেলা পেজের একদম উপরের বড় ব্যানার ও ৩টি ট্রাস্ট ব্যাজের লেখা পরিবর্তন করুন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ব্যানার টাইটেল (Title)</label>
              <input
                type="text"
                value={currentConfig.hero.bannerTitle}
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev,
                  hero: { ...prev.hero, bannerTitle: e.target.value }
                }))}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">অ্যানাউন্সমেন্ট ব্যাজ (Badge)</label>
              <input
                type="text"
                value={currentConfig.hero.announcementBadge}
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev,
                  hero: { ...prev.hero, announcementBadge: e.target.value }
                }))}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">সাব-টাইটেল (Subtitle / Description)</label>
              <input
                type="text"
                value={currentConfig.hero.bannerSubtitle}
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev,
                  hero: { ...prev.hero, bannerSubtitle: e.target.value }
                }))}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">মেলা স্পেশাল ডিসকাউন্ট টেক্সট</label>
              <input
                type="text"
                value={currentConfig.hero.discountText}
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev,
                  hero: { ...prev.hero, discountText: e.target.value }
                }))}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ব্যানার ব্যাকগ্রাউন্ড ইমেজ URL</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentConfig.hero.bannerImageUrl || ''}
                  onChange={(e) => setCurrentConfig(prev => ({
                    ...prev,
                    hero: { ...prev.hero, bannerImageUrl: e.target.value }
                  }))}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer flex items-center space-x-1 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, (url) => {
                      setCurrentConfig(prev => ({
                        ...prev,
                        hero: { ...prev.hero, bannerImageUrl: url }
                      }));
                    })}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3 Trust Cards Editor */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-black text-slate-900">৩টি ট্রাস্ট কার্ড (Trust Cards)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {currentConfig.hero.trustCards.map((card, idx) => (
                <div key={card.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-sky-600 uppercase">কার্ড #{idx + 1}</span>
                    <input
                      type="text"
                      value={card.iconText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.hero.trustCards];
                          updated[idx] = { ...updated[idx], iconText: val };
                          return { ...prev, hero: { ...prev.hero, trustCards: updated } };
                        });
                      }}
                      className="w-10 text-center font-bold text-xs p-1 bg-white border border-slate-200 rounded"
                      title="আইকন টেক্সট (যেমন ৳, 📖, 🪙)"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">টাইটেল</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.hero.trustCards];
                          updated[idx] = { ...updated[idx], title: val };
                          return { ...prev, hero: { ...prev.hero, trustCards: updated } };
                        });
                      }}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">সাবটাইটেল</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.hero.trustCards];
                          updated[idx] = { ...updated[idx], subtitle: val };
                          return { ...prev, hero: { ...prev.hero, trustCards: updated } };
                        });
                      }}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded text-sky-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ক্লিক অ্যাকশন কুয়েরি</label>
                    <input
                      type="text"
                      value={card.categoryQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.hero.trustCards];
                          updated[idx] = { ...updated[idx], categoryQuery: val };
                          return { ...prev, hero: { ...prev.hero, trustCards: updated } };
                        });
                      }}
                      className="w-full text-xs font-semibold p-1.5 bg-white border border-slate-200 rounded text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">জনপ্রিয় বইয়ের ক্যাটাগরি ({currentConfig.categories.length})</h3>
              <p className="text-xs text-slate-500">বইমেলার ক্যাটাগরি গ্রিডে প্রদর্শিত বইয়ের ধরন ও কাভার ছবি পরিবর্তন করুন</p>
            </div>
            <button
              onClick={() => {
                setEditingCategory({
                  id: `cat-${Date.now()}`,
                  title: '',
                  count: '১,০০০+ বই',
                  imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
                  query: ''
                });
                setIsCategoryModalOpen(true);
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ক্যাটাগরি যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentConfig.categories.map((cat, idx) => (
              <div key={cat.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 group relative hover:border-sky-300 transition-all">
                <img src={cat.imageUrl} alt={cat.title} className="w-12 h-14 object-cover rounded shadow-2xs border border-slate-200 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-black text-slate-900 truncate">{cat.title}</h5>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{cat.count}</span>
                  <span className="text-[9px] text-sky-600 font-bold block truncate">🔍 {cat.query}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1 text-slate-500 hover:text-sky-600 hover:bg-white rounded transition-colors cursor-pointer"
                    title="এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`আপনি কি "${cat.title}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
                        setCurrentConfig(prev => ({
                          ...prev,
                          categories: prev.categories.filter(c => c.id !== cat.id)
                        }));
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO REELS / STORIES */}
      {activeTab === 'reels' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">ভিডিও রিলস ও স্টোরিজ ({currentConfig.reels.length})</h3>
              <p className="text-xs text-slate-500">বইমেলার ভিডিও স্টোরিজ, লেখক ও স্কলারদের বয়ান ও আলোচনা পরিচালনা করুন</p>
            </div>
            <button
              onClick={() => {
                setEditingReel({
                  id: `reel-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  speaker: '',
                  thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=400&q=80',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                });
                setIsReelModalOpen(true);
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন রিল যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentConfig.reels.map((reel) => (
              <div key={reel.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs group flex flex-col justify-between">
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-8 h-8 fill-white text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="p-3 text-left space-y-1">
                  <h5 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">{reel.title}</h5>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{reel.subtitle}</p>
                  <span className="text-[10px] text-sky-600 font-bold block">👤 {reel.speaker}</span>
                </div>
                <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">{reel.videoUrl}</span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => {
                        setEditingReel(reel);
                        setIsReelModalOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-sky-600 rounded cursor-pointer"
                      title="এডিট"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`আপনি কি "${reel.title}" রিলটি মুছে ফেলতে চান?`)) {
                          setCurrentConfig(prev => ({
                            ...prev,
                            reels: prev.reels.filter(r => r.id !== reel.id)
                          }));
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICE DEALS MANAGEMENT */}
      {activeTab === 'deals' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">৪টি আকর্ষণীয় প্রাইস অফার কার্ড</h3>
            <p className="text-xs text-slate-500">বইমেলার প্রাইস টায়ার (৯৯৳, ১৯৯৳, ২৯৯৳ ইত্যাদি) ও ফ্রি ডেলিভারি ব্যানার পরিচালনা করুন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentConfig.priceDeals.map((deal, idx) => (
              <div key={deal.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-600">অফার কার্ড #{idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase bg-${deal.color}-100 text-${deal.color}-800`}>
                    {deal.badge}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">টাইটেল</label>
                    <input
                      type="text"
                      value={deal.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.priceDeals];
                          updated[idx] = { ...updated[idx], title: val };
                          return { ...prev, priceDeals: updated };
                        });
                      }}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ব্যাজ টেক্সট</label>
                    <input
                      type="text"
                      value={deal.badge}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.priceDeals];
                          updated[idx] = { ...updated[idx], badge: val };
                          return { ...prev, priceDeals: updated };
                        });
                      }}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">মূল্যসীমা (সর্বোচ্চ টাকা)</label>
                    <input
                      type="number"
                      value={deal.priceLimit}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentConfig(prev => {
                          const updated = [...prev.priceDeals];
                          updated[idx] = { ...updated[idx], priceLimit: val };
                          return { ...prev, priceDeals: updated };
                        });
                      }}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ক্লিক সার্চ কুয়েরি</label>
                    <input
                      type="text"
                      value={deal.query}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentConfig(prev => {
                          const updated = [...prev.priceDeals];
                          updated[idx] = { ...updated[idx], query: val };
                          return { ...prev, priceDeals: updated };
                        });
                      }}
                      className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: LEADERBOARD & AWARDS */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">বেস্টসেলার অ্যাওয়ার্ড ও লিডারবোর্ড র‍্যাংকিং</h3>
              <p className="text-xs text-slate-500">ফিকশন, নন-ফিকশন, ক্যারিয়ার ও একাডেমিক এবং সেরা লেখক তালিকা ম্যানেজ করুন</p>
            </div>

            <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {[
                { id: 'fiction', label: 'ফিকশন বই' },
                { id: 'nonFiction', label: 'নন-ফিকশন' },
                { id: 'career', label: 'ক্যারিয়ার ও একাডেমিক' },
                { id: 'contemporary', label: 'সমকালীন' },
                { id: 'authors', label: 'সেরা লেখক তালিকা' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setLeaderboardCol(sub.id as any)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    leaderboardCol === sub.id 
                      ? 'bg-white text-sky-600 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          {leaderboardCol !== 'authors' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">
                  তালিকাভুক্ত বইসমূহ ({currentConfig.leaderboard[leaderboardCol]?.length || 0})
                </span>
                <button
                  onClick={() => {
                    const list = currentConfig.leaderboard[leaderboardCol] || [];
                    setEditingLeaderboardBook({
                      id: `${leaderboardCol}-${Date.now()}`,
                      rank: list.length + 1,
                      title: '',
                      author: '',
                      publisher: '',
                      rating: 5.0,
                      reviewsCount: 10,
                      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
                      price: 350,
                      discountPrice: 280,
                      isHot: false
                    });
                    setIsLeaderboardBookModalOpen(true);
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন বই যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-2">
                {currentConfig.leaderboard[leaderboardCol]?.map((book, idx) => (
                  <div key={book.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-6 text-center font-black text-sm text-slate-600 shrink-0">
                        {book.rank === 1 ? <Crown className="w-4 h-4 text-amber-500 inline" /> : `#${book.rank}`}
                      </div>
                      <img src={book.imageUrl} alt={book.title} className="w-10 h-12 object-cover rounded border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h5 className="text-xs font-black text-slate-900 truncate">{book.title}</h5>
                          {book.isHot && <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">HOT</span>}
                        </div>
                        <span className="text-[10.5px] text-slate-500 block">{book.author} | {book.publisher}</span>
                        <span className="text-[10px] text-emerald-600 font-bold block">TK. {book.discountPrice} (মূল: {book.price})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingLeaderboardBook(book);
                          setIsLeaderboardBookModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-sky-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`আপনি কি "${book.title}" বইটি লিডারবোর্ড থেকে সরাতে চান?`)) {
                            setCurrentConfig(prev => ({
                              ...prev,
                              leaderboard: {
                                ...prev.leaderboard,
                                [leaderboardCol]: prev.leaderboard[leaderboardCol].filter(b => b.id !== book.id)
                              }
                            }));
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Top Authors Tab */
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">
                  সেরা লেখক র‍্যাংকিং ({currentConfig.leaderboard.topAuthors.length})
                </span>
                <button
                  onClick={() => {
                    const list = currentConfig.leaderboard.topAuthors;
                    const newAut: BoimelaLeaderboardAuthor = {
                      id: `a-${Date.now()}`,
                      rank: list.length + 1,
                      name: '',
                      booksCount: 20,
                      totalSold: '৫০,০০০+ কপি',
                      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
                      badge: 'জনপ্রিয় লেখক'
                    };
                    setCurrentConfig(prev => ({
                      ...prev,
                      leaderboard: {
                        ...prev.leaderboard,
                        topAuthors: [...prev.leaderboard.topAuthors, newAut]
                      }
                    }));
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন লেখক যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentConfig.leaderboard.topAuthors.map((author, idx) => (
                  <div key={author.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
                    <span className="text-sm font-black text-slate-600 w-5 text-center">#{author.rank}</span>
                    <img src={author.photoUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <input
                        type="text"
                        value={author.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentConfig(prev => {
                            const updated = [...prev.leaderboard.topAuthors];
                            updated[idx] = { ...updated[idx], name: val };
                            return { ...prev, leaderboard: { ...prev.leaderboard, topAuthors: updated } };
                          });
                        }}
                        placeholder="লেখকের নাম"
                        className="w-full text-xs font-black p-1 bg-white border border-slate-200 rounded"
                      />
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={author.totalSold}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentConfig(prev => {
                              const updated = [...prev.leaderboard.topAuthors];
                              updated[idx] = { ...updated[idx], totalSold: val };
                              return { ...prev, leaderboard: { ...prev.leaderboard, topAuthors: updated } };
                            });
                          }}
                          placeholder="মোট বিক্রয় (কপি)"
                          className="w-1/2 text-[10px] p-1 bg-white border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={author.badge}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentConfig(prev => {
                              const updated = [...prev.leaderboard.topAuthors];
                              updated[idx] = { ...updated[idx], badge: val };
                              return { ...prev, leaderboard: { ...prev.leaderboard, topAuthors: updated } };
                            });
                          }}
                          placeholder="ব্যাজ"
                          className="w-1/2 text-[10px] p-1 bg-white border border-slate-200 rounded text-amber-700 font-bold"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentConfig(prev => ({
                          ...prev,
                          leaderboard: {
                            ...prev.leaderboard,
                            topAuthors: prev.leaderboard.topAuthors.filter(a => a.id !== author.id)
                          }
                        }));
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: AUTHORS & PUBLISHERS SHOWCASE */}
      {activeTab === 'authors' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-xs text-left">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">বইমেলা লেখক ও প্রকাশনী শোকেস</h3>
            <p className="text-xs text-slate-500">বইমেলা পেজের মাঝের দুই-কলামের লেখক ও প্রকাশনী প্রোফাইল পরিবর্তন করুন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authors Column */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-800">ফিচার্ড লেখকবৃন্দ ({currentConfig.authors.length})</h4>
                <button
                  onClick={() => {
                    const newName = prompt('লেখকের নাম লিখুন:');
                    if (newName) {
                      setCurrentConfig(prev => ({
                        ...prev,
                        authors: [...prev.authors, {
                          id: `aut-${Date.now()}`,
                          name: newName,
                          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
                        }]
                      }));
                    }
                  }}
                  className="text-xs text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  + লেখক যোগ করুন
                </button>
              </div>

              <div className="space-y-2">
                {currentConfig.authors.map((aut, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={aut.photo} alt={aut.name} className="w-8 h-8 rounded-full object-cover border" />
                      <span className="text-xs font-bold text-slate-800">{aut.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentConfig(prev => ({
                          ...prev,
                          authors: prev.authors.filter((_, i) => i !== idx)
                        }));
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Publishers Column */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-800">ফিচার্ড প্রকাশনীবৃন্দ ({currentConfig.publishers.length})</h4>
                <button
                  onClick={() => {
                    const newPub = prompt('প্রকাশনীর নাম লিখুন:');
                    if (newPub) {
                      setCurrentConfig(prev => ({
                        ...prev,
                        publishers: [...prev.publishers, {
                          id: `pub-${Date.now()}`,
                          name: newPub,
                          logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80'
                        }]
                      }));
                    }
                  }}
                  className="text-xs text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  + প্রকাশনী যোগ করুন
                </button>
              </div>

              <div className="space-y-2">
                {currentConfig.publishers.map((pub, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={pub.logo} alt={pub.name} className="w-8 h-8 rounded-full object-cover border" />
                      <span className="text-xs font-bold text-slate-800">{pub.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentConfig(prev => ({
                          ...prev,
                          publishers: prev.publishers.filter((_, i) => i !== idx)
                        }));
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SECTION DISPLAY TOGGLES */}
      {activeTab === 'toggles' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs text-left">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">সেকশন দৃশ্যমানতা (Section Visibility Toggles)</h3>
            <p className="text-xs text-slate-500">বইমেলা ২০২৬ পেজে কোন কোন সেকশন প্রদর্শন করা হবে তা এক ক্লিকে অন/অফ করুন</p>
          </div>

          <div className="space-y-3 max-w-xl">
            {[
              { key: 'showTrustBanners', label: '১. শীর্ষ ৩টি ট্রাস্ট ব্যানার (Cash on delivery, একটু পড়ে দেখুন, পয়েন্ট)' },
              { key: 'showCategories', label: '২. জনপ্রিয় বইয়ের ক্যাটাগরি গ্রিড' },
              { key: 'showReels', label: '৩. ভিডিও রিলস ও স্টোরিজ স্ট্রিপ' },
              { key: 'showAuthorPublisher', label: '৪. প্রিয় লেখক ও প্রকাশনী সন্ধান প্যানেল' },
              { key: 'showPriceDeals', label: '৫. ৪টি আকর্ষণীয় প্রাইস অফার কার্ড (৯৯৳, ১৯৯৳, ২৯৯৳)' },
              { key: 'showLeaderboard', label: '৬. বইমেলা বেস্টসেলার অ্যাওয়ার্ড ও ৪-কলাম লিডারবোর্ড' }
            ].map((item) => {
              const isChecked = (currentConfig.sectionToggles as any)?.[item.key] !== false;
              return (
                <label key={item.key} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCurrentConfig(prev => ({
                        ...prev,
                        sectionToggles: {
                          ...prev.sectionToggles,
                          [item.key]: checked
                        }
                      }));
                    }}
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* CATEGORY EDIT MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-900">ক্যাটাগরি তথ্য এডিট</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ক্যাটাগরি নাম</label>
                <input
                  type="text"
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">বই সংখ্যা টেক্সট (যেমন ১২,০০০+ বই)</label>
                <input
                  type="text"
                  value={editingCategory.count}
                  onChange={(e) => setEditingCategory({ ...editingCategory, count: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ক্লিক ফিল্টার কুয়েরি (Search Query)</label>
                <input
                  type="text"
                  value={editingCategory.query}
                  onChange={(e) => setEditingCategory({ ...editingCategory, query: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ইমেজ URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingCategory.imageUrl}
                    onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                    className="flex-1 text-xs font-semibold p-2 border border-slate-200 rounded-lg"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold cursor-pointer">
                    ফাইল
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setEditingCategory({ ...editingCategory, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setCurrentConfig(prev => {
                    const exists = prev.categories.some(c => c.id === editingCategory.id);
                    const updated = exists 
                      ? prev.categories.map(c => c.id === editingCategory.id ? editingCategory : c)
                      : [...prev.categories, editingCategory];
                    return { ...prev, categories: updated };
                  });
                  setIsCategoryModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-black text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
              >
                যোগ/আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REEL EDIT MODAL */}
      {isReelModalOpen && editingReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-900">ভিডিও রিল তথ্য এডিট</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ভিডিও টাইটেল</label>
                <input
                  type="text"
                  value={editingReel.title}
                  onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">সাবটাইটেল</label>
                <input
                  type="text"
                  value={editingReel.subtitle}
                  onChange={(e) => setEditingReel({ ...editingReel, subtitle: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">বক্তা / রিভিউয়ার নাম</label>
                <input
                  type="text"
                  value={editingReel.speaker}
                  onChange={(e) => setEditingReel({ ...editingReel, speaker: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ভিডিও URL (YouTube Embed বা MP4)</label>
                <input
                  type="text"
                  value={editingReel.videoUrl}
                  onChange={(e) => setEditingReel({ ...editingReel, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">থাম্বনেইল ইমেজ URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingReel.thumbnail}
                    onChange={(e) => setEditingReel({ ...editingReel, thumbnail: e.target.value })}
                    className="flex-1 text-xs font-semibold p-2 border border-slate-200 rounded-lg"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold cursor-pointer">
                    ফাইল
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setEditingReel({ ...editingReel, thumbnail: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsReelModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  setCurrentConfig(prev => {
                    const exists = prev.reels.some(r => r.id === editingReel.id);
                    const updated = exists 
                      ? prev.reels.map(r => r.id === editingReel.id ? editingReel : r)
                      : [...prev.reels, editingReel];
                    return { ...prev, reels: updated };
                  });
                  setIsReelModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-black text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
              >
                যোগ/আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD BOOK EDIT MODAL */}
      {isLeaderboardBookModalOpen && editingLeaderboardBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-900">লিডারবোর্ড বই তথ্য</h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">র‍্যাংক (Rank)</label>
                  <input
                    type="number"
                    value={editingLeaderboardBook.rank}
                    onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, rank: Number(e.target.value) })}
                    className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">হট ব্যাজ</label>
                  <label className="flex items-center space-x-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLeaderboardBook.isHot || false}
                      onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, isHot: e.target.checked })}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-xs font-bold text-red-600">HOT ব্যাজ দিন</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">বইয়ের নাম (Title)</label>
                <input
                  type="text"
                  value={editingLeaderboardBook.title}
                  onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, title: e.target.value })}
                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">লেখক (Author)</label>
                  <input
                    type="text"
                    value={editingLeaderboardBook.author}
                    onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, author: e.target.value })}
                    className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">প্রকাশনী (Publisher)</label>
                  <input
                    type="text"
                    value={editingLeaderboardBook.publisher || ''}
                    onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, publisher: e.target.value })}
                    className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">মূল মূল্য (Original Price)</label>
                  <input
                    type="number"
                    value={editingLeaderboardBook.price}
                    onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, price: Number(e.target.value) })}
                    className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">মেলা ডিসকাউন্ট মূল্য</label>
                  <input
                    type="number"
                    value={editingLeaderboardBook.discountPrice}
                    onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, discountPrice: Number(e.target.value) })}
                    className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">কাভার ইমেজ URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingLeaderboardBook.imageUrl}
                    onChange={(e) => setEditingLeaderboardBook({ ...editingLeaderboardBook, imageUrl: e.target.value })}
                    className="flex-1 text-xs font-semibold p-2 border border-slate-200 rounded-lg"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold cursor-pointer">
                    ফাইল
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setEditingLeaderboardBook({ ...editingLeaderboardBook, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsLeaderboardBookModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  if (leaderboardCol !== 'authors') {
                    setCurrentConfig(prev => {
                      const list = prev.leaderboard[leaderboardCol] || [];
                      const exists = list.some(b => b.id === editingLeaderboardBook.id);
                      const updated = exists 
                        ? list.map(b => b.id === editingLeaderboardBook.id ? editingLeaderboardBook : b)
                        : [...list, editingLeaderboardBook];
                      return {
                        ...prev,
                        leaderboard: {
                          ...prev.leaderboard,
                          [leaderboardCol]: updated
                        }
                      };
                    });
                  }
                  setIsLeaderboardBookModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-black text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
