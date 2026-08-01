import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Coins,
  ShieldCheck,
  Target,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Zap,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const InvestmentsScreen: React.FC = () => {
  const {
    investments,
    goals,
    formatCurrency,
    setIsAddInvestmentOpen,
    setIsNewGoalOpen,
    setIsAddFundsOpen,
    setSelectedGoalId,
  } = useFinance();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sipMonthly, setSipMonthly] = useState<number>(500);
  const [sipYears, setSipYears] = useState<number>(5);
  const [sipReturnRate, setSipReturnRate] = useState<number>(12);

  const totalInvested = investments.reduce((sum, i) => sum + i.investedAmount, 0);
  const currentValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalGain = currentValue - totalInvested;
  const overallReturnPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const totalMonthlySip = investments.reduce((sum, i) => sum + (i.monthlySipAmount || 0), 0);

  const categories = ['All', 'Mutual Funds', 'SIP', 'Stocks', 'Gold', 'Crypto'];

  const filteredInvestments =
    filterCategory === 'All'
      ? investments
      : investments.filter((i) => i.category === filterCategory);

  // SIP Calculator Projection calculation
  const monthlyRate = sipReturnRate / 12 / 100;
  const totalMonths = sipYears * 12;
  const projectedFutureValue =
    sipMonthly *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);
  const totalPrincipalDeposited = sipMonthly * totalMonths;
  const estimatedWealthGain = projectedFutureValue - totalPrincipalDeposited;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#18181B] p-6 rounded-2xl border border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Investments & Wealth Portfolio</h1>
          </div>
          <p className="text-xs text-[#908FA0] mt-1">
            Track mutual funds, SIPs, equity, crypto, and goal projections in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewGoalOpen(true)}
            className="px-4 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-[#3F3F46]"
          >
            <Target className="w-4 h-4 text-[#C0C1FF]" />
            <span>Create Goal</span>
          </button>
          <button
            onClick={() => setIsAddInvestmentOpen(true)}
            className="px-4 py-2 bg-[#F59E0B] hover:opacity-90 text-black font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#F59E0B]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Investment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>TOTAL PORTFOLIO VALUE</span>
            <PieChartIcon className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {formatCurrency(currentValue)}
          </div>
          <div className="text-[11px] text-[#4EDEA3] flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+${totalGain.toFixed(2)} Capital Gain</span>
          </div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>TOTAL PRINCIPAL INVESTED</span>
            <Coins className="w-4 h-4 text-[#C0C1FF]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {formatCurrency(totalInvested)}
          </div>
          <div className="text-[11px] text-[#908FA0]">Base capital allocation</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>TOTAL ROI YIELD</span>
            <Zap className="w-4 h-4 text-[#4EDEA3]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#4EDEA3]">
            +{overallReturnPercent.toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#4EDEA3]">Outperforming market benchmark</div>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#908FA0]">
            <span>ACTIVE MONTHLY SIP</span>
            <ShieldCheck className="w-4 h-4 text-[#6366F1]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#C0C1FF]">
            {formatCurrency(totalMonthlySip)} / mo
          </div>
          <div className="text-[11px] text-[#908FA0]">Automated recurring growth</div>
        </div>
      </div>

      {/* SIP Calculator & Holdings Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Investment Holdings</h2>
              <p className="text-xs text-[#908FA0]">Asset allocations and performance</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-[#131316] p-1 rounded-xl border border-[#27272A]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === cat
                      ? 'bg-[#F59E0B] text-black shadow-md'
                      : 'text-[#908FA0] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272A] text-[11px] font-bold text-[#908FA0] uppercase">
                  <th className="pb-3 pl-2">Asset Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Invested</th>
                  <th className="pb-3 text-right">Current Value</th>
                  <th className="pb-3 text-right pr-2">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/50 text-xs">
                {filteredInvestments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#1F1F22] transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-white">{inv.name}</div>
                      <div className="text-[10px] text-[#F59E0B] font-mono">{inv.symbol}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#27272A] text-[#E4E1E6] text-[10px] font-medium">
                        {inv.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-[#908FA0]">
                      {formatCurrency(inv.investedAmount)}
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-white">
                      {formatCurrency(inv.currentValue)}
                    </td>
                    <td className="py-3.5 text-right pr-2 font-mono font-bold text-[#4EDEA3]">
                      +{inv.returnsPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIP Calculator Projections */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>SIP Growth Calculator</span>
            </h2>
            <p className="text-xs text-[#908FA0] mt-0.5">Project wealth creation over time</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-[#E4E1E6] mb-1">
                <span>Monthly Investment</span>
                <span className="text-[#F59E0B] font-mono">${sipMonthly}/mo</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={sipMonthly}
                onChange={(e) => setSipMonthly(Number(e.target.value))}
                className="w-full accent-[#F59E0B]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-[#E4E1E6] mb-1">
                <span>Time Period</span>
                <span className="text-[#C0C1FF] font-mono">{sipYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full accent-[#6366F1]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-[#E4E1E6] mb-1">
                <span>Expected Annual Return</span>
                <span className="text-[#4EDEA3] font-mono">{sipReturnRate}% APR</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                value={sipReturnRate}
                onChange={(e) => setSipReturnRate(Number(e.target.value))}
                className="w-full accent-[#4EDEA3]"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#131316] border border-[#27272A] space-y-2">
            <div className="flex justify-between text-xs text-[#908FA0]">
              <span>Total Principal</span>
              <span className="font-mono text-white">{formatCurrency(totalPrincipalDeposited)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#908FA0]">
              <span>Estimated Returns</span>
              <span className="font-mono text-[#4EDEA3]">+{formatCurrency(estimatedWealthGain)}</span>
            </div>
            <div className="pt-2 border-t border-[#27272A] flex justify-between items-center">
              <span className="text-xs font-bold text-white">Projected Corpus</span>
              <span className="text-lg font-mono font-extrabold text-[#F59E0B]">
                {formatCurrency(projectedFutureValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section Integration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Target Financial Goals</h2>
            <p className="text-xs text-[#908FA0]">Automated savings goals linked to investments</p>
          </div>
          <button
            onClick={() => setIsNewGoalOpen(true)}
            className="text-xs text-[#F59E0B] font-bold hover:underline"
          >
            + Create New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return (
              <div
                key={g.id}
                className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-4 hover:border-[#6366F1] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base">{g.title}</h3>
                    <p className="text-[11px] text-[#908FA0]">{g.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-[#27272A] text-[#F59E0B] rounded-lg text-[10px] font-mono font-bold">
                    {g.targetDate}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-bold">{formatCurrency(g.currentAmount)}</span>
                    <span className="text-[#908FA0]">{formatCurrency(g.targetAmount)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#27272A] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#6366F1] to-[#4EDEA3] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedGoalId(g.id);
                    setIsAddFundsOpen(true);
                  }}
                  className="w-full py-2 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  + Add Funds To Goal
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
