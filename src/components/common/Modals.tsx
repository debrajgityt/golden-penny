import React, { useState } from 'react';
import {
  X,
  Check,
  DollarSign,
  Download,
  AlertTriangle,
  Target,
  Plus,
  Upload,
  FileSpreadsheet,
  FileText,
  Landmark,
  TrendingUp,
  Banknote,
  Calendar,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { exportTransactionsToCSV, exportTransactionsToPDF } from '../../utils/exportUtils';
import { TransactionStatus, Transaction } from '../../types';

export const ModalsContainer: React.FC = () => {
  const {
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addTransaction,
    editTransaction,
    isAddFundsOpen,
    setIsAddFundsOpen,
    selectedGoalId,
    goals,
    addFundsToGoal,
    isNewGoalOpen,
    setIsNewGoalOpen,
    createGoal,
    isExportModalOpen,
    setIsExportModalOpen,
    isAuditModalOpen,
    setIsAuditModalOpen,
    isUploadExpenseOpen,
    setIsUploadExpenseOpen,
    isConnectAccountOpen,
    setIsConnectAccountOpen,
    addAccount,
    isEditTxOpen,
    setIsEditTxOpen,
    editingTx,
    setEditingTx,
    isAddInvestmentOpen,
    setIsAddInvestmentOpen,
    addInvestment,
    isAddBillOpen,
    setIsAddBillOpen,
    addBill,
    transactions,
    currency,
    formatCurrency,
  } = useFinance();

  // 1. Add Expense / Income Modal State
  const [desc, setDesc] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('Groceries');
  const [account, setAccount] = useState('HDFC Platinum *4112');
  const [paymentMode, setPaymentMode] = useState<'Credit Card' | 'Wire Transfer' | 'Stripe' | 'Bank Transfer' | 'UPI'>('Credit Card');
  const [status, setStatus] = useState<TransactionStatus>('Cleared');

  // 2. Upload / Import Modal State
  const [uploadMode, setUploadMode] = useState<'manual' | 'bulk_template' | 'statement_import'>('statement_import');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsedPreviewCount, setParsedPreviewCount] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

  // 3. Edit Transaction Modal State
  const [editDesc, setEditDesc] = useState(editingTx?.description || '');
  const [editAmount, setEditAmount] = useState(editingTx?.amount.toString() || '');
  const [editCategory, setEditCategory] = useState(editingTx?.category || 'Groceries');
  const [editAccount, setEditAccount] = useState(editingTx?.account || 'HDFC Platinum *4112');
  const [editType, setEditType] = useState<'expense' | 'income'>(editingTx?.type || 'expense');

  // Sync editingTx values when editingTx changes
  React.useEffect(() => {
    if (editingTx) {
      setEditDesc(editingTx.description);
      setEditAmount(editingTx.amount.toString());
      setEditCategory(editingTx.category);
      setEditAccount(editingTx.account);
      setEditType(editingTx.type);
    }
  }, [editingTx]);

  // 4. Connect Account State
  const [instName, setInstName] = useState('HDFC Bank');
  const [accName, setAccName] = useState('HDFC Salary Checking');
  const [accType, setAccType] = useState<'Checking' | 'Savings' | 'Credit Card' | 'Investment'>('Checking');
  const [accNumber, setAccNumber] = useState('*' + Math.floor(1000 + Math.random() * 9000));
  const [accBalance, setAccBalance] = useState('5000');

  // 5. Add Investment State
  const [invName, setInvName] = useState('Parag Parikh Flexi Cap Fund');
  const [invCat, setInvCat] = useState<'Mutual Funds' | 'SIP' | 'Stocks' | 'Gold' | 'Crypto' | 'Real Estate'>('Mutual Funds');
  const [invInvested, setInvInvested] = useState('2000');
  const [invCurrent, setInvCurrent] = useState('2450');

  // 6. Add Bill State
  const [billName, setBillName] = useState('Netflix Ultra HD');
  const [billVendor, setBillVendor] = useState('Netflix Services');
  const [billAmount, setBillAmount] = useState('19.99');
  const [billCategory, setBillCategory] = useState('Entertainment');
  const [billDueDate, setBillDueDate] = useState('15th of month');
  const [billAutoPay, setBillAutoPay] = useState(true);

  // 7. Export Date Range State
  const [exportStartDate, setExportStartDate] = useState('2026-01-01');
  const [exportEndDate, setExportEndDate] = useState('2026-12-31');
  const [exportRangeLabel, setExportRangeLabel] = useState('Year to Date');

  // Handlers
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amountInput) return;

    const numAmount = parseFloat(amountInput);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const amountInUSD = currency === 'INR' ? numAmount / 83.5 : numAmount;

    addTransaction({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: desc,
      account,
      accountSource: `${account} / ${category}`,
      category,
      status,
      amount: amountInUSD,
      type,
      paymentMode,
      details: 'Manual entry created in Golden Penny',
    });

    setDesc('');
    setAmountInput('');
    setIsAddExpenseOpen(false);
  };

  const handleEditTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx || !editDesc || !editAmount) return;
    const num = parseFloat(editAmount);
    if (isNaN(num)) return;

    const amountInUSD = currency === 'INR' ? num / 83.5 : num;

    editTransaction(editingTx.id, {
      description: editDesc,
      amount: amountInUSD,
      category: editCategory,
      account: editAccount,
      type: editType,
    });

    setIsEditTxOpen(false);
    setEditingTx(null);
  };

  const handleStatementFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadMessage('Analyzing statement narration, detecting debit/credit entries...');

    setTimeout(() => {
      // Simulate intelligent parsing of bank statement
      const parsedSample: Omit<Transaction, 'id' | 'rawDate'>[] = [
        {
          date: 'Aug 01, 2026',
          description: 'HDFC ATM CASH WITHDRAWAL #9812',
          account: 'HDFC Platinum *4112',
          accountSource: 'HDFC Platinum / ATM',
          category: 'Shopping',
          status: 'Cleared',
          amount: 120,
          type: 'expense',
          paymentMode: 'Bank Transfer',
          details: 'Parsed from bank statement: Debit $120.00',
          matchConfidence: 99,
        },
        {
          date: 'Jul 30, 2026',
          description: 'STRIPE PAYOUT CLIENT CONSULTING',
          account: 'Mercury Reserve *3120',
          accountSource: 'Mercury Reserve / Income',
          category: 'Income',
          status: 'Cleared',
          amount: 2400,
          type: 'income',
          paymentMode: 'Stripe',
          details: 'Parsed from bank statement: Credit $2,400.00',
          matchConfidence: 98,
        },
        {
          date: 'Jul 28, 2026',
          description: 'SWIGGY DINING OUT BENGALURU',
          account: 'ICICI Wealth *8821',
          accountSource: 'ICICI Wealth / Dining Out',
          category: 'Dining Out',
          status: 'Cleared',
          amount: 45,
          type: 'expense',
          paymentMode: 'UPI',
          details: 'Parsed from bank statement: Debit $45.00',
          matchConfidence: 96,
        },
      ];

      parsedSample.forEach((t) => addTransaction(t));
      setParsedPreviewCount(parsedSample.length);
      setUploadMessage(`Successfully parsed ${parsedSample.length} transactions from "${file.name}"! Debit/Credit amounts & narration posted.`);
    }, 1200);
  };

  const downloadCSVTemplate = () => {
    const templateCSV = `Date,Description,Amount,Type,Category,Account,PaymentMode\n2026-08-01,AWS Cloud Services,142.50,expense,Utilities,Chase Business,Wire Transfer\n2026-08-02,Client Consulting Deposit,3500.00,income,Income,Mercury Reserve,Stripe\n2026-08-03,Whole Foods Groceries,85.20,expense,Groceries,HDFC Platinum,Credit Card`;
    const blob = new Blob([templateCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Golden_Penny_Bulk_Import_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConnectAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName || !instName) return;
    const bal = parseFloat(accBalance) || 0;
    const balUSD = currency === 'INR' ? bal / 83.5 : bal;

    addAccount({
      name: accName,
      type: accType,
      accountNumber: accNumber,
      institution: instName,
      balance: balUSD,
    });

    setIsConnectAccountOpen(false);
  };

  const handleAddInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName) return;
    const inv = parseFloat(invInvested) || 0;
    const cur = parseFloat(invCurrent) || inv;
    const invUSD = currency === 'INR' ? inv / 83.5 : inv;
    const curUSD = currency === 'INR' ? cur / 83.5 : cur;
    const retPct = invUSD > 0 ? parseFloat((((curUSD - invUSD) / invUSD) * 100).toFixed(1)) : 0;

    addInvestment({
      name: invName,
      symbol: invName.slice(0, 4).toUpperCase(),
      category: invCat,
      investedAmount: invUSD,
      currentValue: curUSD,
      returnsPercent: retPct,
    });

    setIsAddInvestmentOpen(false);
  };

  const handleAddBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billName || !billAmount) return;
    const amt = parseFloat(billAmount) || 0;
    const amtUSD = currency === 'INR' ? amt / 83.5 : amt;

    addBill({
      name: billName,
      amount: amtUSD,
      dueDate: billDueDate,
      category: billCategory,
      vendor: billVendor,
      status: 'Unpaid',
      autoPay: billAutoPay,
      account: 'HDFC Platinum *4112',
    });

    setIsAddBillOpen(false);
  };

  // Add Funds & Goal handlers
  const [fundsAmount, setFundsAmount] = useState('');
  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !fundsAmount) return;
    const num = parseFloat(fundsAmount);
    if (isNaN(num) || num <= 0) return;
    const numUSD = currency === 'INR' ? num / 83.5 : num;
    addFundsToGoal(selectedGoalId, numUSD);
    setFundsAmount('');
    setIsAddFundsOpen(false);
  };

  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('BY DEC 2026');
  const [goalDesc, setGoalDesc] = useState('');

  const handleNewGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;
    const targetNum = parseFloat(goalTarget);
    if (isNaN(targetNum) || targetNum <= 0) return;
    const targetUSD = currency === 'INR' ? targetNum / 83.5 : targetNum;
    createGoal({
      title: goalTitle,
      targetAmount: targetUSD,
      currentAmount: 0,
      targetDate: goalDate,
      description: goalDesc || 'Custom financial target',
    });
    setGoalTitle('');
    setGoalTarget('');
    setGoalDesc('');
    setIsNewGoalOpen(false);
  };

  const activeGoal = goals.find((g) => g.id === selectedGoalId);

  return (
    <>
      {/* 1. Upload / Import Bank Statement & Bulk Expenses Modal */}
      {isUploadExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUploadExpenseOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#908FA0] hover:text-white rounded-lg hover:bg-[#27272A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Expense & Bank Statement Import</h3>
                <p className="text-xs text-[#908FA0]">
                  Import statement files with automatic narration & debit/credit detection or use bulk template.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#131316] rounded-xl border border-[#27272A] mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUploadMode('statement_import')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  uploadMode === 'statement_import'
                    ? 'bg-[#F59E0B] text-black shadow-md'
                    : 'text-[#908FA0] hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Bank Statement</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('bulk_template')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  uploadMode === 'bulk_template'
                    ? 'bg-[#6366F1] text-white shadow-md'
                    : 'text-[#908FA0] hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>CSV Template</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUploadExpenseOpen(false);
                  setIsAddExpenseOpen(true);
                }}
                className="py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[#908FA0] hover:text-white hover:bg-[#27272A]"
              >
                <Plus className="w-4 h-4" />
                <span>Manual 1-by-1</span>
              </button>
            </div>

            {uploadMode === 'statement_import' && (
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-[#27272A] hover:border-[#F59E0B] rounded-2xl bg-[#131316] text-center space-y-3 transition-colors relative">
                  <Upload className="w-10 h-10 text-[#F59E0B] mx-auto animate-bounce" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Upload Bank Statement File</h4>
                    <p className="text-xs text-[#908FA0] mt-1">
                      Supports PDF, CSV, or TXT bank statements (Chase, HDFC, ICICI, Mercury, SBI)
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.csv,.txt"
                    onChange={handleStatementFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {uploadMessage && (
                  <div className="p-4 rounded-xl bg-[#4EDEA3]/10 border border-[#4EDEA3]/30 text-xs text-[#4EDEA3] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{uploadMessage}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadExpenseOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#27272A] text-xs font-bold text-[#E4E1E6]"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {uploadMode === 'bulk_template' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Golden Penny Bulk CSV Template</div>
                    <div className="text-[11px] text-[#908FA0]">
                      Fill date, narration, amount, category & payment mode in standard format.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={downloadCSVTemplate}
                    className="px-3 py-1.5 bg-[#6366F1] text-white text-xs font-bold rounded-lg hover:opacity-90 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Template</span>
                  </button>
                </div>

                <div className="p-6 border-2 border-dashed border-[#27272A] hover:border-[#6366F1] rounded-2xl bg-[#131316] text-center space-y-3 transition-colors relative">
                  <FileSpreadsheet className="w-10 h-10 text-[#6366F1] mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Upload Filled Bulk CSV</h4>
                    <p className="text-xs text-[#908FA0] mt-1">Select your completed CSV spreadsheet</p>
                  </div>

                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleStatementFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {uploadMessage && (
                  <div className="p-4 rounded-xl bg-[#4EDEA3]/10 border border-[#4EDEA3]/30 text-xs text-[#4EDEA3] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{uploadMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Add Expense / Income Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddExpenseOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Manual Expense Entry</h3>
            <p className="text-xs text-[#908FA0] mb-5">
              Input single transaction record directly into General Ledger.
            </p>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div className="flex gap-2 p-1 bg-[#131316] rounded-xl border border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    type === 'expense' ? 'bg-[#EF4444] text-white' : 'text-[#908FA0]'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    type === 'income' ? 'bg-[#4EDEA3] text-black' : 'text-[#908FA0]'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Description / Narration
                </label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Whole Foods Groceries, Client Retainer"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Travel">Travel</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="SaaS Subscriptions">SaaS Subscriptions</option>
                    <option value="Dining Out">Dining Out</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6366F1] text-white font-bold text-sm hover:opacity-90"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Edit Transaction Modal */}
      {isEditTxOpen && editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditTxOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-lg font-bold text-white">Edit Transaction Record</h3>
            </div>

            <form onSubmit={handleEditTxSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Description / Narration
                </label>
                <input
                  type="text"
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Travel">Travel</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="SaaS Subscriptions">SaaS Subscriptions</option>
                    <option value="Dining Out">Dining Out</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditTxOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] text-black font-bold text-sm hover:opacity-90"
                >
                  Update Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Connect Account Modal */}
      {isConnectAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsConnectAccountOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Connect New Bank Account</h3>
            </div>
            <p className="text-xs text-[#908FA0] mb-5">
              Secure 256-bit OpenBanking connection setup.
            </p>

            <form onSubmit={handleConnectAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  placeholder="e.g. HDFC Bank, Chase, ICICI, SBI"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Account Nickname
                </label>
                <input
                  type="text"
                  required
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="e.g. Wealth Salary Checking"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Type
                  </label>
                  <select
                    value={accType}
                    onChange={(e) => setAccType(e.target.value as any)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Opening Balance ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={accBalance}
                    onChange={(e) => setAccBalance(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsConnectAccountOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6366F1] text-white font-bold text-sm hover:opacity-90"
                >
                  Connect Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Investment Holding Modal */}
      {isAddInvestmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddInvestmentOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-lg font-bold text-white">Add Investment Holding</h3>
            </div>

            <form onSubmit={handleAddInvestmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Asset / Fund Name
                </label>
                <input
                  type="text"
                  required
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  placeholder="e.g. Parag Parikh Flexi Cap Fund, AAPL"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Asset Category
                </label>
                <select
                  value={invCat}
                  onChange={(e) => setInvCat(e.target.value as any)}
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="Mutual Funds">Mutual Funds</option>
                  <option value="SIP">SIP</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Gold">Gold</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Invested Principal
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={invInvested}
                    onChange={(e) => setInvInvested(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Current Valuation
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={invCurrent}
                    onChange={(e) => setInvCurrent(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddInvestmentOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] text-black font-bold text-sm hover:opacity-90"
                >
                  Add Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Recurring Bill Modal */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddBillOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Banknote className="w-5 h-5 text-[#6366F1]" />
              <h3 className="text-lg font-bold text-white">Add Recurring Bill</h3>
            </div>

            <form onSubmit={handleAddBillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Bill Name
                </label>
                <input
                  type="text"
                  required
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  placeholder="e.g. Netflix Ultra HD, AWS Cloud"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Due Cycle
                  </label>
                  <input
                    type="text"
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    placeholder="15th of month"
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoPayCheck"
                  checked={billAutoPay}
                  onChange={(e) => setBillAutoPay(e.target.checked)}
                  className="rounded border-[#27272A] bg-[#131316] text-[#6366F1]"
                />
                <label htmlFor="autoPayCheck" className="text-xs text-white font-medium cursor-pointer">
                  Enable Auto-Pay Debit
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6366F1] text-white font-bold text-sm hover:opacity-90"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Export Custom Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Customizable Date-Wise Statement Report</h3>
            </div>

            <p className="text-xs text-[#908FA0] mb-5">
              Generate PDF or Excel statement formatted with Golden Penny KPIs and author copyright.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Preset Date Range
                </label>
                <select
                  value={exportRangeLabel}
                  onChange={(e) => setExportRangeLabel(e.target.value)}
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="All Time">All Time Records</option>
                  <option value="Year to Date">Year to Date (2026)</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Custom Date Range">Custom Date Range</option>
                </select>
              </div>

              {exportRangeLabel === 'Custom Date Range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#908FA0] mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                      className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#908FA0] mb-1">End Date</label>
                    <input
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                      className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  exportTransactionsToCSV(transactions, currency);
                  setIsExportModalOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-[#27272A] bg-[#131316] hover:border-[#F59E0B] transition-all group"
              >
                <div className="text-left">
                  <div className="font-bold text-xs text-white group-hover:text-[#F59E0B]">
                    Download Excel / CSV Statement
                  </div>
                  <div className="text-[10px] text-[#908FA0]">Includes KPI summaries & dates</div>
                </div>
                <Download className="w-4 h-4 text-[#F59E0B]" />
              </button>

              <button
                onClick={() => {
                  exportTransactionsToPDF(transactions, currency, {
                    startDate: exportRangeLabel === 'Custom Date Range' ? exportStartDate : undefined,
                    endDate: exportRangeLabel === 'Custom Date Range' ? exportEndDate : undefined,
                    dateRangeLabel: exportRangeLabel,
                  });
                  setIsExportModalOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-[#27272A] bg-[#131316] hover:border-[#6366F1] transition-all group"
              >
                <div className="text-left">
                  <div className="font-bold text-xs text-white group-hover:text-[#6366F1]">
                    Download Official PDF Report
                  </div>
                  <div className="text-[10px] text-[#908FA0]">Formatted with Debraj Bhowmick copyright watermark</div>
                </div>
                <Download className="w-4 h-4 text-[#6366F1]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Goal Add Funds & New Goal Modals */}
      {isAddFundsOpen && activeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddFundsOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#6366F1]/20 rounded-xl text-[#6366F1]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{activeGoal.title}</h3>
                <p className="text-xs text-[#908FA0]">Target: {formatCurrency(activeGoal.targetAmount)}</p>
              </div>
            </div>

            <p className="text-xs text-[#C7C4D7] mb-4">
              Current balance: <span className="font-bold text-[#4EDEA3]">{formatCurrency(activeGoal.currentAmount)}</span>.
            </p>

            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Contribution Amount ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddFundsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4EDEA3] text-black font-bold text-sm hover:opacity-90"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNewGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsNewGoalOpen(false)}
              className="absolute top-4 right-4 text-[#908FA0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Create Financial Goal</h3>
            <p className="text-xs text-[#908FA0] mb-4">Set a target savings milestone.</p>

            <form onSubmit={handleNewGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Home Down Payment, EV Purchase"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Target ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#908FA0] mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewGoalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#27272A] text-sm text-[#908FA0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6366F1] text-white font-bold text-sm hover:opacity-90"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
