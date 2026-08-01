import React, { useState } from 'react';
import {
  BookOpen,
  Zap,
  Shield,
  Server,
  Key,
  Globe,
  Database,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Terminal,
  Cpu,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const UserGuideScreen: React.FC = () => {
  const [activePart, setActivePart] = useState<'basic' | 'inter' | 'advance'>('basic');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#6366F1]" />
          <span>Golden Penny Master User Guide</span>
        </h2>
        <p className="text-xs text-[#908FA0] mt-1">
          Complete step-by-step operating manual divided into Basic, Intermediate, and Advanced architecture levels.
        </p>
      </div>

      {/* Guide Level Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#18181B] border border-[#27272A] rounded-2xl">
        <button
          onClick={() => setActivePart('basic')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activePart === 'basic'
              ? 'bg-[#10B981] text-black shadow-lg'
              : 'text-[#908FA0] hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Part 1: Basic Guide</span>
        </button>

        <button
          onClick={() => setActivePart('inter')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activePart === 'inter'
              ? 'bg-[#F59E0B] text-black shadow-lg'
              : 'text-[#908FA0] hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Part 2: Intermediate Guide</span>
        </button>

        <button
          onClick={() => setActivePart('advance')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activePart === 'advance'
              ? 'bg-[#6366F1] text-white shadow-lg'
              : 'text-[#908FA0] hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Part 3: Advanced & VPS Guide</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 sm:p-8 space-y-6">
        {activePart === 'basic' && (
          <div className="space-y-6">
            <div className="border-b border-[#27272A] pb-4">
              <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold border border-[#10B981]/30 uppercase tracking-wider">
                Level 1: Beginner Fundamentals
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Getting Started with Golden Penny</h3>
              <p className="text-xs text-[#908FA0] mt-1">
                Master day-to-day income tracking, expense tagging, multi-currency switching, and connecting bank accounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">Multi-Currency Switching (USD / INR / EUR / GBP)</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Click the currency button in the top navigation bar or under <strong>Settings &gt; Currency</strong> to instantly convert all transactions, account balances, and investment totals into <strong>INR (₹)</strong>, <strong>USD ($)</strong>, <strong>EUR (€)</strong>, or <strong>GBP (£)</strong>.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">Logging Expenses & Incomes</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Use the <strong>"+ Add Transaction"</strong> modal from the header to record new income or expenses. Categorize them into SaaS, Dining Out, Shopping, or Travel to ensure real-time budget tracking.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">Connecting Bank Accounts</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Navigate to <strong>Accounts</strong> and click <strong>"Connect Bank / Wallet"</strong>. Supported institutions include HDFC Bank, ICICI Bank, Chase, SBI, and Stripe Merchant Accounts.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h4 className="font-bold text-sm text-white">Profile Picture & Contact Setup</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Open <strong>Settings</strong> to update your name, email, avatar image URL, and mobile number (pre-filled with <strong>+91 9804791288</strong>) for receiving direct WhatsApp & email alerts.
                </p>
              </div>
            </div>
          </div>
        )}

        {activePart === 'inter' && (
          <div className="space-y-6">
            <div className="border-b border-[#27272A] pb-4">
              <span className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/30 uppercase tracking-wider">
                Level 2: Intermediate Wealth Management
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Investments, SIPs, GST & Statement Audits</h3>
              <p className="text-xs text-[#908FA0] mt-1">
                Automate recurring utility payments, track Mutual Fund growth, export date-range financial reports, and configure WhatsApp alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">SIP & Portfolio Investments</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Track Mutual Funds, Nifty 50, Stocks, Gold, and Crypto in <strong>Investments</strong>. Use the built-in SIP return calculator to project returns over 1 to 10 years.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">EMI, GST & Prepaid Reminders</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Use the <strong>Alerts & Reminders Hub</strong> to monitor home loan EMIs, GST filings (GSTR-3B), advance tax, and mobile plan renewals. Dispatch instant WhatsApp notifications directly to your phone.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">Date-Wise Statement Exports (PDF / CSV)</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Generate official audit-ready PDF/CSV statements filtered by custom date ranges, accounts, or categories. Click <strong>"Export Statement"</strong> in Transactions.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h4 className="font-bold text-sm text-white">Bank Statement AI File Parser</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  Upload CSV or bank PDF statements via <strong>"Import File"</strong>. Golden Penny automatically extracts merchant names, amounts, payment modes, and reconciles matching ledger entries.
                </p>
              </div>
            </div>
          </div>
        )}

        {activePart === 'advance' && (
          <div className="space-y-6">
            <div className="border-b border-[#27272A] pb-4">
              <span className="px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold border border-[#6366F1]/30 uppercase tracking-wider">
                Level 3: Advanced Architecture & VPS
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Multi-LLM Integration, Data Backup & VPS Hosting</h3>
              <p className="text-xs text-[#908FA0] mt-1">
                Configure custom LLM keys, run full-system JSON backups, and deploy Golden Penny on your own self-hosted Linux VPS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">Multi-LLM AI Engine (Gemini / ChatGPT / OpenRouter)</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  In <strong>AI Assistant</strong>, select your preferred engine: <strong>Gemini 3.6 Flash</strong>, <strong>ChatGPT (gpt-4o-mini)</strong>, or <strong>OpenRouter</strong>. Use built-in credentials or input your personal API key. If no key is set, the system uses the seamless bypass engine.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">Full JSON Backup & Seamless Restore</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  In <strong>Settings &gt; Data Management</strong>, click <strong>"Download Backup (.json)"</strong> to preserve all transactions, accounts, goals, and alerts. Restore anytime by uploading the file — new items will be merged safely without deleting existing entries.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">System Reset with Double Confirmation</h4>
                <p className="text-xs text-[#908FA0] leading-relaxed">
                  To start completely fresh, navigate to <strong>Settings &gt; Data Management</strong> and click <strong>"Reset All Data"</strong>. A safety modal will prompt you to type <strong>RESET</strong> before wiping records.
                </p>
              </div>

              <div className="bg-[#131316] p-5 rounded-xl border border-[#27272A] space-y-2 col-span-1 md:col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h4 className="font-bold text-sm text-white">Ubuntu VPS + Coolify Panel GitHub Deployment Plan</h4>
                </div>
                <div className="text-xs text-[#908FA0] space-y-2 pt-1 leading-relaxed">
                  <p className="text-white font-semibold">
                    Yes! Exporting the code via AI Studio creates or syncs your application directly to GitHub, which Coolify then pulls onto your Ubuntu VPS automatically:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[#C0C1FF]">
                    <li>
                      <strong>Step 1 (Export to GitHub):</strong> In AI Studio, click the top-right Settings/Export menu and choose <strong>"Export to GitHub"</strong>. This saves the complete codebase into your GitHub account repository.
                    </li>
                    <li>
                      <strong>Step 2 (Connect Coolify Panel):</strong> Open your Coolify Panel on your Ubuntu VPS (<code className="text-[#F59E0B]">http://your-vps-ip:8000</code>). Click <strong>+ Add New Resource</strong> &gt; <strong>Public/Private GitHub Repository</strong>.
                    </li>
                    <li>
                      <strong>Step 3 (Select Repo & Build):</strong> Select your Golden Penny repository. Set the build pack to <strong>Nixpacks</strong> or <strong>Node.js</strong>. Coolify will automatically detect <code className="text-[#F59E0B]">package.json</code>, build with <code className="text-[#F59E0B]">npm run build</code>, and start on port 3000.
                    </li>
                    <li>
                      <strong>Step 4 (Automatic Continuous Deployment):</strong> Whenever you push changes to GitHub, Coolify will auto-rebuild and update your live domain with zero downtime!
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
