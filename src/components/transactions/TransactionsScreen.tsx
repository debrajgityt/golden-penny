import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Search,
  Zap,
  Paperclip,
  ZoomIn,
  RefreshCw,
  Flag,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  FileSpreadsheet,
  Edit2,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { exportTransactionsToCSV, exportTransactionsToPDF } from '../../utils/exportUtils';

export const TransactionsScreen: React.FC = () => {
  const {
    transactions,
    selectedTxId,
    setSelectedTxId,
    reconcileTransaction,
    flagTransaction,
    bulkMatchReconcile,
    formatCurrency,
    currency,
    setIsUploadExpenseOpen,
    setIsEditTxOpen,
    setEditingTx,
    setIsAddExpenseOpen,
  } = useFinance();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [accountFilter, setAccountFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [reconcileToast, setReconcileToast] = useState('');

  // Multi-select for bulk actions
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);

  const filteredTxs = transactions.filter((tx) => {
    if (categoryFilter !== 'All' && !tx.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
      return false;
    }
    if (modeFilter !== 'All' && tx.paymentMode !== modeFilter) {
      return false;
    }
    if (accountFilter !== 'All' && !tx.account.includes(accountFilter)) {
      return false;
    }
    if (
      searchQuery &&
      !tx.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(tx.details || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const selectedTx = transactions.find((t) => t.id === selectedTxId) || filteredTxs[0];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTxIds(filteredTxs.map((t) => t.id));
    } else {
      setSelectedTxIds([]);
    }
  };

  const handleToggleRowSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTxIds.includes(id)) {
      setSelectedTxIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedTxIds((prev) => [...prev, id]);
    }
  };

  const handleBulkReconcile = () => {
    const targetCount = selectedTxIds.length > 0 ? selectedTxIds.length : filteredTxs.length;
    bulkMatchReconcile(selectedTxIds.length > 0 ? selectedTxIds : undefined);
    setSelectedTxIds([]);
    setReconcileToast(`Successfully auto-matched & reconciled ${targetCount} transactions with 98% confidence!`);
    setTimeout(() => setReconcileToast(''), 4000);
  };

  const handleEditClick = (tx: typeof transactions[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTx(tx);
    setIsEditTxOpen(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast Alert for Reconciliation */}
      {reconcileToast && (
        <div className="p-4 rounded-xl bg-[#4EDEA3]/15 border border-[#4EDEA3] text-[#4EDEA3] flex items-center justify-between text-xs font-bold shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{reconcileToast}</span>
          </div>
          <button onClick={() => setReconcileToast('')} className="text-[#908FA0] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#18181B] p-6 rounded-2xl border border-[#27272A]">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Transactions & Reconciliation Hub</span>
          </h2>
          <p className="text-xs text-[#908FA0] mt-1">
            Manage, reconcile, bulk import statements, and edit general ledger records seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Upload Bank Statement / Expense Template */}
          <button
            onClick={() => setIsUploadExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F59E0B] hover:opacity-90 text-black font-bold rounded-xl text-xs transition-all shadow-md shadow-[#F59E0B]/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload / Import Statement</span>
          </button>

          {/* Add Manual Expense */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6366F1] hover:opacity-90 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#6366F1]/20"
          >
            <span>+ Manual Entry</span>
          </button>

          {/* Quick Export PDF/CSV */}
          <button
            onClick={() => exportTransactionsToPDF(filteredTxs, currency, { dateRangeLabel: dateRange })}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#3F3F46] bg-[#1F1F22] hover:bg-[#27272A] rounded-xl text-xs font-bold text-white transition-all"
            title="Download PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-[#C0C1FF]" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-[#18181B] rounded-2xl p-4 border border-[#27272A] flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 border-r border-[#27272A] pr-4">
          <span className="text-xs text-[#908FA0] uppercase font-bold tracking-wider">Filter By</span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#131316] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs font-medium text-white focus:outline-none cursor-pointer"
          >
            <option value="All">Category: All</option>
            <option value="SaaS Subscriptions">SaaS Subscriptions</option>
            <option value="Shopping">Shopping</option>
            <option value="Dining Out">Dining Out</option>
            <option value="Travel">Travel</option>
            <option value="Income">Income</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-[#131316] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs font-medium text-white focus:outline-none cursor-pointer"
          >
            <option value="All">Mode: All</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Wire Transfer">Wire Transfer</option>
            <option value="Stripe">Stripe</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="flex-1 flex flex-wrap items-center justify-between gap-3 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#908FA0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search narration, vendor, or details..."
              className="w-full bg-[#131316] border border-[#27272A] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#908FA0] focus:ring-1 focus:ring-[#6366F1] focus:outline-none"
            />
          </div>

          <button
            onClick={handleBulkReconcile}
            className="bg-[#00A572] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#00A572]/20"
          >
            <Zap className="w-3.5 h-3.5 text-[#4EDEA3]" />
            <span>
              {selectedTxIds.length > 0
                ? `Bulk Match Selected (${selectedTxIds.length})`
                : 'Bulk Match & Auto-Reconcile'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Table + Right Drawer Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table Container */}
        <div className="flex-1 bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#1F1F22] text-[#908FA0] uppercase font-semibold border-b border-[#27272A]">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filteredTxs.length > 0 && selectedTxIds.length === filteredTxs.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-[#27272A] bg-[#131316] text-[#6366F1] focus:ring-0"
                    />
                  </th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-6 py-3">Description / Narration</th>
                  <th className="px-6 py-3">Account / Source</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Edit</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#27272A]">
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#908FA0]">
                      No transactions found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => {
                    const isSelected = selectedTx?.id === tx.id;
                    const isChecked = selectedTxIds.includes(tx.id);

                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTxId(tx.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#27272A]'
                            : tx.status === 'Unmatched'
                            ? 'bg-[#EF4444]/5 hover:bg-[#27272A]'
                            : 'hover:bg-[#1F1F22]'
                        }`}
                      >
                        <td className="px-4 py-4" onClick={(e) => handleToggleRowSelect(tx.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-[#27272A] bg-[#131316] text-[#6366F1] focus:ring-0"
                          />
                        </td>
                        <td className="px-4 py-4 font-mono text-[#908FA0]">{tx.date}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{tx.description}</div>
                          <div className="text-[11px] text-[#908FA0]">{tx.details}</div>
                        </td>
                        <td className="px-6 py-4 text-[#C7C4D7] font-mono">{tx.accountSource}</td>
                        <td
                          className={`px-6 py-4 text-right font-mono font-bold text-sm ${
                            tx.type === 'expense' ? 'text-[#FFB4AB]' : 'text-[#4EDEA3]'
                          }`}
                        >
                          {tx.type === 'expense' ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-4">
                          {tx.status === 'Unmatched' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mr-1.5 animate-pulse" />
                              Unmatched
                            </span>
                          )}
                          {tx.status === 'Pending' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFB95F]/20 text-[#FFB95F] border border-[#FFB95F]/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB95F] mr-1.5" />
                              Pending
                            </span>
                          )}
                          {tx.status === 'Cleared' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4EDEA3]/20 text-[#4EDEA3] border border-[#4EDEA3]/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4EDEA3] mr-1.5" />
                              Cleared
                              {tx.matchConfidence && ` (${tx.matchConfidence}%)`}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={(e) => handleEditClick(tx, e)}
                            className="p-1.5 text-[#908FA0] hover:text-[#6366F1] rounded-lg hover:bg-[#27272A] transition-colors"
                            title="Edit Transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sliding Right Drawer for Transaction Reconciliation */}
        {selectedTx && (
          <aside className="w-full lg:w-96 bg-[#18181B] rounded-2xl border border-[#27272A] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#27272A] flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">{selectedTx.description}</h3>
                <p className="text-xs text-[#908FA0]">{selectedTx.date} • {selectedTx.paymentMode}</p>
              </div>

              <button
                onClick={(e) => handleEditClick(selectedTx, e)}
                className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3 h-3 text-[#F59E0B]" />
                <span>Edit</span>
              </button>
            </div>

            {/* Scroll Area */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar text-xs">
              {/* Receipt Attachment */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-[#908FA0]">
                  Receipt & Invoice Verification
                </label>
                <div className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-[#27272A] flex items-center justify-center overflow-hidden bg-[#131316] group cursor-pointer">
                  <img
                    src={
                      selectedTx.receiptUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6jrkzY-rtjGJ22o2Lv56YrCh7XokxMHIStg1HisilC7eAfxgVfC6BbYllUeSPnoBU9OlVPHu84YeechLWMzI69X_vT9rpIL3ZWvuXwyhDVfMQG3m7vXOZd-Ir4tuGmAhx51FaNfOHQGDgbOZZXj69e3UdBuBgI0vZXLHREw5pTwn2YgHWZOsyvVe-4DQSovunkMzXDavulVR7FtkXQ15Vfa3R7KIlP4LsX0-Ighs4KzxSYCv352NC'
                    }
                    alt="Receipt preview"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        window.open(
                          selectedTx.receiptUrl ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuB6jrkzY-rtjGJ22o2Lv56YrCh7XokxMHIStg1HisilC7eAfxgVfC6BbYllUeSPnoBU9OlVPHu84YeechLWMzI69X_vT9rpIL3ZWvuXwyhDVfMQG3m7vXOZd-Ir4tuGmAhx51FaNfOHQGDgbOZZXj69e3UdBuBgI0vZXLHREw5pTwn2YgHWZOsyvVe-4DQSovunkMzXDavulVR7FtkXQ15Vfa3R7KIlP4LsX0-Ighs4KzxSYCv352NC',
                          '_blank'
                        )
                      }
                      className="p-2 bg-[#1F1F22] rounded-full border border-[#27272A] text-white"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#908FA0] block">
                    Account Source
                  </label>
                  <p className="text-xs font-semibold text-white mt-0.5">{selectedTx.account}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-[#908FA0] block">
                    Amount
                  </label>
                  <p className="text-xs font-bold text-[#4EDEA3] font-mono mt-0.5">
                    {formatCurrency(selectedTx.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reconciliation Actions */}
            <div className="p-5 bg-[#131316] border-t border-[#27272A] space-y-2.5">
              <button
                onClick={() => {
                  reconcileTransaction(selectedTx.id);
                  setReconcileToast(`Reconciled "${selectedTx.description}" successfully!`);
                  setTimeout(() => setReconcileToast(''), 3000);
                }}
                className="w-full bg-[#4EDEA3] text-black py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#4EDEA3]/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reconcile & Clear Entry</span>
              </button>

              <button
                onClick={() => flagTransaction(selectedTx.id)}
                className="w-full border border-[#27272A] text-[#908FA0] py-2 rounded-xl text-xs font-medium hover:bg-[#1F1F22] hover:text-white transition-colors"
              >
                Flag for Audit Review
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

