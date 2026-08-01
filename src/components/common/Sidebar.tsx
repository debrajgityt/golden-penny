import React from 'react';
import {
  LayoutDashboard,
  Landmark,
  Receipt,
  Wallet,
  TrendingUp,
  Banknote,
  Bot,
  Settings,
  User,
  LogOut,
  X,
  ShieldCheck,
  Coins,
  Bell,
  BookOpen,
} from 'lucide-react';
import { Logo } from './Logo';
import { useFinance, TabType } from '../../context/FinanceContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, user, logout, setIsAuthModalOpen } = useFinance();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'accounts', label: 'Accounts', icon: <Landmark className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <Wallet className="w-5 h-5" /> },
    { id: 'investments', label: 'Investments', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'bills', label: 'Bills', icon: <Banknote className="w-5 h-5" /> },
    { id: 'alerts', label: 'Alerts & Reminders', icon: <Bell className="w-5 h-5" /> },
    { id: 'guide', label: 'User Guide', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#131316] border-r border-[#27272A] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header Branding */}
          <div className="flex items-center justify-between mb-6 px-1">
            <Logo variant="full" size="md" />
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-[#908FA0] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#F59E0B] font-bold bg-[#2A2A2D] border-r-2 border-[#F59E0B]'
                      : 'text-[#C7C4D7] hover:bg-[#1F1F22] hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#F59E0B]' : 'text-[#908FA0]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account Info Card */}
          <div className="pt-3 border-t border-[#27272A] space-y-1">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full text-left p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-[#6366F1] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span className="truncate">{user.name}</span>
                    {user.isVerified && <ShieldCheck className="w-3 h-3 text-[#4EDEA3] shrink-0" />}
                  </div>
                  <div className="text-[10px] text-[#908FA0] truncate">{user.email}</div>
                </div>
              </div>
              <LogOut
                className="w-4 h-4 text-[#908FA0] hover:text-[#EF4444] shrink-0 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
              />
            </button>

            {/* Copyright & Author Section */}
            <div className="pt-3 text-center px-1">
              <p className="text-[11px] font-medium text-[#908FA0]">
                © 2026 <span className="font-bold text-[#E4E1E6]">Golden Penny</span>
              </p>
              <p className="text-[10px] text-[#908FA0] mt-0.5">
                Author & Creator:{' '}
                <span className="text-[#F59E0B] font-semibold">Debraj Bhowmick</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

