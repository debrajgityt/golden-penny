export type CurrencyMode = 'USD' | 'INR' | 'EUR' | 'GBP';

export type LlmProvider = 'gemini' | 'openai' | 'openrouter';

export type TransactionStatus = 'Cleared' | 'Pending' | 'Unmatched';

export interface AlertItem {
  id: string;
  title: string;
  category: 'EMI' | 'Subscription' | 'Prepaid' | 'Tax' | 'GST';
  amount: number;
  dueDate: string;
  vendor: string;
  mobileNumber: string;
  email: string;
  status: 'Pending' | 'Sent' | 'Paid';
  channels: ('Email' | 'WhatsApp' | 'Telegram' | 'Browser')[];
  description?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO or formatted string
  rawDate: string; // for sorting e.g. "2023-10-24"
  description: string;
  details?: string;
  account: string;
  accountSource: string;
  category: string;
  status: TransactionStatus;
  amount: number; // positive for income, negative for expense (or store absolute with type)
  type: 'expense' | 'income';
  receiptUrl?: string;
  paymentMode: 'Credit Card' | 'Wire Transfer' | 'Stripe' | 'Bank Transfer' | 'UPI';
  categoryBreakdown?: { label: string; amount: number }[];
  matchConfidence?: number; // e.g., 98 for 98% match
  reconciledDate?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  customAvatarUrl?: string;
  isVerified: boolean;
  authMethod: 'google' | 'email' | 'guest';
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  category: 'Mutual Funds' | 'Stocks' | 'SIP' | 'Crypto' | 'Gold' | 'Real Estate';
  investedAmount: number;
  currentValue: number;
  returnsPercent: number;
  monthlySipAmount?: number;
}

export interface Bill {
  id: string;
  name: string;
  vendor: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  autoPay: boolean;
  account: string;
  lastPaidDate?: string;
}

export interface CategoryBudget {
  id: string;
  name: string;
  icon: string;
  spent: number;
  allocated: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetDate: string; // e.g. "DEC 2024"
  description: string;
  currentAmount: number;
  targetAmount: number;
}

export interface AIInsight {
  id: string;
  type: 'anomaly' | 'forecasting' | 'reminder' | 'pulse';
  title: string;
  description: string;
  amountText?: string;
  detectedTime?: string;
  badgeText?: string;
  badgeColor?: 'error' | 'secondary' | 'primary' | 'tertiary';
  actionText?: string;
  actionType?: 'audit' | 'reconcile' | 'cancel_subscription';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  dataCard?: {
    title: string;
    merchant: string;
    wasteAmount: number;
    actionText: string;
    actionType: 'cancel_duplicate';
  };
}

export interface AccountBalance {
  id: string;
  name: string;
  type: string;
  accountNumber: string;
  balance: number;
  institution: string;
}
