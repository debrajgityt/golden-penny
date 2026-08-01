import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Bell,
  Key,
  Check,
  RotateCcw,
  Download,
  Upload,
  User,
  Phone,
  Mail,
  Camera,
  AlertTriangle,
  Server,
  ShieldAlert,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyMode } from '../../types';

export const SettingsScreen: React.FC = () => {
  const {
    currency,
    setCurrency,
    user,
    updateUserProfile,
    resetAllData,
    exportDataBackupJSON,
    importDataBackupJSON,
  } = useFinance();

  const [anomalyAlerts, setAnomalyAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Profile Edit State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+91 9804791288');
  const [customAvatar, setCustomAvatar] = useState(user.customAvatarUrl || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetDoneText, setResetDoneText] = useState('');

  // Backup & Restore State
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const presetAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBithLGA1M436N_jIuqPXRQlB2iV0JL9tHOR-9sA-73-ljYYeqMXyZkan9uMcnejXlI12S9BioB2JpVImUyD2kunfCfZW1SKWKEBZVdE9RVB9WYTQVrbf7z0KRwMowDWPf7ed2dQ58rNafgAOZe4lLAm51v0q_LHK-OB-LCDJMVUllyhafJ7Ka68h64ebuVkFL9HeDuLMPJQ544mm-8ua1LsmWrsMZwsS6ZaCNytsIO_CsMw3jwo09Q',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      customAvatarUrl: customAvatar,
      avatar: customAvatar || presetAvatars[0],
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleConfirmReset = () => {
    if (resetConfirmText.trim().toUpperCase() === 'RESET') {
      resetAllData();
      setIsResetModalOpen(false);
      setResetConfirmText('');
      setResetDoneText('All financial transactions, accounts, and records have been completely reset.');
      setTimeout(() => setResetDoneText(''), 5000);
    }
  };

  const handleFileUploadRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const result = importDataBackupJSON(json);
        if (result.success) {
          setRestoreMessage({ type: 'success', text: result.message });
        } else {
          setRestoreMessage({ type: 'error', text: result.message });
        }
      } catch (err) {
        setRestoreMessage({ type: 'error', text: 'Invalid JSON file structure.' });
      }
      setTimeout(() => setRestoreMessage(null), 6000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#6366F1]" />
          <span>Application Settings</span>
        </h2>
        <p className="text-xs text-[#908FA0] mt-1">
          Customize currency display, user profile picture, data backup & restore, and system reset controls.
        </p>
      </div>

      {resetDoneText && (
        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{resetDoneText}</span>
        </div>
      )}

      {/* User Profile & Avatar Settings */}
      <div className="bg-[#18181B]/80 backdrop-blur-md rounded-2xl border border-[#27272A] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-[#F59E0B]" />
          <div>
            <h3 className="font-bold text-sm text-white">User Profile & Avatar Picture</h3>
            <p className="text-xs text-[#908FA0]">Manage your account details and profile photo</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-bold text-[#908FA0] block mb-2">Select Profile Picture / Avatar</label>
            <div className="flex flex-wrap items-center gap-3">
              {presetAvatars.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setCustomAvatar(url);
                    updateUserProfile({ avatar: url });
                  }}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    (customAvatar || user.avatar) === url
                      ? 'border-[#F59E0B] scale-110 shadow-lg'
                      : 'border-[#27272A] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-[11px] text-[#908FA0] block mb-1">Or enter custom Avatar Image URL:</label>
              <input
                type="url"
                placeholder="https://example.com/my-photo.jpg"
                value={customAvatar}
                onChange={(e) => setCustomAvatar(e.target.value)}
                className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#908FA0] block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#908FA0] block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#908FA0] block mb-1">Mobile Phone Number (for WhatsApp / SMS Alerts)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9804791288"
              className="w-full bg-[#131316] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#25D366]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSaved ? (
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Updated Successfully!
              </span>
            ) : (
              <span className="text-[11px] text-[#908FA0]">Updates site-wide user identity and alert notifications.</span>
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#6366F1] text-white text-xs font-bold hover:opacity-90 shadow-md"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Currency Settings (Strict Multi-Currency) */}
      <div className="bg-[#18181B]/80 backdrop-blur-md rounded-2xl border border-[#27272A] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#C0C1FF]" />
          <div>
            <h3 className="font-bold text-sm text-white">Strict Currency & Region Mode</h3>
            <p className="text-xs text-[#908FA0]">Select primary currency format enforced across all views and exports</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)' },
            { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
            { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
            { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
          ].map((item) => {
            const isSelected = currency === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setCurrency(item.code as CurrencyMode)}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B] shadow-lg scale-105'
                    : 'bg-[#131316] border-[#27272A] text-[#908FA0] hover:text-white'
                }`}
              >
                <span className="text-xl font-bold">{item.symbol}</span>
                <span className="text-xs font-bold">{item.code}</span>
                <span className="text-[10px] opacity-75">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Backup & Restore Section */}
      <div className="bg-[#18181B]/80 backdrop-blur-md rounded-2xl border border-[#27272A] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-[#10B981]" />
          <div>
            <h3 className="font-bold text-sm text-white">Data Backup & Restore</h3>
            <p className="text-xs text-[#908FA0]">Download full JSON system backups or restore data without deleting existing entries</p>
          </div>
        </div>

        {restoreMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-bold ${
              restoreMessage.type === 'success'
                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
            }`}
          >
            {restoreMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#131316] rounded-xl border border-[#27272A] space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#10B981]" />
              <span>Download Backup (.json)</span>
            </div>
            <p className="text-[11px] text-[#908FA0]">
              Exports all transactions, accounts, investments, bills, budgets, and alerts to a standalone file.
            </p>
            <button
              onClick={exportDataBackupJSON}
              className="w-full py-2 px-3 rounded-lg bg-[#10B981] text-black text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Export JSON Backup
            </button>
          </div>

          <div className="p-4 bg-[#131316] rounded-xl border border-[#27272A] space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#6366F1]" />
              <span>Restore Backup (.json)</span>
            </div>
            <p className="text-[11px] text-[#908FA0]">
              Upload a previously saved Golden Penny backup file. Merges new records without overwriting current data.
            </p>
            <label className="block w-full text-center py-2 px-3 rounded-lg bg-[#6366F1] text-white text-xs font-bold hover:opacity-90 cursor-pointer transition-opacity">
              <span>Select & Upload JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUploadRestore}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone: System Reset */}
      <div className="bg-[#EF4444]/5 border border-[#EF4444]/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          <div>
            <h3 className="font-bold text-sm text-[#EF4444]">Danger Zone: Reset All Data</h3>
            <p className="text-xs text-[#908FA0]">Permanently wipe all transactions, accounts, and budgets to start fresh</p>
          </div>
        </div>

        <div className="p-4 bg-[#131316] rounded-xl border border-[#EF4444]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">Reset Financial Database</div>
            <div className="text-[11px] text-[#908FA0]">Requires double confirmation text prompt before clearing.</div>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-all shadow-lg shrink-0"
          >
            Reset All Financial Records
          </button>
        </div>
      </div>

      {/* Double Confirmation Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181B] border border-[#EF4444]/50 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Double Confirmation Required</h3>
            </div>

            <p className="text-xs text-[#C7C4D7] leading-relaxed">
              Are you absolutely sure? This action will <strong>permanently delete all expenses, incomes, connected accounts, and goals</strong> from your local session.
            </p>

            <div className="bg-[#131316] p-3 rounded-xl border border-[#EF4444]/30 text-xs text-[#908FA0]">
              To confirm, type <strong className="text-[#EF4444] font-mono">RESET</strong> in the box below:
            </div>

            <input
              type="text"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="Type RESET here..."
              className="w-full bg-[#131316] border border-[#27272A] focus:border-[#EF4444] rounded-xl px-3.5 py-2 text-xs text-white uppercase font-mono focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsResetModalOpen(false);
                  setResetConfirmText('');
                }}
                className="px-4 py-2 rounded-xl bg-[#27272A] text-white text-xs font-bold hover:bg-[#333338]"
              >
                Cancel
              </button>

              <button
                disabled={resetConfirmText.trim().toUpperCase() !== 'RESET'}
                onClick={handleConfirmReset}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
                  resetConfirmText.trim().toUpperCase() === 'RESET'
                    ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                    : 'bg-[#27272A] text-[#908FA0] cursor-not-allowed'
                }`}
              >
                Confirm Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

