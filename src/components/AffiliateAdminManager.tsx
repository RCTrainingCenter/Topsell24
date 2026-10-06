import React, { useState } from 'react';
import { 
  AffiliateUser, 
  AffiliateWithdrawal, 
  AffiliateProgramConfig 
} from '../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Settings, 
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  Percent,
  Wallet,
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface AffiliateAdminManagerProps {
  affiliates: AffiliateUser[];
  withdrawals: AffiliateWithdrawal[];
  config: AffiliateProgramConfig;
  onUpdateAffiliates: (updated: AffiliateUser[]) => void;
  onUpdateWithdrawals: (updated: AffiliateWithdrawal[]) => void;
  onUpdateConfig: (updated: AffiliateProgramConfig) => void;
}

export default function AffiliateAdminManager({
  affiliates,
  withdrawals,
  config,
  onUpdateAffiliates,
  onUpdateWithdrawals,
  onUpdateConfig
}: AffiliateAdminManagerProps) {
  const [activeTab, setActiveTab] = useState<'affiliates' | 'withdrawals' | 'settings'>('affiliates');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal / Transaction entry state for approving withdrawal
  const [processingWithdrawalId, setProcessingWithdrawalId] = useState<string | null>(null);
  const [transactionIdInput, setTransactionIdInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Editing Commission Modal
  const [editingAffiliateId, setEditingAffiliateId] = useState<string | null>(null);
  const [commissionInput, setCommissionInput] = useState<number>(config.defaultCommissionPercent);

  // Statistics
  const totalAffiliates = affiliates.length;
  const activeAffiliates = affiliates.filter(a => a.status === 'active').length;
  const pendingAffiliates = affiliates.filter(a => a.status === 'pending').length;
  const totalEarningsAll = affiliates.reduce((acc, a) => acc + (a.totalEarnings || 0), 0);
  const totalBalanceAll = affiliates.reduce((acc, a) => acc + (a.currentBalance || 0), 0);
  const pendingPayoutsCount = withdrawals.filter(w => w.status === 'pending').length;
  const pendingPayoutsAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((acc, w) => acc + (w.amount || 0), 0);

  // Filter affiliates
  const filteredAffiliates = affiliates.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phoneOrEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter(w => {
    if (withdrawalFilter === 'all') return true;
    return w.status === withdrawalFilter;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUpdateStatus = (affiliateId: string, newStatus: 'active' | 'pending' | 'suspended') => {
    const updated = affiliates.map(a => {
      if (a.id === affiliateId) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    onUpdateAffiliates(updated);
  };

  const handleSaveCommission = (affiliateId: string) => {
    const updated = affiliates.map(a => {
      if (a.id === affiliateId) {
        return { ...a, commissionRate: Number(commissionInput) };
      }
      return a;
    });
    onUpdateAffiliates(updated);
    setEditingAffiliateId(null);
  };

  const handleApproveWithdrawal = (withdrawalId: string) => {
    const target = withdrawals.find(w => w.id === withdrawalId);
    if (!target) return;

    // Update withdrawal status
    const updatedWithdrawals = withdrawals.map(w => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status: 'approved' as const,
          processedDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
          transactionId: transactionIdInput.trim() || 'TRX-' + Math.floor(100000 + Math.random() * 900000),
          adminNote: adminNoteInput.trim()
        };
      }
      return w;
    });

    // Deduct from affiliate's currentBalance and add to totalWithdrawn
    const updatedAffiliates = affiliates.map(a => {
      if (a.id === target.affiliateId) {
        const newBalance = Math.max(0, (a.currentBalance || 0) - target.amount);
        const newWithdrawn = (a.totalWithdrawn || 0) + target.amount;
        return {
          ...a,
          currentBalance: newBalance,
          totalWithdrawn: newWithdrawn
        };
      }
      return a;
    });

    onUpdateWithdrawals(updatedWithdrawals);
    onUpdateAffiliates(updatedAffiliates);
    setProcessingWithdrawalId(null);
    setTransactionIdInput('');
    setAdminNoteInput('');
  };

  const handleRejectWithdrawal = (withdrawalId: string) => {
    const reason = prompt('উইথড্রয়াল বাতিল করার কারণ লিখুন (ঐচ্ছিক):') || 'নিয়ম বহির্ভূত বা তথ্যের অমিল';
    const updatedWithdrawals = withdrawals.map(w => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status: 'rejected' as const,
          adminNote: reason,
          processedDate: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
        };
      }
      return w;
    });
    onUpdateWithdrawals(updatedWithdrawals);
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>অ্যাফিলিয়েট প্রোগ্রাম ম্যানেজার</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                config.isEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {config.isEnabled ? 'চালু আছে' : 'বন্ধ'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              অ্যাফিলিয়েট অনুমোদন, সেলস ট্র্যাকিং, কমিশন ও উইথড্রয়াল ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        {/* Global Settings & Quick Stats */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>প্রোগ্রাম সেটিংস</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Affiliates */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>মোট অ্যাফিলিয়েট</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalAffiliates}</span>
            <span className="text-[11px] text-emerald-600 font-bold">({activeAffiliates} সক্রিয়)</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>অনুমোদনের অপেক্ষায়</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${pendingAffiliates > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingAffiliates}
            </span>
            <span className="text-[11px] text-slate-400">জন আবেদনকারী</span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>মোট অর্জিত কমিশন</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">৳ {totalEarningsAll.toLocaleString()}</span>
          </div>
        </div>

        {/* Pending Payout Requests */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>পেন্ডিং উইথড্র রিকোয়েস্ট</span>
            <Wallet className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${pendingPayoutsCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {pendingPayoutsCount}
            </span>
            <span className="text-[11px] text-rose-500 font-bold">(৳ {pendingPayoutsAmount.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-200 gap-2 pb-px">
        <button
          onClick={() => setActiveTab('affiliates')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'affiliates'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>অ্যাফিলিয়েট তালিকা ({affiliates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'withdrawals'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>উইথড্রয়াল রিকোয়েস্ট</span>
          {pendingPayoutsCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-full">
              {pendingPayoutsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>নীতিমালা ও কনফিগারেশন</span>
        </button>
      </div>

      {/* TAB 1: AFFILIATES LIST */}
      {activeTab === 'affiliates' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম, মোবাইল বা রেফারেল কোড খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 shrink-0">স্ট্যাটাস:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700"
              >
                <option value="all">সবগুলো ({affiliates.length})</option>
                <option value="active">সক্রিয় ({activeAffiliates})</option>
                <option value="pending">অনুমোদনের অপেক্ষায় ({pendingAffiliates})</option>
                <option value="suspended">স্থগিত</option>
              </select>
            </div>
          </div>

          {/* Affiliates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">অ্যাফিলিয়েট তথ্য</th>
                  <th className="px-4 py-3">রেফারেল কোড</th>
                  <th className="px-4 py-3">পেমেন্ট মেথড ও নম্বর</th>
                  <th className="px-4 py-3">কমিশন রেট</th>
                  <th className="px-4 py-3">ক্লিক / অর্ডার</th>
                  <th className="px-4 py-3">মোট কমিশন</th>
                  <th className="px-4 py-3">উইথড্রয়াল ব্যালেন্স</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAffiliates.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400">
                      কোনো অ্যাফিলিয়েট পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  filteredAffiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Phone */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{aff.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{aff.phoneOrEmail}</div>
                        {aff.channelUrl && (
                          <a 
                            href={aff.channelUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-sky-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>চ্যানেল লিংক</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>

                      {/* Referral Code */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded w-fit text-[11px]">
                          <span>{aff.referralCode}</span>
                          <button
                            onClick={() => handleCopy(aff.referralCode)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="কোড কপি করুন"
                          >
                            {copiedCode === aff.referralCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Payment info */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-700">{aff.paymentMethod}</span>
                        <div className="text-[11px] font-mono text-slate-500">{aff.paymentNumber}</div>
                      </td>

                      {/* Commission % */}
                      <td className="px-4 py-3">
                        {editingAffiliateId === aff.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={commissionInput}
                              onChange={(e) => setCommissionInput(Number(e.target.value))}
                              className="w-14 px-1.5 py-0.5 border border-sky-400 rounded text-xs font-bold"
                            />
                            <button
                              onClick={() => handleSaveCommission(aff.id)}
                              className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              সেভ
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingAffiliateId(aff.id);
                              setCommissionInput(aff.commissionRate || config.defaultCommissionPercent);
                            }}
                            className="font-bold text-sky-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                            title="কমিশন পরিবর্তন করুন"
                          >
                            <span>{aff.commissionRate || config.defaultCommissionPercent}%</span>
                            <Percent className="w-3 h-3 text-slate-400" />
                          </button>
                        )}
                      </td>

                      {/* Clicks / Orders */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{aff.totalClicks || 0} ক্লিক</div>
                        <div className="text-[11px] text-emerald-600 font-bold">{aff.totalOrders || 0} সেলস</div>
                      </td>

                      {/* Total Earnings */}
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        ৳ {(aff.totalEarnings || 0).toLocaleString()}
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">৳ {(aff.currentBalance || 0).toLocaleString()}</div>
                        {(aff.totalWithdrawn || 0) > 0 && (
                          <div className="text-[10px] text-slate-400">
                            উইথড্র: ৳ {(aff.totalWithdrawn || 0).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          aff.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : aff.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {aff.status === 'active' ? 'সক্রিয়' : aff.status === 'pending' ? 'অপেক্ষমাণ' : 'স্থগিত'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {aff.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(aff.id, 'active')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="অ্যাফিলিয়েট অনুমোদন করুন"
                            >
                              অনুমোদন
                            </button>
                          )}
                          {aff.status === 'active' && (
                            <button
                              onClick={() => handleUpdateStatus(aff.id, 'suspended')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              title="স্থগিত করুন"
                            >
                              স্থগিত
                            </button>
                          )}
                          {aff.status === 'suspended' && (
                            <button
                              onClick={() => handleUpdateStatus(aff.id, 'active')}
                              className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              title="পুনরায় সক্রিয় করুন"
                            >
                              সক্রিয় করুন
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WITHDRAWAL REQUESTS */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>উইথড্রয়াল ও পে-আউট রিকোয়েস্ট তালিকা</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">ফিল্টার:</span>
              <select
                value={withdrawalFilter}
                onChange={(e) => setWithdrawalFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="all">সব রিকোয়েস্ট ({withdrawals.length})</option>
                <option value="pending">পেন্ডিং ({withdrawals.filter(w => w.status === 'pending').length})</option>
                <option value="approved">অনুমোদিত / পেইড</option>
                <option value="rejected">বাতিলকৃত</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">তারিখ</th>
                  <th className="px-4 py-3">অ্যাফিলিয়েট</th>
                  <th className="px-4 py-3">উইথড্রয়াল পরিমাণ</th>
                  <th className="px-4 py-3">পেমেন্ট মেথড</th>
                  <th className="px-4 py-3">অ্যাকাউন্ট নম্বর</th>
                  <th className="px-4 py-3">ট্রানজেকশন আইডি</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      কোনো উইথড্রয়াল রিকোয়েস্ট নেই
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 text-slate-600 font-medium">{w.requestDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{w.affiliateName}</div>
                        <div className="text-[11px] text-slate-500">{w.affiliatePhone}</div>
                      </td>
                      <td className="px-4 py-3 font-black text-emerald-700 text-sm">
                        ৳ {w.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{w.paymentMethod}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{w.paymentNumber}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {w.transactionId || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : w.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {w.status === 'approved' ? '✓ সম্পন্ন হয়েছে' : w.status === 'pending' ? 'অপেক্ষমাণ' : 'বাতিল'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {w.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setProcessingWithdrawalId(w.id);
                                setTransactionIdInput('TRX-' + Math.floor(100000 + Math.random() * 900000));
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              পেমেন্ট করুন
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(w.id)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-semibold border border-rose-200 cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Processing Payment */}
          {processingWithdrawalId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-sm text-slate-900">পেমেন্ট নিশ্চিতকরণ ও অনুমোদন</h4>
                  <button
                    onClick={() => setProcessingWithdrawalId(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">ট্রানজেকশন আইডি (bKash/Nagad TrxID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: BK-8492048"
                      value={transactionIdInput}
                      onChange={(e) => setTransactionIdInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">অ্যাডমিন নোট (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="বিকাশ সেন্ড মানি করা হয়েছে"
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setProcessingWithdrawalId(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={() => handleApproveWithdrawal(processingWithdrawalId)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    পেমেন্ট সম্পন্ন করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS & POLICIES */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            <span>অ্যাফিলিয়েট প্রোগ্রাম সেটিংস ও নীতিমালা</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Toggle Program */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">প্রোগ্রাম স্ট্যাটাস</span>
                  <span className="text-slate-500 text-xs">অ্যাফিলিয়েট রেজিস্ট্রেশন ও লিংক জেনারেশন চালু থাকবে কি না</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.isEnabled}
                  onChange={(e) => onUpdateConfig({ ...config, isEnabled: e.target.checked })}
                  className="w-5 h-5 text-sky-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Default Commission Rate */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block text-xs">ডিফল্ট কমিশন হার (%) *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.defaultCommissionPercent}
                  onChange={(e) => onUpdateConfig({ ...config, defaultCommissionPercent: Number(e.target.value) })}
                  className="w-24 px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-sm"
                />
                <span className="text-slate-600 font-semibold">% (প্রতি সফল বিক্রয়ে)</span>
              </div>
            </div>

            {/* Minimum Payout */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block text-xs">সর্বনিম্ন উইথড্রয়াল সীমা (৳) *</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={config.minimumWithdrawalAmount}
                  onChange={(e) => onUpdateConfig({ ...config, minimumWithdrawalAmount: Number(e.target.value) })}
                  className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-sm"
                />
                <span className="text-slate-600 font-semibold">টাকা</span>
              </div>
            </div>

            {/* Cookie Tracking Duration */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block text-xs">রেফারেল ট্র্যাকিং মেয়াদ (দিন) *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={config.cookieDurationDays}
                  onChange={(e) => onUpdateConfig({ ...config, cookieDurationDays: Number(e.target.value) })}
                  className="w-24 px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-sm"
                />
                <span className="text-slate-600 font-semibold">দিন পর্যন্ত কুকিজ ট্র্যাকিং সংরক্ষিত থাকবে</span>
              </div>
            </div>

            {/* Banner Title */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 md:col-span-2">
              <label className="font-bold text-slate-800 block text-xs">অ্যাফিলিয়েট পোর্টাল ব্যানার শিরোনাম</label>
              <input
                type="text"
                value={config.bannerTitle}
                onChange={(e) => onUpdateConfig({ ...config, bannerTitle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-xs"
              />
            </div>

            {/* Video Tutorial URL */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 md:col-span-2">
              <label className="font-bold text-slate-800 block text-xs">টিউটোরিয়াল ভিডিও এমবেড ইউআরএল (YouTube Embed Link)</label>
              <input
                type="text"
                value={config.tutorialVideoUrl}
                onChange={(e) => onUpdateConfig({ ...config, tutorialVideoUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
