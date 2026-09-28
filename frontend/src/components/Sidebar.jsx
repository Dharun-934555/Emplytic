import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  BrainCircuit,
  Sparkles,
  FileSpreadsheet,
  Settings,
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

  const coreItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'analytics', label: 'Performance Analysis', icon: BarChart3 },
    { id: 'prediction', label: 'ML Prediction', icon: BrainCircuit, badge: 'AI' },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  const systemItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#faf8f5] border-r border-slate-200/70 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200/50">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-md">
                <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  EMP<span className="text-amber-600">lytic</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  HR AI Intelligence
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)]">
            {/* Core Analytics */}
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                CORE ANALYTICS
              </div>

              {coreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* System Section */}
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                SYSTEM
              </div>

              {systemItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl font-medium text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Profile Bottom Card */}
        <div className="p-4 border-t border-slate-200/60 bg-[#f4f1ea]/60">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                {user?.name ? user.name.charAt(0) : 'S'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {user?.name || 'Sarah Jenkins'}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600 inline" />
                  {user?.role || 'HR Manager'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
