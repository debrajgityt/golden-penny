import React, { useState } from 'react';
import {
  Landmark,
  CreditCard,
  Building2,
  RefreshCw,
  Plus,
  ShieldCheck,
  ArrowUpRight,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const AccountsScreen: React.FC = () => {
  const { accounts, formatCurrency, setActiveTab, setIsConnectAccountOpen, deleteAccount } = useFinance();
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
    }, 800);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#18181B] p-6 rounded-2xl border border-[#27272A]">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#6366F1]" />
            <span>Bank & Card Accounts</span>
          </h2>
          <p className="text-xs text-[#908FA0] mt-1">
            256-bit encrypted OpenBanking connections across checking, savings, and credit cards.
          </p>
        </div>

        <button
          onClick={() => setIsConnectAccountOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-[#6366F1]/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Account</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const isCredit = acc.type === 'Credit Card';
          const isSyncing = syncingId === acc.id;

          return (
            <div
              key={acc.id}
              className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl flex flex-col justify-between hover:border-[#6366F1] transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1B1B1E] border border-[#27272A] rounded-xl text-[#C0C1FF]">
                    {isCredit ? <CreditCard className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{acc.name}</h4>
                    <span className="text-[11px] text-[#908FA0]">{acc.institution}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#908FA0] bg-[#1B1B1E] border border-[#27272A] px-2 py-0.5 rounded">
                    {acc.accountNumber}
                  </span>
                  <button
                    onClick={() => deleteAccount(acc.id)}
                    className="p-1 text-[#908FA0] hover:text-[#EF4444] rounded transition-colors"
                    title="Delete Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#908FA0] tracking-wider block">
                  {isCredit ? 'Credit Balance Used' : 'Available Balance'}
                </span>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    acc.balance < 0 ? 'text-[#FFB4AB]' : 'text-[#4EDEA3]'
                  }`}
                >
                  {formatCurrency(acc.balance)}
                </div>
              </div>

              <div className="pt-3 border-t border-[#27272A] flex justify-between items-center text-xs">
                <button
                  onClick={() => handleSync(acc.id)}
                  className="text-[#908FA0] hover:text-white flex items-center gap-1 transition-colors"
                  title="Force Sync Balance"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-[#F59E0B] animate-spin" />
                      <span className="text-[11px] text-[#F59E0B]">Syncing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#4EDEA3]" />
                      <span className="text-[11px]">Synced Just Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-[#6366F1] font-bold hover:underline flex items-center gap-1"
                >
                  <span>View GL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

