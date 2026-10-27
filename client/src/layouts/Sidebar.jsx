import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Sparkles,
  Database,
  X,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  dbConnected = true
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budget', label: 'Monthly Budget', icon: Target }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-midnight-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-midnight-950 text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint-500 to-mint-600 flex items-center justify-center text-midnight-950 font-bold shadow-lg shadow-mint-500/20">
              <span className="text-xl">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white tracking-tight">SpendSphere</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-mint-500/10 text-mint-400 border border-mint-500/20">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">Smart Financial Engine</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-smooth ${
                  isActive
                    ? 'bg-mint-500/15 text-mint-400 border border-mint-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-mint-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-mint-400" />}
              </button>
            );
          })}

          <div className="pt-6">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Financial Highlights
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-mint-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Latency Ledger</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transactions are recorded in paise precision with dual-layer MongoDB verification.
              </p>
            </div>
          </div>
        </div>

        {/* Database & System Status Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${dbConnected ? 'bg-mint-400' : 'bg-rose-500'}`} />
                {dbConnected && (
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-mint-400 animate-ping opacity-75" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {dbConnected ? 'MongoDB Live' : 'Database Offline'}
                </p>
                <p className="text-[11px] text-slate-400">spendsphere @ 5050</p>
              </div>
            </div>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
