import React, { createContext, useContext, useState } from 'react';
import {
  Transaction,
  CategoryBudget,
  FinancialGoal,
  AIInsight,
  ChatMessage,
  CurrencyMode,
  LlmProvider,
  UserProfile,
  AccountBalance,
  Investment,
  Bill,
} from '../types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_AI_MESSAGES,
  INITIAL_AI_INSIGHTS,
  INITIAL_ACCOUNTS,
  INITIAL_INVESTMENTS,
  INITIAL_BILLS,
  INITIAL_USER,
  INITIAL_ALERTS,
} from '../mockData';
import { AlertItem } from '../types';

export type TabType =
  | 'overview'
  | 'accounts'
  | 'transactions'
  | 'budgets'
  | 'investments'
  | 'bills'
  | 'alerts'
  | 'guide'
  | 'ai'
  | 'settings';

interface FinanceContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currency: CurrencyMode;
  setCurrency: (currency: CurrencyMode) => void;
  toggleCurrency: () => void;
  formatCurrency: (amountInUSD: number) => string;
  usdToInrRate: number;

  // User Auth & Profile
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string) => string; // returns mock otp code
  signupWithEmail: (name: string, email: string, password: string) => string; // create account, returns otp
  verifyEmailOtp: (email: string, code: string) => boolean;
  logout: () => void;

  // Data Reset & Backup / Restore
  resetAllData: () => void;
  exportDataBackupJSON: () => void;
  importDataBackupJSON: (jsonData: any) => { success: boolean; message: string };

  // Alerts & Notifications
  alerts: AlertItem[];
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  deleteAlert: (id: string) => void;
  triggerAlertDispatch: (alert: AlertItem, channel: 'Email' | 'WhatsApp' | 'Telegram' | 'Browser') => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'rawDate'>) => void;
  editTransaction: (id: string, updatedTx: Partial<Transaction>) => void;
  bulkImportTransactions: (txs: Omit<Transaction, 'id' | 'rawDate'>[]) => void;
  reconcileTransaction: (id: string) => void;
  flagTransaction: (id: string) => void;
  bulkMatchReconcile: (ids?: string[]) => void;

  // Accounts
  accounts: AccountBalance[];
  addAccount: (acc: Omit<AccountBalance, 'id'>) => void;
  deleteAccount: (id: string) => void;

  // Investments
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, 'id'>) => void;

  // Bills
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  payBill: (id: string) => void;
  toggleAutoPay: (id: string) => void;

  // Budgets & Goals
  budgets: CategoryBudget[];
  updateCategoryBudget: (id: string, allocated: number) => void;
  goals: FinancialGoal[];
  addFundsToGoal: (goalId: string, amountUSD: number) => void;
  createGoal: (goal: Omit<FinancialGoal, 'id'>) => void;

  // AI Assistant
  aiMessages: ChatMessage[];
  aiInsights: AIInsight[];
  sendAiMessage: (text: string) => Promise<void>;
  cancelDuplicateSubscription: (merchantName: string) => void;
  llmProvider: LlmProvider;
  setLlmProvider: (provider: LlmProvider) => void;
  userLlmKey: string;
  setUserLlmKey: (key: string) => void;

  selectedTxId: string | null;
  setSelectedTxId: (id: string | null) => void;

  // Modals
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isUploadExpenseOpen: boolean;
  setIsUploadExpenseOpen: (open: boolean) => void;
  isConnectAccountOpen: boolean;
  setIsConnectAccountOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEditTxOpen: boolean;
  setIsEditTxOpen: (open: boolean) => void;
  editingTx: Transaction | null;
  setEditingTx: (tx: Transaction | null) => void;
  isAddInvestmentOpen: boolean;
  setIsAddInvestmentOpen: (open: boolean) => void;
  isAddBillOpen: boolean;
  setIsAddBillOpen: (open: boolean) => void;
  isAddFundsOpen: boolean;
  setIsAddFundsOpen: (open: boolean) => void;
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;
  isNewGoalOpen: boolean;
  setIsNewGoalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isAuditModalOpen: boolean;
  setIsAuditModalOpen: (open: boolean) => void;

  // Metrics
  netWorthUSD: number;
  monthlyIncomeUSD: number;
  monthlyExpensesUSD: number;
  monthlyInvestmentsUSD: number;
  monthlySpendLimitUSD: number;
  remainingBudgetUSD: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const USD_TO_INR = 83.5;

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currency, setCurrency] = useState<CurrencyMode>('INR');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [accounts, setAccounts] = useState<AccountBalance[]>(INITIAL_ACCOUNTS);
  const [investments, setInvestments] = useState<Investment[]>(INITIAL_INVESTMENTS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>(INITIAL_AI_MESSAGES);
  const [aiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [selectedTxId, setSelectedTxId] = useState<string | null>('tx-1');

  // LLM Provider State
  const [llmProvider, setLlmProvider] = useState<LlmProvider>('gemini');
  const [userLlmKey, setUserLlmKey] = useState<string>('');

  // Modal States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isUploadExpenseOpen, setIsUploadExpenseOpen] = useState(false);
  const [isConnectAccountOpen, setIsConnectAccountOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditTxOpen, setIsEditTxOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const toggleCurrency = () => {
    setCurrency((prev) => {
      if (prev === 'USD') return 'INR';
      if (prev === 'INR') return 'EUR';
      if (prev === 'EUR') return 'GBP';
      return 'USD';
    });
  };

  const formatCurrency = (amountInUSD: number): string => {
    const isNegative = amountInUSD < 0;
    const absVal = Math.abs(amountInUSD);

    if (currency === 'INR') {
      const inrValue = Math.round(absVal * USD_TO_INR);
      return `${isNegative ? '-' : ''}₹${inrValue.toLocaleString('en-IN')}`;
    }
    if (currency === 'EUR') {
      const eurVal = absVal * 0.92;
      return `${isNegative ? '-' : ''}€${eurVal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    if (currency === 'GBP') {
      const gbpVal = absVal * 0.78;
      return `${isNegative ? '-' : ''}£${gbpVal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    return `${isNegative ? '-' : ''}$${absVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // Reset All Data Function
  const resetAllData = () => {
    setTransactions([]);
    setBills([]);
    setGoals([]);
    setAccounts([]);
    setInvestments([]);
    setAlerts([]);
    setBudgets((prev) => prev.map((b) => ({ ...b, spent: 0 })));
  };

  // Backup & Restore Functions
  const exportDataBackupJSON = () => {
    const backupData = {
      app: 'Golden Penny Personal Wealth OS',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user,
      currency,
      transactions,
      accounts,
      investments,
      bills,
      budgets,
      goals,
      alerts,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `golden_penny_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataBackupJSON = (jsonData: any) => {
    try {
      if (!jsonData || typeof jsonData !== 'object') {
        return { success: false, message: 'Invalid backup format' };
      }

      let restoredCount = 0;

      if (Array.isArray(jsonData.transactions) && jsonData.transactions.length > 0) {
        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newItems = jsonData.transactions.filter((t: any) => !existingIds.has(t.id));
          restoredCount += newItems.length;
          return [...newItems, ...prev];
        });
      }

      if (Array.isArray(jsonData.accounts) && jsonData.accounts.length > 0) {
        setAccounts((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newItems = jsonData.accounts.filter((a: any) => !existingIds.has(a.id));
          return [...prev, ...newItems];
        });
      }

      if (Array.isArray(jsonData.investments) && jsonData.investments.length > 0) {
        setInvestments((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newItems = jsonData.investments.filter((i: any) => !existingIds.has(i.id));
          return [...prev, ...newItems];
        });
      }

      if (Array.isArray(jsonData.bills) && jsonData.bills.length > 0) {
        setBills((prev) => {
          const existingIds = new Set(prev.map((b) => b.id));
          const newItems = jsonData.bills.filter((b: any) => !existingIds.has(b.id));
          return [...prev, ...newItems];
        });
      }

      if (Array.isArray(jsonData.alerts) && jsonData.alerts.length > 0) {
        setAlerts((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newItems = jsonData.alerts.filter((a: any) => !existingIds.has(a.id));
          return [...prev, ...newItems];
        });
      }

      return {
        success: true,
        message: `Successfully restored backup data! Merged record items into Golden Penny.`,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to restore JSON file' };
    }
  };

  // Alerts Management
  const addAlert = (alert: Omit<AlertItem, 'id'>) => {
    const newAlert: AlertItem = {
      ...alert,
      id: `alert-${Date.now()}`,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const triggerAlertDispatch = (alert: AlertItem, channel: 'Email' | 'WhatsApp' | 'Telegram' | 'Browser') => {
    const cleanPhone = (alert.mobileNumber || user.phone || '+919804791288').replace(/[^0-9]/g, '');
    const msg = `Golden Penny Alert Reminder: ${alert.title} of ${formatCurrency(alert.amount)} is due on ${alert.dueDate} for ${alert.vendor}.`;

    if (channel === 'WhatsApp') {
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    } else if (channel === 'Email') {
      const mailUrl = `mailto:${alert.email || user.email}?subject=${encodeURIComponent(alert.title)}&body=${encodeURIComponent(msg)}`;
      window.open(mailUrl, '_blank');
    } else if (channel === 'Telegram') {
      const url = `https://t.me/share/url?url=${encodeURIComponent('https://goldenpenny.app')}&text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    } else if (channel === 'Browser') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(alert.title, { body: msg });
      } else {
        window.alert(`${alert.title}\n${msg}`);
      }
    }
  };

  // Auth Functions
  const loginWithGoogle = () => {
    setUser({
      name: 'Debraj Bhowmick',
      email: 'debrajbhowmick89@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBithLGA1M436N_jIuqPXRQlB2iV0JL9tHOR-9sA-73-ljYYeqMXyZkan9uMcnejXlI12S9BioB2JpVImUyD2kunfCfZW1SKWKEBZVdE9RVB9WYTQVrbf7z0KRwMowDWPf7ed2dQ58rNafgAOZe4lLAm51v0q_LHK-OB-LCDJMVUllyhafJ7Ka68h64ebuVkFL9HeDuLMPJQ544mm-8ua1LsmWrsMZwsS6ZaCNytsIO_CsMw3jwo09Q',
      isVerified: true,
      authMethod: 'google',
    });
  };

  const loginWithEmail = (email: string) => {
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setUser({
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User',
      email,
      avatar: '',
      isVerified: false,
      authMethod: 'email',
    });
    return mockCode;
  };

  const signupWithEmail = (name: string, email: string, _password: string) => {
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setUser({
      name: name || email.split('@')[0],
      email,
      avatar: '',
      isVerified: false,
      authMethod: 'email',
    });
    return mockCode;
  };

  const verifyEmailOtp = (_email: string, code: string) => {
    if (code.length === 6) {
      setUser((prev) => ({ ...prev, isVerified: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser({
      name: 'Guest User',
      email: 'guest@goldenpenny.app',
      avatar: '',
      isVerified: false,
      authMethod: 'guest',
    });
    // Reopen auth modal so user sees Sign In screen (not silent guest mode)
    setIsAuthModalOpen(true);
  };

  // Metrics calculations
  const totalAccountBalancesUSD = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalInvestmentsValueUSD = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const netWorthUSD = totalAccountBalancesUSD + totalInvestmentsValueUSD;

  const monthlyIncomeUSD = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0) || 2215.56;

  const monthlyExpensesUSD = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyInvestmentsUSD = investments.reduce(
    (acc, i) => acc + (i.monthlySipAmount || 0),
    0
  );

  const monthlySpendLimitUSD = 2500.0;
  const remainingBudgetUSD = Math.max(0, monthlySpendLimitUSD - monthlyExpensesUSD);

  // Accounts CRUD
  const addAccount = (acc: Omit<AccountBalance, 'id'>) => {
    const newAcc: AccountBalance = {
      ...acc,
      id: `acc-${Date.now()}`,
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Investments CRUD
  const addInvestment = (inv: Omit<Investment, 'id'>) => {
    const newInv: Investment = {
      ...inv,
      id: `inv-${Date.now()}`,
    };
    setInvestments((prev) => [newInv, ...prev]);
  };

  // Bills CRUD
  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill-${Date.now()}`,
    };
    setBills((prev) => [newBill, ...prev]);
  };

  const payBill = (id: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: 'Paid' as const, lastPaidDate: new Date().toISOString().split('T')[0] }
          : b
      )
    );
  };

  const toggleAutoPay = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, autoPay: !b.autoPay } : b))
    );
  };

  // Transaction CRUD & Reconcile
  const addTransaction = (tx: Omit<Transaction, 'id' | 'rawDate'>) => {
    const id = `tx-${Date.now()}`;
    const rawDate = new Date().toISOString().split('T')[0];
    const newTx: Transaction = {
      ...tx,
      id,
      rawDate,
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (tx.type === 'expense') {
      setBudgets((prevBudgets) =>
        prevBudgets.map((b) => {
          if (
            b.name.toLowerCase() === tx.category.toLowerCase() ||
            tx.category.toLowerCase().includes(b.name.toLowerCase())
          ) {
            return { ...b, spent: b.spent + tx.amount };
          }
          return b;
        })
      );
    }
  };

  const editTransaction = (id: string, updatedTx: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTx } : t))
    );
  };

  const bulkImportTransactions = (txs: Omit<Transaction, 'id' | 'rawDate'>[]) => {
    const newItems: Transaction[] = txs.map((tx, idx) => ({
      ...tx,
      id: `tx-imp-${Date.now()}-${idx}`,
      rawDate: tx.date || new Date().toISOString().split('T')[0],
    }));
    setTransactions((prev) => [...newItems, ...prev]);
  };

  const reconcileTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Cleared' as const,
              matchConfidence: 100,
              reconciledDate: new Date().toLocaleDateString(),
            }
          : t
      )
    );
  };

  const flagTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Pending' as const } : t))
    );
  };

  const bulkMatchReconcile = (ids?: string[]) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (!ids || ids.length === 0 || ids.includes(t.id) || t.status === 'Unmatched') {
          return {
            ...t,
            status: 'Cleared' as const,
            matchConfidence: Math.floor(Math.random() * 5) + 95, // 95% - 99%
            reconciledDate: new Date().toLocaleDateString(),
          };
        }
        return t;
      })
    );
  };

  const updateCategoryBudget = (id: string, allocated: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, allocated } : b))
    );
  };

  const addFundsToGoal = (goalId: string, amountUSD: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + amountUSD }
          : g
      )
    );
  };

  const createGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: `g-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const cancelDuplicateSubscription = (merchantName: string) => {
    setAiMessages((prev) =>
      prev.map((msg) => {
        if (msg.dataCard?.merchant === merchantName) {
          return {
            ...msg,
            text: `${msg.text} (Cancelled duplicate subscription. Savings: $12.99/mo)`,
            dataCard: undefined,
          };
        }
        return msg;
      })
    );
  };

  const sendAiMessage = async (userText: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      time,
    };

    setAiMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          provider: llmProvider,
          apiKey: userLlmKey,
          context: {
            netWorthUSD,
            monthlyExpensesUSD,
            monthlyIncomeUSD,
            transactionsCount: transactions.length,
            accountsCount: accounts.length,
            investmentsCount: investments.length,
          },
        }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || 'I am analyzing your Golden Penny financial records.';

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setAiMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const fallbackAiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `I've analyzed "${userText}". Your net worth is ${formatCurrency(
          netWorthUSD
        )} with monthly cash flow of ${formatCurrency(monthlyIncomeUSD)} income vs ${formatCurrency(
          monthlyExpensesUSD
        )} expenses. All records are indexed.`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setAiMessages((prev) => [...prev, fallbackAiMessage]);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        toggleCurrency,
        formatCurrency,
        usdToInrRate: USD_TO_INR,

        user,
        updateUserProfile,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        verifyEmailOtp,
        logout,

        resetAllData,
        exportDataBackupJSON,
        importDataBackupJSON,

        alerts,
        addAlert,
        deleteAlert,
        triggerAlertDispatch,

        transactions,
        addTransaction,
        editTransaction,
        bulkImportTransactions,
        reconcileTransaction,
        flagTransaction,
        bulkMatchReconcile,

        accounts,
        addAccount,
        deleteAccount,

        investments,
        addInvestment,

        bills,
        addBill,
        payBill,
        toggleAutoPay,

        budgets,
        updateCategoryBudget,

        goals,
        addFundsToGoal,
        createGoal,

        aiMessages,
        aiInsights,
        sendAiMessage,
        cancelDuplicateSubscription,
        llmProvider,
        setLlmProvider,
        userLlmKey,
        setUserLlmKey,

        selectedTxId,
        setSelectedTxId,

        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isUploadExpenseOpen,
        setIsUploadExpenseOpen,
        isConnectAccountOpen,
        setIsConnectAccountOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isEditTxOpen,
        setIsEditTxOpen,
        editingTx,
        setEditingTx,
        isAddInvestmentOpen,
        setIsAddInvestmentOpen,
        isAddBillOpen,
        setIsAddBillOpen,
        isAddFundsOpen,
        setIsAddFundsOpen,
        selectedGoalId,
        setSelectedGoalId,
        isNewGoalOpen,
        setIsNewGoalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isAuditModalOpen,
        setIsAuditModalOpen,

        netWorthUSD,
        monthlyIncomeUSD,
        monthlyExpensesUSD,
        monthlyInvestmentsUSD,
        monthlySpendLimitUSD,
        remainingBudgetUSD,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

