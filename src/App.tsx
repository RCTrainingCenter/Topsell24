import React, { useState, useRef, useEffect } from 'react';
import {
  ALL_PRODUCTS,
  BANNERS,
  BOOKS_DATA,
  ELECTRONICS_DATA,
  SUPERSTORE_DATA,
  FASHION_DATA,
  KIDS_DATA,
  TESTIMONIALS,
} from './data';
import { Product, CartItem, Campaign, Coupon, PromoPopupConfig, BoimelaConfig, AffiliateUser, AffiliateWithdrawal, AffiliateProgramConfig, SingleProductLandingPage } from './types';
import { DEFAULT_BOIMELA_CONFIG } from './data/defaultBoimelaConfig';
import { DEFAULT_AFFILIATES, DEFAULT_WITHDRAWALS, DEFAULT_AFFILIATE_CONFIG } from './data/defaultAffiliates';
import { DEFAULT_LANDING_PAGES } from './data/defaultLandingPages';
import SingleProductLandingPageView from './components/SingleProductLandingPageView';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import BookPreviewModal from './components/BookPreviewModal';
import RequestQuoteModal from './components/RequestQuoteModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import LoginModal from './components/LoginModal';
import ProductSinglePageView from './components/ProductSinglePageView';
import UserDashboardModal from './components/UserDashboardModal';
import AuthorDetailsView from './components/AuthorDetailsView';
import PromoPopupModal, { DEFAULT_PROMO_POPUP_CONFIG } from './components/PromoPopupModal';
import { BookTrustBanners } from './components/RokomariFeaturesShowcase';
import { 
  ChevronLeft, ChevronRight, ChevronDown, CheckCircle, RefreshCw, Star, Info, HelpingHand, Award, ArrowRight, ShieldCheck, Phone, Mail, MapPin, Truck,
  Home, Grid, Search, User, ShoppingCart, Sliders, X, ClipboardList, LogOut, Heart, Smartphone, Coins,
  BookOpen, TrendingUp, Sparkles, Globe, Languages, Tv, Laptop, Headphones, ShoppingBag, Baby, Gift, Smile, HelpCircle, Copy, Download
} from 'lucide-react';
import AdminPanel, { AdminTabConfig, AdminBannerConfig, AdminQuote, AdminOrder } from './components/AdminPanel';
import { db, handleFirestoreError, OperationType, logOutFromFirebase, auth } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import HomeView from './components/HomeView';
import { translations } from './translations';
import PromoCarousel from './components/PromoCarousel';
import CampaignsView from './components/CampaignsView';
import ProductCompare from './components/ProductCompare';
import ProductSkeleton from './components/ProductSkeleton';
import AffiliateView from './components/AffiliateView';
import BookDonationView from './components/BookDonationView';
import BoimelaView from './components/BoimelaView';
import WishlistView from './components/WishlistView';
import { optimizeFirestoreDocumentImages } from './utils/imageOptimizer';
import { parseRouteUrl } from './utils/navigationHelper';

