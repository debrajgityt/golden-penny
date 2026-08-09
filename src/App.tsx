import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ModalsContainer } from './components/common/Modals';
import { AuthModal } from './components/common/AuthModal';
import { AuthGate } from './components/common/AuthGate';

import { OverviewScreen } from './components/dashboard/OverviewScreen';
import { TransactionsScreen } from './components/transactions/TransactionsScreen';
import { BudgetsScreen } from './components/budgets/BudgetsScreen';
import { AiAssistantScreen } from './components/ai/AiAssistantScreen';
import { AccountsScreen } from './components/accounts/AccountsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { InvestmentsScreen } from './components/investments/InvestmentsScreen';
import { BillsScreen } from './components/bills/BillsScreen';
import { AlertsScreen } from './components/alerts/AlertsScreen';
import { UserGuideScreen } from './components/guide/UserGuideScreen';

const MainContent: React.FC = () => {
  const { activeTab, user } = useFinance();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── AUTH GATE ──────────────────────────────────────────────────────────────
  // When the user is not authenticated, render the full-screen login page.
  // The dashboard is completely hidden — no data is visible to unauthenticated
  // visitors. The AuthGate has no dismiss/close button.
  if (user.authMethod === 'guest') {
    return <AuthGate />;
  }
  // ──────────────────────────────────────────────────────────────────────────

  const renderScreen = () => {
    switch (activeTab) {
      case 'overview':      return <OverviewScreen />;
      case 'accounts':      return <AccountsScreen />;
      case 'transactions':  return <TransactionsScreen />;
      case 'bills':         return <BillsScreen />;
      case 'budgets':       return <BudgetsScreen />;
      case 'investments':   return <InvestmentsScreen />;
      case 'alerts':        return <AlertsScreen />;
      case 'guide':         return <UserGuideScreen />;
      case 'ai':            return <AiAssistantScreen />;
      case 'settings':      return <SettingsScreen />;
      default:              return <OverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E4E1E6] font-sans selection:bg-[#6366F1] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Header */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Main Screen Container */}
      <main className="ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto transition-all">
        {renderScreen()}
      </main>

      {/* Modals Layer */}
      <ModalsContainer />
      {/* AuthModal: only used when logged-in user clicks their profile avatar
          (shows profile card + sign-out button). */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
