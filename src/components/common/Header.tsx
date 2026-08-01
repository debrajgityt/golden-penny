import React, { useState } from 'react';
import { Search, Bell, Plus, Menu, ArrowUpDown, Download, Upload, ShieldCheck, User } from 'lucide-react';
import { Logo } from './Logo';
import { useFinance } from '../../context/FinanceContext';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  searchPlaceholder?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  title = 'Golden Penny',
  searchPlaceholder = 'Search transactions, accounts, rules...',
}) => {
  const {
    currency,
    toggleCurrency,
    setIsAddExpenseOpen,
    setIsUploadExpenseOpen,
    setIsExportModalOpen,
    setIsAuthModalOpen,
    setActiveTab,
    user,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setActiveTab('transactions');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131316]/80 backdrop-blur-xl border-b border-[#27272A] flex justify-between items-center h-16 px-4 lg:px-6 ml-0 lg:ml-64">
      <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[#908FA0] hover:text-white rounded-lg hover:bg-[#2A2A2D]"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:inline-block lg:hidden">
          <Logo variant="full" size="sm" />
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-md group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#908FA0] group-focus-within:text-[#C0C1FF] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className="w-full bg-[#1B1B1E] border border-[#27272A] rounded-full pl-10 pr-4 py-1.5 text-sm text-[#E4E1E6] placeholder-[#908FA0] focus:ring-2 focus:ring-[#6366F1] focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Bulk Upload / Statement Import Button */}
        <button
          onClick={() => setIsUploadExpenseOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3F3F46] bg-[#18181B] text-xs font-semibold text-[#E4E1E6] hover:bg-[#27272A] hover:border-[#6366F1] transition-all"
          title="Upload statement or bulk import expenses"
        >
          <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Upload / Import</span>
        </button>

        {/* Export statement button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#27272A] text-xs font-semibold text-[#E4E1E6] hover:bg-[#2A2A2D] transition-colors"
          title="Export Customizable Date-wise Report (PDF/Excel)"
        >
          <Download className="w-3.5 h-3.5 text-[#C0C1FF]" />
          <span>Report</span>
        </button>

        {/* Currency Toggle */}
        <button
          onClick={toggleCurrency}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1F1F22] border border-[#27272A] rounded-lg text-xs font-bold text-[#4EDEA3] hover:bg-[#2A2A2D] transition-colors"
          title="Switch USD/INR"
        >
          <span className="font-mono">{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
          <ArrowUpDown className="w-3 h-3 text-[#908FA0]" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveTab('alerts')}
          className="relative p-2 text-[#908FA0] hover:text-[#C0C1FF] rounded-lg transition-colors"
          title="Payment Alerts & Reminders"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" />
        </button>

        {/* Add Expense Primary Button */}
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="bg-[#6366F1] text-white px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1 hover:opacity-90 transition-all active:scale-95 shadow-md shadow-[#6366F1]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Expense</span>
        </button>

        {/* User Profile Button */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1F1F22] border border-transparent hover:border-[#27272A] transition-all"
          title="Account Settings & Verification"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#F59E0B]/50 shrink-0 bg-[#27272A] flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-[#F59E0B]" />
            )}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{user.name}</span>
              {user.isVerified && <ShieldCheck className="w-3 h-3 text-[#4EDEA3]" />}
            </div>
            <span className="text-[10px] text-[#908FA0]">{user.email}</span>
          </div>
        </button>
      </div>
    </header>
  );
};

