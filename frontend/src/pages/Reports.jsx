import React from 'react';
import { Download, FileSpreadsheet, Users, PieChart, BrainCircuit, Award } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const reports = [
    {
      id: 'employees',
      title: 'Employee Performance Report',
      description: 'Export comprehensive workforce details, department roles, monthly income, attendance, and ML performance tiers.',
      icon: Users,
      badge: 'Full Staff Export'
    },
    {
      id: 'summary',
      title: 'Performance Group Summary',
      description: 'Export high-level metrics breakdown of total employee counts, percentage distributions across High, Medium, and Low groups.',
      icon: PieChart,
      badge: 'Executive Summary'
    },
    {
      id: 'predictions',
      title: 'Prediction History Log',
      description: 'Export historical ML prediction logs, stored employee prediction classifications, and individual class probability scores.',
      icon: BrainCircuit,
      badge: 'AI Logs'
    },
    {
      id: 'model-evaluation',
      title: 'Model Evaluation Metrics',
      description: 'Export comparative evaluation metrics for Logistic Regression, Decision Tree, and Random Forest models (Accuracy, Precision, Recall, F1).',
      icon: Award,
      badge: 'ML Evaluation'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold mb-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Data Export Engine</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          HR Reports & CSV Exports
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Generate and download complete CSV dataset reports for offline analysis and auditing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
                    {rep.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rep.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">Format: Standard CSV</span>
                <button
                  onClick={() => api.downloadReport(rep.id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
