import React from 'react';
import {
  TrendingUp,
  Landmark,
  Banknote,
  ShoppingCart,
  LineChart,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { CASH_FLOW_CHART_DATA } from '../../mockData';

export const OverviewScreen: React.FC = () => {
  const {
    formatCurrency,
    currency,
    transactions,
    setActiveTab,
    monthlyExpensesUSD,
    monthlySpendLimitUSD,
    usdToInrRate,
  } = useFinance();

  const netWorthVal = formatCurrency(14910.18);
  const incomeVal = formatCurrency(2215.56);
  const expenseVal = formatCurrency(monthlyExpensesUSD);
  const investmentVal = formatCurrency(1516.16);

  const percentUsed = Math.min(
    100,
    Math.round((monthlyExpensesUSD / monthlySpendLimitUSD) * 100)
  );

  // Scaled Chart Data based on Currency Mode
  const chartData = CASH_FLOW_CHART_DATA.map((item) => ({
    ...item,
    incomeScaled: currency === 'INR' ? item.income : Math.round(item.income / usdToInrRate),
    expensesScaled:
      currency === 'INR' ? item.expenses : Math.round(item.expenses / usdToInrRate),
  }));

  const pieData = [
    { name: 'Rent', value: 35, color: '#6366F1' },
    { name: 'Groceries', value: 20, color: '#4EDE93' },
    { name: 'EMI', value: 18, color: '#FFB95F' },
    { name: 'Utilities', value: 15, color: '#FFB4AB' },
    { name: 'Misc', value: 12, color: '#C0C1FF' },
  ];

  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Row 1: Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Net Worth */}
        <div className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl flex flex-col justify-between hover:border-[#6366F1]/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[#908FA0] text-xs font-semibold uppercase tracking-wider">
              Net Worth
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C0C1FF]/10 flex items-center justify-center text-[#C0C1FF]">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono">
              {netWorthVal}
            </h2>
            <p className="text-[#4EDE93] text-xs flex items-center gap-1 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.2% vs last month</span>
            </p>
          </div>
        </div>

        {/* Card 2: Monthly Income */}
        <div className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl flex flex-col justify-between hover:border-[#4EDE93]/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[#908FA0] text-xs font-semibold uppercase tracking-wider">
              Monthly Income
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#4EDE93]/10 flex items-center justify-center text-[#4EDE93]">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono">
              {incomeVal}
            </h2>
            <p className="text-[#908FA0] text-xs mt-1">Salary + Dividends</p>
          </div>
        </div>

        {/* Card 3: Monthly Expenses */}
        <div className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl flex flex-col justify-between hover:border-[#FFB4AB]/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[#908FA0] text-xs font-semibold uppercase tracking-wider">
              Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFB4AB]/10 flex items-center justify-center text-[#FFB4AB]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono">
              {expenseVal}
            </h2>
            <div className="w-full bg-[#2A2A2D] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#FFB4AB] h-full rounded-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <p className="text-[#908FA0] text-xs mt-1">{percentUsed}% of budget used</p>
          </div>
        </div>

        {/* Card 4: Investments */}
        <div className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl flex flex-col justify-between hover:border-[#FFB95F]/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[#908FA0] text-xs font-semibold uppercase tracking-wider">
              Investments
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFB95F]/10 flex items-center justify-center text-[#FFB95F]">
              <LineChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-mono">
              {investmentVal}
            </h2>
            <p className="text-[#908FA0] text-xs mt-1">Total allocations this month</p>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Area Chart */}
        <div className="lg:col-span-7 bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Cash Flow Analysis</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
                <span className="text-[#908FA0]">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFB4AB]" />
                <span className="text-[#908FA0]">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB4AB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFB4AB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#908FA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272A' }}
                />
                <YAxis
                  stroke="#908FA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (currency === 'INR' ? `₹${v / 1000}k` : `$${v}`)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B1B1E',
                    borderColor: '#27272A',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#E4E1E6',
                  }}
                  formatter={(value: any) => [
                    currency === 'INR'
                      ? `₹${Number(value).toLocaleString()}`
                      : `$${Number(value).toLocaleString()}`,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="incomeScaled"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expensesScaled"
                  stroke="#FFB4AB"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories Donut Chart */}
        <div className="lg:col-span-5 bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] p-5 rounded-xl flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-4">Expense Categories</h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-64">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181B" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1B1B1E',
                      borderColor: '#27272A',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-[#908FA0]">Total</span>
                <span className="font-bold text-sm text-white font-mono">{expenseVal}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {pieData.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#C7C4D7] font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono text-[#908FA0] font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions */}
      <div className="bg-[#18181B]/80 backdrop-blur-md border border-[#27272A] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#27272A] flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <button
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#27272A] text-xs text-[#908FA0] hover:text-white hover:border-[#6366F1] transition-all"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1B1B1E] text-[#908FA0] uppercase tracking-wider font-semibold border-b border-[#27272A]">
              <tr>
                <th className="px-6 py-3">Transaction</th>
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {recentTxs.map((tx) => {
                const displayAmt = formatCurrency(tx.amount);
                const isExpense = tx.type === 'expense';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#2A2A2D] transition-colors cursor-pointer"
                    onClick={() => setActiveTab('transactions')}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{tx.description}</div>
                      <div className="text-[11px] text-[#908FA0]">{tx.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-[#1B1B1E] px-2 py-1 rounded text-[#908FA0] border border-[#27272A]">
                        {tx.account}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#6366F1]/10 text-[#C0C1FF] font-medium">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'Cleared' && (
                        <span className="inline-flex items-center gap-1.5 text-[#4EDE93] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </span>
                      )}
                      {tx.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 text-[#FFB95F] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                      {tx.status === 'Unmatched' && (
                        <span className="inline-flex items-center gap-1.5 text-[#FFB4AB] font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Unmatched</span>
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-mono font-bold text-sm ${
                        isExpense ? 'text-[#FFB4AB]' : 'text-[#4EDE93]'
                      }`}
                    >
                      {isExpense ? `-${displayAmt}` : `+${displayAmt}`}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="p-1 text-[#908FA0] hover:text-white rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
