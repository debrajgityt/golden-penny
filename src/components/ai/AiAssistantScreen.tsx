import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Key,
  Settings,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const AiAssistantScreen: React.FC = () => {
  const {
    aiMessages,
    sendAiMessage,
    aiInsights,
    cancelDuplicateSubscription,
    setIsAuditModalOpen,
    formatCurrency,
    llmProvider,
    setLlmProvider,
    userLlmKey,
    setUserLlmKey,
  } = useFinance();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'Check for duplicate subscriptions',
    'Analyze my AWS cloud spend anomaly',
    'How much can I safely invest this month?',
    'Audit travel & dining expenses',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isSending) return;

    setInput('');
    setIsSending(true);
    await sendAiMessage(query);
    setIsSending(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isSending]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#6366F1]" />
            <span>Golden Penny AI Assistant</span>
          </h2>
          <p className="text-xs text-[#908FA0] mt-1">
            Real-time wealth insights powered by Gemini, ChatGPT, or OpenRouter LLM.
          </p>
        </div>

        {/* LLM Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-[#131316] p-1 rounded-xl border border-[#27272A] text-xs font-bold">
            <button
              onClick={() => setLlmProvider('gemini')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                llmProvider === 'gemini'
                  ? 'bg-[#6366F1] text-white shadow-md'
                  : 'text-[#908FA0] hover:text-white'
              }`}
            >
              Gemini AI
            </button>
            <button
              onClick={() => setLlmProvider('openai')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                llmProvider === 'openai'
                  ? 'bg-[#10B981] text-white shadow-md'
                  : 'text-[#908FA0] hover:text-white'
              }`}
            >
              ChatGPT
            </button>
            <button
              onClick={() => setLlmProvider('openrouter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                llmProvider === 'openrouter'
                  ? 'bg-[#F59E0B] text-black shadow-md'
                  : 'text-[#908FA0] hover:text-white'
              }`}
            >
              OpenRouter
            </button>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="p-2 rounded-xl bg-[#1B1B1E] border border-[#27272A] hover:border-[#6366F1] text-[#908FA0] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Configure Custom API Key"
          >
            <Key className="w-4 h-4 text-[#F59E0B]" />
            <span>API Key</span>
          </button>
        </div>
      </div>

      {/* API Key Drawer */}
      {showKeyInput && (
        <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-xs text-[#908FA0]">
            Enter custom API key for <span className="text-white font-bold uppercase">{llmProvider}</span>:
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-1 max-w-md">
            <input
              type="password"
              value={userLlmKey}
              onChange={(e) => setUserLlmKey(e.target.value)}
              placeholder={`Enter your ${llmProvider.toUpperCase()} API key...`}
              className="flex-1 bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-3 py-1.5 bg-[#6366F1] text-white text-xs font-bold rounded-xl"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Chat Box (Left 8 cols) + AI Insights Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-8 bg-[#18181B]/80 backdrop-blur-md rounded-xl border border-[#27272A] flex flex-col h-[600px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
            {aiMessages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-[#908FA0]">
                    <span>{isUser ? 'You' : 'Gemini AI'}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#6366F1] text-white font-medium rounded-tr-none'
                        : 'bg-[#1B1B1E] border border-[#27272A] text-[#E4E1E6] rounded-tl-none space-y-3'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Duplicate Subscription Action Card */}
                    {msg.dataCard && (
                      <div className="mt-3 bg-[#131316] border border-[#27272A] p-3 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-white text-xs">
                            {msg.dataCard.title}
                          </div>
                          <div className="text-[10px] text-[#EF4444] font-semibold">
                            Waste: ${msg.dataCard.wasteAmount}/mo
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            cancelDuplicateSubscription(msg.dataCard!.merchant)
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#EF4444] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          {msg.dataCard.actionText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-[#908FA0] py-2">
                <RefreshCcw className="w-3.5 h-3.5 animate-spin text-[#6366F1]" />
                <span>Gemini is analyzing ledger records...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="p-3 bg-[#131316] border-t border-[#27272A] flex flex-wrap gap-2">
            {promptChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="text-[11px] font-semibold text-[#C0C1FF] bg-[#1B1B1E] border border-[#27272A] hover:border-[#6366F1] px-3 py-1 rounded-full transition-all text-left"
              >
                ✨ {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-[#18181B] border-t border-[#27272A]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini about budgets, AWS anomalies, or cash flow..."
                className="flex-1 bg-[#131316] border border-[#27272A] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#908FA0] focus:ring-1 focus:ring-[#6366F1] focus:outline-none"
              />

              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-2.5 rounded-xl bg-[#6366F1] text-white font-bold disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Live AI Insights Right Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFB95F]" />
              <span>Live AI Insights</span>
            </h3>
            <span className="text-[10px] text-[#908FA0] font-mono uppercase">Updated Just Now</span>
          </div>

          <div className="space-y-3">
            {/* Anomaly Card */}
            <div className="bg-[#18181B]/90 backdrop-blur-md border border-[#EF4444]/40 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>DETECTED 2m AGO</span>
                </span>
                <span className="text-[10px] font-mono text-[#EF4444] font-bold">
                  +$412.50 vs Avg
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">Anomaly: AWS Cloud Expense</h4>
              <p className="text-xs text-[#908FA0] leading-relaxed">
                Your AWS Cloud expense jumped 14% above the 3-month moving average. This deviates significantly from regular usage patterns.
              </p>
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full mt-2 py-1.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] font-bold text-xs hover:bg-[#EF4444] hover:text-white transition-all"
              >
                Audit Usage & Set Alert
              </button>
            </div>

            {/* Forecasting Card */}
            <div className="bg-[#18181B]/90 backdrop-blur-md border border-[#27272A] p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#4EDE93] uppercase tracking-wider">
                  OPTIMAL
                </span>
                <span className="text-[10px] font-mono text-[#908FA0]">Goal Velocity</span>
              </div>
              <h4 className="text-sm font-bold text-white">Budget Forecasting</h4>
              <p className="text-xs text-[#908FA0] leading-relaxed">
                At current burn rates, you will reach your "Japan Vacation" goal 12 days earlier than projected. Suggesting a $200 allocation to Investments.
              </p>
            </div>

            {/* Quarterly Tax Prep */}
            <div className="bg-[#18181B]/90 backdrop-blur-md border border-[#27272A] p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#C0C1FF] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>DUE IN 2 DAYS</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">Quarterly Tax Prep</h4>
              <p className="text-xs text-[#908FA0] leading-relaxed">
                Auto-reconciliation of 14 freelance invoices due in 2 days.
              </p>
            </div>

            {/* Wealth Pulse */}
            <div className="bg-[#18181B]/90 backdrop-blur-md border border-[#27272A] p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#908FA0] uppercase">Wealth Pulse</span>
                <div className="text-lg font-bold text-white font-mono">{formatCurrency(14910.18)}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#4EDE93] bg-[#4EDE93]/10 px-2 py-0.5 rounded border border-[#4EDE93]/30">
                  +0.8% today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
