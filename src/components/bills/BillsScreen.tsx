import React from 'react';
import { Banknote, Plus, Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BillsScreen: React.FC = () => {
  const { bills, formatCurrency, payBill, toggleAutoPay, setIsAddBillOpen } = useFinance();

  const totalMonthlyBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const unpaidBillsTotal = bills
    .filter((b) => b.status === 'Unpaid' || b.status === 'Overdue')
    .reduce((sum, b) => sum + b.amount, 0);
  const overdueCount = bills.filter((b) => b.status === 'Overdue').length;
  const autoPayCount = bills.filter((b) => b.autoPay).length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18181B] p-6 rounded-2xl border border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30">
              <Banknote className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Bills & Recurring Expenses</h1>
          </div>
          <p className="text-xs text-[#908FA0] mt-1">
            Never miss a payment deadline. Manage subscriptions, auto-pay settings, and utility bills.
          </p>
        </div>

        <button
          onClick={() => setIsAddBillOpen(true)}
          className="px-4 py-2 bg-[#6366F1] hover:opacity-90 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#6366F1]/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recurring Bill</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>TOTAL MONTHLY OBLIGATIONS</span>
            <Banknote className="w-4 h-4 text-[#6366F1]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {formatCurrency(totalMonthlyBills)}
          </div>
          <div className="text-[11px] text-[#908FA0]">Across {bills.length} active vendors</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>UNPAID / DUE SOON</span>
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#F59E0B]">
            {formatCurrency(unpaidBillsTotal)}
          </div>
          <div className="text-[11px] text-[#F59E0B]">Requires attention</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>OVERDUE ALERTS</span>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#EF4444]">
            {overdueCount}
          </div>
          <div className="text-[11px] text-[#908FA0]">
            {overdueCount === 0 ? 'All bills up to date' : 'Immediate payment needed'}
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>AUTO-PAY ENABLED</span>
            <RefreshCw className="w-4 h-4 text-[#4EDEA3]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#4EDEA3]">
            {autoPayCount} / {bills.length}
          </div>
          <div className="text-[11px] text-[#4EDEA3]">Hands-free bill management</div>
        </div>
      </div>

      {/* Bills List Table */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-white">Upcoming & Active Bills</h2>
          <span className="text-xs text-[#908FA0]">{bills.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[11px] font-bold text-[#908FA0] uppercase">
                <th className="pb-3 pl-2">Bill Name</th>
                <th className="pb-3">Vendor / Account</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-center">Auto-Pay</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50 text-xs">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-[#1F1F22] transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-white">{b.name}</div>
                    <div className="text-[10px] text-[#908FA0]">{b.category}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="text-white font-medium">{b.vendor}</div>
                    <div className="text-[10px] text-[#908FA0]">{b.account}</div>
                  </td>
                  <td className="py-3.5 font-mono text-[#E4E1E6]">
                    {b.dueDate}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-white">
                    {formatCurrency(b.amount)}
                  </td>
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => toggleAutoPay(b.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        b.autoPay
                          ? 'bg-[#4EDEA3]/10 text-[#4EDEA3] border border-[#4EDEA3]/30'
                          : 'bg-[#27272A] text-[#908FA0]'
                      }`}
                    >
                      {b.autoPay ? 'ON' : 'OFF'}
                    </button>
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Paid'
                          ? 'bg-[#4EDEA3]/10 text-[#4EDEA3]'
                          : b.status === 'Overdue'
                          ? 'bg-[#EF4444]/10 text-[#EF4444]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    {b.status !== 'Paid' ? (
                      <button
                        onClick={() => payBill(b.id)}
                        className="px-3 py-1.5 bg-[#4EDEA3] hover:opacity-90 text-black font-bold rounded-lg text-[11px] flex items-center gap-1 ml-auto transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pay Bill</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#908FA0] font-mono">
                        Paid on {b.lastPaidDate || 'Recent'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
