import React from 'react';
import {
  Wallet,
  Plus,
  Target,
  AlertTriangle,
  TrendingUp,
  Banknote,
  ShoppingBag,
  Home,
  Zap,
  Plane,
  Film,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BudgetsScreen: React.FC = () => {
  const {
    budgets,
    goals,
    formatCurrency,
    monthlyExpensesUSD,
    monthlySpendLimitUSD,
    remainingBudgetUSD,
    setIsAddExpenseOpen,
    setIsAddFundsOpen,
    setSelectedGoalId,
    setIsNewGoalOpen,
    setIsAuditModalOpen,
    setActiveTab,
  } = useFinance();

  const spendPercent = Math.min(
    100,
    Math.round((monthlyExpensesUSD / monthlySpendLimitUSD) * 100)
  );

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'groceries':
        return <ShoppingBag className="w-4 h-4 text-[#4EDE93]" />;
      case 'rent':
        return <Home className="w-4 h-4 text-[#6366F1]" />;
      case 'utilities':
        return <Zap className="w-4 h-4 text-[#FFB95F]" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-[#EF4444]" />;
      case 'travel':
        return <Plane className="w-4 h-4 text-[#C0C1FF]" />;
      case 'entertainment':
        return <Film className="w-4 h-4 text-[#4EDE93]" />;
      default:
        return <Wallet className="w-4 h-4 text-[#6366F1]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Budget & Goals Planner</h2>
          <p className="text-xs text-[#908FA0] mt-1">
            Track category limits, manage goal milestones, and receive smart budget alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('investments')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F1F22] hover:bg-[#27272A] border border-[#27272A] text-white rounded-xl text-xs font-bold transition-all"
          >
            <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
            <span>Investments</span>
          </button>
          <button
            onClick={() => setActiveTab('bills')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F1F22] hover:bg-[#27272A] border border-[#27272A] text-white rounded-xl text-xs font-bold transition-all"
          >
            <Banknote className="w-4 h-4 text-[#6366F1]" />
            <span>Bills</span>
          </button>
          <button
            onClick={() => setIsNewGoalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#6366F1]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Top Overview Banner Card */}
      <div className="bg-[#18181B]/80 backdrop-blur-md rounded-xl p-6 border border-[#27272A] relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#908FA0]">
              Monthly Spend Overview
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white font-mono">
                {formatCurrency(monthlyExpensesUSD)}
              </h1>
              <span className="text-sm font-semibold text-[#908FA0]">
                of {formatCurrency(monthlySpendLimitUSD)} limit
              </span>
            </div>
            <p className="text-xs text-[#4EDE93] font-medium mt-1">
              {formatCurrency(remainingBudgetUSD)} remaining for the month
            </p>
          </div>

          <div className="w-full md:w-72 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#908FA0]">Burn Rate</span>
              <span className={spendPercent > 80 ? 'text-[#EF4444]' : 'text-[#4EDE93]'}>
                {spendPercent}%
              </span>
            </div>
            <div className="w-full bg-[#2A2A2D] h-3 rounded-full overflow-hidden p-0.5 border border-[#27272A]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  spendPercent > 100
                    ? 'bg-[#EF4444]'
                    : spendPercent > 80
                    ? 'bg-[#FFB95F]'
                    : 'bg-[#6366F1]'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Category Budgets (Left 8 cols) + Smart Alerts (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Budgets Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#6366F1]" />
              <span>Category Budgets</span>
            </h3>

            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="text-xs font-semibold text-[#6366F1] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const usageRatio = b.spent / b.allocated;
              const usagePercent = Math.min(100, Math.round(usageRatio * 100));

              const isOverBudget = usageRatio > 1.0;
              const isWarning = usageRatio > 0.8 && !isOverBudget;

              return (
                <div
                  key={b.id}
                  className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-4 rounded-xl flex flex-col justify-between hover:border-[#6366F1]/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#1B1B1E] border border-[#27272A]">
                        {getCategoryIcon(b.name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{b.name}</h4>
                        <span className="text-[10px] text-[#908FA0]">Monthly Allocation</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOverBudget
                          ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                          : isWarning
                          ? 'bg-[#FFB95F]/20 text-[#FFB95F] border border-[#FFB95F]/30'
                          : 'bg-[#4EDE93]/20 text-[#4EDE93] border border-[#4EDE93]/30'
                      }`}
                    >
                      {isOverBudget ? 'OVER BUDGET' : isWarning ? 'WARNING' : 'ON TRACK'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-mono font-bold text-white">
                        {formatCurrency(b.spent)}
                      </span>
                      <span className="text-xs text-[#908FA0] font-mono">
                        / {formatCurrency(b.allocated)}
                      </span>
                    </div>

                    <div className="w-full bg-[#2A2A2D] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverBudget
                            ? 'bg-[#EF4444]'
                            : isWarning
                            ? 'bg-[#FFB95F]'
                            : 'bg-[#4EDE93]'
                        }`}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Alerts & AI Insights Panel */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFB95F]" />
            <span>Budget Alerts</span>
          </h3>

          <div className="space-y-3">
            {/* Anomaly Card */}
            <div className="bg-[#18181B] border border-[#EF4444]/30 p-4 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#EF4444] font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Cloud Expense Spike</span>
              </div>
              <h4 className="text-sm font-bold text-white">AWS Cloud Services (+$412.50)</h4>
              <p className="text-xs text-[#908FA0]">
                AWS EC2 usage is 14% higher than your historical 3-month baseline.
              </p>
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="mt-2 text-xs font-bold text-[#6366F1] hover:underline"
              >
                Audit Anomaly Details →
              </button>
            </div>

            {/* Over Budget Shopping Alert */}
            <div className="bg-[#18181B] border border-[#FFB95F]/30 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[#FFB95F] font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Over Budget Warning</span>
              </div>
              <h4 className="text-sm font-bold text-white">Shopping Category (123% Used)</h4>
              <p className="text-xs text-[#908FA0]">
                Shopping expense exceeded allocation due to recent Apple hardware purchase.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Goals Section */}
      <div className="space-y-4 pt-4 border-t border-[#27272A]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#4EDE93]" />
            <span>Financial Goals & Milestones</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const ratio = goal.currentAmount / goal.targetAmount;
            const goalPercent = Math.min(100, Math.round(ratio * 100));

            return (
              <div
                key={goal.id}
                className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl flex flex-col justify-between hover:border-[#4EDE93]/40 transition-all space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-base text-white">{goal.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded border border-[#6366F1]/20">
                      {goal.targetDate}
                    </span>
                  </div>
                  <p className="text-xs text-[#908FA0] line-clamp-2">{goal.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-mono font-bold text-[#4EDE93]">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-xs font-mono text-[#908FA0]">
                      / {formatCurrency(goal.targetAmount)} ({goalPercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-[#2A2A2D] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4EDE93] h-full rounded-full transition-all duration-700"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setIsAddFundsOpen(true);
                    }}
                    className="w-full mt-3 py-2 bg-[#1F1F22] hover:bg-[#6366F1] border border-[#27272A] hover:border-transparent text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Funds</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
