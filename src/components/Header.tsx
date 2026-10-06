import { useState, useEffect } from 'react';
import { 
  Phone, Search, ShoppingCart, User, Smartphone, Sparkles, MapPin, Truck, HeartHandshake, Coins,
  ChevronDown, ClipboardList, Star, ThumbsUp, Users, Heart, LayoutGrid, Library, Send, Wallet, LogOut, Languages,
  Mic, X, Menu, BookOpen, Laptop, ShoppingBag, Baby, Building2, Award, Flame, Calendar, Layers, ChevronRight, Tag
} from 'lucide-react';
import { ProductType, Product } from '../types';
import { getProductImageUrl } from '../lib/bookUtils';
import { translations } from '../translations';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenTracker: () => void;
  onSearch: (query: string) => void;
  logoTitle?: string;
  logoImageUrl?: string;
  hotline?: string;
  operatingHours?: string;
  tabsConfig?: any[];
  loggedInUser?: { name: string; emailOrPhone: string; isAdmin: boolean; photoURL?: string } | null;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
  onOpenUserDashboard?: () => void;
  filteredProducts?: Product[];
  onSelectProduct?: (p: Product) => void;
  language?: 'en' | 'bn';
  onToggleLanguage?: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
}

export default function Header({
  activeTab,
  onTabChange,
  cartCount,
  onOpenCart,
  onOpenLogin,
  onOpenTracker,
  onSearch,
  logoTitle,
  logoImageUrl,
  hotline = '16297',
  operatingHours = '9 AM to 8 PM',
  tabsConfig,
  loggedInUser,
  onLogout,
  onOpenAdmin,
  onOpenUserDashboard,
  filteredProducts = [],
  onSelectProduct,
  language = 'bn',
  onToggleLanguage,
  wishlistCount = 0,
  onOpenWishlist,
}: HeaderProps) {
  const t = translations[language];
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localQuery, setLocalQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'bn-BD' | 'en-US'>(language === 'bn' ? 'bn-BD' : 'en-US');
  const [listeningStatus, setListeningStatus] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Functional Category Scope Selector in Search Bar (General / Books / Electronics etc.)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryDropdownOpen, setIsMobileCategoryDropdownOpen] = useState(false);
  const [selectedCategoryScope, setSelectedCategoryScope] = useState<string>('all');

  const getScopeLabel = () => {
    switch (selectedCategoryScope) {
      case 'books':
        return 'Books';
      case 'electronics':
        return 'Electronics';
      case 'superstore':
        return 'Superstore';
      case 'fashion':
        return 'Fashion';
      case 'kids':
        return 'Kids';
      case 'ebook':
        return 'eBooks';
      default:
        return activeTab === 'books' ? 'Books' :
               activeTab === 'electronics' ? 'Electronics' :
               activeTab === 'superstore' ? 'Superstore' :
               activeTab === 'fashion' ? 'Fashion' :
               activeTab === 'kids' ? 'Kids' : 'General';
    }
  };

  const handleSubcategoryClick = (sub: string) => {
    const subClean = sub.replace(' TEXT', '').trim();
    if (subClean === 'লেখক') {
      const el = document.getElementById('popular-authors-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const autBtn = document.getElementById('tab-btn-authors');
        if (autBtn) autBtn.click();
      } else {
        onTabChange('books');
      }
      return;
    }
    if (subClean === 'প্রকাশক' || subClean === 'প্রকাশনী') {
      const el = document.getElementById('popular-authors-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const pubBtn = document.getElementById('tab-btn-publishers');
        if (pubBtn) pubBtn.click();
      } else {
        onTabChange('books');
      }
      return;
    }
    if (subClean.includes('বইমেলা')) {
      onTabChange('boimela');
      return;
    }
    if (subClean === 'কার্ট অফার') {
      onOpenCart();
      return;
    }
    if (subClean === 'অতিরিক্ত ছাড়ে বই') {
      onTabChange('offers');
      return;
    }
    if (subClean === 'বিষয়') {
      onTabChange('books');
      return;
    }
    if (subClean === 'ইসলামী বই' || subClean === 'ইসলামি বই') {
      onTabChange('books');
      onSearch('ইসলামি');
      return;
    }
    if (subClean === 'একাডেমিক বই') {
      onTabChange('books');
      onSearch('একাডেমিক');
      return;
    }
    if (subClean === 'ইংরেজি বই' || subClean === 'ইংরেজি ভাষার বই') {
      onTabChange('books');
      onSearch('English');
      return;
    }
    if (subClean === 'ইংরেজি মাধ্যম বই') {
      onTabChange('books');
      onSearch('English Medium');
      return;
    }
    if (subClean === 'এইচএসসি পড়াশোনা' || subClean === 'ভর্তি প্রস্তুতি') {
      onTabChange('books');
      onSearch('এইচএসসি');
      return;
    }
    // Fallback for electronics, superstore, kids subcategories
    onSearch(subClean);
  };

  // Dynamic animated typewriter placeholder for the search bar
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');

  useEffect(() => {
    let phrases: string[] = [];

    if (language === 'bn') {
      switch (activeTab) {
        case 'books':
          phrases = [
            'বই, লেখক বা প্রকাশনীর নাম দিয়ে খুঁজুন...',
            'হুমায়ূন আহমেদ সমগ্র...',
            'ইসলামী বই ও সাহিত্য সমগ্র...',
            'এইচএসসি ও এডমিশন গাইড...',
            'বেস্টসেলার উপন্যাস ও গল্প...',
            'রবীন্দ্রনাথ ও নজরুল রচনাবলী...'
          ];
          break;
        case 'electronics':
          phrases = [
            'চার্জার ফ্যান, পাওয়ার ব্যাংক ও গ্যাজেট খুঁজুন...',
            'স্মার্ট ওয়াচ, ইয়ারবাডস ও স্পিকার...',
            'কম্পিউটার ও মোবাইল এক্সেসরিজ...',
            'ক্যাম্পিং ফ্যান ও পোর্টেবল ফ্যান...'
          ];
          break;
        case 'superstore':
          phrases = [
            'স্টেশনারি, অর্গানিক ফুড ও কসমেটিকস খুঁজুন...',
            'ডায়েরি, খাতা, কলম ও ক্যালকুলেটর...',
            'ইসলামিক এক্সেসরিজ ও গিফট ভাউচার...',
            'গ্রোসারি ও হেলথ কেয়ার প্রোডাক্ট...'
          ];
          break;
        case 'fashion':
          phrases = [
            'পোলো শার্ট, জিন্স প্যান্ট, পাঞ্জাবি ও জুতা খুঁজুন...',
            'এক্সপোর্ট কোয়ালিটি পোলো শার্ট ও টি-শার্ট...',
            'স্নিকার্স, লোফার ও ফরমাল জুতা...',
            'সালোয়ার কামিজ, থ্রি-পিস ও শাড়ি...'
          ];
          break;
        case 'kids':
          phrases = [
            'শিশুদের খেলনা ও বেবি কেয়ার খুঁজুন...',
            'ফিডার, ডায়াপার ও বেবি লোশন...',
            'স্কুল স্টেশনারি ও ড্রয়িং সামগ্রী...',
            'শিক্ষণীয় ও বুদ্ধির বিকাশমূলক খেলনা...'
          ];
          break;
        default:
          phrases = [
            'বই, লেখক বা পছন্দের পণ্য সার্চ করুন...',
            'হুমায়ূন আহমেদ বই সমগ্র...',
            'চার্জার ফ্যান ও মিনি পাওয়ার ব্যাংক...',
            'এইচএসসি ও ভার্সিটি এডমিশন বই...',
            'স্মার্ট গ্যাজেট ও ইলেকট্রনিক্স...',
            'সুপারস্টোর ও স্টেশনারি আইটেম...'
          ];
          break;
      }
    } else {
      switch (activeTab) {
        case 'books':
          phrases = [
            'Search by book title, author, or publisher...',
            'Search Humayun Ahmed books...',
            'Search Islamic & Academic books...',
            'Search Fiction, Thriller, Poetry...'
          ];
          break;
        case 'electronics':
          phrases = [
            'Search Charger Fan, Power Bank...',
            'Search Smartwatch, Earbuds, Gadgets...',
            'Search Computer & Mobile accessories...'
          ];
          break;
        case 'superstore':
          phrases = [
            'Search Stationery, Organic food...',
            'Search Diaries, Notebooks, Beauty items...'
          ];
          break;
        case 'fashion':
          phrases = [
            'Search Polo Shirt, Jeans, Panjabi, Shoes...',
            'Search Sneakers, Loafers, Women Fashion...'
          ];
          break;
        case 'kids':
          phrases = [
            'Search Kids Toys, Baby Care...',
            'Search School Stationery, Baby Feeding...'
          ];
          break;
        default:
          phrases = [
            'Search by books, authors, or products...',
            'Search Humayun Ahmed Books...',
            'Search Charger Fan, Power Bank, Gadgets...',
            'Search Academic & Admission Books...',
            'Search Superstore & Lifestyle items...'
          ];
          break;
      }
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: any = null;

    const tick = () => {
      const currentPhrase = phrases[phraseIndex % phrases.length];

      if (!isDeleting) {
        charIndex++;
        setAnimatedPlaceholder(currentPhrase.substring(0, charIndex));

        if (charIndex >= currentPhrase.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, 2200);
          return;
        } else {
          timeoutId = setTimeout(tick, 55);
          return;
        }
      } else {
        charIndex--;
        setAnimatedPlaceholder(currentPhrase.substring(0, charIndex));

        if (charIndex <= 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeoutId = setTimeout(tick, 400);
          return;
        } else {
          timeoutId = setTimeout(tick, 28);
          return;
        }
      }
    };

    timeoutId = setTimeout(tick, 300);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeTab, language]);

  // Synchronize speech language with main app language if not manually changed
  useEffect(() => {
    setSpeechLanguage(language === 'bn' ? 'bn-BD' : 'en-US');
  }, [language]);

  // Handle custom show-mobile-search event and scroll listeners
  useEffect(() => {
    const handleShowSearch = () => {
      setIsMobileSearchVisible(true);
    };

    window.addEventListener('show-mobile-search', handleShowSearch);

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.innerWidth >= 768) return; // Only trigger on mobile sizes

      const currentScrollY = window.scrollY;

      // If voice search is active, do not hide the search bar
      if (isListening) {
        setIsMobileSearchVisible(true);
        return;
      }

      // If the mobile search input is focused, do not hide it
      const activeEl = document.activeElement;
      if (activeEl && activeEl.id === 'mobile-search-input') {
        setIsMobileSearchVisible(true);
        return;
      }

      // If we are currently ignoring scroll events (e.g. during Quick Search transition)
      if ((window as any).__ignoreSearchScroll) {
        setIsMobileSearchVisible(true);
        return;
      }

      // Force show search bar if scrolled close to top
      if (currentScrollY <= 100) {
        setIsMobileSearchVisible(true);
      } else if (Math.abs(currentScrollY - lastScrollY) > 8) {
        // If scrolling down, hide it; if scrolling up, show it
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
          setIsMobileSearchVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsMobileSearchVisible(true);
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('show-mobile-search', handleShowSearch);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isListening]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {}
      }
    };
  }, [recognitionInstance]);

  const startVoiceSearch = (preferredLang?: 'bn-BD' | 'en-US') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToastMessage(language === 'bn' ? 'আপনার ব্রাউজার ভয়েস সার্চ সমর্থন করে না।' : 'Your browser does not support voice search.');
      return;
    }

    const activeLang = preferredLang || speechLanguage;

    // Stop existing if running
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = activeLang;

    recognition.onstart = () => {
      setIsListening(true);
      setListeningStatus(
        activeLang === 'bn-BD' 
          ? 'বাংলায় বলুন...' 
          : 'Listening in English...'
      );
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
      if (event.error === 'no-speech') {
        setToastMessage(language === 'bn' ? 'কোন শব্দ শোনা যায়নি। আবার চেষ্টা করুন।' : 'No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setToastMessage(language === 'bn' ? 'মাইক্রোফোন ব্যবহারের অনুমতি নেই।' : 'Microphone access denied.');
      } else {
        setToastMessage(language === 'bn' ? 'ভয়েস সার্চে সমস্যা হয়েছে।' : 'Error occurred in voice search.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim() !== '') {
        handleInputChange(transcript);
        setToastMessage(
          language === 'bn' 
            ? `খোঁজা হচ্ছে: "${transcript}"` 
            : `Searching for: "${transcript}"`
        );
      }
    };

    try {
      recognition.start();
      setRecognitionInstance(recognition);
    } catch (err) {
      console.error('Error starting recognition:', err);
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Reset local query when active tab changes
  useEffect(() => {
    setLocalQuery('');
    setShowDropdown(false);
  }, [activeTab]);

  const handleInputChange = (val: string) => {
    setLocalQuery(val);
    onSearch(val);
    setShowDropdown(true);
  };

  const handleCategoryClick = (cat: string) => {
    setLocalQuery(cat);
    onSearch(cat);
    setShowDropdown(false);
  };

  const handleProductClick = (prod: Product) => {
    setLocalQuery(prod.title);
    onSearch(prod.title);
    if (onSelectProduct) {
      onSelectProduct(prod);
    }
    setShowDropdown(false);
  };

  // Extract unique categories and subcategories from products matching local query
  const queryLower = localQuery.toLowerCase().trim();
  
  // To avoid circular or weird empty suggestions, only suggest when there's an actual typed input
  const matches = queryLower
    ? filteredProducts.filter(p => 
        p.title.toLowerCase().includes(queryLower) ||
        p.authorOrBrand.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        (p.childCategory && p.childCategory.toLowerCase().includes(queryLower))
      )
    : [];

  const categorySuggestions = queryLower
    ? Array.from(
        new Set(
          matches
            .flatMap(p => [p.category, p.childCategory])
            .filter((cat): cat is string => !!cat && cat.toLowerCase().includes(queryLower))
        )
      ).slice(0, 3)
    : [];

  const productSuggestions = queryLower ? matches.slice(0, 5) : [];

  const renderAutocompleteDropdown = (isMobile: boolean) => {
    if (!showDropdown || localQuery.trim() === '') return null;
    if (categorySuggestions.length === 0 && productSuggestions.length === 0) return null;

    return (
      <div className={`absolute left-0 right-0 mt-2 bg-white/98 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-up max-h-[340px] overflow-y-auto ${isMobile ? 'top-full' : 'top-full'}`}>
        {/* Category Suggestions */}
        {categorySuggestions.length > 0 && (
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">{t.categorySuggestion}</div>
            <div className="space-y-0.5">
              {categorySuggestions.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors flex items-center space-x-2 font-bold cursor-pointer"
                >
                  <span className="text-amber-500 text-xs">🏷️</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Suggestions */}
        {productSuggestions.length > 0 && (
          <div className="p-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">{t.productSuggestion}</div>
            <div className="space-y-1">
              {productSuggestions.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleProductClick(prod)}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded-md transition-colors flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-md overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-500 shadow-3xs">
                    {prod.imageUrl ? (
                      <img src={getProductImageUrl(prod)} alt={prod.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-600 transition-colors">
                      {prod.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">{prod.authorOrBrand}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-rose-600 block">৳{prod.discountedPrice}</span>
                    {prod.originalPrice > prod.discountedPrice && (
                      <span className="text-[9px] text-slate-400 line-through">৳{prod.originalPrice}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };
  
  const getLogoSegments = (title: string = 'টপসেল') => {
    if (title === 'টপসেল') {
      return [
        { text: 'ট', color: 'text-neutral-800' },
        { text: 'প', color: 'text-amber-500' },
        { text: 'সে', color: 'text-blue-600' },
        { text: 'ল', color: 'text-rose-500' },
      ];
    }
    if (title === 'রকমারি') {
      return [
        { text: 'র', color: 'text-neutral-800' },
        { text: 'ক', color: 'text-amber-500' },
        { text: 'মা', color: 'text-blue-600' },
        { text: 'রি', color: 'text-rose-500' },
      ];
    }
    const colors = ['text-neutral-800', 'text-amber-500', 'text-blue-600', 'text-rose-500'];
    return Array.from(title).map((char, index) => ({
      text: char,
      color: colors[index % colors.length]
    }));
  };

  const handleLogoClick = () => {
    onTabChange('home');
  };

  const getTabLabel = (id: string, defaultLabel: string) => {
    switch (id) {
      case 'books': return t.booksTab;
      case 'electronics': return t.electronicsTab;
      case 'superstore': return t.superstoreTab;
      case 'fashion': return t.fashionTab;
      case 'kids': return t.kidsTab;
      case 'corporate': return t.corporateTab;
      case 'awards': return t.awardsTab;
      case 'offers': return t.offersTab;
      case 'boimela': return t.boimelaTab;
      default: return defaultLabel;
    }
  };

  const tabs = (() => {
    if (!tabsConfig) {
      return [
        { id: 'books', label: 'বই' },
        { id: 'electronics', label: 'ইলেক্ট্রনিক্স' },
        { id: 'superstore', label: 'সুপার স্টোর' },
        { id: 'fashion', label: 'ফ্যাশন' },
        { id: 'kids', label: 'কিডস জোন' },
        { id: 'corporate', label: 'প্রাতিষ্ঠানিক অর্ডার' },
        { id: 'awards', label: 'বেস্টসেলার অ্যাওয়ার্ড' },
        { id: 'offers', label: 'আজকের অফার!' },
        { id: 'boimela', label: 'বইমেলা ২০২৬' },
      ];
    }
    const list = [...tabsConfig];
    if (!list.some((t: any) => t.id === 'fashion')) {
      const superIdx = list.findIndex((t: any) => t.id === 'superstore');
      const fashionTabObj = { id: 'fashion', label: 'ফ্যাশন', isVisible: true };
      if (superIdx !== -1) {
        list.splice(superIdx + 1, 0, fashionTabObj);
      } else {
        list.push(fashionTabObj);
      }
    }
    return list.filter((t: any) => t.isVisible);
  })();

  const getSubcategories = () => {
    switch (activeTab) {
      case 'home':
        return ['লেখক', 'বিষয়', 'ইসলামী বই', 'বইমেলা ২০২৬', 'একাডেমিক বই', 'অতিরিক্ত ছাড়ে বই', 'প্রকাশক TEXT', 'কার্ট অফার', 'ইংরেজি বই', 'ইংরেজি মাধ্যম বই', 'এইচএসসি পড়াশোনা'];
      case 'books':
        return ['লেখক', 'বিষয়', 'প্রকাশনী', 'বইমেলা ২০২৬', 'একাডেমিক বই', 'অতিরিক্ত ছাড়ে বই', 'প্যারালাল TEXT', 'ভর্তি প্রস্তুতি', 'ইসলামি বই', 'ইংরেজি ভাষার বই', 'পশ্চিমবঙ্গের বই'];
      case 'electronics':
        return ['Computer & Accessories', 'Mobile & Accessories', 'Smart Watch', 'Office Equipment', 'Gaming Zone', 'Networking', 'Sound System', 'Grooming & Lifestyle', 'Appliances', 'Science Kit'];
      case 'superstore':
        return ['Weekly Bestseller', 'Islamic Accessories', 'Stationery', 'Organic Food', 'Beauty & Personal Care', 'Voucher', 'Diary/Notebook', 'Calculator', 'Groceries', 'Fan & Ventilator', 'Drawing & Art Supplies'];
      case 'fashion':
        return ['শার্ট ও পোলো', 'প্যান্ট ও জিন্স', 'জুতা ও স্নিকার্স', 'পাঞ্জাবি', 'মেয়েদের ফ্যাশন', 'ঘড়ি ও বেল্ট'];
      case 'kids':
        return ['Diaper & Potty', 'Feeding', 'Kids Toys', 'Lotions & Creams', 'Teethers & Pacifier', 'Grooming', 'Oral & Health', 'Body Wash', 'Mum Pot & Cups', 'Bathing'];
      default:
        return [];
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'books':
        return t.searchPlaceholderBooks;
      case 'electronics':
        return t.searchPlaceholderElectronics;
      case 'superstore':
        return t.searchPlaceholderSuperstore;
      case 'fashion':
        return language === 'bn' ? 'ফ্যাশন আইটেম খুঁজুন (পোলো শার্ট, প্যান্ট, জুতা, পাঞ্জাবি...)' : 'Search fashion (Polo Shirt, Jeans, Shoes, Panjabi...)';
      case 'kids':
        return t.searchPlaceholderKids;
      default:
        return t.searchPlaceholderGeneral;
    }
  };

  return (
    <>
      {/* 1. Top Hotline Banner Strip - Hidden on Mobile, scrolls away naturally */}
      <div className="hidden md:block bg-slate-50 border-b border-gray-150 py-2 px-4 md:px-8 text-slate-600 text-xs sm:text-[13px] font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center space-x-2.5">
            <a href={`tel:${hotline}`} className="flex items-center text-rose-500 hover:text-rose-600 font-bold transition-colors">
              <Phone className="w-4 h-4 mr-1" />
              <span>{language === 'bn' ? 'হটলাইন:' : 'Hotline:'} {hotline}</span>
            </a>
            <span className="text-slate-400">|</span>
            <span>({operatingHours})</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button id="track-order-btn" onClick={onOpenTracker} className="hover:text-amber-600 cursor-pointer flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5" />
              <span>{t.trackOrder}</span>
            </button>
            <span className="text-slate-300">|</span>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScNuXqsemAAsRPwyg-RnqPG-403ZLuzh5-wl2CommI8Fn6K0w/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span>{t.initiative}</span>
            </a>
            <span className="text-slate-300">|</span>
            <button onClick={() => onTabChange('affiliate')} className="hover:text-amber-600 cursor-pointer flex items-center space-x-1 font-bold text-sky-600">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{t.earnHome}</span>
            </button>
            <span className="text-slate-300">|</span>
            <button onClick={() => onTabChange('donation')} className="hover:text-amber-500 cursor-pointer flex items-center space-x-1 font-medium">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.bookDonation}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Main Header Bar (Mobile Header + Desktop Search & Branding) */}
      <header className="bg-white md:border-b md:border-gray-150 z-40">
        {/* MOBILE COMPACT HEADER: Visible on mobile, hidden on desktop */}
        <div className="md:hidden">
        {/* Fixed Top Bar: 3-Line Menu (Left), Centered Logo (Middle), Action Icons (Right) */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-150 px-3 sm:px-4 h-14 sm:h-15 flex items-center justify-between shadow-xs">
          
          {/* LEFT: 3-Line Mobile Menu Hamburger Trigger */}
          <div className="flex items-center justify-start shrink-0 min-w-[40px]">
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 -ml-1 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center justify-center active:scale-95"
              title="Menu"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.4]" />
            </button>
          </div>

          {/* MIDDLE: Centered Logo */}
          <div 
            onClick={handleLogoClick} 
            className="flex-1 flex items-center justify-center px-1 sm:px-2 cursor-pointer select-none text-center"
          >
            {logoImageUrl ? (
              <img
                src={logoImageUrl}
                alt={logoTitle || 'Logo'}
                className="h-9 sm:h-10 max-h-10 max-w-[160px] sm:max-w-[200px] object-contain transition-transform active:scale-95"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-[22px] sm:text-[24px] font-black font-sans leading-none flex items-center justify-center">
                {getLogoSegments(logoTitle || 'কেনাকাটা').map((seg, idx) => (
                  <span key={idx} className={`${seg.color} font-black`}>{seg.text}</span>
                ))}
                <span className="text-emerald-500 font-extrabold text-xl leading-none">.</span>
                <span className="text-[10px] font-bold text-slate-500 tracking-tighter uppercase ml-0.5 bg-slate-100 py-0.5 px-1.5 rounded border border-gray-200">
                  SHOP
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: Actions (Track Order, User Profile / Login, Wishlist) */}
          <div className="flex items-center justify-end space-x-1.5 sm:space-x-2 shrink-0 min-w-[40px]">
            {/* Track Order Button */}
            <button 
              onClick={onOpenTracker} 
              className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs" 
              title={t.trackOrder}
              aria-label={t.trackOrder}
            >
              <Truck className="w-5 h-5 text-slate-700" />
            </button>
            
            {/* User Log In / Circular Profile for Mobile */}
            {loggedInUser ? (
              <button 
                onClick={loggedInUser.isAdmin ? onOpenAdmin : onOpenUserDashboard}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-slate-300 hover:border-sky-500 shrink-0 shadow-2xs cursor-pointer transition-all active:scale-95"
                title={loggedInUser.name}
                aria-label={loggedInUser.name}
              >
                <img 
                  src={loggedInUser.photoURL || (loggedInUser.emailOrPhone.toLowerCase() === 'rakhalchandro2@gmail.com' 
                    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                  )} 
                  alt="User photo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ) : (
              <button 
                onClick={onOpenLogin} 
                className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs" 
                title="Login"
                aria-label="Login"
              >
                <User className="w-5 h-5 text-slate-700" />
              </button>
            )}

            {/* Watchlist / Wishlist Trigger for Mobile */}
            <button 
              id="mobile-header-watchlist-btn"
              onClick={() => {
                if (onOpenWishlist) onOpenWishlist();
                else onTabChange('wishlist');
              }} 
              className={`relative font-bold w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs ${
                activeTab === 'wishlist' 
                  ? 'bg-rose-500 text-white shadow-xs scale-105' 
                  : 'text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title={language === 'bn' ? "আমার উইশলিস্ট / ওয়াচলিস্ট" : "Wishlist / Watchlist"}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-white text-white' : (wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-700')}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-extrabold text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-xs border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Spaceholder to prevent content from jumping behind the fixed top bar */}
        <div className="h-14 sm:h-15" />

        {/* Search Bar Container - Modern, Polished Mobile Search Experience */}
        <div className="relative z-40 bg-gradient-to-b from-white via-white to-slate-50/70 px-3.5 sm:px-4 pt-2.5 pb-2 border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className={`transition-all duration-300 ease-in-out origin-top relative w-full ${
            isMobileSearchVisible 
              ? 'opacity-100 mt-0 scale-y-100 overflow-visible' 
              : 'max-h-0 opacity-0 -mt-2.5 scale-y-95 pointer-events-none overflow-hidden'
          }`}>
            {showDropdown && localQuery.trim() !== '' && (
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            )}
            
            {/* The Main Pill Search Box with Glassmorphism & Soft Ring */}
            <div className="relative z-50 w-full flex items-center bg-slate-50/90 hover:bg-white focus-within:bg-white border-1.5 border-slate-200/90 hover:border-sky-300 focus-within:border-sky-500 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:shadow-[0_4px_18px_rgba(14,165,233,0.15)] focus-within:ring-3 focus-within:ring-sky-100/80 transition-all duration-200 p-1 pl-1.5">
              
              {/* Mobile Category Scope Selector (General Option replacing the small search icon) */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMobileCategoryDropdownOpen(prev => !prev)}
                  className="bg-slate-200/80 hover:bg-slate-200 text-slate-800 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 transition-all cursor-pointer mr-1 select-none active:scale-95 border border-slate-300/70 shadow-3xs"
                  title="ক্যাটাগরি পরিবর্তন করুন"
                >
                  <span className="truncate max-w-[65px]">{getScopeLabel()}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${isMobileCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileCategoryDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setIsMobileCategoryDropdownOpen(false)} 
                    />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white/98 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl z-[70] py-1.5 animate-scale-up text-left">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        সার্চ ডিপার্টমেন্ট
                      </div>
                      {[
                        { id: 'all', label: 'সকল পণ্য (General)', icon: '🌐' },
                        { id: 'books', label: 'বই সমগ্র (Books)', icon: '📚' },
                        { id: 'electronics', label: 'ইলেক্ট্রনিক্স (Electronics)', icon: '⚡' },
                        { id: 'superstore', label: 'সুপার স্টোর (Superstore)', icon: '🛒' },
                        { id: 'fashion', label: 'ফ্যাশন (Fashion)', icon: '👕' },
                        { id: 'kids', label: 'কিডস জোন (Kids Zone)', icon: '🧸' },
                        { id: 'ebook', label: 'ই-বুক (Digital Books)', icon: '📖' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryScope(opt.id);
                            setIsMobileCategoryDropdownOpen(false);
                            if (opt.id !== 'all') {
                              onTabChange(opt.id === 'ebook' ? 'books' : opt.id);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
                            selectedCategoryScope === opt.id 
                              ? 'bg-sky-50 text-sky-600 font-black' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm">{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Search Text Input */}
              <input
                id="mobile-search-input"
                type="text"
                placeholder={animatedPlaceholder || getSearchPlaceholder()}
                value={localQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-transparent py-1.5 text-[13px] sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all duration-150"
              />

              {/* Action Buttons Right Cluster */}
              <div className="flex items-center space-x-1 shrink-0 pr-0.5">
                {/* Clear Input Button (visible when query exists) */}
                {localQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalQuery('');
                      onSearch('');
                    }}
                    className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center justify-center cursor-pointer transition-colors active:scale-90 mr-0.5"
                    title="মুছে ফেলুন"
                    aria-label="Clear query"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                )}

                {/* Voice Search Mic Button Mobile */}
                <button
                  type="button"
                  onClick={() => isListening ? stopVoiceSearch() : startVoiceSearch()}
                  className={`w-8 h-8 rounded-full transition-all cursor-pointer relative flex items-center justify-center active:scale-90 ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200' 
                      : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50 bg-white border border-slate-200/80 shadow-3xs'
                  }`}
                  title={language === 'bn' ? 'কণ্ঠস্বর অনুসন্ধান (ভয়েস সার্চ)' : 'Voice Search'}
                  aria-label="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                  {isListening && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </button>

                {/* Submit Search Button (Gradient Circle) */}
                <button 
                  type="button"
                  onClick={() => onSearch(localQuery)}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-xs flex items-center justify-center shrink-0 active:scale-90 transition-transform cursor-pointer"
                  title="অনুসন্ধান করুন"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 stroke-[2.5] text-white" />
                </button>
              </div>
            </div>

            {/* Quick Trending Keyword Suggestion Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1.5 mt-1 -mx-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
                ট্রেন্ডিং:
              </span>
              {[
                { label: '🔥 আজকের ডিল', q: "Today's Deal" },
                { label: '📚 এইচএসসি', q: 'এইচএসসি' },
                { label: '⚡ ফ্যান ও গ্যাজেট', q: 'ফ্যান' },
                { label: '🎧 ইয়ারবাডস', q: 'earphone' },
                { label: '🍯 মধু ও তেল', q: 'মধু' },
                { label: '🧸 শিশুদের খেলনা', q: 'খেলনা' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLocalQuery(chip.q);
                    onSearch(chip.q);
                  }}
                  className="shrink-0 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 border border-slate-200/80 text-[10.5px] font-bold text-slate-650 transition-all cursor-pointer active:scale-95 shadow-3xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {renderAutocompleteDropdown(true)}
          </div>
        </div>
      </div>

      {/* 2. Main Branding Header & Search Strip - Hidden on Mobile */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 items-center justify-between gap-4">
        {/* Rokomari Logo Recreated in High Fidelity CSS / Custom Uploaded Image Logo */}
        <div onClick={handleLogoClick} className="flex items-center space-x-1 cursor-pointer select-none">
          {logoImageUrl ? (
            <img
              src={logoImageUrl}
              alt={logoTitle || 'Logo'}
              className="h-10 sm:h-11 max-w-[220px] object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-[28px] font-black font-sans leading-none flex items-center">
              {/* Traditional Rokomari yellow/blue/red text segments */}
              {getLogoSegments(logoTitle || 'কেনাকাটা').map((seg, idx) => (
                <span key={idx} className={`${seg.color} font-black`}>{seg.text}</span>
              ))}
              {/* Small red heart accent dot */}
              <span className="text-emerald-500 font-extrabold text-2xl leading-none">.</span>
              <span className="text-[12px] font-semibold text-slate-500 tracking-tighter uppercase self-end ml-0.5 mb-1 bg-slate-100 py-0.5 px-1 rounded border border-gray-200">
                SHOP
              </span>
            </div>
          )}
        </div>

        {/* Live Catalog Search with Dropdown Indicator */}
        <div className="relative z-40 w-full max-w-2xl">
          {showDropdown && localQuery.trim() !== '' && (
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          )}
          <div className="relative z-50 w-full flex border-2 border-slate-300 rounded-lg hover:border-amber-400 focus-within:border-amber-500 transition-colors bg-white overflow-hidden shadow-xs">
            {/* Functional Category Scope Dropdown in Desktop Search Bar */}
            <div className="relative shrink-0 hidden sm:block">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                className="bg-slate-100 hover:bg-slate-200/80 border-r border-slate-200 px-3 py-2 text-xs text-slate-700 font-black flex items-center space-x-1.5 select-none transition-colors cursor-pointer"
                title="ক্যাটাগরি অনুযায়ী সার্চ ফিল্টার করুন"
              >
                <span>{getScopeLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setIsCategoryDropdownOpen(false)} />
                  <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-scale-up text-left">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      সার্চ ডিপার্টমেন্ট
                    </div>
                    {[
                      { id: 'all', label: 'সকল পণ্য (General)', icon: '🌐' },
                      { id: 'books', label: 'বই সমগ্র (Books)', icon: '📚' },
                      { id: 'electronics', label: 'ইলেক্ট্রনিক্স (Electronics)', icon: '⚡' },
                      { id: 'superstore', label: 'সুপার স্টোর (Superstore)', icon: '🛒' },
                      { id: 'fashion', label: 'ফ্যাশন (Fashion)', icon: '👕' },
                      { id: 'kids', label: 'কিডস জোন (Kids Zone)', icon: '🧸' },
                      { id: 'ebook', label: 'ই-বুক (Digital Books)', icon: '📖' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryScope(opt.id);
                          setIsCategoryDropdownOpen(false);
                          if (opt.id !== 'all') {
                            onTabChange(opt.id === 'ebook' ? 'books' : opt.id);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
                          selectedCategoryScope === opt.id 
                            ? 'bg-sky-50 text-sky-600 font-black' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <input
              id="global-search-input"
              type="text"
              placeholder={animatedPlaceholder || getSearchPlaceholder()}
              value={localQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-3.5 py-1.5 text-sm font-semibold text-slate-800 placeholder:font-semibold placeholder:text-slate-500 focus:outline-hidden transition-all duration-150"
            />
            {/* Voice Search Mic Button */}
            <div className="flex items-center pr-2 bg-white shrink-0">
              <button
                type="button"
                onClick={() => isListening ? stopVoiceSearch() : startVoiceSearch()}
                className={`p-1.5 rounded-full transition-all cursor-pointer relative flex items-center justify-center hover:scale-105 active:scale-95 ${
                  isListening 
                    ? 'bg-red-50 text-red-600 animate-pulse' 
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                }`}
                title={language === 'bn' ? 'কণ্ঠস্বর অনুসন্ধান (ভয়েস সার্চ)' : 'Voice Search'}
              >
                <Mic className="w-4 h-4" />
                {isListening && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                )}
              </button>
            </div>
            <button className="bg-slate-50 px-4 py-1.5 text-slate-600 hover:bg-slate-100 border-l border-slate-200 text-sm flex items-center justify-center">
              <Search className="w-4 h-4 text-sky-500" />
            </button>
          </div>
          {renderAutocompleteDropdown(false)}
        </div>

        {/* Floating Controls Area */}
        <div className="flex items-center space-x-5">
          {/* Download App Promo (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center space-x-2 text-slate-700 hover:text-amber-600 cursor-pointer">
            <Smartphone className="w-6 h-6 text-slate-500" />
            <div className="text-left leading-none font-sans">
              <span className="text-[9.5px] block text-slate-400 font-medium font-sans">{t.downloadApp}</span>
              <span className="text-xs font-bold font-sans">{t.downloadApp}</span>
            </div>
          </div>

          {/* User Log In / Profile Hover Dropdown Block */}
          {loggedInUser ? (
            <div className="relative group/profile py-1.5 flex items-center">
              {/* Trigger area: Circular Profile image, name, and ▾ */}
              <div 
                className="flex items-center space-x-2.5 cursor-pointer select-none py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                onClick={loggedInUser.isAdmin ? onOpenAdmin : onOpenUserDashboard}
                title={loggedInUser.isAdmin ? 'কন্ট্রোল প্যানেল খুলুন' : 'ড্যাশবোর্ড খুলুন'}
              >
                {/* 1. Man's visual portrait avatar exactly matching screenshot */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-350 shrink-0 shadow-2xs">
                  <img 
                    src={loggedInUser.photoURL || (loggedInUser.emailOrPhone.toLowerCase() === 'rakhalchandro2@gmail.com' 
                      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                    )} 
                    alt="User photo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 2. "Hello, Name" text + Down Chevron ▼ */}
                <div className="text-left font-sans leading-tight">
                  <div className="text-[10px] text-slate-400 font-bold block leading-none">{t.hello}</div>
                  <div className="text-[13px] font-extrabold text-slate-800 flex items-center gap-1 tracking-tight mt-0.5">
                    <span>{loggedInUser.name}</span>
                    <span className="text-[8px] text-slate-500 self-center leading-none">▼</span>
                  </div>
                </div>
              </div>

              {/* High-Fidelity Dropdown Menu structured exactly like the screenshot */}
              <div 
                id="profile-dropdown-container"
                className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-150/85 rounded-lg shadow-xl py-1 z-50 transition-all duration-200 ease-out opacity-0 translate-y-2 invisible group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:visible pointer-events-none group-hover/profile:pointer-events-auto"
              >
                {/* Admin Indicator shortcut if applicable */}
                {loggedInUser.isAdmin && (
                  <button 
                    id="profile-dropdown-admin-panel"
                    onClick={onOpenAdmin}
                    className="w-full flex items-center space-x-3 px-4.5 py-2 hover:bg-amber-50 text-left text-xs font-black text-amber-700 transition-colors cursor-pointer border-b border-amber-100"
                  >
                    <span className="text-sm">👑</span>
                    <span>{t.adminPanel}</span>
                  </button>
                )}

                <button 
                  id="profile-dropdown-account"
                  onClick={() => {
                    if (loggedInUser.isAdmin && onOpenAdmin) onOpenAdmin();
                    else onOpenUserDashboard?.();
                  }}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.accountInfo}</span>
                </button>

                <button 
                  id="profile-dropdown-orders"
                  onClick={onOpenTracker}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.ordersTracking}</span>
                </button>

                <button 
                  id="profile-dropdown-ratings"
                  onClick={() => showToast(language === 'bn' ? "আমার রেটিং ও রিভিউ সেকশন" : "My Ratings & Reviews Section")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Star className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.ratingsReviews}</span>
                </button>

                <button 
                  id="profile-dropdown-interests"
                  onClick={() => showToast(language === 'bn' ? "মাই ইন্টারেস্ট ও সাবজেক্ট তালিকা" : "My Interests & Subjects List")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.myInterests}</span>
                </button>

                <button 
                  id="profile-dropdown-authors"
                  onClick={() => showToast(language === 'bn' ? "ফলো করা লেখকদের ডেটা" : "Following Authors List")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.followingAuthors}</span>
                </button>

                <button 
                  id="profile-dropdown-wishlist"
                  onClick={() => {
                    if (onOpenWishlist) onOpenWishlist();
                    else onTabChange('wishlist');
                  }}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 shrink-0 fill-rose-50" />
                  <span>{t.wishlist}</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button 
                  id="profile-dropdown-saved"
                  onClick={() => showToast(language === 'bn' ? "সেভড লিস্ট বা প্রিয় বইসমূহ" : "Saved & Favorite List")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.savedList}</span>
                </button>

                <button 
                  id="profile-dropdown-ebooks"
                  onClick={() => showToast(language === 'bn' ? "আমার রকমারি ই-বুক লাইব্রেরী" : "My eBook Library")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.ebookLibrary}</span>
                </button>

                <button 
                  id="profile-dropdown-bookshelf"
                  onClick={() => showToast(language === 'bn' ? "বুকশেলফ বা পঠিত বইয়ের র্যাক" : "My Bookshelf & History")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Library className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.bookshelf}</span>
                </button>

                <button 
                  id="profile-dropdown-bkash"
                  onClick={() => showToast(language === 'bn' ? "বিকাশ মেথড ও কানেকশন সেটিংস" : "bKash Account Connection Settings")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-505 shrink-0" style={{ transform: 'rotate(-40deg)' }} />
                  <span>{t.bkashAccount}</span>
                </button>

                <button 
                  id="profile-dropdown-balance"
                  onClick={() => showToast(language === 'bn' ? "আপনার রকমারি মেইন ব্যালেন্স" : "Your Wallet Balance")}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-slate-50 text-left text-[12.5px] font-medium text-slate-705 transition-colors cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-slate-505 shrink-0" />
                  <span>{t.rokomariBalance}</span>
                </button>

                {/* Soft Visual Divider */}
                <div className="border-t border-slate-100 my-1"></div>

                <button 
                  id="profile-dropdown-signout"
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3.5 px-4.5 py-2 hover:bg-rose-50 text-left text-[12.5px] font-bold text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            </div>
          ) : (
            <div onClick={onOpenLogin} className="flex items-center space-x-2 text-slate-700 hover:text-amber-600 cursor-pointer">
              <User className="w-6 h-6 text-slate-500" />
              <div className="text-left leading-none">
                <span className="text-[9.5px] block text-slate-400 font-medium font-sans">{t.helloSignIn}</span>
                <span className="text-xs font-bold font-sans">{t.myAccount}</span>
              </div>
            </div>
          )}

          {/* Dynamic Wishlist / Watchlist Indicator */}
          <button
            id="wishlist-toggle-btn"
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
              else onTabChange('wishlist');
            }}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              activeTab === 'wishlist' 
                ? 'bg-rose-50 text-rose-600' 
                : 'hover:bg-slate-100 text-slate-700 hover:text-rose-600'
            }`}
            title={language === 'bn' ? "আমার উইশলিস্ট / ওয়াচলিস্ট" : "Wishlist / Watchlist"}
          >
            <Heart className={`w-6 h-6 ${activeTab === 'wishlist' || wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Dynamic Cart Indicator */}
          <button
            id="cart-toggle-btn"
            onClick={onOpenCart}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

    {/* 3. Primary Responsive Nav Tabs - Hidden on Mobile (accessible via 3-line menu), visible on Desktop/Tablet */}
    <nav className="hidden md:block bg-white border-b border-gray-150 relative z-30">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-1 md:py-1.5 gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5">
          {/* Home Tab Always Leads */}
          <button
             onClick={() => onTabChange('home')}
             className={`py-1.5 md:py-2 px-1.5 sm:px-2 md:px-2.5 lg:px-3 text-[11px] sm:text-[12px] md:text-[12.5px] lg:text-[13.5px] xl:text-[14px] font-bold font-sans rounded-md hover:text-sky-600 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
               activeTab === 'home' ? 'text-sky-600 bg-sky-50 font-black' : 'text-slate-700'
             }`}
          >
            {t.homeTab}
          </button>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`py-1.5 md:py-2 px-1.5 sm:px-2 md:px-2.5 lg:px-3 text-[11px] sm:text-[12px] md:text-[12.5px] lg:text-[13.5px] xl:text-[14px] font-bold font-sans transition-all relative cursor-pointer flex items-center whitespace-nowrap shrink-0 rounded-md ${
                activeTab === tab.id
                  ? 'text-sky-600 bg-sky-50 font-black'
                  : 'text-slate-700 hover:text-sky-500 hover:bg-slate-50'
              }`}
            >
              <span>{getTabLabel(tab.id, tab.label)}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 inset-x-2 h-0.5 bg-sky-500 rounded-t-full"></span>
              )}
              {tab.id === 'offers' && (
                <span className="ml-1 px-1 bg-amber-500 text-amber-950 text-[8px] font-black tracking-tight rounded-sm scale-90 animate-pulse">
                  HOT
                </span>
              )}
            </button>
          ))}
          
          <button
            type="button"
            onClick={() => {
              onTabChange('offers');
              showToast(language === 'bn' ? 'শুধুমাত্র আপনার জন্য স্পেশাল অফার সমূহ' : 'Special Offers Just For You');
            }}
            className="py-1.5 md:py-2 px-1.5 sm:px-2 md:px-2.5 lg:px-3 text-[11px] sm:text-[12px] md:text-[12.5px] lg:text-[13.5px] xl:text-[14px] font-black text-amber-500 hover:text-amber-600 cursor-pointer flex items-center font-sans whitespace-nowrap shrink-0 hover:bg-amber-50 rounded-md transition-all"
            title="ForYou Special"
          >
            {t.justForYou}
          </button>
        </div>
      </div>
    </nav>

    {/* 4. Secondary Sub-Category Filter Strip - Hidden on Mobile (accessible via 3-line menu), visible on Desktop/Tablet */}
    {getSubcategories().length > 0 && (
      <div className="hidden md:block bg-slate-50 border-b border-gray-150 py-1">
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 text-[9px] sm:text-[10px] md:text-[10.5px] lg:text-[11px] xl:text-[11.5px] text-slate-500 font-medium py-0.5">
            {getSubcategories().map((sub, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSubcategoryClick(sub)}
                className="cursor-pointer hover:text-sky-600 hover:bg-white/80 px-1 sm:px-1.5 md:px-2 py-0.5 rounded transition-all font-medium select-none active:scale-95 text-slate-600 whitespace-nowrap shrink-0"
                title={`${sub.replace(' TEXT', '')} দেখুন`}
              >
                {sub.replace(' TEXT', '')}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

      {/* Dynamic Toast feedback element */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-sans font-bold py-3 px-5 rounded-xl shadow-2xl z-50 flex items-center space-x-2 border border-slate-800 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Voice Search Listening Modal Overlay */}
      {isListening && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 flex flex-col items-center relative overflow-hidden">
            {/* Pulsing colored gradient ambient glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-sky-500 animate-pulse" />

            {/* Close button */}
            <button
              onClick={stopVoiceSearch}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Listening icon + Ring waves */}
            <div className="relative mt-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-red-500/20 scale-125 animate-pulse" />
              <div className="bg-red-500 text-white p-5 rounded-full shadow-lg relative z-10 flex items-center justify-center">
                <Mic className="w-8 h-8" />
              </div>
            </div>

            {/* Audio Waves Simulation */}
            <div className="flex items-center space-x-1.5 h-6 mt-6 justify-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${[14, 24, 18, 22, 12][i]}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>

            {/* Status & Prompts */}
            <p className="mt-4 text-sm font-bold text-slate-800 text-center">
              {listeningStatus}
            </p>
            <p className="mt-1.5 text-xs text-slate-400 font-medium text-center px-4">
              {language === 'bn' 
                ? 'আপনার পছন্দের প্রোডাক্ট বা ক্যাটাগরির নাম বলুন' 
                : 'Say the name of your desired product or category'}
            </p>

            {/* Language Selection Pills */}
            <div className="mt-6 flex items-center bg-slate-50 border border-slate-150 p-1 rounded-full w-full justify-between">
              <button
                type="button"
                onClick={() => {
                  setSpeechLanguage('bn-BD');
                  startVoiceSearch('bn-BD');
                }}
                className={`flex-1 text-[11px] font-black py-2 px-3 rounded-full transition-all cursor-pointer text-center ${
                  speechLanguage === 'bn-BD'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpeechLanguage('en-US');
                  startVoiceSearch('en-US');
                }}
                className={`flex-1 text-[11px] font-black py-2 px-3 rounded-full transition-all cursor-pointer text-center ${
                  speechLanguage === 'en-US'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English (US)
              </button>
            </div>

            {/* Helper tips */}
            <div className="mt-6 border-t border-slate-100 pt-4 w-full text-center">
              <span className="text-[10.5px] text-slate-400 font-bold block mb-1">
                {language === 'bn' ? 'উদাহরণস্বরূপ বলুন:' : 'For example, say:'}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md inline-block font-mono">
                {speechLanguage === 'bn-BD' 
                  ? (activeTab === 'books' ? '"হুমায়ূন আহমেদ"' : activeTab === 'electronics' ? '"হেডফোন"' : '"মধু"')
                  : (activeTab === 'books' ? '"Humayun Ahmed"' : activeTab === 'electronics' ? '"Headphone"' : '"Honey"')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile 3-Line Menu Drawer Overlay (Accessible via top hamburger icon) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[120] flex md:hidden">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)} 
          />

          {/* Slide-in Drawer Container */}
          <div className="relative w-[310px] max-w-[85vw] h-full bg-white shadow-2xl z-10 flex flex-col overflow-hidden animate-slide-right">
            {/* Header bar */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between border-b border-slate-800 shadow-xs">
              <div className="flex items-center space-x-1 cursor-pointer select-none" onClick={() => { handleLogoClick(); setIsMobileMenuOpen(false); }}>
                {logoImageUrl ? (
                  <img
                    src={logoImageUrl}
                    alt={logoTitle || 'Logo'}
                    className="h-7 max-w-[130px] object-contain brightness-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-base font-black font-sans leading-none flex items-center">
                    {getLogoSegments(logoTitle || 'টপসেল').map((seg, idx) => (
                      <span key={idx} className={seg.color.replace('text-sky-700', 'text-sky-400').replace('text-slate-800', 'text-white')}>{seg.text}</span>
                    ))}
                    <span className="text-emerald-400 font-extrabold text-sm leading-none">.</span>
                    <span className="text-[9px] font-semibold text-slate-300 tracking-tighter uppercase ml-1 bg-white/10 py-0.5 px-1.5 rounded border border-white/20">
                      মেনু
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-slate-800">
              {/* 1. Main Navigation Tabs */}
              <div className="p-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  {language === 'bn' ? 'প্রধান ক্যাটাগরি ও মেনু' : 'Main Categories & Menu'}
                </h4>
                <div className="space-y-1">
                  {/* Home Tab */}
                  <button
                    onClick={() => {
                      onTabChange('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'home' 
                        ? 'bg-sky-50 text-sky-600 font-black border border-sky-200/80 shadow-2xs' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">🏠</span>
                      <span>{t.homeTab}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dynamic Tabs */}
                  {tabs.map((tab) => {
                    const getTabIcon = (id: string) => {
                      switch(id) {
                        case 'books': return '📚';
                        case 'electronics': return '⚡';
                        case 'superstore': return '🛒';
                        case 'fashion': return '👕';
                        case 'kids': return '🧸';
                        case 'corporate': return '🏢';
                        case 'awards': return '🏆';
                        case 'offers': return '🔥';
                        case 'boimela': return '📖';
                        default: return '🏷️';
                      }
                    };
                    const isHot = tab.id === 'offers';

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onTabChange(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeTab === tab.id 
                            ? 'bg-sky-50 text-sky-600 font-black border border-sky-200/80 shadow-2xs' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{getTabIcon(tab.id)}</span>
                          <span>{getTabLabel(tab.id, tab.label)}</span>
                          {isHot && (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black tracking-tight rounded-sm animate-pulse">
                              HOT
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    );
                  })}

                  {/* Just for you */}
                  <button
                    onClick={() => {
                      onTabChange('home');
                      setIsMobileMenuOpen(false);
                      showToast(language === 'bn' ? 'শুধুমাত্র আপনার জন্য সেকশনে নিয়ে যাওয়া হচ্ছে...' : 'Navigating to Just For You...');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/70 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">✨</span>
                      <span>{t.justForYou}</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                </div>
              </div>

              {/* 2. Subcategories & Quick Filters */}
              {getSubcategories().length > 0 && (
                <div className="p-3 bg-slate-50/60">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
                    <span>{language === 'bn' ? 'সাব-ক্যাটাগরি ও ফিল্টার' : 'Sub-categories & Filters'}</span>
                    <span className="text-[9px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/70">
                      {activeTab === 'home' ? 'হোম' : activeTab === 'books' ? 'বই' : activeTab === 'electronics' ? 'ইলেকট্রনিক্স' : activeTab === 'superstore' ? 'সুপার স্টোর' : activeTab === 'fashion' ? 'ফ্যাশন' : 'ফিল্টার'}
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {getSubcategories().map((sub, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleSubcategoryClick(sub);
                          setIsMobileMenuOpen(false);
                        }}
                        className="cursor-pointer text-[11px] font-semibold text-slate-700 bg-white hover:text-sky-600 hover:border-sky-300 border border-slate-200 px-2.5 py-1.5 rounded-md shadow-2xs transition-all active:scale-95 text-left"
                      >
                        {sub.replace(' TEXT', '')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Quick Action Links & Services */}
              <div className="p-3 space-y-1">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  {language === 'bn' ? 'সেবা ও সুবিধাসমূহ' : 'Services & Links'}
                </h4>
                
                <button
                  onClick={() => {
                    onOpenTracker();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{t.trackOrder}</span>
                </button>

                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScNuXqsemAAsRPwyg-RnqPG-403ZLuzh5-wl2CommI8Fn6K0w/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t.initiative}</span>
                </a>

                <button
                  onClick={() => {
                    onTabChange('affiliate');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.earnHome}</span>
                </button>

                <button
                  onClick={() => {
                    onTabChange('donation');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{t.bookDonation}</span>
                </button>
              </div>

              {/* 4. Hotline & Contact */}
              <div className="p-3.5 bg-rose-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-rose-600 font-black text-xs">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'হটলাইন:' : 'Hotline:'} {hotline}</span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block mt-0.5">({operatingHours})</span>
                </div>
                <a 
                  href={`tel:${hotline}`}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                >
                  কল করুন
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
