import { X, CheckCircle2, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { logInWithGoogle, logOutFromFirebase } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { uid?: string; name: string; emailOrPhone: string; isAdmin: boolean; photoURL?: string; phoneNumber?: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [loggedName, setLoggedName] = useState('কাস্টমার');
  const [loggedEmail, setLoggedEmail] = useState('');
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  // States for Google Sign-In Phone Number Prompt
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [googlePhone, setGooglePhone] = useState('');
  const [tempGoogleUser, setTempGoogleUser] = useState<any>(null);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    const query = mobileNumber.trim();
    const isEmail = query.includes('@');

    if (isEmail) {
      if (!/\S+@\S+\.\S+/.test(query)) {
        setErrorText('অনুগ্রহ করে সঠিক ইমেইল এড্রেস প্রদান করুন!');
        return;
      }
    } else {
      if (query.length < 11) {
        setErrorText('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার প্রদান করুন!');
        return;
      }
    }

    if (password.length < 4) {
      setErrorText('পাসওয়ার্ডটি অবশ্যই ৪ ডিজিটের বেশি হতে হবে!');
      return;
    }

    const isAdmin = query.toLowerCase() === 'rakhalchandro2@gmail.com';
    const name = isAdmin ? 'রাখাল চন্দ্র শীল' : 'কাস্টমার';
    const loggedUser = {
      uid: query.replace(/[^a-zA-Z0-9_\-]/g, '_'),
      name,
      emailOrPhone: query,
      isAdmin: isAdmin
    };

    setLoggedName(name);
    setLoggedEmail(query);
    setIsGoogleAuth(false);

    if (onLoginSuccess) {
      onLoginSuccess(loggedUser);
    }

    setIsSuccess(true);
  };

  const handleGoogleLoginClick = async () => {
    setErrorText('');
    try {
      const user = await logInWithGoogle();
      if (user) {
        const displayName = user.displayName || 'গুগল ইউজার';
        const email = user.email || '';
        const isAdmin = email.toLowerCase() === 'rakhalchandro2@gmail.com';

        // Check if there is an existing user profile with a phone number
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let existingPhone = '';
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          existingPhone = data.phoneNumber || data.phone || data.mobile || '';
        }

        if (existingPhone) {
          // If existing user already has a phone number, proceed directly to login success
          const loggedUser = {
            uid: user.uid,
            name: displayName,
            emailOrPhone: email,
            isAdmin: isAdmin,
            photoURL: user.photoURL || undefined,
            phoneNumber: existingPhone
          };

          setLoggedName(displayName);
          setLoggedEmail(email);
          setIsGoogleAuth(true);

          if (onLoginSuccess) {
            onLoginSuccess(loggedUser);
          }
          setIsSuccess(true);
        } else {
          // If phone number is missing, set temporary state and show prompt
          setTempGoogleUser({
            uid: user.uid,
            name: displayName,
            emailOrPhone: email,
            isAdmin: isAdmin,
            photoURL: user.photoURL || undefined
          });
          setShowPhonePrompt(true);
        }
      }
    } catch (err: any) {
      setErrorText(err.message || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    
    const phone = googlePhone.trim();
    if (phone.length < 11 || !phone.startsWith('01')) {
      setErrorText('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার প্রদান করুন! (যেমন: 01xxxxxxxxx)');
      return;
    }

    if (tempGoogleUser) {
      setIsSubmittingPhone(true);
      try {
        const completedUser = {
          ...tempGoogleUser,
          phoneNumber: phone
        };

        // Complete login
        setLoggedName(tempGoogleUser.name);
        setLoggedEmail(tempGoogleUser.emailOrPhone);
        setIsGoogleAuth(true);

        if (onLoginSuccess) {
          await onLoginSuccess(completedUser);
        }
        
        setShowPhonePrompt(false);
        setIsSuccess(true);
      } catch (err: any) {
        setErrorText('মোবাইল নাম্বার সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।');
      } finally {
        setIsSubmittingPhone(false);
      }
    }
  };

  const handlePhoneCancel = async () => {
    try {
      await logOutFromFirebase();
    } catch (err) {
      console.error('Logout error on cancel:', err);
    }
    // Reset all states
    setTempGoogleUser(null);
    setShowPhonePrompt(false);
    setGooglePhone('');
    setErrorText('');
  };

  const handleClose = () => {
    if (showPhonePrompt) {
      handlePhoneCancel();
    }
    onClose();
  };

  const handleLoggedDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl flex flex-col z-10 overflow-hidden animate-scale-up border border-slate-100 p-6 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-150">
          <h3 className="text-sm font-black text-slate-800 font-sans">
            {showPhonePrompt ? 'মোবাইল নাম্বার ভেরিফিকেশন' : 'টপসেল অ্যাকাউন্ট সাইন-ইন'}
          </h3>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-850 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorText && (
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-md border border-rose-100 text-xs flex items-center space-x-1 px-1 text-[11px] font-bold font-sans">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {showPhonePrompt ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4 font-sans text-left">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-900 leading-relaxed space-y-1">
              <p className="font-extrabold flex items-center gap-1.5 text-amber-850">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                গুগল সাইন-ইন সফল হয়েছে!
              </p>
              <p className="font-medium text-[11px]">
                আপনার টপসেল অ্যাকাউন্ট সম্পন্ন করতে একটি সচল মোবাইল নাম্বার প্রদান করা আবশ্যক।
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">মোবাইল নাম্বার *</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[11px] text-slate-450 font-bold font-sans">BD (+88)</span>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={googlePhone}
                  onChange={(e) => setGooglePhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className="w-full border border-slate-200 rounded pl-18 pr-3 py-1.5 text-xs focus:outline-hidden font-mono font-bold text-slate-850"
                  disabled={isSubmittingPhone}
                />
              </div>
              <p className="text-[10px] text-slate-450 font-medium">নিরাপদ ডেলিভারি ও অর্ডার ট্র্যাকিংয়ের জন্য আপনার মোবাইল নাম্বারটি প্রয়োজন।</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handlePhoneCancel}
                disabled={isSubmittingPhone}
                className="flex-grow py-2 border border-slate-250 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded shadow-xs transition-all cursor-pointer text-center"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isSubmittingPhone}
                className="flex-grow bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs py-2 rounded shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                {isSubmittingPhone ? (
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>সম্পন্ন করুন</span>
                )}
              </button>
            </div>
          </form>
        ) : isSuccess ? (
          <div className="text-center py-6 flex flex-col items-center justify-center space-y-4 font-sans">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-md font-bold text-slate-800">লগইন সফল হয়েছে!</h3>
            <p className="text-xs text-slate-600 px-2 leading-relaxed">
              {loggedEmail.trim().toLowerCase() === 'rakhalchandro2@gmail.com' ? (
                <span>🎉 স্বাগতম <strong>{loggedName}</strong>! আপনি এডমিন হিসেবে সফলভাবে সাইন-ইন করেছেন এবং টপসেল কন্ট্রোল প্যানেল সক্রিয় করা হয়েছে।</span>
              ) : (
                <span>স্বাগতম <strong>{loggedName}</strong>! আপনি এখন টপসেল বুক ক্লাব এবং অফারগুলোর সুবিধা উপভোগ করতে পারবেন।</span>
              )}
            </p>
            <button
              onClick={handleLoggedDone}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2 px-6 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              চালিয়ে যান
            </button>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-xs text-slate-500 leading-relaxed font-sans text-center">
              লগইন করে আপনার পছন্দের বইয়ের সংগ্রহ ট্র্যাক করুন এবং আকর্ষণীয় উপহার কুপন জিতুন!
            </div>

            <div className="space-y-3 font-sans">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">মোবাইল বা ইমেইল এড্রেস *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: rakhalchandro2@gmail.com বা 017xxxxxxxx"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">পাসওয়ার্ড *</label>
                <input
                  type="password"
                  required
                  placeholder="পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Google or Mobile Simulation links */}
            <div className="flex justify-between items-center text-[10.5px] font-sans">
              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-500">
                <input type="checkbox" className="rounded text-sky-600 border-gray-300 w-3.5 h-3.5" />
                <span>মনে রাখুন</span>
              </label>
              <a href="#reset" className="text-sky-600 hover:underline">পাসওয়ার্ড ভুলে গিয়েছেন?</a>
            </div>

            <button
               id="login-submit-btn"
               type="submit"
               className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs py-2.5 rounded shadow-xs transition-colors cursor-pointer"
            >
              সাইন-ইন করুন
            </button>
            
            <div className="relative my-4 flex justify-center items-center">
              <div className="absolute inset-x-0 h-px bg-slate-100"></div>
              <span className="relative bg-white px-2.5 text-slate-400 text-[10px] uppercase font-bold tracking-widest font-mono">OR</span>
            </div>

            <button
              id="google-login-btn"
              type="button"
              onClick={handleGoogleLoginClick}
              className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
            >
              <span>🌐</span>
              <span>Google অ্যাকাউন্ট দিয়ে সাইন-ইন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
