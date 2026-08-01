import {
  Transaction,
  CategoryBudget,
  FinancialGoal,
  AIInsight,
  ChatMessage,
  AccountBalance,
  AlertItem,
} from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: 'Oct 24, 2023',
    rawDate: '2023-10-24',
    description: 'AWS Cloud Hosting',
    details: 'INV-98210 - Monthly Infrastructure',
    account: 'Chase Business *9821',
    accountSource: 'Chase *9821 / SaaS',
    category: 'SaaS Subscriptions',
    status: 'Unmatched',
    amount: 1240.5,
    type: 'expense',
    paymentMode: 'Credit Card',
    receiptUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6jrkzY-rtjGJ22o2Lv56YrCh7XokxMHIStg1HisilC7eAfxgVfC6BbYllUeSPnoBU9OlVPHu84YeechLWMzI69X_vT9rpIL3ZWvuXwyhDVfMQG3m7vXOZd-Ir4tuGmAhx51FaNfOHQGDgbOZZXj69e3UdBuBgI0vZXLHREw5pTwn2YgHWZOsyvVe-4DQSovunkMzXDavulVR7FtkXQ15Vfa3R7KIlP4LsX0-Ighs4KzxSYCv352NC',
    categoryBreakdown: [
      { label: 'Infrastructure', amount: 1000.0 },
      { label: 'Service Tax', amount: 240.5 },
    ],
  },
  {
    id: 'tx-2',
    date: 'Oct 24, 2023',
    rawDate: '2023-10-24',
    description: 'Apple Store Online',
    details: 'MacBook Pro M3 Max Accessories',
    account: 'HDFC Platinum *4112',
    accountSource: 'HDFC *4112 / Tech',
    category: 'Shopping',
    status: 'Cleared',
    amount: 1555.0,
    type: 'expense',
    paymentMode: 'Credit Card',
    categoryBreakdown: [
      { label: 'Hardware', amount: 1400.0 },
      { label: 'AppleCare', amount: 155.0 },
    ],
  },
  {
    id: 'tx-3',
    date: 'Oct 24, 2023',
    rawDate: '2023-10-24',
    description: 'Starbucks Coffee #421',
    details: 'Internal Meeting Refreshments',
    account: 'Amex Business *1004',
    accountSource: 'Amex *1004 / Meals',
    category: 'Dining Out',
    status: 'Pending',
    amount: 12.4,
    type: 'expense',
    paymentMode: 'Credit Card',
    categoryBreakdown: [{ label: 'Beverages', amount: 12.4 }],
  },
  {
    id: 'tx-4',
    date: 'Oct 23, 2023',
    rawDate: '2023-10-23',
    description: 'OpenAI - ChatGPT Plus',
    details: 'Recurring Software Fee',
    account: 'Mercury Reserve *3120',
    accountSource: 'Mercury *3120 / Software',
    category: 'SaaS Subscriptions',
    status: 'Cleared',
    amount: 20.0,
    type: 'expense',
    paymentMode: 'Stripe',
    categoryBreakdown: [{ label: 'AI Tools', amount: 20.0 }],
  },
  {
    id: 'tx-5',
    date: 'Oct 23, 2023',
    rawDate: '2023-10-23',
    description: 'The Gourmet Bistro',
    details: 'Client Dinner Meeting',
    account: 'ICICI Wealth *8821',
    accountSource: 'ICICI *8821 / Dining',
    category: 'Dining Out',
    status: 'Pending',
    amount: 51.0,
    type: 'expense',
    paymentMode: 'Credit Card',
    categoryBreakdown: [{ label: 'Food & Beverage', amount: 51.0 }],
  },
  {
    id: 'tx-6',
    date: 'Oct 22, 2023',
    rawDate: '2023-10-22',
    description: 'Adobe Creative Cloud',
    details: 'Design Suite Subscription',
    account: 'Mercury Reserve *3120',
    accountSource: 'Mercury *3120 / Design',
    category: 'SaaS Subscriptions',
    status: 'Cleared',
    amount: 52.99,
    type: 'expense',
    paymentMode: 'Stripe',
    categoryBreakdown: [{ label: 'Software License', amount: 52.99 }],
  },
  {
    id: 'tx-7',
    date: 'Oct 21, 2023',
    rawDate: '2023-10-21',
    description: 'Tech Corp Salary',
    details: 'Bi-weekly Direct Deposit & Dividends',
    account: 'SBI Savings *9012',
    accountSource: 'SBI *9012 / Payroll',
    category: 'Income',
    status: 'Cleared',
    amount: 1976.0,
    type: 'income',
    paymentMode: 'Wire Transfer',
    categoryBreakdown: [
      { label: 'Base Salary', amount: 1800.0 },
      { label: 'Dividend Bonus', amount: 176.0 },
    ],
  },
  {
    id: 'tx-8',
    date: 'Oct 21, 2023',
    rawDate: '2023-10-21',
    description: 'Delta Airlines - HQ Flight',
    details: 'Business Travel Expense to NYC HQ',
    account: 'Chase Business *9821',
    accountSource: 'Chase *9821 / Travel',
    category: 'Travel',
    status: 'Unmatched',
    amount: 4520.0,
    type: 'expense',
    paymentMode: 'Wire Transfer',
    categoryBreakdown: [
      { label: 'Airfare', amount: 4100.0 },
      { label: 'Luggage Fees', amount: 420.0 },
    ],
  },
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  {
    id: 'b-1',
    name: 'Groceries',
    icon: 'shopping_cart',
    spent: 148.5, // ~$148.50 (~₹12,400)
    allocated: 239.5, // ~$239.50 (~₹20,000)
  },
  {
    id: 'b-2',
    name: 'Rent',
    icon: 'home',
    spent: 538.92, // ~$538.92 (~₹45,000)
    allocated: 538.92, // (~₹45,000)
  },
  {
    id: 'b-3',
    name: 'Utilities',
    icon: 'bolt',
    spent: 81.44, // ~$81.44 (~₹6,800)
    allocated: 95.8, // ~$95.80 (~₹8,000)
  },
  {
    id: 'b-4',
    name: 'Shopping',
    icon: 'payments',
    spent: 221.55, // ~$221.55 (~₹18,500)
    allocated: 179.64, // ~$179.64 (~₹15,000)
  },
  {
    id: 'b-5',
    name: 'Travel',
    icon: 'flight',
    spent: 23.95, // ~$23.95 (~₹2,000)
    allocated: 143.71, // ~$143.71 (~₹12,000)
  },
  {
    id: 'b-6',
    name: 'Entertainment',
    icon: 'movie',
    spent: 41.91, // ~$41.91 (~₹3,500)
    allocated: 119.76, // ~$119.76 (~₹10,000)
  },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'g-1',
    title: 'Emergency Fund',
    targetDate: 'BY DEC 2024',
    description: 'Safety net for 6 months of living expenses including rent and medical.',
    currentAmount: 3832.33, // (~₹3,20,000)
    targetAmount: 5988.02, // (~₹5,00,000)
  },
  {
    id: 'g-2',
    title: 'Japan Vacation',
    targetDate: 'BY OCT 2024',
    description: 'Flights, accommodation and dining for a 14-day trip to Tokyo and Kyoto.',
    currentAmount: 2215.56, // (~₹1,85,000)
    targetAmount: 2994.01, // (~₹2,50,000)
  },
  {
    id: 'g-3',
    title: 'Car Loan EMI',
    targetDate: 'BY SEP 2024',
    description: 'Monthly recurring installment for the SUV financing plan.',
    currentAmount: 179.64, // (~₹15,000)
    targetAmount: 299.4, // (~₹25,000)
  },
];

