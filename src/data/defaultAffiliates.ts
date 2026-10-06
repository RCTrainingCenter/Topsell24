import { AffiliateUser, AffiliateWithdrawal, AffiliateProgramConfig } from '../types';

export const DEFAULT_AFFILIATE_CONFIG: AffiliateProgramConfig = {
  isEnabled: true,
  defaultCommissionPercent: 10,
  minimumWithdrawalAmount: 500,
  cookieDurationDays: 30,
  bannerTitle: 'রকমারি অ্যাফিলিয়েট হয়ে ঘরে বসে সহজে আয় করুন',
  bannerSubtitle: 'পছন্দের বই ও পণ্য রিকমেন্ড করে প্রতি সফল অর্ডারে নিশ্চিত ১০%-২০% পর্যন্ত কমিশন উপার্জন করুন',
  tutorialVideoUrl: 'https://www.youtube.com/embed/5aL-7aG_718'
};

export const DEFAULT_AFFILIATES: AffiliateUser[] = [
  {
    id: 'aff-1',
    name: 'মোঃ শরিফুল ইসলাম',
    phoneOrEmail: '01711223344',
    password: 'password123',
    referralCode: 'ROK-AFF-101',
    channelUrl: 'https://facebook.com/bookreviewbangla',
    paymentMethod: 'bKash',
    paymentNumber: '01711223344',
    status: 'active',
    commissionRate: 10,
    totalClicks: 148,
    totalOrders: 19,
    totalSalesAmount: 16200,
    totalEarnings: 1620,
    currentBalance: 1120,
    totalWithdrawn: 500,
    createdAt: '১৫ জানুয়ারি ২০২৬'
  },
  {
    id: 'aff-2',
    name: 'রাফিয়া জান্নাত',
    phoneOrEmail: '01822334455',
    password: 'password123',
    referralCode: 'ROK-AFF-202',
    channelUrl: 'https://youtube.com/@rafiasbooknook',
    paymentMethod: 'Nagad',
    paymentNumber: '01822334455',
    status: 'active',
    commissionRate: 12,
    totalClicks: 94,
    totalOrders: 11,
    totalSalesAmount: 9400,
    totalEarnings: 1128,
    currentBalance: 1128,
    totalWithdrawn: 0,
    createdAt: '২৩ জানুয়ারি ২০২৬'
  },
  {
    id: 'aff-3',
    name: 'তানভীর আহমেদ',
    phoneOrEmail: '01933445566',
    password: 'password123',
    referralCode: 'ROK-AFF-303',
    channelUrl: 'https://instagram.com/booklover_bd',
    paymentMethod: 'bKash',
    paymentNumber: '01933445566',
    status: 'pending',
    commissionRate: 10,
    totalClicks: 21,
    totalOrders: 2,
    totalSalesAmount: 1750,
    totalEarnings: 175,
    currentBalance: 175,
    totalWithdrawn: 0,
    createdAt: '০৫ ফেব্রুয়ারি ২০২৬'
  }
];

export const DEFAULT_WITHDRAWALS: AffiliateWithdrawal[] = [
  {
    id: 'w-1',
    affiliateId: 'aff-1',
    affiliateName: 'মোঃ শরিফুল ইসলাম',
    affiliatePhone: '01711223344',
    amount: 500,
    paymentMethod: 'bKash',
    paymentNumber: '01711223344',
    status: 'approved',
    requestDate: '২৮ জানুয়ারি ২০২৬',
    processedDate: '২৯ জানুয়ারি ২০২৬',
    transactionId: 'BK-9948214'
  },
  {
    id: 'w-2',
    affiliateId: 'aff-1',
    affiliateName: 'মোঃ শরিফুল ইসলাম',
    affiliatePhone: '01711223344',
    amount: 500,
    paymentMethod: 'bKash',
    paymentNumber: '01711223344',
    status: 'pending',
    requestDate: '০১ ফেব্রুয়ারি ২০২৬'
  }
];
