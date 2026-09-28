import React, { useState } from 'react';
import { Download, FileSpreadsheet, Users, PieChart, BrainCircuit, Award, Sliders, Sparkles, CheckSquare, Square } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [reportTitle, setReportTitle] = useState('Q3_Department_Performance_Audit');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [loading, setLoading] = useState(false);

  // Selected metrics checklist
  const [selectedMetrics, setSelectedMetrics] = useState({
    employee_id: true,
    name: true,
    department: true,
    job_role: true,
    performance_group: true,
    monthly_income: true,
    attendance_rate: true,
    job_satisfaction: true,
    training_hours: true,
    projects_completed: true,
    employee_engagement: false
  });

  const toggleMetric = (key) => {
    setSelectedMetrics({ ...selectedMetrics, [key]: !selectedMetrics[key] });
  };

  const handleGenerateCustomReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const activeMetrics = Object.keys(selectedMetrics).filter((k) => selectedMetrics[k]);
      await api.generateCustomReport({
        title: reportTitle,
        department: selectedDept,
        performance_group: selectedGroup,
        metrics: activeMetrics
      });
    } catch (err) {
      alert(`Report generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const presetReports = [
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
          HR Reports & Custom Export Builder
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Build tailored HR performance reports or download instant preset CSV dataset summaries.
        </p>
      </div>

      {/* Interactive Custom Report Builder Form */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Custom HR Report Generator Form</h3>
              <p className="text-xs text-slate-500">Configure report title, department filters, and metric columns to export</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            Interactive Form
          </span>
        </div>

        <form onSubmit={handleGenerateCustomReport} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Report Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Report Title / Filename</label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Q3_Audit_Report"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Filter Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Performance Group Filter */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Filter Performance Tier</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="All">All Performance Tiers</option>
                <option value="High Performance">High Performance Only</option>
                <option value="Medium Performance">Medium Performance Only</option>
                <option value="Low Performance">Low Performance Only</option>
              </select>
            </div>
          </div>

          {/* Select Metrics Checklist */}
          <div className="space-y-2 pt-2">
            <label className="font-bold text-slate-700 block">Select Included Metrics & Feature Columns</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
              {[
                { key: 'employee_id', label: 'Employee ID' },
                { key: 'name', label: 'Full Name' },
                { key: 'department', label: 'Department' },
                { key: 'job_role', label: 'Job Role' },
                { key: 'performance_group', label: 'Performance Tier' },
                { key: 'monthly_income', label: 'Monthly Income ($)' },
                { key: 'attendance_rate', label: 'Attendance Rate (%)' },
                { key: 'job_satisfaction', label: 'Job Satisfaction' },
                { key: 'training_hours', label: 'Training Hours' },
                { key: 'projects_completed', label: 'Projects Completed' },
                { key: 'employee_engagement', label: 'Engagement Score' }
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleMetric(m.key)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    selectedMetrics[m.key]
                      ? 'bg-amber-500/10 border-amber-400 text-amber-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {selectedMetrics[m.key] ? (
                    <CheckSquare className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className="truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Generating Custom Report...' : 'Generate & Download Custom CSV'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preset Quick Reports Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-slate-900">Standard Preset Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {presetReports.map((rep) => {
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
    </div>
  );
}
