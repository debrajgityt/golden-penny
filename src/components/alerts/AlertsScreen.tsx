import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Send,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  PhoneCall,
  Mail,
  MessageSquare,
  ShieldAlert,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AlertItem } from '../../types';

export const AlertsScreen: React.FC = () => {
  const {
    alerts,
    addAlert,
    deleteAlert,
    triggerAlertDispatch,
    formatCurrency,
    user,
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'EMI' | 'Subscription' | 'Prepaid' | 'Tax' | 'GST'>('EMI');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [mobileNumber, setMobileNumber] = useState(user.phone || '+91 9804791288');
  const [email, setEmail] = useState(user.email || 'debrajbhowmick89@gmail.com');
  const [description, setDescription] = useState('');

  const categories = ['ALL', 'EMI', 'Subscription', 'Prepaid', 'Tax', 'GST'];

  const filteredAlerts = selectedCategory === 'ALL'
    ? alerts
    : alerts.filter((a) => a.category === selectedCategory);

  const handleSubmitNewAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !dueDate) return;

    addAlert({
      title,
      category,
      amount: parseFloat(amount) || 0,
      dueDate,
      vendor: vendor || 'Direct Vendor',
      mobileNumber: mobileNumber || '+91 9804791288',
      email: email || 'debrajbhowmick89@gmail.com',
      status: 'Pending',
      channels: ['Email', 'WhatsApp', 'Browser'],
      description,
    });

    setTitle('');
    setAmount('');
    setDueDate('');
    setVendor('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'EMI':
        return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30';
      case 'Tax':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
      case 'GST':
        return 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/30';
      case 'Prepaid':
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
      default:
        return 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#F59E0B]" />
            <span>Alerts & Payment Reminders Hub</span>
          </h2>
          <p className="text-xs text-[#908FA0] mt-1">
            Automated notifications for EMI loans, subscriptions, mobile prepaid plans, Income Tax, and GST compliance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-black font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Payment Alert</span>
        </button>
      </div>

      {/* Target Contact Card */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Alert Notification Receiver: {user.name}</span>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] border border-[#10B981]/30">Active</span>
            </div>
            <div className="text-[11px] text-[#908FA0] flex items-center gap-3 mt-0.5">
              <span>WhatsApp / SMS: <strong className="text-white">{user.phone || '+91 9804791288'}</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-white">{user.email || 'debrajbhowmick89@gmail.com'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#908FA0]">Dispatch Channels:</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-bold border border-[#25D366]/30 flex items-center gap-1">
            WhatsApp
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold border border-[#6366F1]/30 flex items-center gap-1">
            Email
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#0088cc]/10 text-[#0088cc] text-xs font-bold border border-[#0088cc]/30 flex items-center gap-1">
            Telegram
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#F59E0B] text-black shadow-md'
                : 'bg-[#18181B] text-[#908FA0] hover:text-white border border-[#27272A]'
            }`}
          >
            {cat === 'ALL' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-[#18181B] rounded-xl border border-[#27272A]">
            <Clock className="w-10 h-10 text-[#908FA0] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-white">No active alerts in this category.</p>
            <p className="text-xs text-[#908FA0] mt-1">Click "Set New Payment Alert" above to create an EMI or GST reminder.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#18181B] border border-[#27272A] hover:border-[#F59E0B]/50 transition-all rounded-xl p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryColor(alert.category)}`}>
                    {alert.category}
                  </span>
                  <div className="text-xs font-bold text-[#F59E0B]">
                    {formatCurrency(alert.amount)}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{alert.title}</h3>
                <p className="text-xs text-[#908FA0] mt-0.5">{alert.vendor}</p>

                {alert.description && (
                  <p className="text-[11px] text-[#A0A0B0] mt-2 bg-[#131316] p-2 rounded-lg border border-[#27272A]/50">
                    {alert.description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-xs text-[#908FA0]">
                  <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Due Date: <strong className="text-white">{alert.dueDate}</strong></span>
                </div>
              </div>

              {/* Instant Dispatch Actions */}
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => triggerAlertDispatch(alert, 'WhatsApp')}
                    className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => triggerAlertDispatch(alert, 'Email')}
                    className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-all"
                    title="Send Email Reminder"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => triggerAlertDispatch(alert, 'Browser')}
                    className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black transition-all"
                    title="Trigger Live Notification"
                  >
                    <Bell className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 rounded-lg text-[#908FA0] hover:text-[#EF4444] transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Alert Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />
                <span>Create Payment Reminder Alert</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#908FA0] hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewAlert} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#908FA0] block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Home Loan EMI or Q2 GST Return"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#908FA0] block mb-1">Alert Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="EMI">EMI Repayment</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Prepaid">Prepaid Plan</option>
                    <option value="Tax">Income Tax</option>
                    <option value="GST">GST Return</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#908FA0] block mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#908FA0] block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#908FA0] block mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank / Income Tax Dept"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#908FA0] block mb-1">Mobile Number (for WhatsApp / SMS)</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 9804791288"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#908FA0] block mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Auto-debit from primary account"
                  className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#27272A] text-white text-xs font-bold hover:bg-[#333338]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F59E0B] text-black text-xs font-bold hover:opacity-90 shadow-lg"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