export const INITIAL_ACCOUNTS: AccountBalance[] = [
  {
    id: 'acc-1',
    name: 'HDFC Platinum Card',
    type: 'Credit Card',
    accountNumber: '*4112',
    balance: -1555.0,
    institution: 'HDFC Bank',
  },
  {
    id: 'acc-2',
    name: 'Chase Business Reserve',
    type: 'Checking',
    accountNumber: '*9821',
    balance: 45200.0,
    institution: 'Chase',
  },
  {
    id: 'acc-3',
    name: 'ICICI Wealth Savings',
    type: 'Savings',
    accountNumber: '*8821',
    balance: 18450.0,
    institution: 'ICICI Bank',
  },
  {
    id: 'acc-4',
    name: 'Mercury Treasury',
    type: 'Money Market',
    accountNumber: '*3120',
    balance: 125000.0,
    institution: 'Mercury',
  },
  {
    id: 'acc-5',
    name: 'SBI Primary Savings',
    type: 'Savings',
    accountNumber: '*9012',
    balance: 8900.0,
    institution: 'State Bank of India',
  },
];

export const INITIAL_AI_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Good morning, Alex. I've finished scanning your accounts. Your net worth grew by 2.4% this week. Would you like a breakdown of the contributors?",
    time: '09:41 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Yes, please. Also, check if I have any duplicate subscriptions from last month.',
    time: '09:43 AM',
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'I found 2 potential duplicates. You are being billed for both "CloudStore Pro" and "CloudStore Basic". Total monthly waste: $12.99.',
    time: '09:44 AM',
    dataCard: {
      title: 'CloudStore Pro Duplicate',
      merchant: 'CLOUD_SERVICES_INC',
      wasteAmount: 12.99,
      actionText: 'Cancel Basic',
      actionType: 'cancel_duplicate',
    },
  },
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'anomaly',
    title: 'Anomaly: AWS Cloud Expense',
    description:
      'Your AWS Cloud expense jumped 14% above the 3-month moving average. This deviates significantly from your regular usage patterns.',
    amountText: '+$412.50 vs Avg',
    detectedTime: 'DETECTED 2m AGO',
    actionText: 'Audit Usage',
    actionType: 'audit',
  },
  {
    id: 'insight-2',
    type: 'forecasting',
    title: 'Budget Forecasting',
    description:
      'At current burn rates, you will reach your "Summer Travel" goal 12 days earlier than projected. Suggesting a $200 allocation to Investments.',
    badgeText: 'OPTIMAL',
    badgeColor: 'secondary',
  },
  {
    id: 'insight-3',
    type: 'reminder',
    title: 'Quarterly Tax Prep',
    description: 'Auto-reconciliation of 14 freelance invoices due in 2 days.',
    actionType: 'reconcile',
  },
  {
    id: 'insight-4',
    type: 'pulse',
    title: 'Wealth Pulse',
    description: 'Real-time market exposure analysis.',
    amountText: '$1.24M',
    badgeText: '+0.8%',
  },
];