export default function App() {
  // Control Panel Trigger
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState<boolean>(false);

  // Firebase Auth State
  const [fbUser, setFbUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  // Logged-in User State (persistent)
  const [loggedInUser, setLoggedInUser] = useState<{ uid?: string; name: string; emailOrPhone: string; isAdmin: boolean; photoURL?: string; phoneNumber?: string; deliveryAddress?: string } | null>(() => {
    const local = localStorage.getItem('kenakata_logged_user_v1');
    if (local) return JSON.parse(local);
    return null;
  });

  // Dynamic products list catalog state (initialized/saved via local storage for persistence across reloads)
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('rokomari_products_v1');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  });

  // Dynamic favorite products state (persisted locally and synced with Firestore)
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(() => {
    const local = localStorage.getItem('kenakata_favorites_v1');
    return local ? JSON.parse(local) : [];
  });

  // Sync with localStorage on changes
  useEffect(() => {
    localStorage.setItem('kenakata_favorites_v1', JSON.stringify(favoriteProductIds));
  }, [favoriteProductIds]);

  // Sync with Firestore UserProfile if logged in
  useEffect(() => {
    if (!loggedInUser) return;
    const userUid = loggedInUser.uid || loggedInUser.emailOrPhone.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const docRef = doc(db, 'users', userUid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.favoriteProductIds) {
          setFavoriteProductIds(data.favoriteProductIds);
        }
        setLoggedInUser(prev => {
          if (!prev) return null;
          let changed = false;
          const updated = { ...prev };
          if (data.photoURL && data.photoURL !== prev.photoURL) {
            updated.photoURL = data.photoURL;
            changed = true;
          }
          if (data.phoneNumber && data.phoneNumber !== prev.phoneNumber) {
            updated.phoneNumber = data.phoneNumber;
            changed = true;
          }
          if (data.deliveryAddress !== undefined && data.deliveryAddress !== prev.deliveryAddress) {
            updated.deliveryAddress = data.deliveryAddress;
            changed = true;
          }
          return changed ? updated : prev;
        });
      }
    }, (error) => {
      console.warn('Silent read error on favorites Firestore sync:', error);
    });
    return () => unsubscribe();
  }, [loggedInUser?.uid, loggedInUser?.emailOrPhone]);

  const handleToggleFavorite = async (product: Product) => {
    const isFav = favoriteProductIds.includes(product.id);
    const newFavorites = isFav 
      ? favoriteProductIds.filter(id => id !== product.id)
      : [...favoriteProductIds, product.id];
      
    setFavoriteProductIds(newFavorites);
    
    if (loggedInUser) {
      const userUid = loggedInUser.uid || loggedInUser.emailOrPhone.replace(/[^a-zA-Z0-9_\-]/g, '_');
      try {
        await setDoc(doc(db, 'users', userUid), {
          favoriteProductIds: newFavorites
        }, { merge: true });
      } catch (err: any) {
        console.warn('Favorites write error:', err);
      }
    }
  };

  const handleUpdateUserAddress = async (newAddress: string) => {
    if (!loggedInUser) return;
    const userUid = loggedInUser.uid || loggedInUser.emailOrPhone.replace(/[^a-zA-Z0-9_\-]/g, '_');
    try {
      await setDoc(doc(db, 'users', userUid), {
        deliveryAddress: newAddress
      }, { merge: true });
      setLoggedInUser(prev => prev ? { ...prev, deliveryAddress: newAddress } : null);
    } catch (err: any) {
      console.error('Failed to update user delivery address:', err);
      throw err;
    }
  };

  // Shared Wishlist States & Helpers (declared after state variables)
  const [sharedWishlistProductIds, setSharedWishlistProductIds] = useState<string[]>([]);
  const [isSharedWishlistOpen, setIsSharedWishlistOpen] = useState<boolean>(false);

  // Parse shared_wishlist query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedParam = urlParams.get('shared_wishlist');
    if (sharedParam) {
      const ids = sharedParam.split(',').filter(Boolean);
      if (ids.length > 0) {
        setSharedWishlistProductIds(ids);
        setIsSharedWishlistOpen(true);
      }
    }
  }, [products]);

  const clearSharedWishlistQuery = () => {
    setIsSharedWishlistOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('shared_wishlist');
    window.history.replaceState({}, document.title, url.pathname + url.search);
  };

  const handleImportSharedWishlist = async () => {
    const newFavorites = Array.from(new Set([...favoriteProductIds, ...sharedWishlistProductIds]));
    setFavoriteProductIds(newFavorites);
    
    if (loggedInUser) {
      const userUid = loggedInUser.uid || loggedInUser.emailOrPhone.replace(/[^a-zA-Z0-9_\-]/g, '_');
      try {
        await setDoc(doc(db, 'users', userUid), {
          favoriteProductIds: newFavorites
        }, { merge: true });
      } catch (err: any) {
        console.warn('Favorites write error:', err);
      }
    }
    clearSharedWishlistQuery();
  };

  // Author Details Modal state
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | null>(null);

  // Language switcher state (English / Bengali)
  const [language, setLanguage] = useState<'en' | 'bn'>(() => {
    const saved = localStorage.getItem('kenakata_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
    localStorage.setItem('kenakata_lang', nextLang);
  };

  const t = translations[language];

  // FAQ interactive accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic visible tabs and dynamic naming configurations
  const [tabsConfig, setTabsConfig] = useState<AdminTabConfig[]>(() => {
    const local = localStorage.getItem('rokomari_tabs_v1');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          if (!parsed.some((t: any) => t.id === 'fashion')) {
            const sIdx = parsed.findIndex((t: any) => t.id === 'superstore');
            const fashionTab = { id: 'fashion', label: 'ফ্যাশন', isVisible: true };
            if (sIdx !== -1) {
              parsed.splice(sIdx + 1, 0, fashionTab);
            } else {
              parsed.push(fashionTab);
            }
          }
          return parsed;
        }
      } catch (e) {}
    }
    return [
      { id: 'books', label: 'বই', isVisible: true },
      { id: 'electronics', label: 'ইলেক্ট্রনিক্স', isVisible: true },
      { id: 'superstore', label: 'সুপার স্টোর', isVisible: true },
      { id: 'fashion', label: 'ফ্যাশন', isVisible: true },
      { id: 'kids', label: 'কিডস জোন', isVisible: true },
      { id: 'corporate', label: 'প্রাতিষ্ঠানিক অর্ডার', isVisible: true },
      { id: 'awards', label: 'বেস্টসেলার অ্যাওয়ার্ড', isVisible: true },
      { id: 'offers', label: 'আজকের অফার!', isVisible: true },
      { id: 'boimela', label: 'বইমেলা ২০২৬', isVisible: true },
      { id: 'campaigns', label: 'কম্বো অফার 🎁', isVisible: true },
    ];
  });

  // Dynamic promo banners for each tab (map of tabId to list of BannerSlide)
  const [bannersConfig, setBannersConfig] = useState<Record<string, any>>(() => {
    const local = localStorage.getItem('rokomari_banners_v1');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return {};
  });

  // Dynamic Boimela 2026 Page Configuration (managed via Admin Panel)
  const [boimelaConfig, setBoimelaConfig] = useState<BoimelaConfig>(() => {
    const local = localStorage.getItem('rokomari_boimela_config_v1');
    if (local) {
      try {
        return { ...DEFAULT_BOIMELA_CONFIG, ...JSON.parse(local) };
      } catch (e) {
        console.error('Failed to parse boimela config:', e);
      }
    }
    return DEFAULT_BOIMELA_CONFIG;
  });

  const handleUpdateBoimelaConfig = (updated: BoimelaConfig) => {
    setBoimelaConfig(updated);
    localStorage.setItem('rokomari_boimela_config_v1', JSON.stringify(updated));
  };

  // Affiliate Program States & Configuration
  const [affiliates, setAffiliates] = useState<AffiliateUser[]>(() => {
    const local = localStorage.getItem('rokomari_affiliates_v1');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return DEFAULT_AFFILIATES;
  });

  const [affiliateWithdrawals, setAffiliateWithdrawals] = useState<AffiliateWithdrawal[]>(() => {
    const local = localStorage.getItem('rokomari_affiliate_withdrawals_v1');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return DEFAULT_WITHDRAWALS;
  });

  const [affiliateConfig, setAffiliateConfig] = useState<AffiliateProgramConfig>(() => {
    const local = localStorage.getItem('rokomari_affiliate_config_v1');
    if (local) {
      try {
        return { ...DEFAULT_AFFILIATE_CONFIG, ...JSON.parse(local) };
      } catch (e) {}
    }
    return DEFAULT_AFFILIATE_CONFIG;
  });

  // Listen and sync affiliates from Firestore
  useEffect(() => {
    const unsubscribeAffiliates = onSnapshot(collection(db, 'affiliates'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AffiliateUser));
        setAffiliates(list);
        localStorage.setItem('rokomari_affiliates_v1', JSON.stringify(list));
      } else {
        DEFAULT_AFFILIATES.forEach(a => {
          setDoc(doc(db, 'affiliates', a.id), a).catch(() => {});
        });
      }
    }, () => {});

    const unsubscribeWithdrawals = onSnapshot(collection(db, 'affiliate_withdrawals'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AffiliateWithdrawal));
        setAffiliateWithdrawals(list);
        localStorage.setItem('rokomari_affiliate_withdrawals_v1', JSON.stringify(list));
      } else {
        DEFAULT_WITHDRAWALS.forEach(w => {
          setDoc(doc(db, 'affiliate_withdrawals', w.id), w).catch(() => {});
        });
      }
    }, () => {});

    return () => {
      unsubscribeAffiliates();
      unsubscribeWithdrawals();
    };
  }, []);

  // Track referral clicks from URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref') || params.get('affiliate');
      if (refCode) {
        const cleanRef = refCode.trim();
        localStorage.setItem('rokomari_affiliate_ref', cleanRef);

        // Increment click count for this affiliate
        setAffiliates(prev => {
          const updated = prev.map(a => {
            if (a.referralCode.toLowerCase() === cleanRef.toLowerCase()) {
              const fresh = { ...a, totalClicks: (a.totalClicks || 0) + 1 };
              setDoc(doc(db, 'affiliates', fresh.id), fresh, { merge: true }).catch(() => {});
              return fresh;
            }
            return a;
          });
          localStorage.setItem('rokomari_affiliates_v1', JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, []);

  const handleRegisterAffiliate = async (newAff: AffiliateUser) => {
    const updated = [newAff, ...affiliates.filter(a => a.id !== newAff.id)];
    setAffiliates(updated);
    localStorage.setItem('rokomari_affiliates_v1', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'affiliates', newAff.id), newAff);
    } catch (e) {}
  };

  const handleRequestAffiliateWithdrawal = async (req: AffiliateWithdrawal) => {
    const updated = [req, ...affiliateWithdrawals.filter(w => w.id !== req.id)];
    setAffiliateWithdrawals(updated);
    localStorage.setItem('rokomari_affiliate_withdrawals_v1', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'affiliate_withdrawals', req.id), req);
    } catch (e) {}
  };

  const handleUpdateAffiliates = async (updated: AffiliateUser[]) => {
    setAffiliates(updated);
    localStorage.setItem('rokomari_affiliates_v1', JSON.stringify(updated));
    for (const a of updated) {
      await setDoc(doc(db, 'affiliates', a.id), a).catch(() => {});
    }
  };

  const handleUpdateAffiliateWithdrawals = async (updated: AffiliateWithdrawal[]) => {
    setAffiliateWithdrawals(updated);
    localStorage.setItem('rokomari_affiliate_withdrawals_v1', JSON.stringify(updated));
    for (const w of updated) {
      await setDoc(doc(db, 'affiliate_withdrawals', w.id), w).catch(() => {});
    }
  };

  const handleUpdateAffiliateConfig = (updated: AffiliateProgramConfig) => {
    setAffiliateConfig(updated);
    localStorage.setItem('rokomari_affiliate_config_v1', JSON.stringify(updated));
  };

  // Single Product Landing Pages State
  const [landingPages, setLandingPages] = useState<SingleProductLandingPage[]>(() => {
    const local = localStorage.getItem('rokomari_landing_pages_v1');
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return DEFAULT_LANDING_PAGES;
  });

  const [selectedLandingPage, setSelectedLandingPage] = useState<SingleProductLandingPage | null>(null);

  // Sync Landing Pages from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'landing_pages'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SingleProductLandingPage));
        setLandingPages(list);
        localStorage.setItem('rokomari_landing_pages_v1', JSON.stringify(list));
      } else {
        DEFAULT_LANDING_PAGES.forEach(lp => {
          setDoc(doc(db, 'landing_pages', lp.id), lp).catch(() => {});
        });
      }
    }, () => {});
    return () => unsubscribe();
  }, []);

  const handleUpdateLandingPages = async (updated: SingleProductLandingPage[]) => {
    setLandingPages(updated);
    localStorage.setItem('rokomari_landing_pages_v1', JSON.stringify(updated));
    const currentIds = new Set(updated.map(p => p.id));
    const toDelete = landingPages.filter(p => !currentIds.has(p.id));
    for (const p of toDelete) {
      await deleteDoc(doc(db, 'landing_pages', p.id)).catch(() => {});
    }
    for (const p of updated) {
      await setDoc(doc(db, 'landing_pages', p.id), p).catch(() => {});
    }
  };

  // URL Hash Deep Link Check for #landing/:slug
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#landing/')) {
        const slug = hash.replace('#landing/', '').trim();
        const found = landingPages.find(p => p.slug === slug || p.id === slug);
        if (found) {
          setSelectedLandingPage(found);
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [landingPages]);

  // Dynamic Client quotation requests received
  const [quotes, setQuotes] = useState<AdminQuote[]>(() => {
    const local = localStorage.getItem('rokomari_quotes_v1');
    if (local) return JSON.parse(local);
    return [
      {
        id: "q-1",
        clientName: "মোহাম্মদ আশরাফুল",
        institution: "সিটি ব্যাংক লিমিটেড (HR Dept)",
        phone: "01783451290",
        email: "ashraful.city@bank.com",
        bookDetails: "৫টি ভিন্ন মোটিভেশনাল বই - ১০০ কপি করে মোট ৫০০ কপি।",
        quantity: 500,
        status: "Pending",
        date: "২৫ মে, ২০২৬"
      },
      {
        id: "q-2",
        clientName: "তাসনিম ফাতেমা",
        institution: "গ্রিনভিউ লিটল ফ্লাওয়ার স্কুল",
        phone: "01511223344",
        email: "tasnim.greenview@school.edu.bd",
        bookDetails: "শিশুদের পাজল ও ভাষা শিক্ষার বই - ২৫০ পিস উপহার প্রজেক্টের কোটেশন চাই।",
        quantity: 250,
        status: "Approved",
        date: "২৪ মে, ২০২৬"
      }
    ];
  });

  // Dynamic mock orders list to track
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    const local = localStorage.getItem('rokomari_orders_v1');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'RM-542103',
        clientName: 'রাখাল চন্দ্র শীল',
        phone: '01819554421',
        address: 'রোড ১২, সেক্টর ৪, উত্তরা, ঢাকা',
        itemsCount: 2,
        totalPrice: 428,
        status: 'Dispatched',
        date: '২৫ মে, ২০২৬'
      },
      {
        id: 'RM-810294',
        clientName: 'সায়েম রেজা',
        phone: '01712009944',
        address: 'হোল্ডিং ৪৫, বাড্ডা লিংক রোড, ঢাকা',
        itemsCount: 4,
        totalPrice: 1250,
        status: 'Completed',
        date: '২৪ মে, ২০২৬'
      }
    ];
  });

  // Hotline services & logo segments state
  const [siteSettings, setSiteSettings] = useState(() => {
    const local = localStorage.getItem('rokomari_settings_v1');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.logoTitle === 'রকমারি' || parsed.logoTitle === 'কেনাকাটা') {
        parsed.logoTitle = 'টপসেল';
      }
      return {
        hotline: parsed.hotline || '16297',
        operatingHours: parsed.operatingHours || '9 AM to 8 PM',
        announcementText: parsed.announcementText || '',
        logoTitle: parsed.logoTitle || 'টপসেল',
        logoImageUrl: parsed.logoImageUrl || '',
        favicon: parsed.favicon || '',
      };
    }
    return {
      hotline: '16297',
      operatingHours: '9 AM to 8 PM',
      announcementText: '',
      logoTitle: 'টপসেল',
      logoImageUrl: '',
      favicon: '',
    };
  });

  // Dynamic user profiles state synchronized from Firestore
  const [users, setUsers] = useState<any[]>([]);

  // Dynamic campaigns state synchronized from Firestore
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Dynamic coupons state synchronized from Firestore
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Dynamic promotional offer popup state synchronized from Firestore
  const [promoPopupConfig, setPromoPopupConfig] = useState<PromoPopupConfig>(() => {
    const local = localStorage.getItem('rokomari_promo_popup_v1');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return DEFAULT_PROMO_POPUP_CONFIG;
      }
    }
    return DEFAULT_PROMO_POPUP_CONFIG;
  });
  const [isPromoPopupOpen, setIsPromoPopupOpen] = useState<boolean>(false);

  // Skeleton loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(() => {
    return !localStorage.getItem('rokomari_products_v1');
  });

  // 1. Synchronize products collection in real-time
  useEffect(() => {
    const hasLocalCache = !!localStorage.getItem('rokomari_products_v1');
    if (!hasLocalCache) {
      setIsLoadingProducts(true);
    }
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap products in Firestore only if localStorage does not have existing data
        const local = localStorage.getItem('rokomari_products_v1');
        if (!local) {
          setProducts(ALL_PRODUCTS);
          ALL_PRODUCTS.forEach((p) => {
            setDoc(doc(db, 'products', p.id), p).catch(err => console.error('Bootstrap products error:', err));
          });
        }
      } else {
        const list: Product[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Product);
        });
        setProducts(list);
        try {
          localStorage.setItem('rokomari_products_v1', JSON.stringify(list));
        } catch (e) {}
      }
      setIsLoadingProducts(false);
    }, (error) => {
      console.warn('Firestore products listener warning:', error);
      setIsLoadingProducts(false);
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 2. Synchronize navigation tabs configuration in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_configs', 'tabs'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.list)) {
          const list = [...data.list];
          if (!list.some((t: any) => t.id === 'fashion')) {
            const sIdx = list.findIndex((t: any) => t.id === 'superstore');
            const fashionTab = { id: 'fashion', label: 'ফ্যাশন', isVisible: true };
            if (sIdx !== -1) {
              list.splice(sIdx + 1, 0, fashionTab);
            } else {
              list.push(fashionTab);
            }
            setDoc(doc(db, 'site_configs', 'tabs'), { list }).catch(() => {});
          }
          setTabsConfig(list);
          try {
            localStorage.setItem('rokomari_tabs_v1', JSON.stringify(list));
          } catch (e) {}
        }
      } else {
        // Bootstrap standard categories config in Firestore
        const defaultTabs = [
          { id: 'books', label: 'বই', isVisible: true },
          { id: 'electronics', label: 'ইলেক্ট্রনিক্স', isVisible: true },
          { id: 'superstore', label: 'সুপার স্টোর', isVisible: true },
          { id: 'fashion', label: 'ফ্যাশন', isVisible: true },
          { id: 'kids', label: 'কিডস জোন', isVisible: true },
          { id: 'corporate', label: 'প্রাতিষ্ঠানিক অর্ডার', isVisible: true },
          { id: 'awards', label: 'বেস্টসেলার অ্যাওয়ার্ড', isVisible: true },
          { id: 'offers', label: 'আজকের অফার!', isVisible: true },
          { id: 'boimela', label: 'বইমেলা ২০২৬', isVisible: true },
          { id: 'campaigns', label: 'কম্বো অফার 🎁', isVisible: true },
        ];
        setTabsConfig(defaultTabs);
        if (loggedInUser?.isAdmin) {
          setDoc(doc(db, 'site_configs', 'tabs'), { list: defaultTabs })
            .catch(err => console.error('Bootstrap tabs error:', err));
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site_configs/tabs');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 3. Synchronize marketing banner configurations in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_configs', 'banners'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          const merged = { ...BANNERS, ...data };
          setBannersConfig(merged);
          localStorage.setItem('rokomari_banners_v1', JSON.stringify(merged));
        }
      } else {
        // Bootstrap standard banner promotions config using original BANNERS
        setBannersConfig(BANNERS);
        if (loggedInUser?.isAdmin) {
          setDoc(doc(db, 'site_configs', 'banners'), BANNERS)
            .catch(err => console.error('Bootstrap banners error:', err));
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site_configs/banners');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 4. Synchronize general site settings in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_configs', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        const parsed = snapshot.data();
        if (parsed) {
          const updatedSettings = {
            hotline: parsed.hotline || '16297',
            operatingHours: parsed.operatingHours || '9 AM to 8 PM',
            announcementText: parsed.announcementText || '',
            logoTitle: parsed.logoTitle || 'টপসেল',
            logoImageUrl: parsed.logoImageUrl || '',
            favicon: parsed.favicon || ''
          };
          setSiteSettings(updatedSettings);
          try {
            localStorage.setItem('rokomari_settings_v1', JSON.stringify(updatedSettings));
          } catch (e) {}
        }
      } else {
        // Bootstrap site details preserving any existing local settings
        const local = localStorage.getItem('rokomari_settings_v1');
        let defaultSettings = {
          hotline: '16297',
          operatingHours: '9 AM to 8 PM',
          announcementText: '',
          logoTitle: 'টপসেল',
          logoImageUrl: '',
          favicon: ''
        };
        if (local) {
          try {
            const parsedLocal = JSON.parse(local);
            defaultSettings = { ...defaultSettings, ...parsedLocal };
          } catch (e) {}
        }
        setSiteSettings(defaultSettings);
        setDoc(doc(db, 'site_configs', 'settings'), defaultSettings)
          .catch(err => console.error('Bootstrap settings error:', err));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site_configs/settings');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // Sync favicon dynamically to the browser's link tag
  useEffect(() => {
    if (siteSettings?.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.favicon;
    }
  }, [siteSettings?.favicon]);

  // 5. Synchronize quotation submissions table in real-time
  useEffect(() => {
    if (!loggedInUser?.isAdmin) {
      const local = localStorage.getItem('rokomari_quotes_v1');
      if (local) setQuotes(JSON.parse(local));
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'quotes'), (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap default quotes in Firestore
        const defaultQuotes = [
          {
            id: "q-1",
            clientName: "মোহাম্মদ আশরাফুল",
            institution: "সিটি ব্যাংক লিমিটেড (HR Dept)",
            phone: "01783451290",
            email: "ashraful.city@bank.com",
            bookDetails: "৫টি ভিন্ন মোティブেশনাল বই - ১০০ কপি করে মোট ৫০০ কপি।",
            quantity: 500,
            status: "Pending",
            date: "২৫ মে, ২০২৬"
          },
          {
            id: "q-2",
            clientName: "তাসনিম ফাতেমা",
            institution: "গ্রিনভিউ লিটল ফ্লাওয়ার স্কুল",
            phone: "01511223344",
            email: "tasnim.greenview@school.edu.bd",
            bookDetails: "শিশুদের পাজল ও ভাষা শিক্ষার বই - ২৫০ পিস উপহার প্রজেক্টের কোটেশন চাই।",
            quantity: 250,
            status: "Approved",
            date: "২৪ মে, ২০২৬"
          }
        ];
        defaultQuotes.forEach((q) => {
          setDoc(doc(db, 'quotes', q.id), q).catch(err => console.log('Bootstrap quote error:', err));
        });
      } else {
        const list: AdminQuote[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as AdminQuote);
        });
        setQuotes(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'quotes');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 6. Synchronize orders database in real-time
  useEffect(() => {
    if (!loggedInUser?.isAdmin) {
      const local = localStorage.getItem('rokomari_orders_v1');
      if (local) setOrders(JSON.parse(local));
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap default orders in Firestore
        const defaultOrders = [
          {
            id: 'RM-542103',
            clientName: 'রাখাল চন্দ্র শীল',
            phone: '01819554421',
            address: 'রোড ১২, সেক্টর ৪, উত্তরা, ঢাকা',
            itemsCount: 2,
            totalPrice: 428,
            status: 'Dispatched',
            date: '২৫ মে, ২০২৬'
          },
          {
            id: 'RM-810294',
            clientName: 'সায়েম রেজা',
            phone: '01712009944',
            address: 'হোল্ডিং ৪৫, বাড্ডা লিংক রোড, ঢাকা',
            itemsCount: 4,
            totalPrice: 1250,
            status: 'Completed',
            date: '২৪ মে, ২০২৬'
          }
        ];
        defaultOrders.forEach((o) => {
          setDoc(doc(db, 'orders', o.id), o).catch(err => console.log('Bootstrap order error:', err));
        });
      } else {
        const list: AdminOrder[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as AdminOrder);
        });
        setOrders(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 7. Synchronize user profiles list in real-time
  useEffect(() => {
    if (!loggedInUser?.isAdmin) {
      setUsers([]);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data());
      });
      
      // Bootstrap if empty
      if (snapshot.empty) {
        const defaultUsers = [
          {
            uid: 'admin_rakhal',
            name: 'রাখাল চন্দ্র শীল',
            email: 'rakhalchandro2@gmail.com',
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            uid: 'customer_sayeem',
            name: 'সায়েম রেজা',
            email: 'sayeemreza@gmail.com',
            role: 'customer',
            createdAt: new Date().toISOString()
          }
        ];
        defaultUsers.forEach((u) => {
          setDoc(doc(db, 'users', u.uid), u).catch(err => console.error('Bootstrap user error:', err));
        });
      } else {
        setUsers(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 8. Synchronize campaigns collection in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap standard combo campaigns config in Firestore
        const defaultCampaigns: Campaign[] = [
          {
            id: 'camp-combo1',
            title: '🔥 অমর একুশে বইমেলা বেস্টসেলার কম্বো প্যাক',
            description: 'জনপ্রিয় ৩টি বেস্টসেলার মোটিভেশনাল ও আত্মуন্নয়নমূলক বই একসাথে পান বিশেষ ২০% অতিরিক্ত ছাড়ে! সাথে ফ্রি আকর্ষণীয় ডায়েরি ও ফ্রি ডেলিভারি উপহার নিশ্চিত।',
            bannerImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80',
            discountPercent: 20,
            productIds: ['b1', 'b2', 'b3'],
            isActive: true,
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            giftDetails: 'ফ্রি এক্সক্লুসিভ রিডার্স ডায়েরি + ফ্রি ক্যাশ অন ডেলিভারি!'
          },
          {
            id: 'camp-combo2',
            title: '⚡ স্মার্ট হোম ওয়ার্ক অ্যান্ড রিডিং ডিল',
            description: 'পড়ালেখা ও হোম অফিসের জন্য সেরা রিচার্জেবল মিনি ফ্যান এবং পাওয়ার ব্যাংক কম্বো। গরমে নিরবচ্ছিন্ন চার্জ ও বাতাসের নিশ্চয়তা পান সরাসরি ২৫% বান্ডেল ছাড়ে!',
            bannerImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
            discountPercent: 25,
            productIds: ['e1', 'e2'],
            isActive: true,
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            giftDetails: 'হাই স্পিড নাইলন বিনুনি ইউএসবি ক্যাবল উপহার!'
          }
        ];
        setCampaigns(defaultCampaigns);
        if (loggedInUser?.isAdmin) {
          defaultCampaigns.forEach((c) => {
            setDoc(doc(db, 'campaigns', c.id), c).catch(err => console.error('Bootstrap campaign error:', err));
          });
        }
      } else {
        const list: Campaign[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Campaign);
        });
        setCampaigns(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'campaigns');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 9. Synchronize coupons collection in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      if (snapshot.empty) {
        const defaultCoupons: Coupon[] = [
          {
            id: 'coupon-1',
            code: 'KENAKATA10',
            discountPercent: 10,
            minPurchase: 500,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            isActive: true
          },
          {
            id: 'coupon-2',
            code: 'EID2026',
            discountPercent: 20,
            minPurchase: 1000,
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            isActive: true
          },
          {
            id: 'coupon-3',
            code: 'SUMMER30',
            discountPercent: 30,
            minPurchase: 1500,
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            isActive: true
          }
        ];
        setCoupons(defaultCoupons);
        if (loggedInUser?.isAdmin) {
          defaultCoupons.forEach((cp) => {
            setDoc(doc(db, 'coupons', cp.id), cp).catch(err => console.error('Bootstrap coupon error:', err));
          });
        }
      } else {
        const list: Coupon[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Coupon);
        });
        setCoupons(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'coupons');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // 10. Synchronize promotional offer popup settings in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_configs', 'promo_popup'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as PromoPopupConfig;
        if (data) {
          setPromoPopupConfig(data);
          localStorage.setItem('rokomari_promo_popup_v1', JSON.stringify(data));
        }
      } else {
        // Bootstrap default Holiday / Free Shipping promo popup configuration
        setPromoPopupConfig(DEFAULT_PROMO_POPUP_CONFIG);
        if (loggedInUser?.isAdmin) {
          setDoc(doc(db, 'site_configs', 'promo_popup'), DEFAULT_PROMO_POPUP_CONFIG)
            .catch(() => {
              // Silently fallback to local state if write is not permitted
            });
        }
      }
    }, (error) => {
      // Graceful fallback to default/local config if permission or network issue occurs
      const local = localStorage.getItem('rokomari_promo_popup_v1');
      if (local) {
        try {
          setPromoPopupConfig(JSON.parse(local));
        } catch (e) {
          setPromoPopupConfig(DEFAULT_PROMO_POPUP_CONFIG);
        }
      }
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  // Auto-trigger promotional offer popup on user visit
  useEffect(() => {
    if (!promoPopupConfig?.isEnabled) {
      setIsPromoPopupOpen(false);
      return;
    }

    if (promoPopupConfig.showFrequency === 'once_per_session') {
      const alreadyShown = sessionStorage.getItem('rokomari_promo_popup_dismissed');
      if (alreadyShown === 'true') {
        return;
      }
    }

    const delay = (promoPopupConfig.delaySeconds ?? 1) * 1000;
    const timer = setTimeout(() => {
      setIsPromoPopupOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [promoPopupConfig]);

  const handleClosePromoPopup = () => {
    setIsPromoPopupOpen(false);
    if (promoPopupConfig?.showFrequency === 'once_per_session') {
      sessionStorage.setItem('rokomari_promo_popup_dismissed', 'true');
    }
  };

  const handleUpdatePromoPopupConfig = async (updated: PromoPopupConfig) => {
    setPromoPopupConfig(updated);
    localStorage.setItem('rokomari_promo_popup_v1', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'site_configs', 'promo_popup'), updated);
    } catch (err: any) {
      console.error('Failed to update promo popup config in Firestore:', err);
    }
  };

  // Keep active login cached local session fallback for quick bootstrap
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('kenakata_logged_user_v1', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('kenakata_logged_user_v1');
    }
  }, [loggedInUser]);

  // Handle client quote form submission - saves directly to Firestore matching schema
  const handleClientSubmitQuote = async (newQuote: any) => {
    const fullQuote: AdminQuote = {
      id: 'q-' + Date.now().toString(36),
      clientName: newQuote.clientName,
      institution: newQuote.institution,
      phone: newQuote.phone,
      email: newQuote.email,
      bookDetails: newQuote.bookDetails,
      quantity: newQuote.quantity,
      status: 'Pending',
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    try {
      await setDoc(doc(db, 'quotes', fullQuote.id), fullQuote);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'quotes');
    }
  };

  // Handle client order placement via shopping cart drawer - writes straight to Firestore database
  const handlePlaceOrder = async (newOrder: any) => {
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);

      // If this order was referred by an affiliate, credit the affiliate!
      if (newOrder.affiliateRef) {
        const targetAff = affiliates.find(a => 
          a.referralCode.toLowerCase() === newOrder.affiliateRef.toLowerCase()
        );
        if (targetAff) {
          const commissionEarned = newOrder.affiliateCommission || Math.round(newOrder.totalPrice * ((targetAff.commissionRate || affiliateConfig.defaultCommissionPercent || 10) / 100));
          const updatedAff: AffiliateUser = {
            ...targetAff,
            totalOrders: (targetAff.totalOrders || 0) + 1,
            totalSalesAmount: (targetAff.totalSalesAmount || 0) + newOrder.totalPrice,
            totalEarnings: (targetAff.totalEarnings || 0) + commissionEarned,
            currentBalance: (targetAff.currentBalance || 0) + commissionEarned
          };
          const updatedList = affiliates.map(a => a.id === updatedAff.id ? updatedAff : a);
          setAffiliates(updatedList);
          localStorage.setItem('rokomari_affiliates_v1', JSON.stringify(updatedList));
          await setDoc(doc(db, 'affiliates', updatedAff.id), updatedAff, { merge: true }).catch(() => {});
        }
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'orders');
    }
  };

  // Update a user's role (admin/customer) in Firestore
  const handleUpdateUserRole = async (uid: string, newRole: 'admin' | 'customer') => {
    try {
      await setDoc(doc(db, 'users', uid), { role: newRole }, { merge: true });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'users/' + uid);
    }
  };

  // Update offer campaigns in Firestore
  const handleUpdateCampaigns = async (updated: Campaign[]) => {
    try {
      const updatedIds = new Set(updated.map(c => c.id));
      const toDelete = campaigns.filter(c => !updatedIds.has(c.id));
      for (const c of toDelete) {
        await deleteDoc(doc(db, 'campaigns', c.id));
      }
      for (const c of updated) {
        await setDoc(doc(db, 'campaigns', c.id), c);
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'campaigns');
    }
  };

  // Update promo coupons in Firestore
  const handleUpdateCoupons = async (updated: Coupon[]) => {
    try {
      const updatedIds = new Set(updated.map(c => c.id));
      const toDelete = coupons.filter(c => !updatedIds.has(c.id));
      for (const c of toDelete) {
        await deleteDoc(doc(db, 'coupons', c.id));
      }
      for (const c of updated) {
        await setDoc(doc(db, 'coupons', c.id), c);
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'coupons');
    }
  };

  // Firestore specific Administrative modification bridge routines
  const handleUpdateProducts = async (updated: Product[]) => {
    // 1. Immediately update React state for instant UI response
    setProducts(updated);

    // 2. Immediately persist to localStorage
    try {
      localStorage.setItem('rokomari_products_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage products quota:', e);
    }

    // 3. Synchronize deletions and upserts with Firestore
    try {
      const updatedIds = new Set(updated.map(p => p.id));
      const toDelete = products.filter(p => !updatedIds.has(p.id));
      
      const deletePromises = toDelete.map(p => 
        deleteDoc(doc(db, 'products', p.id)).catch(err => {
          console.warn(`Firestore deleteDoc warning for ${p.id}:`, err);
        })
      );
      await Promise.all(deletePromises);

      const upsertPromises = updated.map(p => 
        setDoc(doc(db, 'products', p.id), p).catch(err => {
          console.warn(`Firestore setDoc warning for ${p.id}:`, err);
        })
      );
      await Promise.all(upsertPromises);
    } catch (err: any) {
      console.warn('Firestore products sync warning:', err);
    }
  };

  const handleUpdateTabs = async (updated: AdminTabConfig[]) => {
    try {
      await setDoc(doc(db, 'site_configs', 'tabs'), { list: updated });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'site_configs/tabs');
    }
  };

  const handleUpdateBanners = async (updated: Record<string, any>) => {
    try {
      setBannersConfig(updated);
      try {
        localStorage.setItem('rokomari_banners_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage banner quota:', e);
      }

      // Optimize payload ensuring high-resolution rendering and Firestore 1MB safety
      const safePayload = await optimizeFirestoreDocumentImages(updated, 720000);
      await setDoc(doc(db, 'site_configs', 'banners'), safePayload);
    } catch (err: any) {
      console.warn('Error writing site_configs/banners:', err);
      if (String(err?.message || '').includes('exceeds the maximum allowed size')) {
        console.error('Firestore banners document size limit hit. Preserved in local state.');
      } else {
        handleFirestoreError(err, OperationType.WRITE, 'site_configs/banners');
      }
    }
  };

  const handleUpdateQuotes = async (updated: AdminQuote[]) => {
    try {
      const updatedIds = new Set(updated.map(q => q.id));
      const toDelete = quotes.filter(q => !updatedIds.has(q.id));
      for (const q of toDelete) {
        await deleteDoc(doc(db, 'quotes', q.id));
      }
      for (const q of updated) {
        await setDoc(doc(db, 'quotes', q.id), q);
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'quotes');
    }
  };

  const handleUpdateOrders = async (updated: AdminOrder[]) => {
    try {
      const updatedIds = new Set(updated.map(o => o.id));
      const toDelete = orders.filter(o => !updatedIds.has(o.id));
      for (const o of toDelete) {
        await deleteDoc(doc(db, 'orders', o.id));
      }
      for (const o of updated) {
        await setDoc(doc(db, 'orders', o.id), o);
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'orders');
    }
  };

  const handleUpdateSiteSettings = async (settings: any) => {
    try {
      setSiteSettings(settings);
      try {
        localStorage.setItem('rokomari_settings_v1', JSON.stringify(settings));
      } catch (e) {
        console.warn('localStorage settings quota:', e);
      }
      await setDoc(doc(db, 'site_configs', 'settings'), settings);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'site_configs/settings');
    }
  };

  const [homeConfig, setHomeConfig] = useState<any>(() => {
    const local = localStorage.getItem('rokomari_home_v1');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return null;
  });
  const [isLoadingHomeConfig, setIsLoadingHomeConfig] = useState<boolean>(() => {
    return !localStorage.getItem('rokomari_home_v1');
  });

  // Synchronize home layout and campaigns configurations in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_configs', 'home'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        if (data && Array.isArray(data.categories)) {
          data.categories = data.categories.map((c: any) => {
            if (c?.label && (c.label.includes('ফ্যাশন') || c.label.toLowerCase().includes('fashion')) && c.id === 'electronics') {
              return { ...c, id: 'fashion' };
            }
            return c;
          });
        }
        setHomeConfig(data);
        try {
          localStorage.setItem('rokomari_home_v1', JSON.stringify(data));
        } catch (e) {}
      }
      setIsLoadingHomeConfig(false);
    }, (error) => {
      setIsLoadingHomeConfig(false);
      handleFirestoreError(error, OperationType.GET, 'site_configs/home');
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateHomeConfig = async (updated: any) => {
    try {
      setHomeConfig(updated);
      try {
        localStorage.setItem('rokomari_home_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage home quota:', e);
      }

      // Optimize payload ensuring high-resolution rendering and Firestore 1MB safety
      const safePayload = await optimizeFirestoreDocumentImages(updated, 720000);
      await setDoc(doc(db, 'site_configs', 'home'), safePayload);
    } catch (err: any) {
      console.warn('Error writing site_configs/home:', err);
      if (String(err?.message || '').includes('exceeds the maximum allowed size')) {
        console.error('Firestore home config document size limit hit. Preserved in local state.');
      } else {
        handleFirestoreError(err, OperationType.WRITE, 'site_configs/home');
      }
    }
  };

  const [categoriesConfig, setCategoriesConfig] = useState<Record<string, Record<string, string[]>>>(() => {
    return {
      books: {
        'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন': ['ব্যবাসা', 'বিনিয়োগ', 'আত্মউন্নয়ন'],
        'ইসলামি বই': ['কুরআন ও তাফসীর', 'হাদিস', 'ইসলামী ইতিহাস'],
        'উপন্যাস': ['রোমান্টিক উপন্যাস', 'থ্রিলার', 'ঐতিহাসিক উপন্যাস'],
        'কৃষি ও কৃষক': ['কৃষি তত্ত্ব', 'ফল ও সবজি চাষ'],
        'অনুবাদ': ['অনূদিত আত্মউন্নয়ন', 'অনূদিত সাহিত্য'],
        'ভাষা শিক্ষা ও ব্যাকরণ': ['ইংরেজি শিক্ষা', 'আরবি ভাষা', 'বাংলা ব্যাকরণ'],
        'বিজ্ঞান ও প্রযুক্তি': ['জনপ্রিয় বিজ্ঞান', 'প্রোগ্রামিং ও আইটি']
      },
      electronics: {
        'Computer & Accessories': ['RAM', 'SSD', 'Keyboard', 'Mouse'],
        'Mobile & Accessories': ['Power Bank', 'Charger', 'Cable'],
        'Sound System': ['Bluetooth Speaker', 'Earbuds', 'Headphones'],
        'Appliances': ['Rechargeable Fan', 'Blender', 'Kettle']
      },
      superstore: {
        'Beauty & Personal Care': ['Face Wash', 'Shampoo', 'Lotion'],
        'Stationery': ['Notebook', 'Pen', 'Diary']
      },
      fashion: {
        'শার্ট ও পোলো টি-শার্ট (Shirts & Polo)': ['পোলো শার্ট (Polo Shirt)', 'ক্যাজুয়াল শার্ট (Casual Shirt)', 'হাফ স্লিভ টি-শার্ট (T-Shirt)'],
        'প্যান্ট ও ট্রাউজার (Pants & Jeans)': ['ডেনিম জিন্স (Denim Jeans)', 'গ্যাবার্ডিন প্যান্ট (Gabardine)', 'জগার্স ও ট্রাউজার (Joggers)'],
        'জুতা ও স্নিকার্স (Shoes & Footwear)': ['ক্যাজুয়াল স্নিকার্স (Sneakers)', 'ফরমাল লোফার (Loafers)', 'স্যান্ডেল ও স্লাইড (Sandals)'],
        'পাঞ্জাবি ও কুর্তি (Panjabi & Ethnic)': ['প্রিমিয়াম পাঞ্জাবি (Panjabi)', 'থ্রি-পিস ও কুর্তি (Three-Piece)'],
        'ফ্যাশন এক্সেসরিজ (Watches & Bags)': ['হাতঘড়ি ও সানগ্লাস (Watches)', 'মানিব্যাগ ও বেল্ট (Wallets & Belts)']
      },
      kids: {
        'Feeding': ['Baby Feeder', 'Milk Powder'],
        'Kids Toys': ['Soft Toys', 'Educational Toys', 'Lego']
      }
    };
  });

  // Synchronize category hierarchy configurations in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'site_configs', 'categories'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          const merged = { ...data } as any;
          if (!merged.fashion) {
            merged.fashion = {
              'শার্ট ও পোলো টি-শার্ট (Shirts & Polo)': ['পোলো শার্ট (Polo Shirt)', 'ক্যাজুয়াল শার্ট (Casual Shirt)', 'হাফ স্লিভ টি-শার্ট (T-Shirt)'],
              'প্যান্ট ও ট্রাউজার (Pants & Jeans)': ['ডেনিম জিন্স (Denim Jeans)', 'গ্যাবার্ডিন প্যান্ট (Gabardine)', 'জগার্স ও ট্রাউজার (Joggers)'],
              'জুতা ও স্নিকার্স (Shoes & Footwear)': ['ক্যাজুয়াল স্নিকার্স (Sneakers)', 'ফরমাল লোফার (Loafers)', 'স্যান্ডেল ও স্লাইড (Sandals)'],
              'পাঞ্জাবি ও কুর্তি (Panjabi & Ethnic)': ['প্রিমিয়াম পাঞ্জাবি (Panjabi)', 'থ্রি-পিস ও কুর্তি (Three-Piece)'],
              'ফ্যাশন এক্সেসরিজ (Watches & Bags)': ['হাতঘড়ি ও সানগ্লাস (Watches)', 'মানিব্যাগ ও বেল্ট (Wallets & Belts)']
            };
          }
          setCategoriesConfig(merged);
        }
      } else {
        const defaultCategories = {
          books: {
            'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন': ['ব্যবাসা', 'বিনিয়োগ', 'আত্মউন্নয়ন'],
            'ইসলামি বই': ['কুরআন ও তাফসীর', 'হাদিস', 'ইসলামী ইতিহাস'],
            'উপন্যাস': ['রোমান্টিক উপন্যাস', 'থ্রিলার', 'ঐতিহাসিক উপন্যাস'],
            'কৃষি ও কৃষক': ['কৃষি তত্ত্ব', 'ফল ও সবজি চাষ'],
            'অনুবাদ': ['অনূদিত আত্মউন্নয়ন', 'অনূদিত সাহিত্য'],
            'ভাষা শিক্ষা ও ব্যাকরণ': ['ইংরেজি শিক্ষা', 'আরবি ভাষা', 'বাংলা ব্যাকরণ'],
            'বিজ্ঞান ও প্রযুক্তি': ['জনপ্রিয় বিজ্ঞান', 'প্রোগ্রামিং ও আইটি']
          },
          electronics: {
            'Computer & Accessories': ['RAM', 'SSD', 'Keyboard', 'Mouse'],
            'Mobile & Accessories': ['Power Bank', 'Charger', 'Cable'],
            'Sound System': ['Bluetooth Speaker', 'Earbuds', 'Headphones'],
            'Appliances': ['Rechargeable Fan', 'Blender', 'Kettle']
          },
          superstore: {
            'Beauty & Personal Care': ['Face Wash', 'Shampoo', 'Lotion'],
            'Stationery': ['Notebook', 'Pen', 'Diary']
          },
          fashion: {
            'শার্ট ও পোলো টি-শার্ট (Shirts & Polo)': ['পোলো শার্ট (Polo Shirt)', 'ক্যাজুয়াল শার্ট (Casual Shirt)', 'হাফ স্লিভ টি-শার্ট (T-Shirt)'],
            'প্যান্ট ও ট্রাউজার (Pants & Jeans)': ['ডেনিম জিন্স (Denim Jeans)', 'গ্যাবার্ডিন প্যান্ট (Gabardine)', 'জগার্স ও ট্রাউজার (Joggers)'],
            'জুতা ও স্নিকার্স (Shoes & Footwear)': ['ক্যাজুয়াল স্নিকার্স (Sneakers)', 'ফরমাল লোফার (Loafers)', 'স্যান্ডেল ও স্লাইড (Sandals)'],
            'পাঞ্জাবি ও কুর্তি (Panjabi & Ethnic)': ['প্রিমিয়াম পাঞ্জাবি (Panjabi)', 'থ্রি-পিস ও কুর্তি (Three-Piece)'],
            'ফ্যাশন এক্সেসরিজ (Watches & Bags)': ['হাতঘড়ি ও সানগ্লাস (Watches)', 'মানিব্যাগ ও বেল্ট (Wallets & Belts)']
          },
          kids: {
            'Feeding': ['Baby Feeder', 'Milk Powder'],
            'Kids Toys': ['Soft Toys', 'Educational Toys', 'Lego']
          }
        };
        setCategoriesConfig(defaultCategories);
        if (loggedInUser?.isAdmin) {
          setDoc(doc(db, 'site_configs', 'categories'), defaultCategories)
            .catch(err => console.error('Bootstrap categories hierarchy error:', err));
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site_configs/categories');
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  const handleUpdateCategories = async (updated: any) => {
    try {
      await setDoc(doc(db, 'site_configs', 'categories'), updated);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'site_configs/categories');
    }
  };

  // Derive active tab to manage safely if hidden
  const visibleTabs = tabsConfig.filter(t => t.isVisible);
  const [activeTabState, setActiveTabPrivate] = useState<string>('home');

  // Guard active tab is always visible (fallback if admin hides active tab) - home tab and special views are always enabled
  const isSpecialTab = ['home', 'affiliate', 'donation', 'campaigns', 'awards', 'offers', 'boimela', 'corporate'].includes(activeTabState);
  const activeTab = (isSpecialTab || visibleTabs.some(t => t.id === activeTabState))
    ? activeTabState
    : (visibleTabs[0]?.id || 'books');

  const setActiveTab = (tab: string, skipHashUpdate = false) => {
    setActiveTabPrivate(tab);
    setSelectedCategory('');
    setSelectedChildCategory('');
    setSelectedBrandsOrAuthors([]);
    setSearchQuery('');
    setSelectedSingleProduct(null);
    if (!skipHashUpdate && typeof window !== 'undefined') {
      const targetHash = tab === 'home' ? '' : `#${tab}`;
      if (window.location.hash !== targetHash) {
        if (targetHash === '') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.replaceState(null, '', targetHash);
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  // Central Deep Link & URL Navigator
  const handleNavigateUrl = (rawUrl: string) => {
    if (!rawUrl) return;
    const route = parseRouteUrl(rawUrl);
    
    if (route.isExternal && route.externalUrl) {
      window.open(route.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (route.isAction === 'cart') {
      setIsCartOpen(true);
      return;
    }
    if (route.isAction === 'tracker') {
      setIsTrackerOpen(true);
      return;
    }
    if (route.isAction === 'quote') {
      setIsQuoteOpen(true);
      return;
    }
    if (route.isAction === 'whatsapp') {
      window.open(`https://wa.me/8801700000000`, '_blank');
      return;
    }
    if (route.productId) {
      const prod = products.find(p => p.id === route.productId || p.id.toLowerCase() === route.productId?.toLowerCase());
      if (prod) {
        setSelectedSingleProductState(prod);
        return;
      }
    }
    if (route.tab) {
      setSelectedSingleProductState(null);
      setActiveTabState(route.tab);
      if (route.category) {
        setSelectedCategory(route.category);
      }
      if (route.childCategory) {
        setSelectedChildCategory(route.childCategory);
      }
    }
  };

  // Sync hash routing on browser back/forward or deep-linked URL load
  useEffect(() => {
    const onHashChange = () => {
      const currentHash = window.location.hash;
      if (currentHash) {
        handleNavigateUrl(currentHash);
      }
    };
    if (window.location.hash) {
      onHashChange();
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [products]);

  // Subsets computed directly from the local products list (reacts to admin edits/deletes/adds)
  const books = products.filter(p => p.type === 'book');
  const electronics = products.filter(p => p.type === 'electronic');
  const superstore = products.filter(p => p.type === 'superstore');
  const fashion = products.filter(p => p.type === 'fashion');
  const kids = products.filter(p => p.type === 'kids');

  // Interactive local states list (persisted in localStorage across page reloads)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rokomari_cart_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error loading cart from localStorage:', e);
    }
    return [];
  });

  // Persist cartItems to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('rokomari_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Error saving cart to localStorage:', e);
    }
  }, [cartItems]);
  
  // Product Comparison state
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const handleAddToCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 4) {
        // High visibility alert using a gentle in-app Toast simulation or clear message
        alert('🎉 আপনি সর্বোচ্চ ৪টি প্রোডাক্ট তুলনা তালিকায় যোগ করতে পারবেন!');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCompare = (product: Product) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  const handleClearCompare = () => {
    setCompareItems([]);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedChildCategory, setSelectedChildCategory] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('best-seller');
  const [selectedBrandsOrAuthors, setSelectedBrandsOrAuthors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Modals visibility triggers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Mobile specific visibility triggers
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState<boolean>(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [selectedPreviewBook, setSelectedPreviewBook] = useState<Product | null>(null);
  const [selectedSingleProduct, setSelectedSingleProductState] = useState<Product | null>(null);

  // Sync URL hash to #product/<id> whenever a product is opened or closed
  const setSelectedSingleProduct = (prod: Product | null) => {
    setSelectedSingleProductState(prod);
    if (typeof window !== 'undefined') {
      if (prod && prod.id) {
        const targetHash = `#product/${encodeURIComponent(prod.id)}`;
        if (window.location.hash !== targetHash) {
          window.history.pushState(null, '', window.location.pathname + targetHash);
        }
      } else if (window.location.hash.startsWith('#product/') || window.location.hash.startsWith('#product:')) {
        const fallbackHash = `#${activeTabState || 'home'}`;
        window.history.replaceState(null, '', window.location.pathname + fallbackHash);
      }
    }
  };

  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [isFreeShippingModalOpen, setIsFreeShippingModalOpen] = useState<boolean>(false);
  const [isCouponCopied, setIsCouponCopied] = useState<boolean>(false);

  const handleOpenTracker = () => {
    if (!loggedInUser) {
      setIsLoginOpen(true);
    } else {
      setIsTrackerOpen(true);
    }
  };

  // Scroll to top whenever activeTabState or selectedSingleProduct changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activeTabState, selectedSingleProduct]);

  const handleQuickSearchFocus = () => {
    // Prevent scroll listener from hiding the search bar during transition
    (window as any).__ignoreSearchScroll = true;
    setTimeout(() => {
      (window as any).__ignoreSearchScroll = false;
    }, 1200);

    // Dispatch custom event to force show mobile search bar
    window.dispatchEvent(new CustomEvent('show-mobile-search'));

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const mobileInput = document.getElementById('mobile-search-input');
      if (mobileInput) {
        mobileInput.focus();
        (mobileInput as HTMLInputElement).select();
      } else {
        const desktopInput = document.getElementById('global-search-input');
        if (desktopInput) {
          desktopInput.focus();
          (desktopInput as HTMLInputElement).select();
        }
      }
    }, 250);
  };

  // Carousel slider native refs
  const booksRecentRef = useRef<HTMLDivElement>(null);
  const ebooksRef = useRef<HTMLDivElement>(null);
  const electronicsRecentRef = useRef<HTMLDivElement>(null);
  const superstoreRecentRef = useRef<HTMLDivElement>(null);
  const lipsticksRef = useRef<HTMLDivElement>(null);
  const kidsRecentRef = useRef<HTMLDivElement>(null);
  const nipplesRef = useRef<HTMLDivElement>(null);
  const testimonyRef = useRef<HTMLDivElement>(null);

  // Scroll helpers
  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const offset = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // State mutators for Cart items
  const handleAddToCart = (product: Product, customPrice?: number) => {
    setCartItems((prev) => {
      const prodToUse = customPrice ? { ...product, discountedPrice: customPrice, badgeText: 'COMBO' } : product;
      const existing = prev.find((item) => item.product.id === prodToUse.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === prodToUse.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product: prodToUse, quantity: 1 }];
    });
    // Triggers direct feedback notification in the browser panel
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // State mutators for Sidebar Filter Options
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedChildCategory(''); // Clear child category when changing parent
  };

  const handleSelectChildCategory = (childCategory: string) => {
    setSelectedChildCategory(childCategory);
  };

  const handleSelectSort = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleToggleBrandOrAuthor = (name: string) => {
    setSelectedBrandsOrAuthors((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleToggleInStock = () => {
    setInStockOnly((prev) => !prev);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedChildCategory('');
    setSelectedSort('best-seller');
    setSelectedBrandsOrAuthors([]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Handler for book reading previews modal
  const handleOpenBookPreview = (product: Product) => {
    setSelectedPreviewBook(product);
    setIsPreviewOpen(true);
  };

  // Filter & Sort Logic pipeline
  const getFilteredProducts = (baseProducts: Product[]) => {
    let result = [...baseProducts];

    // 1. Filter by category & child category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedChildCategory) {
      result = result.filter((p) => p.childCategory === selectedChildCategory);
    }

    // 2. Filter by Search Query (supports Bengali titles/brands)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.authorOrBrand.toLowerCase().includes(query) ||
          (p.originalTitle && p.originalTitle.toLowerCase().includes(query))
      );
    }

    // 3. Filter by Authors or Brands checkboxes
    if (selectedBrandsOrAuthors.length > 0) {
      result = result.filter((p) => selectedBrandsOrAuthors.includes(p.authorOrBrand));
    }

    // 4. In stock checker filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // 5. Apply Sort Options
    switch (selectedSort) {
      case 'price-low-high':
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'discount-high-low':
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'new-released':
        // Show lowest totalRatings first for new items
        result.sort((a, b) => a.totalRatings - b.totalRatings);
        break;
      case 'best-seller':
      default:
        // High ratings first
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  };

  const currentFilteredProducts = (() => {
    switch (activeTab) {
      case 'books':
        return getFilteredProducts(books);
      case 'electronics':
        return getFilteredProducts(electronics);
      case 'superstore':
        return getFilteredProducts(superstore);
      case 'fashion':
        return getFilteredProducts(fashion);
      case 'kids':
        return getFilteredProducts(kids);
      default:
        return getFilteredProducts(products);
    }
  })();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 font-sans antialiased text-slate-800">
      
      {/* Complete Header Panel */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          handleResetFilters();
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenTracker={handleOpenTracker}
        onSearch={(query) => setSearchQuery(query)}
        logoTitle={siteSettings.logoTitle}
        logoImageUrl={siteSettings.logoImageUrl}
        hotline={siteSettings.hotline}
        operatingHours={siteSettings.operatingHours}
        tabsConfig={tabsConfig}
        loggedInUser={loggedInUser}
        onLogout={async () => {
          await logOutFromFirebase();
          setLoggedInUser(null);
          setIsUserDashboardOpen(false);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        filteredProducts={currentFilteredProducts}
        onSelectProduct={setSelectedSingleProduct}
        wishlistCount={favoriteProductIds.length}
        onOpenWishlist={() => setActiveTab('wishlist')}
      />

      {/* Primary Orchestration Body Frame */}
      {selectedLandingPage ? (
        <SingleProductLandingPageView
          landingPage={selectedLandingPage}
          products={products}
          hotline={siteSettings.hotline}
          onBack={() => {
            setSelectedLandingPage(null);
            if (typeof window !== 'undefined' && window.location.hash.startsWith('#landing/')) {
              window.history.replaceState(null, '', window.location.pathname + '#offers');
            }
          }}
          onPlaceOrder={handlePlaceOrder}
          onSelectProduct={(p) => {
            setSelectedLandingPage(null);
            setSelectedSingleProduct(p);
          }}
          loggedInUser={loggedInUser}
        />
      ) : selectedSingleProduct ? (
        <ProductSinglePageView
          product={selectedSingleProduct}
          onClose={() => setSelectedSingleProduct(null)}
          onAddToCart={handleAddToCart}
          productsList={products}
          onSelectProduct={(p) => setSelectedSingleProduct(p)}
          onPreview={handleOpenBookPreview}
          onViewAuthor={(name) => setSelectedAuthorName(name)}
          loggedInUser={loggedInUser}
        />
      ) : activeTab === 'affiliate' ? (
        <AffiliateView
          onBackToHome={() => setActiveTab('home')}
          onOpenLogin={() => setIsLoginOpen(true)}
          language={language}
          products={products}
          affiliates={affiliates}
          withdrawals={affiliateWithdrawals}
          orders={orders}
          config={affiliateConfig}
          onRegisterAffiliate={handleRegisterAffiliate}
          onRequestWithdrawal={handleRequestAffiliateWithdrawal}
          loggedInUser={loggedInUser}
        />
      ) : activeTab === 'donation' ? (
        <BookDonationView
          onBackToHome={() => setActiveTab('home')}
        />
      ) : activeTab === 'wishlist' ? (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex-grow w-full pb-20 lg:pb-6">
          <WishlistView
            products={products}
            favoriteProductIds={favoriteProductIds}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onClose={() => setActiveTab('home')}
          />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex-grow w-full pb-20 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sider Filtering Widget Grid */}
          {activeTab !== 'home' && activeTab !== 'campaigns' && (
            <div className="hidden lg:block">
              <Sidebar
                activeTab={activeTab}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                selectedChildCategory={selectedChildCategory}
                onSelectChildCategory={handleSelectChildCategory}
                categoriesConfig={categoriesConfig}
                selectedSort={selectedSort}
                onSelectSort={handleSelectSort}
                selectedBrandsOrAuthors={selectedBrandsOrAuthors}
                onToggleBrandOrAuthor={handleToggleBrandOrAuthor}
                inStockOnly={inStockOnly}
                onToggleInStock={handleToggleInStock}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* Main Content Stage */}
          <div className="flex-1 space-y-7 min-w-0">
            
            {/* Dynamic Slider Banner matching Screenshot details */}
            {['books', 'electronics', 'superstore', 'fashion', 'kids', 'corporate'].includes(activeTab) && (
              <PromoCarousel
                tabId={activeTab}
                slides={bannersConfig[activeTab]}
                onActionClick={
                  activeTab === 'corporate' 
                    ? () => setIsQuoteOpen(true) 
                    : () => setActiveTab('offers')
                }
                onNavigateUrl={handleNavigateUrl}
                actionLabel={activeTab === 'corporate' ? 'Request A Quote' : 'অফারটি গ্রহণ করুন ⚡'}
                className="mb-4"
              />
            )}

            {/* Mobile Filter & Sort Button bar - positioned below the slider banner as per user feedback */}
            {activeTab !== 'home' && !['corporate', 'awards', 'offers', 'boimela', 'campaigns'].includes(activeTab) && (
              <div className="lg:hidden flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs mb-2">
                <span className="text-xs font-bold text-slate-700">
                  {selectedCategory ? `${selectedCategory} ${selectedChildCategory ? `> ${selectedChildCategory}` : ''}` : 'সকল আইটেম'}
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center space-x-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs py-1.5 px-3.5 rounded-md border border-sky-100 transition-all active:scale-95 cursor-pointer animate-pulse"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-500" />
                  <span>ফিল্টার ও সর্ট করুন</span>
                </button>
              </div>
            )}

            {/* TAB VIEW 0: HOME / LANDING SCREEN */}
            {activeTab === 'home' && (
              <HomeView
                onAddToCart={handleAddToCart}
                onPreview={handleOpenBookPreview}
                onSelectProduct={setSelectedSingleProduct}
                onNavigateToTab={(tabId, category) => {
                  setActiveTab(tabId);
                  if (category) {
                    handleSelectCategory(category);
                  }
                }}
                onNavigateUrl={handleNavigateUrl}
                onSearchAuthorOrPublisher={(name) => {
                  setSearchQuery(name);
                  setSelectedCategory('');
                  setSelectedChildCategory('');
                  setActiveTab('books');
                }}
                onViewAuthor={(name) => setSelectedAuthorName(name)}
                products={products}
                homeConfig={homeConfig}
                isLoadingHomeConfig={isLoadingHomeConfig}
                categoriesConfig={categoriesConfig}
                onAddToCompare={handleAddToCompare}
                compareItems={compareItems}
                isLoadingProducts={isLoadingProducts}
                favoriteProductIds={favoriteProductIds}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* TAB VIEW 1: BOOKS (নির্দিস্ট কেনাকাটা বইসমূহ) */}
            {activeTab === 'books' && (() => {
              const filteredBooks = getFilteredProducts(books);
              
              // Group books dynamically by their category field
              const booksByCategory: Record<string, Product[]> = {};
              filteredBooks.forEach((book) => {
                const cat = book.category || 'অন্যান্য বই';
                if (!booksByCategory[cat]) {
                  booksByCategory[cat] = [];
                }
                booksByCategory[cat].push(book);
              });

              const categoryKeys = Object.keys(booksByCategory);

              const getCategoryIcon = (categoryName: string) => {
                switch (categoryName) {
                  case 'ব্যবাসা, বিনিয়োগ ও আত্মউন্নয়ন':
                  case 'ব্যবাসা, বিনিয়োগ ও অর্থনীতি':
                    return <TrendingUp className="w-4 h-4 text-indigo-500" />;
                  case 'ইসলামি বই':
                    return <BookOpen className="w-4 h-4 text-emerald-500" />;
                  case 'উপנ্যাস':
                    return <Sparkles className="w-4 h-4 text-pink-500" />;
                  case 'বিজ্ঞান ও প্রযুক্তি':
                    return <Sparkles className="w-4 h-4 text-blue-500" />;
                  case 'ভাষা শিক্ষা ও ব্যাকরণ':
                    return <Languages className="w-4 h-4 text-amber-500" />;
                  case 'অনুবাদ':
                    return <Globe className="w-4 h-4 text-cyan-500" />;
                  default:
                    return <BookOpen className="w-4 h-4 text-sky-500" />;
                }
              };

              return (
                <div className="space-y-4 md:space-y-6">
                  {/* Book Trust Banners Strip (বই হাতে পেয়ে মূল্য পরিশোধ করুন | বই অর্ডার করার আগে একটু পড়ে দেখুন | অর্ডার করলেই থাকছে পয়েন্ট) - Hidden on Mobile */}
                  <div className="hidden md:block">
                    <BookTrustBanners
                      onNavigateToTab={(tab) => setActiveTab(tab)}
                      onPreviewSampleBook={() => {
                        const sampleBook = books[0];
                        if (sampleBook) {
                          handleOpenBookPreview(sampleBook);
                        }
                      }}
                    />
                  </div>

                  {/* Category Quick Jumps / Navigation capsule pills bar - Hidden on Mobile */}
                  {categoryKeys.length > 0 && (
                    <div className="hidden md:block bg-white border border-slate-150 rounded-xl p-4 shadow-2xs">
                      <div className="flex items-center space-x-2 mb-3">
                        <Grid className="w-4 h-4 text-sky-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">ক্যাটাগরি কুইক লিংক (Quick Navigation):</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryKeys.map((catKey, idx) => (
                          <button
                            key={catKey}
                            onClick={() => {
                              const el = document.getElementById(`cat-section-${idx}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-sans font-bold text-[11px] sm:text-xs py-1.5 px-3.5 rounded-full border border-slate-200 hover:border-sky-200 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            {getCategoryIcon(catKey)}
                            <span>{catKey}</span>
                            <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                              {booksByCategory[catKey].length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render category sections */}
                  {categoryKeys.length === 0 ? (
                    <div className="bg-white border border-slate-150 rounded-xl p-10 text-center shadow-2xs">
                      <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500 font-sans">
                        কোনো বই খুঁজে পাওয়া যায়নি! ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করুন।
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs cursor-pointer transition-colors"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  ) : (
                    categoryKeys.map((catKey, catIdx) => {
                      const catBooks = booksByCategory[catKey];
                      return (
                        <div 
                          key={catKey} 
                          id={`cat-section-${catIdx}`}
                          className="bg-white border border-slate-150/95 rounded-xl p-5 shadow-2xs space-y-4 hover:border-slate-300/80 transition-all duration-300 scroll-mt-20"
                        >
                          {/* Header section with icon and custom scroll controls */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                {getCategoryIcon(catKey)}
                              </div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center gap-2">
                                  {catKey}
                                </h2>
                                <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                                  Category Book Collections • {catBooks.length} Books
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <span className="bg-sky-50 text-sky-700 text-[10px] py-1 px-2 rounded font-extrabold uppercase font-mono tracking-wider border border-sky-100">
                                {catBooks.length} টি বই
                              </span>
                              
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-cat-${catIdx}`);
                                  if (el) el.scrollBy({ left: -350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="পিছনে যান"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-cat-${catIdx}`);
                                  if (el) el.scrollBy({ left: 350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="সামনে যান"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Beautiful book preview section - Scroll tray */}
                          <div
                            id={`scroll-cat-${catIdx}`}
                            className="flex overflow-x-auto gap-4 py-2 scroll-smooth scrollbar-none snap-x"
                          >
                            {catBooks.map((book) => (
                              <div key={book.id} className="w-[190px] shrink-0 snap-start">
                                <ProductCard
                                  product={book}
                                  onAddToCart={handleAddToCart}
                                  onPreview={handleOpenBookPreview}
                                  onSelectProduct={setSelectedSingleProduct}
                                  onAddToCompare={handleAddToCompare}
                                  isComparing={compareItems.some((item) => item.id === book.id)}
                                  isFavorite={favoriteProductIds.includes(book.id)}
                                  onToggleFavorite={handleToggleFavorite}
                                  onViewAuthor={(name) => setSelectedAuthorName(name)}
                                />
                              </div>
                            ))}
                          </div>
                          
                          {/* Banner Section inside category section: Dynamic Prominent Callout */}
                          <div className="bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-emerald-500/5 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 border border-slate-100 text-[11px] text-slate-600">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-bounce" />
                              <span className="font-semibold font-sans text-slate-700">
                                এই ক্যাটাগরির যেকোনো বইয়ের ভেতরের পাতা ফ্রিতে দেখতে 
                                <strong className="text-slate-900 font-extrabold ml-1">"পড়ে দেখুন"</strong> বাটনে ক্লিক করুন।
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenBookPreview(catBooks[0])}
                              className="bg-white hover:bg-sky-600 hover:text-white border border-sky-200 hover:border-sky-600 text-sky-700 font-extrabold text-[9px] py-1 px-3 rounded transition-all active:scale-95 cursor-pointer uppercase shadow-2xs font-mono"
                            >
                              Quick Sample Read 📖
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}

            {/* TAB VIEW 2: ELECTRONICS */}
            {activeTab === 'electronics' && (() => {
              const filteredElectronics = getFilteredProducts(electronics);
              
              // Group electronics dynamically by their category field
              const electronicsByCategory: Record<string, Product[]> = {};
              filteredElectronics.forEach((item) => {
                const cat = item.category || 'অন্যান্য ইলেকট্রনিক্স';
                if (!electronicsByCategory[cat]) {
                  electronicsByCategory[cat] = [];
                }
                electronicsByCategory[cat].push(item);
              });

              const categoryKeys = Object.keys(electronicsByCategory);

              const getCategoryIcon = (categoryName: string) => {
                switch (categoryName) {
                  case 'Sound System':
                    return <Headphones className="w-4 h-4 text-indigo-500" />;
                  case 'Computer & Accessories':
                    return <Laptop className="w-4 h-4 text-sky-500" />;
                  case 'Mobile & Accessories':
                    return <Smartphone className="w-4 h-4 text-emerald-500" />;
                  case 'Appliances':
                    return <Tv className="w-4 h-4 text-rose-500" />;
                  default:
                    return <Tv className="w-4 h-4 text-blue-500" />;
                }
              };

              return (
                <div className="space-y-6">
                  {/* Category Quick Jumps - Hidden on Mobile */}
                  {categoryKeys.length > 0 && (
                    <div className="hidden md:block bg-white border border-slate-150 rounded-xl p-4 shadow-2xs">
                      <div className="flex items-center space-x-2 mb-3">
                        <Grid className="w-4 h-4 text-sky-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">ইলেকট্রনিক্স ক্যাটাগরি (Quick Navigation):</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryKeys.map((catKey, idx) => (
                          <button
                            key={catKey}
                            onClick={() => {
                              const el = document.getElementById(`elec-section-${idx}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-sans font-bold text-[11px] sm:text-xs py-1.5 px-3.5 rounded-full border border-slate-200 hover:border-sky-200 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            {getCategoryIcon(catKey)}
                            <span>{catKey}</span>
                            <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                              {electronicsByCategory[catKey].length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render category sections */}
                  {categoryKeys.length === 0 ? (
                    <div className="bg-white border border-slate-150 rounded-xl p-10 text-center shadow-2xs">
                      <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500 font-sans">
                        কোনো ইলেকট্রনিক্স প্রোডাক্ট খুঁজে পাওয়া যায়নি! ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করুন।
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs cursor-pointer transition-colors"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  ) : (
                    categoryKeys.map((catKey, catIdx) => {
                      const catProducts = electronicsByCategory[catKey];
                      return (
                        <div 
                          key={catKey} 
                          id={`elec-section-${catIdx}`}
                          className="bg-white border border-slate-150/95 rounded-xl p-5 shadow-2xs space-y-4 hover:border-slate-300/80 transition-all duration-300 scroll-mt-20"
                        >
                          {/* Header section with icon and custom scroll controls */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                {getCategoryIcon(catKey)}
                              </div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center gap-2">
                                  {catKey}
                                </h2>
                                <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                                  Electronics Collections • {catProducts.length} Products
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <span className="bg-sky-50 text-sky-700 text-[10px] py-1 px-2 rounded font-extrabold uppercase font-mono tracking-wider border border-sky-100">
                                {catProducts.length} টি প্রোডাক্ট
                              </span>
                              
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-elec-${catIdx}`);
                                  if (el) el.scrollBy({ left: -350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="পিছনে যান"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-elec-${catIdx}`);
                                  if (el) el.scrollBy({ left: 350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="সামনে যান"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Product preview section - Scroll tray */}
                          <div
                            id={`scroll-elec-${catIdx}`}
                            className="flex overflow-x-auto gap-4 py-2 scroll-smooth scrollbar-none snap-x"
                          >
                            {isLoadingProducts ? (
                              [...Array(5)].map((_, idx) => (
                                <div key={idx} className="w-[190px] shrink-0 snap-start">
                                  <ProductSkeleton />
                                </div>
                              ))
                            ) : (
                              catProducts.map((el) => (
                                <div key={el.id} className="w-[190px] shrink-0 snap-start">
                                  <ProductCard
                                    product={el}
                                    onAddToCart={handleAddToCart}
                                    onPreview={handleOpenBookPreview}
                                    onSelectProduct={setSelectedSingleProduct}
                                    onAddToCompare={handleAddToCompare}
                                    isComparing={compareItems.some((item) => item.id === el.id)}
                                    isFavorite={favoriteProductIds.includes(el.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                  />
                                </div>
                              ))
                            )}
                          </div>
                          
                          {/* Banner Section inside category section */}
                          <div className="bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-emerald-500/5 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 border border-slate-100 text-[11px] text-slate-600">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-bounce" />
                              <span className="font-semibold font-sans text-slate-700">
                                ১০০% অরিজিনাল ব্রান্ডের এই প্রোডাক্টটিতে পাচ্ছেন 
                                <strong className="text-slate-900 font-extrabold ml-1"> অফিসিয়াল ওয়ারেন্টি ও রিপ্লেসমেন্ট গ্যারান্টি!</strong>
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedSingleProduct(catProducts[0])}
                              className="bg-white hover:bg-sky-600 hover:text-white border border-sky-200 hover:border-sky-600 text-sky-700 font-extrabold text-[9px] py-1 px-3 rounded transition-all active:scale-95 cursor-pointer uppercase shadow-2xs font-mono"
                            >
                              View Details 🔍
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}

            {/* TAB VIEW 3: SUPERSTORE */}
            {activeTab === 'superstore' && (() => {
              const filteredSuperstore = getFilteredProducts(superstore);
              
              // Group superstore dynamically by their category field
              const superstoreByCategory: Record<string, Product[]> = {};
              filteredSuperstore.forEach((item) => {
                const cat = item.category || 'অন্যান্য সুপারস্টোর পণ্য';
                if (!superstoreByCategory[cat]) {
                  superstoreByCategory[cat] = [];
                }
                superstoreByCategory[cat].push(item);
              });

              const categoryKeys = Object.keys(superstoreByCategory);

              const getCategoryIcon = (categoryName: string) => {
                switch (categoryName) {
                  case 'Beauty & Personal Care':
                  case 'Cosmetics':
                    return <Sparkles className="w-4 h-4 text-pink-500" />;
                  case 'Food & Beverage':
                    return <ShoppingBag className="w-4 h-4 text-amber-500" />;
                  case 'Home Care':
                  case 'Groceries':
                  case 'Kitchen':
                    return <Home className="w-4 h-4 text-emerald-500" />;
                  default:
                    return <ShoppingBag className="w-4 h-4 text-teal-500" />;
                }
              };

              return (
                <div className="space-y-6">
                  {/* Category Quick Jumps - Hidden on Mobile */}
                  {categoryKeys.length > 0 && (
                    <div className="hidden md:block bg-white border border-slate-150 rounded-xl p-4 shadow-2xs">
                      <div className="flex items-center space-x-2 mb-3">
                        <Grid className="w-4 h-4 text-sky-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">সুপার স্টোর ক্যাটাগরি (Quick Navigation):</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryKeys.map((catKey, idx) => (
                          <button
                            key={catKey}
                            onClick={() => {
                              const el = document.getElementById(`super-section-${idx}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-sans font-bold text-[11px] sm:text-xs py-1.5 px-3.5 rounded-full border border-slate-200 hover:border-sky-200 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            {getCategoryIcon(catKey)}
                            <span>{catKey}</span>
                            <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                              {superstoreByCategory[catKey].length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render category sections */}
                  {categoryKeys.length === 0 ? (
                    <div className="bg-white border border-slate-150 rounded-xl p-10 text-center shadow-2xs">
                      <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500 font-sans">
                        কোনো সুপার স্টোর প্রোডাক্ট খুঁজে পাওয়া যায়নি! ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করুন।
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs cursor-pointer transition-colors"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  ) : (
                    categoryKeys.map((catKey, catIdx) => {
                      const catProducts = superstoreByCategory[catKey];
                      return (
                        <div 
                          key={catKey} 
                          id={`super-section-${catIdx}`}
                          className="bg-white border border-slate-150/95 rounded-xl p-5 shadow-2xs space-y-4 hover:border-slate-300/80 transition-all duration-300 scroll-mt-20"
                        >
                          {/* Header section with icon and custom scroll controls */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                {getCategoryIcon(catKey)}
                              </div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center gap-2">
                                  {catKey}
                                </h2>
                                <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                                  Superstore Products • {catProducts.length} Items
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <span className="bg-amber-50 text-amber-800 text-[10px] py-1 px-2 rounded font-extrabold uppercase font-mono tracking-wider border border-amber-100">
                                {catProducts.length} টি পণ্য
                              </span>
                              
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-super-${catIdx}`);
                                  if (el) el.scrollBy({ left: -350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="পিছনে যান"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-super-${catIdx}`);
                                  if (el) el.scrollBy({ left: 350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="সামনে যান"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Product preview section - Scroll tray */}
                          <div
                            id={`scroll-super-${catIdx}`}
                            className="flex overflow-x-auto gap-4 py-2 scroll-smooth scrollbar-none snap-x"
                          >
                            {isLoadingProducts ? (
                              [...Array(5)].map((_, idx) => (
                                <div key={idx} className="w-[190px] shrink-0 snap-start">
                                  <ProductSkeleton />
                                </div>
                              ))
                            ) : (
                              catProducts.map((ss) => (
                                <div key={ss.id} className="w-[190px] shrink-0 snap-start">
                                  <ProductCard
                                    product={ss}
                                    onAddToCart={handleAddToCart}
                                    onPreview={handleOpenBookPreview}
                                    onSelectProduct={setSelectedSingleProduct}
                                    onAddToCompare={handleAddToCompare}
                                    isComparing={compareItems.some((item) => item.id === ss.id)}
                                    isFavorite={favoriteProductIds.includes(ss.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                  />
                                </div>
                              ))
                            )}
                          </div>
                          
                          {/* Banner Section inside category section */}
                          <div className="bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-amber-500/5 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 border border-slate-100 text-[11px] text-slate-600">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0 animate-bounce" />
                              <span className="font-semibold font-sans text-slate-700">
                                ১০০% জেনুইন কোয়ালিটির এই প্রিমিয়াম প্রোডাক্টগুলো সরাসরি ইমপোর্ট করা এবং 
                                <strong className="text-slate-900 font-extrabold ml-1"> বেস্ট প্রাইস গ্যারান্টিযুক্ত!</strong>
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedSingleProduct(catProducts[0])}
                              className="bg-white hover:bg-pink-600 hover:text-white border border-pink-200 hover:border-pink-600 text-pink-700 font-extrabold text-[9px] py-1 px-3 rounded transition-all active:scale-95 cursor-pointer uppercase shadow-2xs font-mono"
                            >
                              Check Product 🛍️
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}

            {/* TAB VIEW 3.5: FASHION (ফ্যাশন: জামা, প্যান্ট, জুতা ও এক্সেসরিজ) */}
            {activeTab === 'fashion' && (() => {
              const filteredFashion = getFilteredProducts(fashion);
              
              // Group fashion products dynamically by their category field
              const fashionByCategory: Record<string, Product[]> = {};
              filteredFashion.forEach((item) => {
                const cat = item.category || 'অন্যান্য ফ্যাশন পণ্য';
                if (!fashionByCategory[cat]) {
                  fashionByCategory[cat] = [];
                }
                fashionByCategory[cat].push(item);
              });

              const categoryKeys = Object.keys(fashionByCategory);

              const getCategoryIcon = (categoryName: string) => {
                if (categoryName.includes('জুতা') || categoryName.includes('Shoe')) {
                  return <Award className="w-4 h-4 text-amber-500" />;
                }
                if (categoryName.includes('প্যান্ট') || categoryName.includes('Pant')) {
                  return <ShoppingBag className="w-4 h-4 text-indigo-500" />;
                }
                if (categoryName.includes('এক্সেসরিজ') || categoryName.includes('Watch')) {
                  return <Sparkles className="w-4 h-4 text-rose-500" />;
                }
                return <Sparkles className="w-4 h-4 text-emerald-500" />;
              };

              return (
                <div className="space-y-6">
                  {/* Category Quick Jumps - Hidden on Mobile */}
                  {categoryKeys.length > 0 && (
                    <div className="hidden md:block bg-white border border-slate-150 rounded-xl p-4 shadow-2xs">
                      <div className="flex items-center space-x-2 mb-3">
                        <Grid className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">ফ্যাশন ক্যাটাগরি (জামা, প্যান্ট, জুতা ও এক্সেসরিজ):</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryKeys.map((catKey, idx) => (
                          <button
                            key={catKey}
                            onClick={() => {
                              const el = document.getElementById(`fashion-section-${idx}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-sans font-bold text-[11px] sm:text-xs py-1.5 px-3.5 rounded-full border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            {getCategoryIcon(catKey)}
                            <span>{catKey}</span>
                            <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                              {fashionByCategory[catKey].length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render category sections */}
                  {categoryKeys.length === 0 ? (
                    <div className="bg-white border border-slate-150 rounded-xl p-10 text-center shadow-2xs">
                      <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500 font-sans">
                        কোনো ফ্যাশন প্রোডাক্ট খুঁজে পাওয়া যায়নি! ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করুন।
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs cursor-pointer transition-colors"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  ) : (
                    categoryKeys.map((catKey, catIdx) => {
                      const catProducts = fashionByCategory[catKey];
                      return (
                        <div 
                          key={catKey} 
                          id={`fashion-section-${catIdx}`}
                          className="bg-white border border-slate-150/95 rounded-xl p-5 shadow-2xs space-y-4 hover:border-slate-300/80 transition-all duration-300 scroll-mt-20"
                        >
                          {/* Header section with icon and custom scroll controls */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                {getCategoryIcon(catKey)}
                              </div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center gap-2">
                                  {catKey}
                                </h2>
                                <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                                  Fashion & Apparel • {catProducts.length} Items
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <span className="bg-emerald-50 text-emerald-800 text-[10px] py-1 px-2 rounded font-extrabold uppercase font-mono tracking-wider border border-emerald-100">
                                {catProducts.length} টি পণ্য
                              </span>
                              
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-fashion-${catIdx}`);
                                  if (el) el.scrollBy({ left: -350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-emerald-500 rounded-lg bg-white text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                                title="পিছনে যান"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-fashion-${catIdx}`);
                                  if (el) el.scrollBy({ left: 350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-emerald-500 rounded-lg bg-white text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                                title="সামনে যান"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Product preview section - Scroll tray */}
                          <div
                            id={`scroll-fashion-${catIdx}`}
                            className="flex overflow-x-auto gap-4 py-2 scroll-smooth scrollbar-none snap-x"
                          >
                            {isLoadingProducts ? (
                              [...Array(5)].map((_, idx) => (
                                <div key={idx} className="w-[190px] shrink-0 snap-start">
                                  <ProductSkeleton />
                                </div>
                              ))
                            ) : (
                              catProducts.map((fp) => (
                                <div key={fp.id} className="w-[190px] shrink-0 snap-start">
                                  <ProductCard
                                    product={fp}
                                    onAddToCart={handleAddToCart}
                                    onPreview={handleOpenBookPreview}
                                    onSelectProduct={setSelectedSingleProduct}
                                    onAddToCompare={handleAddToCompare}
                                    isComparing={compareItems.some((item) => item.id === fp.id)}
                                    isFavorite={favoriteProductIds.includes(fp.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                  />
                                </div>
                              ))
                            )}
                          </div>
                          
                          {/* Banner Section inside category section */}
                          <div className="bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-sky-500/5 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 border border-slate-100 text-[11px] text-slate-600">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 animate-bounce" />
                              <span className="font-semibold font-sans text-slate-700">
                                ১০০% এক্সপোর্ট কোয়ালিটি ফেব্রিক ও নিখুঁত মেজারমেন্ট গ্যারান্টি—
                                <strong className="text-slate-900 font-extrabold ml-1">পছন্দের সাইজ ও কালার সিলেক্ট করে অর্ডার করুন!</strong>
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedSingleProduct(catProducts[0])}
                              className="bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 text-emerald-700 font-extrabold text-[9px] py-1 px-3 rounded transition-all active:scale-95 cursor-pointer uppercase shadow-2xs font-mono"
                            >
                              Size & Color 👕
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}

            {/* TAB VIEW 4: KIDS ZONE */}
            {activeTab === 'kids' && (() => {
              const filteredKids = getFilteredProducts(kids);
              
              // Group kids dynamically by their category field
              const kidsByCategory: Record<string, Product[]> = {};
              filteredKids.forEach((item) => {
                const cat = item.category || 'অন্যান্য কিডস প্রোডাক্ট';
                if (!kidsByCategory[cat]) {
                  kidsByCategory[cat] = [];
                }
                kidsByCategory[cat].push(item);
              });

              const categoryKeys = Object.keys(kidsByCategory);

              const getCategoryIcon = (categoryName: string) => {
                switch (categoryName) {
                  case 'Kids Toys':
                    return <Gift className="w-4 h-4 text-purple-500" />;
                  case 'Baby Care':
                    return <Baby className="w-4 h-4 text-sky-500" />;
                  case 'School & Stationery':
                    return <Smile className="w-4 h-4 text-amber-500" />;
                  case 'Feeders & Nipples':
                  case 'Bottle Nipples':
                    return <Smile className="w-4 h-4 text-pink-500" />;
                  default:
                    return <Baby className="w-4 h-4 text-indigo-500" />;
                }
              };

              return (
                <div className="space-y-6">
                  {/* Category Quick Jumps - Hidden on Mobile */}
                  {categoryKeys.length > 0 && (
                    <div className="hidden md:block bg-white border border-slate-150 rounded-xl p-4 shadow-2xs">
                      <div className="flex items-center space-x-2 mb-3">
                        <Grid className="w-4 h-4 text-sky-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">কিডস জোন ক্যাটাগরি (Quick Navigation):</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryKeys.map((catKey, idx) => (
                          <button
                            key={catKey}
                            onClick={() => {
                              const el = document.getElementById(`kids-section-${idx}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className="bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-sans font-bold text-[11px] sm:text-xs py-1.5 px-3.5 rounded-full border border-slate-200 hover:border-sky-200 transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            {getCategoryIcon(catKey)}
                            <span>{catKey}</span>
                            <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                              {kidsByCategory[catKey].length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render category sections */}
                  {categoryKeys.length === 0 ? (
                    <div className="bg-white border border-slate-150 rounded-xl p-10 text-center shadow-2xs">
                      <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-500 font-sans">
                        কোনো কিডস জোন প্রোডাক্ট খুঁজে পাওয়া যায়নি! ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করুন।
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs cursor-pointer transition-colors"
                      >
                        ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  ) : (
                    categoryKeys.map((catKey, catIdx) => {
                      const catProducts = kidsByCategory[catKey];
                      return (
                        <div 
                          key={catKey} 
                          id={`kids-section-${catIdx}`}
                          className="bg-white border border-slate-150/95 rounded-xl p-5 shadow-2xs space-y-4 hover:border-slate-300/80 transition-all duration-300 scroll-mt-20"
                        >
                          {/* Header section with icon and custom scroll controls */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                {getCategoryIcon(catKey)}
                              </div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans flex items-center gap-2">
                                  {catKey}
                                </h2>
                                <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                                  Kids Zone Products • {catProducts.length} Items
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <span className="bg-purple-50 text-purple-800 text-[10px] py-1 px-2 rounded font-extrabold uppercase font-mono tracking-wider border border-purple-100">
                                {catProducts.length} টি পণ্য
                              </span>
                              
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-kids-${catIdx}`);
                                  if (el) el.scrollBy({ left: -350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="পিছনে যান"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`scroll-kids-${catIdx}`);
                                  if (el) el.scrollBy({ left: 350, behavior: 'smooth' });
                                }}
                                className="p-1 border border-slate-200 hover:border-sky-500 rounded-lg bg-white text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                                title="সামনে যান"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Product preview section - Scroll tray */}
                          <div
                            id={`scroll-kids-${catIdx}`}
                            className="flex overflow-x-auto gap-4 py-2 scroll-smooth scrollbar-none snap-x"
                          >
                            {isLoadingProducts ? (
                              [...Array(5)].map((_, idx) => (
                                <div key={idx} className="w-[190px] shrink-0 snap-start">
                                  <ProductSkeleton />
                                </div>
                              ))
                            ) : (
                              catProducts.map((k) => (
                                <div key={k.id} className="w-[190px] shrink-0 snap-start">
                                  <ProductCard
                                    product={k}
                                    onAddToCart={handleAddToCart}
                                    onPreview={handleOpenBookPreview}
                                    onSelectProduct={setSelectedSingleProduct}
                                    onAddToCompare={handleAddToCompare}
                                    isComparing={compareItems.some((item) => item.id === k.id)}
                                    isFavorite={favoriteProductIds.includes(k.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                  />
                                </div>
                              ))
                            )}
                          </div>
                          
                          {/* Banner Section inside category section */}
                          <div className="bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-pink-500/5 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 border border-slate-100 text-[11px] text-slate-600">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-bounce" />
                              <span className="font-semibold font-sans text-slate-700">
                                আপনার প্রিয় সোনামণির সম্পূর্ণ ১০০% নিরাপদ ও নন-টক্সিক সার্টিফাইড পণ্য 
                                <strong className="text-slate-900 font-extrabold ml-1"> কিডস স্পেশাল ডিসকাউন্টে!</strong>
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedSingleProduct(catProducts[0])}
                              className="bg-white hover:bg-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 text-purple-700 font-extrabold text-[9px] py-1 px-3 rounded transition-all active:scale-95 cursor-pointer uppercase shadow-2xs font-mono"
                            >
                              Explore Items 🧒
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })()}

            {/* TAB VIEW 5: CORPORATE / INSTITUTIONAL REQUEST (প্রাতিষ্ঠানিক অর্ডার) */}
            {activeTab === 'corporate' && (
              <div className="space-y-8 animate-scale-up">
                
                {/* Sleek corporate contact information banner */}
                <div className="bg-sky-50 border border-sky-150 rounded-xl p-4 sm:p-6 text-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center space-x-3 text-left">
                    <span className="text-2xl">📞</span>
                    <div className="text-xs">
                      <strong className="block text-slate-800 text-sm font-sans">হটলাইন ও করপোরেট সেলস ইমেইল</strong>
                      <span className="text-slate-500 font-mono">sales@rokomari.com (9.00AM - 7.00PM) | Call: 01708166239</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm py-2.5 px-6 rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 font-sans"
                  >
                    কোটেশন রিকোয়েস্ট করুন 📄
                  </button>
                </div>

                {/* "Why Choose Us" row widgets */}
                <div className="space-y-4">
                  <h2 className="text-md sm:text-lg font-black text-slate-800 text-center font-sans">Why Choose Us</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
                    
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3 font-sans">
                      <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto text-xl">📚</div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">Largest Book Collection</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        &quot;Reading book is a wonderful experience and there&apos;s an explorer in all of us who shouldn&apos;t be lost at any cost. We offer splendid discounts on bulk purchases.&quot;
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3 font-sans">
                      <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-xl">🏷️</div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">Best Price Guaranteed</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        &quot;Reading book is a wonderful experience and there&apos;s an explorer in all of us who shouldn&apos;t be lost. We specialize in customizable special budget constraints.&quot;
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3 font-sans">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">⚡</div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">On Time Delivery</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        On Time 24/7 Delivery is available to meet your unique on-demand scheduled bulk needs securely with damage protective packaging guarantees.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Testimonial slider */}
                <div className="space-y-4 font-sans bg-amber-50/20 border border-amber-200/50 rounded-xl p-5 relative">
                  <h2 className="text-xs font-black text-slate-500 tracking-wider font-mono">OUR CLIENTS REVIEWS</h2>
                  <div ref={testimonyRef} className="flex gap-4 overflow-x-auto scrollbar-none snap-x">
                    {TESTIMONIALS.map((t) => (
                      <div key={t.id} className="min-w-full bg-white rounded-lg border border-slate-150 p-4 shrink-0 snap-start flex space-x-3.5 items-start">
                        <img src={t.avatarUrl} alt={t.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border-2 border-slate-100 object-cover flex-shrink-0" />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <p className="text-[11.5px] italic text-slate-600 leading-relaxed font-sans">&quot;{t.content}&quot;</p>
                          <div className="text-[10px] sm:text-xs">
                            <strong className="text-slate-800 block">{t.name}</strong>
                            <span className="text-slate-400 block">{t.company}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB VIEW 6: WINNERS / BESTSELLER AWARDS IMAGE DISPLAY */}
            {activeTab === 'awards' && (
              <div className="space-y-6 animate-scale-up font-sans">
                <div className="text-center p-6 bg-white border border-gray-200 rounded-xl shadow-xs space-y-3">
                  <div className="inline-flex py-1 px-3 bg-amber-150 text-amber-950 text-[10px] font-black uppercase rounded-full">TOPSELL AWARDS 2026</div>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-800">অমর একুশে বইমেলা টপসেল বেস্টসেলার অ্যাওয়ার্ড</h1>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl mx-auto">
                    বইয়ের পাতার কারিগরদের সম্মানিত করার এ এক অনন্য টপসেল আয়োজন। প্রতি বছর মেলা শেষে বিক্রি হওয়া জনপ্রিয় বই, গুণী লেখক এবং বিশিষ্ট প্রকাশনীদের এই সম্মানে ভূষিত করা হয়।
                  </p>
                </div>

                {/* Mock award winners photo banner grid layout */}
                <div className="bg-sky-850 p-4 rounded-xl text-white relative flex flex-col items-center justify-center border-2 border-indigo-900/60 shadow-lg min-h-[220px]">
                  <div className="absolute inset-0 bg-radial-gradient-net opacity-10"></div>
                  <div className="text-center space-y-3 max-w-md relative z-10 p-4">
                    <span className="text-3xl">🏆</span>
                    <h2 className="text-xs sm:text-sm font-black text-amber-300">বেস্টসেলার অ্যাওয়ার্ড ২০২৪ এবং ২০২৫ সংকলন</h2>
                    <p className="text-[10px] sm:text-xs text-slate-200 leading-relaxed">
                      হুমায়ূন আহমেদ, ডা. শামসুল আরেফীন ও ড. জাকির নায়েক সহ শতাধিক লেখক এবং তাম্রলিপি, ঐতিহ্য প্রকাশনীদের পুরস্কার হস্তান্তরের চিত্র ও তালিকা এখানে প্রদর্শিত।
                    </p>
                    <button onClick={() => setIsQuoteOpen(true)} className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs py-1.5 px-4 rounded transition-colors cursor-pointer self-center">
                      পুরস্কারপ্রাপ্ত বই ও ক্যাটাগরি দেখুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 7: TODAY'S OFFERS (আজকের অফার!) */}
            {activeTab === 'offers' && (
              <div className="space-y-6 animate-scale-up font-sans">
                {/* Dynamic Slider Carousel for Offers Tab */}
                <PromoCarousel
                  tabId="offers"
                  slides={bannersConfig?.offers || BANNERS.offers}
                  onActionClick={() => handleSelectCategory('Appliances')}
                  onNavigateUrl={handleNavigateUrl}
                  actionLabel="অফারগুলো লুফে নিন"
                />

                {/* DEDICATED SECTION: SINGLE PRODUCT LANDING PAGE MEGA DEALS */}
                {landingPages.filter(p => p.status === 'active').length > 0 && (
                  <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-lg space-y-5 border border-purple-800/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 border-b border-purple-800/60 pb-3">
                      <div>
                        <div className="inline-flex items-center space-x-1.5 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                          <span>🔥 মেগা হট ডিল</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <span>এক্সক্লুসিভ সিঙ্গেল প্রোডাক্ট অফার ও ল্যান্ডিং পেজ</span>
                        </h3>
                        <p className="text-xs text-purple-200">
                          এক ক্লিকে বিশেষ মূল্যে সরাসরি অর্ডার করুন — সীমিত সময়ের জন্য বিশেষ ছাড়!
                        </p>
                      </div>

                      <span className="text-xs font-bold text-amber-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-700/50">
                        {landingPages.filter(p => p.status === 'active').length} টি বিশেষ অফার লাইভ
                      </span>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {landingPages.filter(p => p.status === 'active').map(page => {
                        const prod = products.find(p => p.id === page.productId);
                        const img = page.bannerImageUrl || prod?.imageUrl || '';
                        return (
                          <div
                            key={page.id}
                            onClick={() => {
                              setSelectedLandingPage(page);
                              if (typeof window !== 'undefined') {
                                window.location.hash = `#landing/${page.slug}`;
                              }
                              window.scrollTo({ top: 0, behavior: 'instant' as any });
                            }}
                            className="bg-white text-slate-900 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-4 items-center group cursor-pointer border-2 border-transparent hover:border-amber-400 active:scale-[0.99]"
                          >
                            {/* Product Thumb */}
                            <div className="relative w-full sm:w-36 h-40 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                              <img
                                src={img}
                                alt={page.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {page.discountPercent > 0 && (
                                <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                                  {page.discountPercent}% OFF
                                </span>
                              )}
                              {page.deliveryFee === 0 && (
                                <span className="absolute bottom-2 left-2 bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs">
                                  ফ্রি ডেলিভারি
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-2 text-left w-full">
                              <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-purple-200">
                                {page.badgeText || 'সীমিত সময়ের ধামাকা অফার'}
                              </span>

                              <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                                {page.title}
                              </h4>

                              {page.subtitle && (
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {page.subtitle}
                                </p>
                              )}

                              <div className="flex items-baseline space-x-2 pt-1">
                                <span className="text-xl font-black text-emerald-700">
                                  ৳ {page.offerPrice}
                                </span>
                                {page.originalPrice > page.offerPrice && (
                                  <span className="text-xs text-slate-400 line-through font-bold">
                                    ৳ {page.originalPrice}
                                  </span>
                                )}
                              </div>

                              <button
                                className="w-full mt-2 py-2 bg-gradient-to-r from-amber-500 to-amber-400 group-hover:from-amber-600 group-hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1"
                              >
                                <span>অফার পেজে যান ও দ্রুত অর্ডার করুন</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Discount calculator tool widget for fun */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3 font-sans">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">🔥</span>
                    <h3 className="text-xs sm:text-sm font-black text-slate-800">আজকের বিশেষ টপসেল অফার ক্যালকুলেটর</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded flex flex-col justify-between items-center text-center">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">কুপন: TOPSELL10</span>
                      <strong className="text-xs text-sky-600 block">১০% সরাসরি ছাড়!</strong>
                      <span className="text-[9px] text-slate-400 mt-1 block">সব ধরণের বইয়ের উপর প্রযোজ্য</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded flex flex-col justify-between items-center text-center">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">কুপন: EID2026</span>
                      <strong className="text-xs text-emerald-600 block">২০% ঈদ উৎসব ছাড়!</strong>
                      <span className="text-[9px] text-slate-400 mt-1 block">পেমেন্ট গেটওয়েতে ২০% ক্যাশব্যাক</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded flex flex-col justify-between items-center text-center">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">কুপন: SUMMER30</span>
                      <strong className="text-xs text-amber-600 block">৩০% চরম সামার অফার!</strong>
                      <span className="text-[9px] text-slate-400 mt-1 block">ইলেকট্রনিক্স ও রিচার্জ ফ্যানে প্রযোজ্য</span>
                    </div>
                  </div>
                </div>

                {/* All Combo Offers & Campaigns */}
                <CampaignsView
                  campaigns={campaigns}
                  products={products}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={setSelectedSingleProduct}
                />
              </div>
            )}

            {/* TAB VIEW 8: BOIMELA (বইমেলা ২০২৬) */}
            {activeTab === 'boimela' && (
              <BoimelaView
                products={products}
                boimelaConfig={boimelaConfig}
                onSelectProduct={setSelectedSingleProduct}
                onAddToCart={handleAddToCart}
                onPreviewBook={handleOpenBookPreview}
                onSelectCategory={(cat) => handleSelectCategory(cat)}
                onSelectAuthor={(author) => {
                  setSelectedAuthorName(author);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectPublisher={(pub) => {
                  handleSelectCategory(pub);
                }}
              />
            )}

            {/* TAB VIEW 9: CAMPAIGNS & COMBO OFFERS (কম্বো অফার 🎁) */}
            {activeTab === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                products={products}
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedSingleProduct}
              />
            )}

          </div>

        </div>
      </main>
      )}

      {/* Reusable Client-facing Modals state managers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        loggedInUser={loggedInUser}
        coupons={coupons}
      />

      {isPreviewOpen && (
        <BookPreviewModal
          product={selectedPreviewBook}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedPreviewBook(null);
          }}
          onAddToCart={handleAddToCart}
          onViewAuthor={(name) => setSelectedAuthorName(name)}
        />
      )}

      <RequestQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        onSubmitQuote={handleClientSubmitQuote}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        loggedInUser={loggedInUser}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={async (user) => {
          setLoggedInUser(user);
          if (user.isAdmin) {
            setIsAdminOpen(true);
          } else {
            setIsUserDashboardOpen(true);
          }
          // Save or update user profile in Firestore /users/{userId}
          const userUid = user.uid || user.emailOrPhone.replace(/[^a-zA-Z0-9_\-]/g, '_');
          try {
            await setDoc(doc(db, 'users', userUid), {
              uid: userUid,
              name: user.name,
              email: user.emailOrPhone,
              role: user.isAdmin ? 'admin' : 'customer',
              photoURL: user.photoURL || null,
              phoneNumber: user.phoneNumber || null,
              createdAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.error('Failed to save user profile:', e);
          }
        }}
      />

      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        loggedInUser={loggedInUser}
        orders={orders}
        quotes={quotes}
        onLogout={async () => {
          await logOutFromFirebase();
          setLoggedInUser(null);
          setIsUserDashboardOpen(false);
        }}
        favoriteProductIds={favoriteProductIds}
        products={products}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onUpdateAddress={handleUpdateUserAddress}
      />

      {isFreeShippingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="relative bg-[#ecf3fe] rounded-2xl w-full max-w-[340px] overflow-hidden shadow-2xl animate-scale-up border border-sky-100 flex flex-col items-center text-center p-6 space-y-4 select-none">
            {/* Close Button */}
            <button 
              onClick={() => setIsFreeShippingModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 bg-white/80 border border-slate-200 rounded-full hover:bg-white transition-all cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>

            {/* APP FIRST ORDER Badges & Header */}
            <div className="space-y-1.5 pt-2">
              <span className="inline-block bg-[#0092e0] text-white font-sans font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs animate-pulse">
                {homeConfig?.appPromo?.badge || 'APP FIRST ORDER'}
              </span>
              <h3 className="text-sm sm:text-base font-black text-sky-950 font-sans tracking-tight leading-tight">
                {homeConfig?.appPromo?.title || 'অ্যাপে ১ম অর্ডারে ফ্রি শিপিং!'}
              </h3>
              
              {/* Interactive Copyable Promo Code */}
              <div className="inline-flex items-center space-x-1.5 bg-sky-100/85 hover:bg-sky-200/90 border border-sky-200/50 rounded-full px-3 py-1 transition-all active:scale-95 cursor-pointer"
                onClick={() => {
                  const promo = (homeConfig?.appPromo?.promoCode || 'PROMO: APP1ST').replace('PROMO: ', '').trim();
                  navigator.clipboard.writeText(promo);
                  setIsCouponCopied(true);
                  setTimeout(() => setIsCouponCopied(false), 2000);
                }}
              >
                <span className="text-[10px] text-sky-800 font-extrabold font-mono tracking-wider uppercase">
                  {homeConfig?.appPromo?.promoCode || 'PROMO: APP1ST'}
                </span>
                <span className="text-[9px] text-sky-600 font-bold bg-white px-1.5 py-0.5 rounded-full font-sans">
                  {isCouponCopied ? 'কপি হয়েছে' : 'কপি করুন'}
                </span>
              </div>
            </div>

            {/* QR Code Graphic matching Screenshot */}
            <div className="w-40 h-40 bg-white border border-slate-200/75 rounded-2xl p-2.5 flex flex-col justify-center items-center shadow-md relative overflow-hidden group">
              {homeConfig?.appPromo?.qrImageUrl ? (
                <img 
                  src={homeConfig.appPromo.qrImageUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain rounded-lg transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="bg-slate-50 p-0.5 rounded-xl">
                  {/* High fidelity beautiful generated QR code SVG with amber highlights */}
                  <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" rx="8" fill="#FFFFFF" />
                    <rect x="10" y="10" width="22" height="22" rx="4" fill="#0F172A" />
                    <rect x="14" y="14" width="14" height="14" rx="2" fill="#FFFFFF" />
                    <rect x="17" y="17" width="8" height="8" rx="1.5" fill="#F59E0B" />
                    <rect x="68" y="10" width="22" height="22" rx="4" fill="#0F172A" />
                    <rect x="72" y="14" width="14" height="14" rx="2" fill="#FFFFFF" />
                    <rect x="75" y="17" width="8" height="8" rx="1.5" fill="#F59E0B" />
                    <rect x="10" y="68" width="22" height="22" rx="4" fill="#0F172A" />
                    <rect x="14" y="72" width="14" height="14" rx="2" fill="#FFFFFF" />
                    <rect x="17" y="75" width="8" height="8" rx="1.5" fill="#F59E0B" />
                    <rect x="70" y="70" width="10" height="10" rx="2" fill="#0F172A" />
                    <rect x="73" y="73" width="4" height="4" rx="1" fill="#FFFFFF" />
                    <rect x="74" y="74" width="2" height="2" fill="#0F172A" />
                    <rect x="36" y="10" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="44" y="10" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="56" y="10" width="4" height="4" rx="1" fill="#F59E0B" />
                    <rect x="62" y="10" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="36" y="16" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="52" y="16" width="4" height="8" rx="1" fill="#0F172A" />
                    <rect x="60" y="16" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="40" y="24" width="4" height="4" rx="1" fill="#F59E0B" />
                    <rect x="48" y="24" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="60" y="24" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="10" y="36" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="22" y="36" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="30" y="36" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="46" y="36" width="4" height="12" rx="1" fill="#0F172A" />
                    <rect x="54" y="36" width="16" height="4" rx="1" fill="#0F172A" />
                    <rect x="74" y="36" width="4" height="8" rx="1" fill="#0F172A" />
                    <rect x="82" y="36" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="10" y="44" width="4" height="8" rx="1" fill="#0F172A" />
                    <rect x="18" y="44" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="30" y="44" width="4" height="4" rx="1" fill="#F59E0B" />
                    <rect x="38" y="44" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="54" y="44" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="66" y="44" width="4" height="4" rx="1" fill="#F59E0B" />
                    <rect x="74" y="44" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="86" y="44" width="4" height="12" rx="1" fill="#0F172A" />
                    <rect x="14" y="54" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="30" y="54" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="42" y="54" width="4" height="8" rx="1" fill="#0F172A" />
                    <rect x="50" y="54" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="58" y="54" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="74" y="54" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="82" y="54" width="4" height="4" rx="1" fill="#F59E0B" />
                    <rect x="36" y="62" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="44" y="62" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="60" y="62" width="4" height="8" rx="1" fill="#0F172A" />
                    <rect x="68" y="62" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="80" y="62" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="88" y="62" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="36" y="70" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="48" y="70" width="4" height="4" rx="1" fill="#F59E0B" />
                    <rect x="56" y="70" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="84" y="70" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="36" y="78" width="4" height="8" rx="1" fill="#0F172A" />
                    <rect x="44" y="78" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="60" y="78" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="84" y="78" width="4" height="8" rx="1" fill="#F59E0B" />
                    <rect x="90" y="78" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="40" y="86" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="52" y="86" width="4" height="4" rx="1" fill="#0F172A" />
                    <rect x="60" y="86" width="12" height="4" rx="1" fill="#0F172A" />
                    <rect x="76" y="86" width="8" height="4" rx="1" fill="#0F172A" />
                    <rect x="42" y="42" width="16" height="16" rx="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                    <path d="M47 50C47 48.3431 48.3431 47 50 47C51.6569 47 53 48.3431 53 50V53H47V50Z" fill="#FFFFFF" />
                    <rect x="46" y="51" width="8" height="5" rx="1" fill="#1E293B" />
                  </svg>
                </div>
              )}
            </div>

            {/* App Store and Google Play button links */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-center space-x-1.5">
                <a
                  href={homeConfig?.appPromo?.appStoreUrl || 'https://www.apple.com/app-store/'}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center space-x-1 cursor-pointer hover:bg-slate-850 hover:text-white transition-colors"
                >
                  <span></span> <span className="font-mono">App Store</span>
                </a>
                <a
                  href={homeConfig?.appPromo?.googlePlayUrl || 'https://play.google.com/store'}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center space-x-1 cursor-pointer hover:bg-slate-850 hover:text-white transition-colors"
                >
                  <span>🤖</span> <span className="font-mono">Google Play</span>
                </a>
              </div>
              
              {/* Operating System Support info label */}
              <p className="text-[9px] text-slate-500 font-medium">
                {homeConfig?.appPromo?.osText || 'For iOS, Android & HarmonyOS'}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedAuthorName && (
        <AuthorDetailsView
          authorName={selectedAuthorName}
          products={products}
          onClose={() => setSelectedAuthorName(null)}
          onAddToCart={handleAddToCart}
          onPreview={handleOpenBookPreview}
          onSelectProduct={(p) => {
            setSelectedSingleProduct(p);
            setSelectedAuthorName(null);
          }}
          favoriteProductIds={favoriteProductIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}



      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onUpdateProducts={handleUpdateProducts}
          tabsConfig={tabsConfig}
          onUpdateTabs={handleUpdateTabs}
          bannersConfig={bannersConfig}
          onUpdateBanners={handleUpdateBanners}
          quotes={quotes}
          onUpdateQuotes={handleUpdateQuotes}
          orders={orders}
          onUpdateOrders={handleUpdateOrders}
          siteSettings={siteSettings}
          onUpdateSiteSettings={handleUpdateSiteSettings}
          homeConfig={homeConfig}
          onUpdateHomeConfig={handleUpdateHomeConfig}
          categoriesConfig={categoriesConfig}
          onUpdateCategories={handleUpdateCategories}
          users={users}
          onUpdateUserRole={handleUpdateUserRole}
          campaigns={campaigns}
          onUpdateCampaigns={handleUpdateCampaigns}
          coupons={coupons}
          onUpdateCoupons={handleUpdateCoupons}
          promoPopupConfig={promoPopupConfig}
          onUpdatePromoPopupConfig={handleUpdatePromoPopupConfig}
          boimelaConfig={boimelaConfig}
          onUpdateBoimelaConfig={handleUpdateBoimelaConfig}
          affiliates={affiliates}
          onUpdateAffiliates={handleUpdateAffiliates}
          affiliateWithdrawals={affiliateWithdrawals}
          onUpdateAffiliateWithdrawals={handleUpdateAffiliateWithdrawals}
          affiliateConfig={affiliateConfig}
          onUpdateAffiliateConfig={handleUpdateAffiliateConfig}
          landingPages={landingPages}
          onUpdateLandingPages={handleUpdateLandingPages}
          onPreviewLandingPage={(page) => {
            setSelectedLandingPage(page);
            setIsAdminOpen(false);
            if (typeof window !== 'undefined') {
              window.location.hash = `#landing/${page.slug}`;
            }
          }}
        />
      )}

      {/* Global Product Comparison Tray and Spec Comparison Overlay */}
      <ProductCompare
        compareItems={compareItems}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearCompare={handleClearCompare}
        onAddToCart={handleAddToCart}
      />

      {/* Dynamic Floating Quick Checkout pill on bottom right */}
      {cartItems.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className={`fixed ${compareItems.length > 0 ? 'bottom-20' : 'bottom-6'} right-6 bg-rose-600 hover:bg-rose-550 text-white font-extrabold text-[11px] py-2.5 px-4 rounded-full shadow-2xl flex items-center space-x-1.5 z-40 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 animate-bounce`}
        >
          <span className="relative">
            🛍️
            <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 font-black text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </span>
          <span className="font-sans">কার্ট সম্পন্ন করুন</span>
        </button>
      )}

      {/* FAQ Section - Clean Light/White Background Container */}
      <section className="bg-white border-t border-slate-200/80 py-12 text-slate-800 font-sans mt-16" id="customer-faq-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="space-y-2 mb-8 text-center">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide flex items-center justify-center space-x-2">
              <HelpCircle className="w-5 h-5 text-sky-600" />
              <span>{t.faqTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
              {t.faqSubtitle}
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {[
              { q: t.faqDeliveryQ, a: t.faqDeliveryA },
              { q: t.faqReturnQ, a: t.faqReturnA },
              { q: t.faqPaymentQ, a: t.faqPaymentA },
              { q: t.faqOrderQ, a: t.faqOrderA },
              { q: t.faqOriginalBookQ, a: t.faqOriginalBookA }
            ].map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/70 hover:bg-slate-100/80 shadow-xs"
                  id={`faq-item-${index}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-4 sm:px-5 flex justify-between items-center text-left text-xs sm:text-sm font-bold text-slate-800 transition-colors cursor-pointer select-none"
                  >
                    <span className="flex items-center space-x-3 pr-2">
                      <span className="text-[11px] text-sky-700 font-mono font-bold bg-sky-50 px-2 py-0.5 rounded-md shrink-0 border border-sky-100">
                        0{index + 1}
                      </span>
                      <span className="text-slate-800">{item.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-sky-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/80 bg-white animate-fade-in font-medium">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Pixel-Perfect Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans overflow-hidden">
        
        {/* Trust Badges Bar */}
        <div className="bg-slate-950/85 border-b border-slate-800 py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3.5 group cursor-default">
                <div className="bg-sky-500/10 text-sky-400 p-2.5 rounded-lg transition-transform group-hover:scale-110">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {language === 'bn' ? '১০০% আসল প্রোডাক্ট' : '100% Genuine Products'}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    {language === 'bn' ? 'সবচেয়ে অথেন্টিক পণ্যের নির্ভরযোগ্য নিশ্চয়তা' : 'Guaranteed authentic and original goods'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3.5 group cursor-default">
                <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-lg transition-transform group-hover:scale-110">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {language === 'bn' ? 'দ্রুততম হোম ডেলিভারি' : 'Fastest Home Delivery'}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    {language === 'bn' ? 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on delivery across all of Bangladesh'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3.5 group cursor-default">
                <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg transition-transform group-hover:scale-110">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {language === 'bn' ? 'সহজ রিটার্ন পলিসি' : 'Easy Return Policy'}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    {language === 'bn' ? 'পণ্য হাতে পেয়ে পছন্দ না হলে সহজ সমাধানের আশ্বাস' : 'Hassle-free resolutions if you are not satisfied'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3.5 group cursor-default">
                <div className="bg-amber-500/10 text-amber-400 p-2.5 rounded-lg transition-transform group-hover:scale-110">
                  <HelpingHand className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {language === 'bn' ? '২৪/৭ কাস্টমার সাপোর্ট' : '24/7 Customer Support'}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    {language === 'bn' ? 'যে কোনো সহায়তায় আমাদের টিম রয়েছে সদা প্রস্তুত' : 'Our support team is always ready to assist'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Main Footer Links & Info Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand Intro & Contacts */}
            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <span className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
                  <span className="text-xl">🛍️</span>
                  <span className="font-sans">
                    {language === 'bn' ? 'টপসেল' : 'Topsell'}<span className="text-sky-400">.কম</span>
                  </span>
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.footerAboutText}
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href={`tel:${siteSettings.hotline || '16297'}`} className="font-semibold hover:text-sky-400 transition-colors">
                    {siteSettings.hotline || '16297'} {language === 'bn' ? '(হটলাইন / কাস্টমার কেয়ার)' : '(Hotline / Customer Care)'}
                  </a>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>support@topsell.com</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'bn' 
                      ? 'হাউজ #১২, রোড #০৬, মিরপুর ডিওএইচএস, ঢাকা' 
                      : 'House #12, Road #06, Mirpur DOHS, Dhaka'}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Shop Categories */}
            <div className="space-y-3.5 text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-sky-400 pl-2">
                {language === 'bn' ? 'টপসেল ক্যাটাগরি' : 'Shopping Categories'}
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setActiveTab('books'); handleResetFilters(); }} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>📚</span> <span>{language === 'bn' ? 'বই ও সাহিত্য কর্ণার' : 'Books & Literature Corner'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('electronics'); handleResetFilters(); }} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>🔌</span> <span>{language === 'bn' ? 'ইলেক্ট্রনিক্স ও স্মার্ট গ্যাজেট' : 'Electronics & Smart Gadgets'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('superstore'); handleResetFilters(); }} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>🛒</span> <span>{language === 'bn' ? 'সুপারশপ ও নিত্যপ্রয়োজনীয় জিনিস' : 'Superstore & Daily Groceries'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('kids'); handleResetFilters(); }} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>🧸</span> <span>{language === 'bn' ? 'বাচ্চাদের খেলনা ও ফুড কেয়ার' : 'Kids Toys & Food Care'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care & Services */}
            <div className="space-y-3.5 text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-rose-400 pl-2">
                {language === 'bn' ? 'গ্রাহক সেবা ও লিংক' : 'Customer Service & Links'}
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={handleOpenTracker} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>📦</span> <span className="font-sans font-bold">{language === 'bn' ? 'অর্ডার ট্র্যাক করুন (Live Status)' : 'Track Order (Live Status)'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('corporate')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>🏢</span> <span>{language === 'bn' ? 'কর্পোরেট কোটেশন ও বাল্ক রিকোয়েস্ট' : 'Corporate Quotation & Bulk Requests'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('offers')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>⚡</span> <span>{language === 'bn' ? 'আজকের ফ্ল্যাশ সেল অফার' : "Today's Flash Sale Offers"}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('boimela')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>📖</span> <span>{language === 'bn' ? 'অমর একুশে বইমেলা ২০২৬' : 'Amar Ekushey Boimela 2026'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('affiliate')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1.5 text-left">
                    <span>💸</span> <span>{language === 'bn' ? 'অ্যাফিলিয়েট (ঘরে বসে আয় করুন)' : 'Affiliate (Earn from Home)'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Quality & Trust Badges */}
            <div className="space-y-3.5 text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-emerald-400 pl-2">
                {language === 'bn' ? 'আমাদের লক্ষ্য' : 'Our Mission'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {language === 'bn' 
                  ? 'আমরা বিশ্বাস করি দ্রুততম ডেলিভারি ও শতভাগ খাঁটি পণ্যের নিশ্চয়তায়। কোটেশনের মাধ্যমে করপোরেট ক্রয়ে স্বচ্ছতা আনা আমাদের প্রধান লক্ষ্য।' 
                  : 'We believe in fast delivery and 100% genuine products. Ensuring full transparency in corporate procurement is our core mission.'}
              </p>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                  {language === 'bn' ? 'নিরাপদ পেমেন্ট পার্টনার:' : 'Secure Payment Partners:'}
                </span>
                <div className="flex flex-wrap gap-2 text-[10px] font-sans">
                  <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold border border-slate-700/60">
                    {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                  </span>
                  <span className="bg-slate-800 text-sky-400 px-2 py-1 rounded font-bold border border-slate-700/60">
                    {language === 'bn' ? 'বিকাশ / নগদ' : 'bKash / Nagad'}
                  </span>
                  <span className="bg-slate-800 text-emerald-400 px-2 py-1 rounded font-bold border border-slate-700/60">
                    {language === 'bn' ? 'ভিসা / মাস্টারকার্ড' : 'Visa / MasterCard'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom copyright & Proud disclaimer */}
        <div className="bg-slate-950 text-slate-500 text-[11px] font-medium border-t border-slate-800/60 py-5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left space-y-0.5">
              <p className="text-slate-400 font-sans">
                {language === 'bn' ? '© ২০২৬ টপসেল.কম। সর্বস্বত্ব সংরক্ষিত।' : '© 2026 Topsell.com. All rights reserved.'}
              </p>
              <p className="text-[10px] text-slate-500">
                {language === 'bn' 
                  ? 'টপসেল ডট কম এবং কোটেশন লিমিটেড - একটি বিশ্বস্ত বাংলাদেশি উদ্যোগ।' 
                  : 'Topsell.com and Quotation Limited - A trusted Bangladeshi initiative.'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => { setActiveTab('corporate') }} className="hover:text-slate-300 transition-colors cursor-pointer">
                {language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
              </button>
              <span>•</span>
              <button onClick={() => { setActiveTab('corporate') }} className="hover:text-slate-300 transition-colors cursor-pointer">
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </button>
              <span>•</span>
              <button onClick={handleResetFilters} className="hover:text-slate-300 transition-colors cursor-pointer">
                {language === 'bn' ? 'সকল পণ্য' : 'All Products'}
              </button>
            </div>
          </div>
        </div>

      </footer>

      {/* Floating Free Shipping Small Circular Badge (Left side) */}
      <button
        onClick={() => {
          setIsFreeShippingModalOpen(true);
          setIsCouponCopied(false);
        }}
        title="অ্যাপে ১ম অর্ডারে ফ্রি শিপিং! 🎁"
        aria-label="অ্যাপে ১ম অর্ডারে ফ্রি শিপিং"
        className="fixed bottom-20 left-3.5 md:bottom-6 md:left-6 z-40 w-12 h-12 flex flex-col items-center justify-center bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 text-white rounded-full shadow-[0_4px_16px_rgba(225,29,72,0.45)] hover:shadow-[0_6px_22px_rgba(225,29,72,0.65)] hover:scale-110 active:scale-95 transition-all border-2 border-white cursor-pointer select-none group"
      >
        <Truck className="w-5 h-5 group-hover:rotate-6 transition-transform" />
        <span className="text-[7.5px] font-black leading-none mt-0.5 tracking-tighter">ফ্রি ডেলিভারি</span>
        
        {/* Pulsing Gift Badge Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 text-[9px] font-bold text-slate-900 items-center justify-center shadow-xs">🎁</span>
        </span>
      </button>

      {/* Floating WhatsApp Support Small Circular Button (Right side) */}
      <a
        href="https://wa.me/8801700000000"
        target="_blank"
        rel="noopener noreferrer"
        title="হোয়াটসঅ্যাপে হেল্পলাইন সাপোর্ট পান"
        aria-label="হোয়াটসঅ্যাপে হেল্পলাইন সাপোর্ট"
        className="fixed bottom-20 right-3.5 md:bottom-6 md:right-6 z-40 w-12 h-12 flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 text-white rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.45)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.65)] hover:scale-110 active:scale-95 transition-all border-2 border-white cursor-pointer select-none group"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 fill-current group-hover:scale-110 transition-transform"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.584 1.777.894 2.796.894 3.183 0 5.769-2.586 5.769-5.766.001-3.181-2.585-5.781-5.769-5.781zm3.388 8.163c-.144.405-.837.774-1.17.822-.312.043-.687.067-2.146-.537-1.741-.72-2.87-2.482-2.956-2.597-.087-.116-.708-.941-.708-1.793 0-.852.449-1.272.608-1.445.16-.174.348-.217.464-.217.116 0 .232.001.333.006.106.005.249-.04.39.298.144.347.491 1.2.535 1.287.043.087.072.188.014.304-.058.116-.087.188-.174.289l-.26.303c-.087.087-.179.182-.077.357.101.174.451.744.968 1.205.666.593 1.228.777 1.402.864.174.087.275.072.376-.044.101-.116.434-.506.55-.68.116-.174.232-.145.39-.087s1.011.477 1.185.564.289.13.333.203c.043.072.043.42-.101.825zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.954-1.399C8.388 21.492 10.134 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
        <span className="text-[7.5px] font-black leading-none mt-0.5 tracking-tighter">সাপোর্ট</span>
        
        {/* Pulsing Online Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white"></span>
        </span>
      </a>

      {/* MOBILE BOTTOM NAVIGATION BAR: Visible ONLY on mobile viewports */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-40 h-16 flex items-center justify-around px-2 py-1 select-none">
        
        {/* Navigation Item: Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            handleResetFilters();
            setIsMobileCategoriesOpen(false);
            setIsMobileProfileMenuOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
            activeTab === 'home' && !isMobileCategoriesOpen && !isMobileProfileMenuOpen
              ? 'text-sky-600 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">হোম</span>
        </button>

        {/* Navigation Item: Categories Drawer Trigger */}
        <button
          onClick={() => {
            setIsMobileCategoriesOpen(prev => !prev);
            setIsMobileProfileMenuOpen(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
            isMobileCategoriesOpen
              ? 'text-sky-600 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">ক্যাটাগরি</span>
        </button>

        {/* Navigation Item: Quick Search (Centered Floating Action Button) */}
        <button
          onClick={handleQuickSearchFocus}
          className="flex-1 flex flex-col items-center justify-end h-full pb-0.5 relative cursor-pointer"
        >
          <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-amber-400 hover:bg-amber-500 text-slate-950 p-3 rounded-full shadow-[0_4px_14px_rgba(251,191,36,0.5)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.65)] transition-all duration-300 transform active:scale-95 border-4 border-white flex items-center justify-center z-50 w-12 h-12">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] text-slate-500 font-bold mt-1">খুঁজুন</span>
        </button>

        {/* Navigation Item: Shopping Cart Drawer Trigger */}
        <button
          onClick={() => {
            setIsCartOpen(true);
            setIsMobileCategoriesOpen(false);
            setIsMobileProfileMenuOpen(false);
          }}
          className="flex-1 flex flex-col items-center justify-center space-y-0.5 relative text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-extrabold text-[8.5px] px-1.5 py-0.5 rounded-full scale-90 flex items-center justify-center min-w-[15px] h-[15px] border border-white">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
          <span className="text-[10px]">কার্ট</span>
        </button>

        {/* Navigation Item: User Profile Menu / Log In modal */}
        <button
          id="mobile-bottom-profile-btn"
          onClick={() => {
            setIsMobileCategoriesOpen(false);
            if (loggedInUser) {
              setIsMobileProfileMenuOpen(prev => !prev);
            } else {
              setIsLoginOpen(true);
            }
          }}
          className={`flex-1 flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
            isMobileProfileMenuOpen || (!loggedInUser && isLoginOpen)
              ? 'text-sky-600 font-extrabold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">প্রোফাইল</span>
        </button>

      </div>

      {/* MOBILE SIDEBAR FILTER SLIDE-UP OVERLAY DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end lg:hidden transition-all">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setIsMobileFilterOpen(false)} />
          
          <div className="relative w-80 max-w-[85%] h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
            <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-black text-slate-800 tracking-tight font-sans">ফিল্টার ও সর্ট করুন</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-500 hover:text-slate-800 p-1.5 bg-white border border-slate-200 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 pb-24">
              <Sidebar
                activeTab={activeTab}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  handleSelectCategory(cat);
                  setIsMobileFilterOpen(false);
                }}
                selectedChildCategory={selectedChildCategory}
                onSelectChildCategory={(ccat) => {
                  handleSelectChildCategory(ccat);
                  setIsMobileFilterOpen(false);
                }}
                categoriesConfig={categoriesConfig}
                selectedSort={selectedSort}
                onSelectSort={(sort) => {
                  handleSelectSort(sort);
                  setIsMobileFilterOpen(false);
                }}
                selectedBrandsOrAuthors={selectedBrandsOrAuthors}
                onToggleBrandOrAuthor={handleToggleBrandOrAuthor}
                inStockOnly={inStockOnly}
                onToggleInStock={handleToggleInStock}
                onResetFilters={handleResetFilters}
              />
            </div>
            
            <div className="absolute bottom-0 inset-x-0 p-3 bg-slate-50 border-t border-slate-200 flex space-x-2">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-grow py-2 border border-slate-200 hover:bg-slate-100 rounded text-slate-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-grow py-2 bg-sky-600 hover:bg-sky-700 rounded text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE CATEGORIES EXPANSION DRAWER */}
      {isMobileCategoriesOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end lg:hidden transition-all">
          <div className="absolute inset-0" onClick={() => setIsMobileCategoriesOpen(false)} />
          
          <div className="relative w-80 max-w-[85%] h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
            <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-black text-slate-800 tracking-tight font-sans">ক্যাটাগরি ব্রাউজ করুন</span>
              <button onClick={() => setIsMobileCategoriesOpen(false)} className="text-slate-500 hover:text-slate-800 p-1.5 bg-white border border-slate-200 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-24">
              <div className="space-y-3">
                <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">ডিপার্টমেন্ট সমূহ</h3>
                
                {/* Books */}
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => {
                      setActiveTab('books');
                      handleResetFilters();
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 text-left cursor-pointer border-b border-slate-100"
                  >
                    <span className="flex items-center space-x-2 font-bold text-slate-800 text-xs">
                      <span>📚</span>
                      <span>বই ও সাহিত্য</span>
                    </span>
                    <span className="text-slate-400 text-xs">&gt;</span>
                  </button>
                  <div className="p-2 flex flex-wrap gap-1 bg-slate-50">
                    {Object.keys(categoriesConfig['books'] || {}).map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => {
                          setActiveTab('books');
                          handleSelectCategory(subcat);
                          setIsMobileCategoriesOpen(false);
                        }}
                        className="text-[10px] font-medium py-1 px-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-sky-600 hover:border-sky-300 cursor-pointer"
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Electronics */}
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => {
                      setActiveTab('electronics');
                      handleResetFilters();
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 text-left cursor-pointer border-b border-slate-100"
                  >
                    <span className="flex items-center space-x-2 font-bold text-slate-800 text-xs">
                      <span>🔌</span>
                      <span>ইলেক্ট্রনিক্স ও গ্যাজেট</span>
                    </span>
                    <span className="text-slate-400 text-xs">&gt;</span>
                  </button>
                  <div className="p-2 flex flex-wrap gap-1 bg-slate-50">
                    {Object.keys(categoriesConfig['electronics'] || {}).map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => {
                          setActiveTab('electronics');
                          handleSelectCategory(subcat);
                          setIsMobileCategoriesOpen(false);
                        }}
                        className="text-[10px] font-medium py-1 px-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-sky-600 hover:border-sky-300 cursor-pointer"
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Superstore */}
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => {
                      setActiveTab('superstore');
                      handleResetFilters();
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 text-left cursor-pointer border-b border-slate-100"
                  >
                    <span className="flex items-center space-x-2 font-bold text-slate-800 text-xs">
                      <span>🛒</span>
                      <span>সুপার স্টোর</span>
                    </span>
                    <span className="text-slate-400 text-xs">&gt;</span>
                  </button>
                  <div className="p-2 flex flex-wrap gap-1 bg-slate-50">
                    {Object.keys(categoriesConfig['superstore'] || {}).map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => {
                          setActiveTab('superstore');
                          handleSelectCategory(subcat);
                          setIsMobileCategoriesOpen(false);
                        }}
                        className="text-[10px] font-medium py-1 px-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-sky-600 hover:border-sky-300 cursor-pointer"
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fashion */}
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => {
                      setActiveTab('fashion');
                      handleResetFilters();
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 text-left cursor-pointer border-b border-slate-100"
                  >
                    <span className="flex items-center space-x-2 font-bold text-slate-800 text-xs">
                      <span>👕</span>
                      <span>ফ্যাশন (জামা, প্যান্ট, জুতা)</span>
                    </span>
                    <span className="text-slate-400 text-xs">&gt;</span>
                  </button>
                  <div className="p-2 flex flex-wrap gap-1 bg-slate-50">
                    {Object.keys(categoriesConfig['fashion'] || {}).map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => {
                          setActiveTab('fashion');
                          handleSelectCategory(subcat);
                          setIsMobileCategoriesOpen(false);
                        }}
                        className="text-[10px] font-medium py-1 px-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-emerald-600 hover:border-emerald-300 cursor-pointer"
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kids */}
                <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => {
                      setActiveTab('kids');
                      handleResetFilters();
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 text-left cursor-pointer border-b border-slate-100"
                  >
                    <span className="flex items-center space-x-2 font-bold text-slate-800 text-xs">
                      <span>🧸</span>
                      <span>কিডস জোন</span>
                    </span>
                    <span className="text-slate-400 text-xs">&gt;</span>
                  </button>
                  <div className="p-2 flex flex-wrap gap-1 bg-slate-50">
                    {Object.keys(categoriesConfig['kids'] || {}).map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => {
                          setActiveTab('kids');
                          handleSelectCategory(subcat);
                          setIsMobileCategoriesOpen(false);
                        }}
                        className="text-[10px] font-medium py-1 px-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-sky-600 hover:border-sky-300 cursor-pointer"
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Other Tabs shortcuts inside drawer */}
              <div className="space-y-2">
                <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">অন্যান্য পেজ সমূহ</h3>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('offers');
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-bold rounded text-center cursor-pointer"
                  >
                    ⚡ অফার সমূহ
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('boimela');
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-800 font-bold rounded text-center cursor-pointer"
                  >
                    📖 বইমেলা ২০২৬
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('corporate');
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 font-bold rounded text-center cursor-pointer col-span-2"
                  >
                    🏢 বাল্ক ও প্রাতিষ্ঠানিক অর্ডার
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('affiliate');
                      setIsMobileCategoriesOpen(false);
                    }}
                    className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-lg text-center cursor-pointer col-span-2 flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <Coins className="w-4 h-4 text-slate-950" />
                    <span>💸 ঘরে বসে আয় করুন (অ্যাফিলিয়েট)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PROFILE SHEET/OVERLAY */}
      {isMobileProfileMenuOpen && loggedInUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end lg:hidden transition-all">
          <div className="absolute inset-0" onClick={() => setIsMobileProfileMenuOpen(false)} />
          
          <div className="relative w-80 max-w-[85%] h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
            <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-black text-slate-800 tracking-tight font-sans">আমার প্রোফাইল</span>
              <button onClick={() => setIsMobileProfileMenuOpen(false)} className="text-slate-500 hover:text-slate-800 p-1.5 bg-white border border-slate-200 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* User Info meta card */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-300 shrink-0">
                <img 
                  src={loggedInUser.photoURL || (loggedInUser.emailOrPhone.toLowerCase() === 'rakhalchandro2@gmail.com'
                    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=80"
                  )} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left font-sans leading-tight">
                <span className="text-[10px] text-slate-400 font-bold block">সুস্বাগতম,</span>
                <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{loggedInUser.name}</span>
                <span className="text-[9.5px] text-slate-500 truncate max-w-[150px] block mt-0.5">{loggedInUser.emailOrPhone}</span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-3 space-y-1 pb-24">
              {loggedInUser.isAdmin && (
                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    setIsMobileProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 bg-amber-50 border border-amber-200 text-left text-xs font-black text-amber-800 rounded mb-2 cursor-pointer"
                >
                  <span>👑</span>
                  <span>অ্যাডমিন ড্যাশবোর্ড (Live)</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (loggedInUser.isAdmin) {
                    setIsAdminOpen(true);
                  } else {
                    alert("Account configuration details loaded.");
                  }
                  setIsMobileProfileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>আমার প্রোফাইল বিবরণ</span>
              </button>

              <button
                onClick={() => {
                  handleOpenTracker();
                  setIsMobileProfileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 text-slate-400" />
                <span>অর্ডার ট্র্যাকিং ও ইতিহাস</span>
              </button>

              <button
                onClick={() => {
                  alert("আমার রেটিং ও রিভিউ সেকশন");
                  setIsMobileProfileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
              >
                <Star className="w-4 h-4 text-slate-400" />
                <span>বই ও প্রোডাক্ট রিভিউ</span>
              </button>

              <button
                onClick={() => {
                  alert("পছন্দের উইশলিস্ট প্রোডাক্ট সমূহ");
                  setIsMobileProfileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>আমার উইশলিস্ট</span>
              </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-3 bg-white border-t border-slate-150">
              <button
                onClick={async () => {
                  await logOutFromFirebase();
                  setLoggedInUser(null);
                  setIsMobileProfileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 rounded text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>লগ আউট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARED WISHLIST MODAL */}
      {isSharedWishlistOpen && products.filter((p) => sharedWishlistProductIds.includes(p.id)).length > 0 && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-up"
            style={{ maxHeight: '90vh' }}
            id="shared-wishlist-modal-container"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-50 to-rose-100/50 p-5 border-b border-rose-100 relative shrink-0">
              <button 
                type="button"
                onClick={clearSharedWishlistQuery}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-400 hover:text-slate-600 transition-colors shadow-3xs cursor-pointer"
                id="shared-wishlist-modal-close"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse shrink-0">
                  <Gift className="w-5 h-5 text-rose-50" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">
                    বন্ধুর শেয়ার করা উইশলিস্ট! 🎁
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    আপনার এক বন্ধু তাঁর পছন্দের ({products.filter((p) => sharedWishlistProductIds.includes(p.id)).length}টি) পণ্য তালিকা আপনার সাথে শেয়ার করেছেন
                  </p>
                </div>
              </div>
            </div>

            {/* Shared products list body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/40">
              {products.filter((p) => sharedWishlistProductIds.includes(p.id)).map((prod) => {
                const isAlreadyFavorite = favoriteProductIds.includes(prod.id);
                const imageUrl = prod.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
                
                return (
                  <div 
                    key={prod.id}
                    className="bg-white border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-3.5 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Image */}
                      <div className="w-12 h-14 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={imageUrl} 
                          alt={prod.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                      </div>
                      
                      {/* Product Metadata */}
                      <div className="text-left font-sans min-w-0">
                        <span className="text-[8px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-black uppercase">
                          {prod.type === 'book' ? 'বই' : prod.category}
                        </span>
                        <h4 className="text-[11.5px] font-black text-slate-800 line-clamp-1 mt-0.5" title={prod.title}>
                          {prod.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">
                          {prod.authorOrBrand}
                        </p>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-rose-600 text-xs font-black font-mono">৳{prod.discountedPrice}</span>
                          {prod.originalPrice && prod.originalPrice > prod.discountedPrice && (
                            <span className="text-[9.5px] text-slate-400 line-through font-mono">৳{prod.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions column */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(prod)}
                        className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-center ${
                          isAlreadyFavorite 
                            ? 'bg-rose-500 border-rose-500 text-white shadow-3xs' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-rose-500'
                        }`}
                        title={isAlreadyFavorite ? 'উইশলিস্টে সংরক্ষিত আছে' : 'উইশলিস্টে যুক্ত করুন'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isAlreadyFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(prod)}
                        disabled={!prod.inStock}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center space-x-1 transition-all shadow-3xs cursor-pointer ${
                          prod.inStock 
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-97' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>কার্টে নিন</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={handleImportSharedWishlist}
                className="flex-grow bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                id="shared-wishlist-import-all"
              >
                <Heart className="w-4 h-4 fill-rose-50" />
                <span>উইশলিস্টে নিন (Import All)</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const sharedProds = products.filter((p) => sharedWishlistProductIds.includes(p.id));
                  sharedProds.forEach(prod => {
                    if (prod.inStock) {
                      setCartItems((prev) => {
                        const existing = prev.find((item) => item.product.id === prod.id);
                        if (existing) {
                          return prev.map((item) =>
                            item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
                          );
                        }
                        return [...prev, { product: prod, quantity: 1 }];
                      });
                    }
                  });
                  setIsCartOpen(true);
                  clearSharedWishlistQuery();
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                id="shared-wishlist-cart-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>সবগুলো কার্টে নিন (Cart All)</span>
              </button>
              
              <button
                type="button"
                onClick={clearSharedWishlistQuery}
                className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-250 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
                id="shared-wishlist-close-btn"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTIONAL OFFER POPUP (ছুটির ঘণ্টা অফার / রকমারি স্টাইল পপআপ) */}
      <PromoPopupModal
        config={promoPopupConfig}
        isOpen={isPromoPopupOpen}
        onClose={handleClosePromoPopup}
        onApplyCoupon={(code) => {
          // If code is provided, we can copy and give quick notification
          console.log('Applied promo popup coupon:', code);
        }}
        onNavigateToOffers={(targetTab) => {
          if (targetTab) {
            setActiveTab(targetTab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

    </div>
  );
}
