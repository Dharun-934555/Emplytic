import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, Key, Server, Cpu, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>System Settings</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Settings & Configuration
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Manage system preferences, AI model parameters, and database connections.
        </p>
      </div>

      <div className="space-y-6">
        {/* User Account Info Card */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Authenticated User Context</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Name</span>
              <span className="text-sm font-extrabold text-slate-900">{user?.full_name || 'Sarah Jenkins'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
              <span className="text-sm font-extrabold text-slate-900">{user?.email || 'hr@emplytic.ai'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Role Authorization</span>
              <span className="text-sm font-extrabold text-amber-900">{user?.role || 'HR Manager'}</span>
            </div>
          </div>
        </div>

        {/* Machine Learning Pipeline Parameters */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-600" />
            <span>Machine Learning Pipeline Settings</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block">Classifier Engine</span>
                <span className="text-slate-500">Scikit-learn RandomForestClassifier & LogisticRegression</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Active</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block">Classification Target</span>
                <span className="text-slate-500">performance_group (High Performance / Medium Performance / Low Performance)</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">Categorical 3-Class</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block">Train/Test Stratification</span>
                <span className="text-slate-500">80% Training Data, 20% Evaluation Test Set</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px]">Enabled</span>
            </div>
          </div>
        </div>

        {/* Database Connection Info */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Database className="w-5 h-5 text-amber-600" />
            <span>Database Status</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">PostgreSQL / SQLAlchemy Database</span>
                <span className="text-slate-500 font-mono text-[11px]">Tables: users, employees, predictions, model_metrics, training_records</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                <Check className="w-3 h-3 mr-1" /> Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