export const CASH_FLOW_CHART_DATA = [
  { month: 'JAN', income: 145000, expenses: 42000 },
  { month: 'FEB', income: 152000, expenses: 48000 },
  { month: 'MAR', income: 148000, expenses: 51000 },
  { month: 'APR', income: 175000, expenses: 46000 },
  { month: 'MAY', income: 160000, expenses: 59000 },
  { month: 'JUN', income: 185000, expenses: 58400 },
];

export const INITIAL_USER = {
  name: 'Debraj Bhowmick',
  email: 'debrajbhowmick89@gmail.com',
  phone: '+91 9804791288',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBithLGA1M436N_jIuqPXRQlB2iV0JL9tHOR-9sA-73-ljYYeqMXyZkan9uMcnejXlI12S9BioB2JpVImUyD2kunfCfZW1SKWKEBZVdE9RVB9WYTQVrbf7z0KRwMowDWPf7ed2dQ58rNafgAOZe4lLAm51v0q_LHK-OB-LCDJMVUllyhafJ7Ka68h64ebuVkFL9HeDuLMPJQ544mm-8ua1LsmWrsMZwsS6ZaCNytsIO_CsMw3jwo09Q',
  isVerified: true,
  authMethod: 'google' as const,
};

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    title: 'HDFC Home Loan EMI Repayment',
    category: 'EMI',
    amount: 650.0,
    dueDate: '2026-08-10',
    vendor: 'HDFC Bank Ltd',
    mobileNumber: '+91 9804791288',
    email: 'debrajbhowmick89@gmail.com',
    status: 'Pending',
    channels: ['Email', 'WhatsApp', 'Browser'],
    description: 'Auto-debit from HDFC Checking account on 10th of every month.',
  },
  {
    id: 'alert-2',
    title: 'GST Quarterly Return Filing (GSTR-3B)',
    category: 'GST',
    amount: 320.0,
    dueDate: '2026-08-20',
    vendor: 'GST Portal India / Tax Dept',
    mobileNumber: '+91 9804791288',
    email: 'debrajbhowmick89@gmail.com',
    status: 'Pending',
    channels: ['Email', 'WhatsApp', 'Telegram'],
    description: 'Filing requirement for Q2 GST returns.',
  },
  {
    id: 'alert-3',
    title: 'Airtel 5G Unlimited Prepaid Plan Renewal',
    category: 'Prepaid',
    amount: 15.0,
    dueDate: '2026-08-12',
    vendor: 'Airtel Telecom',
    mobileNumber: '+91 9804791288',
    email: 'debrajbhowmick89@gmail.com',
    status: 'Pending',
    channels: ['WhatsApp', 'Browser'],
    description: '365-day validity extension recharge.',
  },
  {
    id: 'alert-4',
    title: 'Advance Income Tax Installment (Q2)',
    category: 'Tax',
    amount: 1200.0,
    dueDate: '2026-09-15',
    vendor: 'Income Tax Department',
    mobileNumber: '+91 9804791288',
    email: 'debrajbhowmick89@gmail.com',
    status: 'Pending',
    channels: ['Email', 'WhatsApp', 'Telegram', 'Browser'],
    description: 'Quarterly advance tax deposit for FY 2026-27.',
  },
  {
    id: 'alert-5',
    title: 'GitHub Enterprise & Cloud Subscription',
    category: 'Subscription',
    amount: 42.0,
    dueDate: '2026-08-18',
    vendor: 'GitHub / Microsoft',
    mobileNumber: '+91 9804791288',
    email: 'debrajbhowmick89@gmail.com',
    status: 'Pending',
    channels: ['Email', 'WhatsApp'],
    description: 'Developer workspace team plan renewal.',
  },
];

export const INITIAL_INVESTMENTS = [
  {
    id: 'inv-1',
    name: 'Nifty 50 Index Mutual Fund',
    symbol: 'NIFTY50',
    category: 'Mutual Funds' as const,
    investedAmount: 25000.0,
    currentValue: 31250.0,
    returnsPercent: 25.0,
    monthlySipAmount: 500.0,
  },
  {
    id: 'inv-2',
    name: 'Tech Bluechip Growth SIP',
    symbol: 'TECHGROW',
    category: 'SIP' as const,
    investedAmount: 18000.0,
    currentValue: 22860.0,
    returnsPercent: 27.0,
    monthlySipAmount: 350.0,
  },
  {
    id: 'inv-3',
    name: 'S&P 500 ETF',
    symbol: 'VOO',
    category: 'Stocks' as const,
    investedAmount: 15000.0,
    currentValue: 18450.0,
    returnsPercent: 23.0,
  },
  {
    id: 'inv-4',
    name: 'Sovereign Gold Bonds',
    symbol: 'SGB-2026',
    category: 'Gold' as const,
    investedAmount: 8000.0,
    currentValue: 9840.0,
    returnsPercent: 23.0,
  },
  {
    id: 'inv-5',
    name: 'Ethereum Staking Vault',
    symbol: 'ETH',
    category: 'Crypto' as const,
    investedAmount: 4500.0,
    currentValue: 5625.0,
    returnsPercent: 25.0,
  },
];

export const INITIAL_BILLS = [
  {
    id: 'bill-1',
    name: 'High-Speed Fiber Internet',
    vendor: 'Airtel Broadband / Xstream',
    category: 'Utilities',
    amount: 35.0,
    dueDate: '2026-08-05',
    status: 'Unpaid' as const,
    autoPay: true,
    account: 'HDFC Platinum *4112',
  },
  {
    id: 'bill-2',
    name: 'Electricity & Utility Bill',
    vendor: 'State Power Distribution',
    category: 'Utilities',
    amount: 68.5,
    dueDate: '2026-08-10',
    status: 'Unpaid' as const,
    autoPay: false,
    account: 'ICICI Wealth *8821',
  },
  {
    id: 'bill-3',
    name: 'Apple iCloud+ & One Premier',
    vendor: 'Apple Services',
    category: 'Subscriptions',
    amount: 19.99,
    dueDate: '2026-08-15',
    status: 'Paid' as const,
    autoPay: true,
    account: 'HDFC Platinum *4112',
    lastPaidDate: '2026-07-15',
  },
  {
    id: 'bill-4',
    name: 'AWS Infrastructure Reserved',
    vendor: 'Amazon Web Services',
    category: 'SaaS',
    amount: 412.5,
    dueDate: '2026-08-20',
    status: 'Unpaid' as const,
    autoPay: true,
    account: 'Chase Business *9821',
  },
];

